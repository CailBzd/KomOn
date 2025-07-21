using Microsoft.EntityFrameworkCore;
using KomOn.Infrastructure.Data;
using KomOn.Core.Interfaces;
using KomOn.Infrastructure.Services;
using KomOn.API.Services;
using KomOn.Infrastructure.Configuration;
using KomOn.Core.DTOs;
using AutoMapper;
using KomOn.API.Mapping;
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers(options =>
{
    // Configuration pour accepter JSON
    options.SuppressAsyncSuffixInActionNames = false;
    // Configuration pour le développement
    if (builder.Environment.IsDevelopment())
    {
        Console.WriteLine("🔧 Development mode: Model validation will be handled manually");
    }
})
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuration
builder.Services.Configure<SupabaseSettings>(
    builder.Configuration.GetSection("Supabase"));

// Database
// builder.Services.AddDbContext<KomOnDbContext>(options =>
//     options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, KomOn.Infrastructure.Services.AuthService>();
builder.Services.AddScoped<KomOn.API.Services.AuthService>();
builder.Services.AddScoped<SupabaseService>();
builder.Services.AddScoped<EventService>();
builder.Services.AddScoped<PaymentService>();



// AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});



var app = builder.Build();

// Méthode pour décoder le JWT Supabase et extraire l'email
string? ExtractEmailFromSupabaseToken(string token)
{
    try
    {
        // Décoder le JWT sans vérification de signature (pour le développement)
        var handler = new JwtSecurityTokenHandler();
        var jsonToken = handler.ReadJwtToken(token);
        
        // Extraire l'email depuis les claims
        var emailClaim = jsonToken.Claims.FirstOrDefault(c => c.Type == "email");
        if (emailClaim != null)
        {
            return emailClaim.Value;
        }
        
        // Si pas d'email dans les claims, essayer dans le payload
        if (jsonToken.Payload.TryGetValue("email", out var emailObj))
        {
            return emailObj?.ToString();
        }
        
        return null;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erreur lors du décodage du JWT: {ex.Message}");
        return null;
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    // En développement, ne pas forcer HTTPS pour permettre les tests HTTP
    Console.WriteLine("🔧 Development mode: HTTPS redirection disabled");
}
else
{
    app.UseHttpsRedirection();
}

// CORS doit être avant les autres middlewares
app.UseCors("AllowAll");

// Middleware pour vérifier les JWT Supabase
app.Use(async (context, next) =>
{
    var path = context.Request.Path.Value;
    
    // Endpoints qui ne nécessitent pas d'authentification
    var publicEndpoints = new[]
    {
        "/api/auth/register",
        "/api/auth/register-email",
        "/api/auth/register-phone",
        "/api/auth/login",
        "/api/auth/login-magic-link",
        "/api/auth/login-otp",
        "/api/auth/verify-otp",
        "/api/auth/send-email-verification",
        "/api/auth/send-sms-verification",
        "/api/auth/verify-email",
        "/api/auth/verify-sms",
        "/api/auth/forgot-password",
        "/api/auth/reset-password"
    };

    // Vérifier si c'est un endpoint public
    if (publicEndpoints.Any(ep => path?.StartsWith(ep) == true))
    {
        await next();
        return;
    }

    // Vérifier si c'est une requête OPTIONS (CORS preflight)
    if (context.Request.Method == "OPTIONS")
    {
        await next();
        return;
    }

    // Vérifier l'autorisation pour les autres endpoints
    var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
    if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
    {
        context.Response.StatusCode = 401;
        await context.Response.WriteAsync("Token d'authentification requis");
        return;
    }

    var token = authHeader.Substring("Bearer ".Length);
    
    try
    {
        // Décoder le token JWT pour extraire l'email de l'utilisateur
        var userService = context.RequestServices.GetRequiredService<IUserService>();
        
        // Extraire l'email depuis le token JWT
        string userEmail;
        
        if (token.StartsWith("mock-jwt-token-"))
        {
            // Token de développement - utiliser l'email par défaut
            userEmail = "test@komon.com";
        }
        else
        {
            // Token Supabase réel - décoder le JWT
            userEmail = ExtractEmailFromSupabaseToken(token) ?? string.Empty;
            
            if (string.IsNullOrEmpty(userEmail))
            {
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("Impossible d'extraire l'email du token JWT");
                return;
            }
        }
        
        // Récupérer l'utilisateur depuis la base avec l'email extrait du token
        var user = await userService.GetByEmailAsync(userEmail);
        
        if (user == null)
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync($"Utilisateur non trouvé pour l'email: {userEmail}");
            return;
        }

        // Créer les claims pour l'utilisateur avec les vraies données
        var claims = new List<System.Security.Claims.Claim>
        {
            new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.NameIdentifier, user.Id.ToString()),
            new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Email, user.Email),
            new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Name, $"{user.FirstName} {user.LastName}")
        };

        var identity = new System.Security.Claims.ClaimsIdentity(claims, "Bearer");
        context.User = new System.Security.Claims.ClaimsPrincipal(identity);
    }
    catch (Exception ex)
    {
        context.Response.StatusCode = 401;
        await context.Response.WriteAsync($"Erreur de validation du token: {ex.Message}");
        return;
    }

    await next();
});

app.UseAuthorization();

app.MapControllers();

// Créer les comptes de test au démarrage
using (var scope = app.Services.CreateScope())
{
    var userService = scope.ServiceProvider.GetRequiredService<IUserService>();
    
    // Vérifier si les comptes de test existent déjà
    var adminUser = await userService.GetByEmailAsync("admin@komon.com");
    if (adminUser == null)
    {
        var createAdminRequest = new CreateUserRequest
        {
            FirstName = "Admin",
            LastName = "KomOn",
            Email = "admin@komon.com",
            DateOfBirth = new DateTime(1990, 1, 1),
            PhoneNumber = "+33123456789",
            Bio = "Administrateur de KomOn",
            Password = "Admin123!",
            Role = "Admin"
        };
        await userService.CreateAsync(createAdminRequest);
        Console.WriteLine("✅ Compte admin créé: admin@komon.com / Admin123!");
    }

    var testUser = await userService.GetByEmailAsync("test@komon.com");
    if (testUser == null)
    {
        var createTestRequest = new CreateUserRequest
        {
            FirstName = "Test",
            LastName = "User",
            Email = "test@komon.com",
            DateOfBirth = new DateTime(1995, 5, 15),
            PhoneNumber = "+33987654321",
            Bio = "Utilisateur de test",
            Password = "Test123!",
            Role = "Participant"
        };
        await userService.CreateAsync(createTestRequest);
        Console.WriteLine("✅ Compte test créé: test@komon.com / Test123!");
    }
}

app.Run(); 
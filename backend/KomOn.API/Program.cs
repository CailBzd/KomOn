using Microsoft.EntityFrameworkCore;
using KomOn.Infrastructure.Data;
using KomOn.Core.Interfaces;
using KomOn.Infrastructure.Services;
using KomOn.API.Services;
using KomOn.Infrastructure.Configuration;
using KomOn.Core.DTOs;
using AutoMapper;
using KomOn.API.Mapping;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

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

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

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
    
    // TODO: Implémenter la vérification du JWT Supabase
    // Pour l'instant, on accepte tous les tokens
    // var supabaseService = context.RequestServices.GetRequiredService<SupabaseService>();
    // var isValid = await supabaseService.ValidateTokenAsync(token);
    // if (!isValid)
    // {
    //     context.Response.StatusCode = 401;
    //     await context.Response.WriteAsync("Token invalide");
    //     return;
    // }

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
using KomOn.Core.Interfaces;
using KomOn.Infrastructure.Services;
using KomOn.Core.DTOs;
using KomOn.Infrastructure.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuration Supabase
builder.Services.Configure<SupabaseSettings>(builder.Configuration.GetSection("Supabase"));
builder.Services.AddSingleton<SupabaseService>();
builder.Services.AddScoped<SupabaseMigrationService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// Services
builder.Services.AddScoped<IEventService, EventService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<KomOn.API.Services.AuthService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
// Swagger toujours activé pour la documentation API
app.UseSwagger();
app.UseSwaggerUI();

// CORS doit être configuré AVANT UseHttpsRedirection pour éviter les redirections sur les requêtes preflight
app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    // Configuration spécifique au développement si nécessaire
    // Désactiver la redirection HTTPS en développement pour éviter les problèmes CORS
}
else
{
    // HTTPS redirection seulement en production
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Exécuter les migrations Supabase au démarrage
using (var scope = app.Services.CreateScope())
{
    try
    {
        var migrationService = scope.ServiceProvider.GetRequiredService<SupabaseMigrationService>();
        await migrationService.RunMigrationsAsync();
        Console.WriteLine("✅ Migrations Supabase exécutées avec succès");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"⚠️ Erreur lors des migrations Supabase: {ex.Message}");
    }
}

// Initialisation des comptes de test
using (var scope = app.Services.CreateScope())
{
    try
    {
        var userService = scope.ServiceProvider.GetRequiredService<IUserService>();
        await InitializeSuperAdminAsync(userService);
        await InitializeTestUserAsync(userService);
        Console.WriteLine("✅ Comptes de test initialisés avec succès");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"⚠️ Erreur lors de l'initialisation des comptes de test: {ex.Message}");
    }
}

// Global exception handler
// app.UseMiddleware<ExceptionHandlingMiddleware>(); // TODO: Décommenter si le middleware existe

app.Run();

// Méthode pour initialiser le compte super-admin
static async Task InitializeSuperAdminAsync(IUserService userService)
{
    const string superAdminEmail = "admin@komon.com";
    const string superAdminPassword = "Admin123!";
    
    // Vérifier si le super-admin existe déjà
    var existingUser = await userService.GetByEmailAsync(superAdminEmail);
    
    if (existingUser == null)
    {
        // Créer le compte super-admin
        var createRequest = new CreateUserRequest
        {
            FirstName = "Super",
            LastName = "Admin",
            Email = superAdminEmail,
            Password = superAdminPassword,
            Role = "admin",
            DateOfBirth = new DateTime(1990, 1, 1),
            PhoneNumber = "+33123456789",
            Bio = "Compte super-administrateur de KomOn"
        };
        
        var superAdmin = await userService.CreateAsync(createRequest);
        Console.WriteLine($"🎯 Super-admin créé: {superAdmin.Email} (ID: {superAdmin.Id})");
    }
    else
    {
        Console.WriteLine($"ℹ️ Super-admin existe déjà: {existingUser.Email}");
    }
}

// Méthode pour initialiser un utilisateur de test
static async Task InitializeTestUserAsync(IUserService userService)
{
    const string testUserEmail = "test@komon.com";
    const string testUserPassword = "Test123!";
    
    // Vérifier si l'utilisateur de test existe déjà
    var existingUser = await userService.GetByEmailAsync(testUserEmail);
    
    if (existingUser == null)
    {
        // Créer l'utilisateur de test
        var createRequest = new CreateUserRequest
        {
            FirstName = "Test",
            LastName = "User",
            Email = testUserEmail,
            Password = testUserPassword,
            Role = "participant",
            DateOfBirth = new DateTime(1995, 5, 15),
            PhoneNumber = "+33123456788",
            Bio = "Compte utilisateur de test pour KomOn"
        };
        
        var testUser = await userService.CreateAsync(createRequest);
        Console.WriteLine($"🎯 Utilisateur de test créé: {testUser.Email} (ID: {testUser.Id})");
    }
    else
    {
        Console.WriteLine($"ℹ️ Utilisateur de test existe déjà: {existingUser.Email}");
    }
} 
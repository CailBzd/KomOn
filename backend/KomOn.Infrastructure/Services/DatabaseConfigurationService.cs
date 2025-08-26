using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using KomOn.Infrastructure.Configuration;
using KomOn.Infrastructure.Data;
using KomOn.Core.Entities;

namespace KomOn.Infrastructure.Services;

public static class DatabaseConfigurationService
{
    public static IServiceCollection AddKomOnDatabase(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var databaseSettings = configuration.GetSection(DatabaseSettings.SectionName)
            .Get<DatabaseSettings>() ?? new DatabaseSettings();
        
        var connectionStringSettings = configuration.GetSection(ConnectionStringSettings.SectionName)
            .Get<ConnectionStringSettings>() ?? new ConnectionStringSettings();

        // Récupération de la chaîne de connexion
        var connectionString = connectionStringSettings.GetConnectionString(databaseSettings.ConnectionStringName);
        
        if (string.IsNullOrEmpty(connectionString))
        {
            throw new InvalidOperationException(
                $"Connection string '{databaseSettings.ConnectionStringName}' not found in configuration.");
        }

        // Configuration du DbContext avec PostgreSQL
        services.AddDbContext<KomOnDbContext>(options =>
        {
            options.UseNpgsql(connectionString, npgsqlOptions =>
            {
                npgsqlOptions.CommandTimeout(databaseSettings.CommandTimeout);
                
                if (databaseSettings.EnableRetryOnFailure)
                {
                    npgsqlOptions.EnableRetryOnFailure(
                        maxRetryCount: databaseSettings.MaxRetryCount,
                        errorCodesToAdd: null,
                        delay: TimeSpan.FromSeconds(databaseSettings.RetryDelaySeconds));
                }
            });

            // Configuration des options de développement
            if (databaseSettings.EnableDetailedErrors)
            {
                options.EnableDetailedErrors();
            }

            if (databaseSettings.EnableSensitiveDataLogging)
            {
                options.EnableSensitiveDataLogging();
            }
        });

        // Configuration des paramètres de base de données
        services.Configure<DatabaseSettings>(configuration.GetSection(DatabaseSettings.SectionName));
        services.Configure<ConnectionStringSettings>(configuration.GetSection(ConnectionStringSettings.SectionName));

        return services;
    }

    public static async Task InitializeDatabaseAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<KomOnDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<KomOnDbContext>>();
        var databaseSettings = scope.ServiceProvider.GetRequiredService<IOptions<DatabaseSettings>>();

        try
        {
            logger.LogInformation("Initializing database...");
            
            // Vérification de la connexion
            await dbContext.Database.CanConnectAsync();
            logger.LogInformation("Database connection successful");

            // Migration automatique si activée
            if (databaseSettings.Value.AutoMigrate)
            {
                logger.LogInformation("Applying database migrations...");
                await dbContext.Database.MigrateAsync();
                logger.LogInformation("Database migrations applied successfully");
            }

            // Initialisation des données si nécessaire
            if (!await dbContext.Sports.AnyAsync())
            {
                logger.LogInformation("Seeding initial data...");
                await SeedInitialDataAsync(dbContext);
                logger.LogInformation("Initial data seeded successfully");
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error initializing database");
            throw;
        }
    }

    private static async Task SeedInitialDataAsync(KomOnDbContext dbContext)
    {
        // Ajout des sports de base
        var sports = new[]
        {
            new Sport { Name = "Football", Description = "Sport d'équipe avec ballon" },
            new Sport { Name = "Basketball", Description = "Sport d'équipe avec panier" },
            new Sport { Name = "Tennis", Description = "Sport de raquette" },
            new Sport { Name = "Running", Description = "Course à pied" },
            new Sport { Name = "Cyclisme", Description = "Vélo sur route ou VTT" },
            new Sport { Name = "Natation", Description = "Nage en piscine ou mer" },
            new Sport { Name = "Musculation", Description = "Renforcement musculaire" },
            new Sport { Name = "Yoga", Description = "Activité physique et mentale" }
        };

        await dbContext.Sports.AddRangeAsync(sports);
        await dbContext.SaveChangesAsync();
    }
} 
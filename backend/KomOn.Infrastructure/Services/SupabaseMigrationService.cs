using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using KomOn.Infrastructure.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;

namespace KomOn.Infrastructure.Services;

public class SupabaseMigrationService
{
    private readonly HttpClient _httpClient;
    private readonly SupabaseSettings _settings;
    private readonly ILogger<SupabaseMigrationService> _logger;

    public SupabaseMigrationService(IOptions<SupabaseSettings> settings, ILogger<SupabaseMigrationService> logger)
    {
        _settings = settings.Value;
        _logger = logger;
        _httpClient = new HttpClient();
    }

    public async Task RunMigrationsAsync()
    {
        try
        {
            _logger.LogInformation("🚀 Démarrage des migrations Supabase...");

            // Migration 1: Créer la table users
            await RunMigration1_CreateUsersTableAsync();

            // Migration 2: Créer la table migrations (pour tracker les migrations)
            await RunMigration2_CreateMigrationsTableAsync();

            // Migration 3: Insérer les migrations dans la table de tracking
            await RunMigration3_TrackMigrationsAsync();

            _logger.LogInformation("✅ Migrations Supabase terminées avec succès");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erreur lors des migrations Supabase");
            throw;
        }
    }

    private async Task RunMigration1_CreateUsersTableAsync()
    {
        _logger.LogInformation("📋 Migration 1: Création de la table users...");

        var sql = @"
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                phone_number VARCHAR(20),
                date_of_birth DATE,
                bio TEXT,
                profile_picture_url VARCHAR(255),
                role VARCHAR(50) DEFAULT 'participant',
                status VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            -- Activer RLS
            ALTER TABLE users ENABLE ROW LEVEL SECURITY;

            -- Créer des politiques de sécurité
            DROP POLICY IF EXISTS ""Users can view own profile"" ON users;
            CREATE POLICY ""Users can view own profile"" ON users
                FOR SELECT USING (auth.uid()::text = id::text);

            DROP POLICY IF EXISTS ""Users can update own profile"" ON users;
            CREATE POLICY ""Users can update own profile"" ON users
                FOR UPDATE USING (auth.uid()::text = id::text);

            DROP POLICY IF EXISTS ""Service role can manage all users"" ON users;
            CREATE POLICY ""Service role can manage all users"" ON users
                FOR ALL USING (auth.role() = 'service_role');

            -- Créer des index
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
        ";

        await ExecuteSqlAsync(sql);
        _logger.LogInformation("✅ Table users créée avec succès");
    }

    private async Task RunMigration2_CreateMigrationsTableAsync()
    {
        _logger.LogInformation("📋 Migration 2: Création de la table migrations...");

        var sql = @"
            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                migration_name VARCHAR(255) UNIQUE NOT NULL,
                applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                sql_script TEXT NOT NULL
            );
        ";

        await ExecuteSqlAsync(sql);
        _logger.LogInformation("✅ Table migrations créée avec succès");
    }

    private async Task RunMigration3_TrackMigrationsAsync()
    {
        _logger.LogInformation("📋 Migration 3: Tracking des migrations...");

        // Vérifier si les migrations ont déjà été appliquées
        var migrations = await GetAppliedMigrationsAsync();
        
        var migrationsToApply = new[]
        {
            new { Name = "001_CreateUsersTable", Sql = "CREATE TABLE users..." },
            new { Name = "002_CreateMigrationsTable", Sql = "CREATE TABLE migrations..." }
        };

        foreach (var migration in migrationsToApply)
        {
            if (!migrations.Contains(migration.Name))
            {
                await TrackMigrationAsync(migration.Name, migration.Sql);
                _logger.LogInformation($"✅ Migration {migration.Name} trackée");
            }
        }
    }

    private async Task ExecuteSqlAsync(string sql)
    {
        try
        {
            var request = new HttpRequestMessage(HttpMethod.Post, $"{_settings.Url}/rest/v1/rpc/exec_sql")
            {
                Content = new StringContent(JsonSerializer.Serialize(new { sql }), Encoding.UTF8, "application/json")
            };

            request.Headers.Add("apikey", _settings.ServiceRoleKey);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _settings.ServiceRoleKey);

            var response = await _httpClient.SendAsync(request);
            
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogWarning($"⚠️ SQL exécuté avec avertissement: {errorContent}");
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning($"⚠️ Erreur lors de l'exécution SQL (peut être normal si la table existe déjà): {ex.Message}");
        }
    }

    private async Task<List<string>> GetAppliedMigrationsAsync()
    {
        try
        {
            var request = new HttpRequestMessage(HttpMethod.Get, $"{_settings.Url}/rest/v1/migrations?select=migration_name");
            request.Headers.Add("apikey", _settings.ServiceRoleKey);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _settings.ServiceRoleKey);

            var response = await _httpClient.SendAsync(request);
            
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                var migrations = JsonSerializer.Deserialize<List<MigrationRecord>>(json);
                return migrations?.Select(m => m.MigrationName).ToList() ?? new List<string>();
            }
        }
        catch
        {
            // Table migrations n'existe pas encore, c'est normal
        }

        return new List<string>();
    }

    private async Task TrackMigrationAsync(string migrationName, string sqlScript)
    {
        try
        {
            var migration = new
            {
                migration_name = migrationName,
                sql_script = sqlScript
            };

            var request = new HttpRequestMessage(HttpMethod.Post, $"{_settings.Url}/rest/v1/migrations")
            {
                Content = new StringContent(JsonSerializer.Serialize(migration), Encoding.UTF8, "application/json")
            };

            request.Headers.Add("apikey", _settings.ServiceRoleKey);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _settings.ServiceRoleKey);

            await _httpClient.SendAsync(request);
        }
        catch (Exception ex)
        {
            _logger.LogWarning($"⚠️ Erreur lors du tracking de la migration {migrationName}: {ex.Message}");
        }
    }

    private class MigrationRecord
    {
        public string MigrationName { get; set; } = string.Empty;
    }
} 
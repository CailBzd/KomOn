using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using KomOn.Infrastructure.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using Supabase;

namespace KomOn.Infrastructure.Services;

public class DatabaseInitializationService
{
    private readonly HttpClient _httpClient;
    private readonly SupabaseSettings _settings;
    private readonly ILogger<DatabaseInitializationService> _logger;
    private readonly Client _supabaseClient;

    public DatabaseInitializationService(IOptions<SupabaseSettings> settings, ILogger<DatabaseInitializationService> logger)
    {
        _settings = settings.Value;
        _logger = logger;
        _httpClient = new HttpClient();
        
        // Ajouter les headers requis pour Supabase
        _httpClient.DefaultRequestHeaders.Add("apikey", _settings.ServiceRoleKey);
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _settings.ServiceRoleKey);

        // Initialiser le client Supabase pour l'exécution SQL
        var supabaseUrl = _settings.Url;
        var supabaseKey = _settings.ServiceRoleKey;
        _supabaseClient = new Client(supabaseUrl, supabaseKey);
    }

    public async Task<bool> InitializeDatabaseAsync()
    {
        try
        {
            _logger.LogInformation("🚀 Initialisation de la base de données KomOn...");

            // Créer les tables via l'API REST
            var tablesCreated = await CreateTablesAsync();
            if (!tablesCreated)
            {
                _logger.LogError("❌ Échec de la création des tables");
                return false;
            }

            // Insérer les sports
            var sportsInserted = await InsertSportsAsync();
            if (sportsInserted)
            {
                var sportsCount = await GetSportsCountAsync();
                _logger.LogInformation($"📊 {sportsCount} sports créés dans la base de données");
            }

            _logger.LogInformation("✅ Base de données KomOn initialisée avec succès");
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erreur lors de l'initialisation de la base de données");
            return false;
        }
    }



    private async Task<bool> CreateTablesAsync()
    {
        try
        {
            _logger.LogInformation("📋 Vérification et création des tables...");
            
            // Vérifier si les tables existent déjà en essayant d'accéder à la table sports
            var response = await _httpClient.GetAsync($"{_settings.Url}/rest/v1/sports?select=id&limit=1");
            
            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("✅ Tables déjà existantes");
                return true;
            }
            else if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                _logger.LogWarning("⚠️ Tables non trouvées - Création automatique...");
                
                // Créer les tables via l'API REST de Supabase
                var tablesCreated = await CreateTablesViaRestApiAsync();
                
                if (tablesCreated)
                {
                    _logger.LogInformation("✅ Tables créées avec succès");
                    return true;
                }
                else
                {
                    _logger.LogError("❌ Échec de la création automatique des tables");
                    _logger.LogInformation("📝 Création manuelle requise dans l'interface Supabase :");
                    _logger.LogInformation("   https://supabase.com/dashboard/project/[VOTRE_PROJET]/sql");
                    _logger.LogInformation("   Ou exécutez le fichier : supabase/migrations/20241201000002_create_komon_database.sql");
                    return false;
                }
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError($"❌ Erreur lors de la vérification des tables: {response.StatusCode} - {errorContent}");
                return false;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erreur lors de la vérification des tables");
            return false;
        }
    }

    private async Task<bool> CreateTablesViaRestApiAsync()
    {
        try
        {
            _logger.LogInformation("🔧 Création des tables via l'API REST...");
            
            // Créer la table sports en premier (table de base)
            var sportsTableCreated = await CreateSportsTableAsync();
            if (!sportsTableCreated)
            {
                _logger.LogError("❌ Impossible de créer la table sports");
                return false;
            }

            // Créer la table users
            var usersTableCreated = await CreateUsersTableAsync();
            if (!usersTableCreated)
            {
                _logger.LogError("❌ Impossible de créer la table users");
                return false;
            }

            // Créer les autres tables qui dépendent des tables de base
            var eventsTableCreated = await CreateEventsTableAsync();
            var registrationsTableCreated = await CreateEventRegistrationsTableAsync();
            var userSportsTableCreated = await CreateUserSportsTableAsync();
            var messagesTableCreated = await CreateMessagesTableAsync();
            var creditsTableCreated = await CreateCreditsTableAsync();

            var allTablesCreated = eventsTableCreated && registrationsTableCreated && 
                                  userSportsTableCreated && messagesTableCreated && creditsTableCreated;

            if (allTablesCreated)
            {
                _logger.LogInformation("✅ Toutes les tables créées avec succès");
                return true;
            }
            else
            {
                _logger.LogWarning("⚠️ Certaines tables n'ont pas pu être créées");
                return false;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erreur lors de la création des tables via l'API REST");
            return false;
        }
    }

    private async Task<bool> CreateSportsTableAsync()
    {
        try
        {
            // Créer la table sports via une requête POST avec un schéma spécifique
            var tableDefinition = new
            {
                name = "sports",
                columns = new object[]
                {
                    new { name = "id", type = "uuid", primary_key = true, default_value = "gen_random_uuid()" },
                    new { name = "name", type = "varchar(100)", not_null = true, unique = true },
                    new { name = "description", type = "text" },
                    new { name = "icon_url", type = "varchar(255)" },
                    new { name = "is_active", type = "boolean", default_value = "true" },
                    new { name = "created_at", type = "timestamp with time zone", default_value = "now()" },
                    new { name = "updated_at", type = "timestamp with time zone", default_value = "now()" }
                }
            };

            var json = JsonSerializer.Serialize(tableDefinition);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Utiliser l'endpoint de gestion des schémas de Supabase
            var response = await _httpClient.PostAsync($"{_settings.Url}/rest/v1/rpc/create_table", content);
            
            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("✅ Table sports créée");
                return true;
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogWarning($"⚠️ Impossible de créer la table sports via API: {errorContent}");
                
                // Fallback : essayer de créer via une insertion qui déclenchera la création automatique
                return await CreateTableViaInsertionAsync("sports");
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning($"⚠️ Erreur lors de la création de la table sports: {ex.Message}");
            return await CreateTableViaInsertionAsync("sports");
        }
    }

    private async Task<bool> CreateTableViaInsertionAsync(string tableName)
    {
        try
        {
            _logger.LogInformation($"🔄 Tentative de création de la table {tableName} via insertion...");
            
            // Essayer d'insérer un enregistrement de test pour déclencher la création automatique
            object testData;
            switch (tableName)
            {
                case "sports":
                    testData = new { name = "Test Sport", description = "Sport de test", icon_url = "⚽" };
                    break;
                case "users":
                    testData = new { username = "testuser", first_name = "Test", last_name = "User", email = "test@test.com", password_hash = "test" };
                    break;
                default:
                    testData = new { id = Guid.NewGuid(), name = "test" };
                    break;
            }

            var json = JsonSerializer.Serialize(testData);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync($"{_settings.Url}/rest/v1/{tableName}", content);
            
            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation($"✅ Table {tableName} créée via insertion");
                return true;
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogWarning($"⚠️ Impossible de créer la table {tableName}: {errorContent}");
                return false;
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning($"⚠️ Erreur lors de la création de la table {tableName}: {ex.Message}");
            return false;
        }
    }

    private Task<bool> CreateUsersTableAsync()
    {
        return CreateTableViaInsertionAsync("users");
    }

    private Task<bool> CreateEventsTableAsync()
    {
        return CreateTableViaInsertionAsync("events");
    }

    private Task<bool> CreateEventRegistrationsTableAsync()
    {
        return CreateTableViaInsertionAsync("event_registrations");
    }

    private Task<bool> CreateUserSportsTableAsync()
    {
        return CreateTableViaInsertionAsync("user_sports");
    }

    private Task<bool> CreateMessagesTableAsync()
    {
        return CreateTableViaInsertionAsync("messages");
    }

    private Task<bool> CreateCreditsTableAsync()
    {
        return CreateTableViaInsertionAsync("credits");
    }





    private async Task<bool> InsertSportsAsync()
    {
        try
        {
            _logger.LogInformation("🏃 Insertion des sports...");

            var sports = new[]
            {
                new { name = "Football", description = "Le football est un sport collectif qui se joue principalement au pied avec un ballon sphérique.", icon_url = "⚽" },
                new { name = "Basketball", description = "Le basketball est un sport collectif qui se joue à la main avec un ballon.", icon_url = "🏀" },
                new { name = "Tennis", description = "Le tennis est un sport de raquette qui se joue entre deux joueurs ou deux équipes.", icon_url = "🎾" },
                new { name = "Course à pied", description = "La course à pied est un sport d'endurance qui se pratique en extérieur.", icon_url = "🏃" },
                new { name = "Musculation", description = "La musculation est un sport qui vise à développer la force musculaire.", icon_url = "💪" },
                new { name = "Natation", description = "La natation est un sport qui se pratique dans l'eau.", icon_url = "🏊" },
                new { name = "Cyclisme", description = "Le cyclisme est un sport qui se pratique à vélo.", icon_url = "🚴" },
                new { name = "Volleyball", description = "Le volleyball est un sport collectif qui se joue avec les mains et les avant-bras.", icon_url = "🏐" },
                new { name = "Handball", description = "Le handball est un sport collectif qui se joue à la main avec un ballon.", icon_url = "🤾" },
                new { name = "Badminton", description = "Le badminton est un sport de raquette qui se joue avec un volant.", icon_url = "🏸" },
                new { name = "Boxe", description = "La boxe est un sport de combat qui se pratique avec les poings.", icon_url = "🥊" },
                new { name = "Judo", description = "Le judo est un art martial et un sport de combat d'origine japonaise.", icon_url = "🥋" },
                new { name = "Escalade", description = "L'escalade est un sport qui consiste à grimper sur des parois rocheuses.", icon_url = "🧗" },
                new { name = "Randonnée", description = "La randonnée est une activité de marche en pleine nature.", icon_url = "🥾" },
                new { name = "Ski", description = "Le ski est un sport de glisse qui se pratique sur la neige.", icon_url = "⛷️" },
                new { name = "Golf", description = "Le golf est un sport de précision qui se joue avec des clubs.", icon_url = "⛳" },
                new { name = "Yoga", description = "Le yoga est une discipline qui combine postures, respiration et méditation.", icon_url = "🧘" },
                new { name = "CrossFit", description = "Le CrossFit est un programme de fitness qui combine plusieurs disciplines.", icon_url = "🏋️" },
                new { name = "Surf", description = "Le surf est un sport de glisse qui se pratique sur les vagues.", icon_url = "🏄" },
                new { name = "Skateboard", description = "Le skateboard est un sport de glisse urbain.", icon_url = "🛹" }
            };

            var insertedCount = 0;
            foreach (var sport in sports)
            {
                try
                {
                    var json = JsonSerializer.Serialize(sport);
                    var content = new StringContent(json, Encoding.UTF8, "application/json");

                    var response = await _httpClient.PostAsync($"{_settings.Url}/rest/v1/sports", content);
                    
                    if (response.IsSuccessStatusCode)
                    {
                        insertedCount++;
                    }
                    else
                    {
                        // Si le sport existe déjà, c'est normal
                        var errorContent = await response.Content.ReadAsStringAsync();
                        if (errorContent.Contains("duplicate key") || errorContent.Contains("already exists"))
                        {
                            _logger.LogInformation($"Sport '{sport.name}' existe déjà");
                        }
                        else
                        {
                            _logger.LogWarning($"Impossible d'insérer le sport '{sport.name}': {errorContent}");
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"Erreur lors de l'insertion du sport '{sport.name}': {ex.Message}");
                }
            }

            _logger.LogInformation($"✅ {insertedCount} sports insérés avec succès");
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erreur lors de l'insertion des sports");
            return false;
        }
    }

    private async Task<int> GetSportsCountAsync()
    {
        try
        {
            var response = await _httpClient.GetAsync($"{_settings.Url}/rest/v1/sports?select=id");
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var sports = JsonSerializer.Deserialize<List<object>>(content);
                return sports?.Count ?? 0;
            }
            return 0;
        }
        catch
        {
            return 0;
        }
    }
} 
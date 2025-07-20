using KomOn.Infrastructure.Configuration;
using Microsoft.Extensions.Options;
using Supabase;
using Supabase.Gotrue;
using Supabase.Gotrue.Interfaces;
using Supabase.Postgrest;
using SupabaseClient = Supabase.Client;

namespace KomOn.Infrastructure.Services;

public class SupabaseService
{
    private readonly SupabaseSettings _settings;
    private readonly SupabaseClient _supabaseClient;
    // private readonly IUserService _userService; // SUPPRIMÉ

    public SupabaseService(IOptions<SupabaseSettings> settings) // SUPPRIMER IUserService
    {
        _settings = settings.Value;
        // _userService = userService; // SUPPRIMÉ
        
        var url = _settings.Url;
        var key = _settings.ServiceRoleKey ?? _settings.Key;
        
        var options = new SupabaseOptions
        {
            AutoRefreshToken = true,
            AutoConnectRealtime = true
        };
        
        _supabaseClient = new SupabaseClient(url, key, options);
    }

    // Méthodes d'authentification Supabase
    public async Task<AuthResult> SignUpAsync(string email, string password, Dictionary<string, object>? userData = null)
    {
        try
        {
            var options = new SignUpOptions
            {
                Data = userData
            };
            var response = await _supabaseClient.Auth.SignUp(email, password, options);
            
            if (response.User != null)
            {
                // Vérifier si l'email est confirmé
                if (!response.User.EmailConfirmedAt.HasValue)
                {
                    return new AuthResult
                    {
                        IsSuccess = true,
                        Token = null, // Pas de token tant que l'email n'est pas vérifié
                        RefreshToken = null,
                        Error = "Inscription réussie. Veuillez vérifier votre email avant de vous connecter.",
                        UserId = Guid.Parse(response.User.Id ?? string.Empty)
                    };
                }
                
                // Si l'email est déjà vérifié, on peut donner un token
                return new AuthResult
                {
                    IsSuccess = true,
                    Token = response.AccessToken ?? string.Empty,
                    RefreshToken = response.RefreshToken ?? string.Empty,
                    Error = null,
                    UserId = Guid.Parse(response.User.Id ?? string.Empty)
                };
            }
            
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Erreur lors de l'inscription.",
                UserId = Guid.Empty
            };
        }
        catch (Exception ex)
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = $"Erreur lors de l'inscription: {ex.Message}",
                UserId = Guid.Empty
            };
        }
    }

    public async Task<AuthResult> SignInAsync(string email, string password)
    {
        try
        {
            var response = await _supabaseClient.Auth.SignIn(email, password);
            if (response.User != null)
            {
                // Vérifier si l'email est confirmé
                if (!response.User.EmailConfirmedAt.HasValue)
                {
                    return new AuthResult
                    {
                        IsSuccess = false,
                        Error = "Votre email n'est pas encore validé.",
                        Token = null,
                        RefreshToken = null
                    };
                }
                if (!string.IsNullOrEmpty(response.AccessToken))
                {
                    return new AuthResult
                    {
                        IsSuccess = true,
                        Token = response.AccessToken ?? string.Empty,
                        RefreshToken = response.RefreshToken ?? string.Empty,
                        Error = null
                    };
                }
            }
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Email ou mot de passe incorrect."
            };
        }
        catch (Exception ex)
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = $"Erreur lors de la connexion: {ex.Message}"
            };
        }
    }

    public async Task<bool> SignOutAsync()
    {
        try
        {
            // Simulation d'un appel Supabase
            await Task.Delay(100);
            Console.WriteLine("Simulation SignOut");
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erreur lors de la déconnexion Supabase: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> RefreshSessionAsync(string refreshToken)
    {
        try
        {
            // Simulation d'un appel Supabase
            await Task.Delay(100);
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erreur lors du refresh de session Supabase: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> RevokeTokenAsync(string token)
    {
        try
        {
            // Pour l'instant, on simule la révocation
            await Task.Delay(100);
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erreur lors de la révocation du token Supabase: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> IsTokenRevokedAsync(string token)
    {
        try
        {
            // Pour l'instant, on simule la vérification
            await Task.Delay(100);
            return false; // Token non révoqué par défaut
        }
        catch
        {
            return false;
        }
    }

    // Méthode pour obtenir les paramètres de configuration
    public SupabaseSettings GetSettings() => _settings;

    /// <summary>
    /// Envoyer un code de vérification par email via Supabase
    /// </summary>
    public async Task<AuthResult> SendEmailVerificationAsync(string email)
    {
        try
        {
            // Utiliser l'API Supabase pour envoyer un email de vérification
            var options = new SignUpOptions
            {
                Data = new Dictionary<string, object> { { "email_verification", true } }
            };
            
            var response = await _supabaseClient.Auth.SignUp(email, "temporary-password", options);
            
            if (response.User != null && !response.User.EmailConfirmedAt.HasValue)
            {
                Console.WriteLine($"Email de vérification envoyé via Supabase: {email}");
                return new AuthResult
                {
                    IsSuccess = true,
                    Error = "Code de vérification envoyé par email."
                };
            }
            
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Impossible d'envoyer le code de vérification."
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erreur lors de l'envoi email Supabase: {ex.Message}");
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Erreur lors de l'envoi du code email."
            };
        }
    }

    /// <summary>
    /// Envoyer un code de vérification par SMS via Supabase
    /// </summary>
    public async Task<AuthResult> SendSmsVerificationAsync(string phoneNumber)
    {
        try
        {
            // Supabase ne supporte pas directement les SMS
            // Pour l'instant, on simule l'envoi
            // TODO: Intégrer un service SMS comme Twilio ou Vonage
            await Task.Delay(1000);
            Console.WriteLine($"Simulation envoi SMS de vérification: {phoneNumber}");
            
            return new AuthResult
            {
                IsSuccess = true,
                Error = "Code de vérification envoyé par SMS."
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erreur lors de l'envoi SMS: {ex.Message}");
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Erreur lors de l'envoi du code SMS."
            };
        }
    }

    /// <summary>
    /// Vérifier un code email via Supabase
    /// </summary>
    public async Task<AuthResult> VerifyEmailCodeAsync(string email, string code)
    {
        try
        {
            // Pour Supabase, la vérification email se fait via un lien dans l'email
            // Le code est généralement un token dans l'URL de redirection
            // Pour l'instant, on simule la vérification avec un code de 6 chiffres
            await Task.Delay(500);
            
            if (code.Length == 6 && code.All(char.IsDigit))
            {
                // TODO: Implémenter la vraie vérification avec Supabase
                // Cela nécessiterait de gérer les tokens de vérification
                Console.WriteLine($"Vérification email réussie: {email}");
                return new AuthResult
                {
                    IsSuccess = true,
                    Error = "Email vérifié avec succès."
                };
            }
            
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Code de vérification invalide."
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erreur lors de la vérification email: {ex.Message}");
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Erreur lors de la vérification du code email."
            };
        }
    }

    /// <summary>
    /// Vérifier un code SMS via Supabase
    /// </summary>
    public async Task<AuthResult> VerifySmsCodeAsync(string phoneNumber, string code)
    {
        try
        {
            // TODO: Implémenter avec la vraie API Supabase Auth
            // Pour l'instant, on accepte n'importe quel code de 6 chiffres
            await Task.Delay(500);
            
            if (code.Length == 6 && code.All(char.IsDigit))
            {
                Console.WriteLine($"Simulation vérification SMS réussie: {phoneNumber}");
                return new AuthResult
                {
                    IsSuccess = true,
                    Error = "SMS vérifié avec succès."
                };
            }
            
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Code de vérification invalide."
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erreur lors de la vérification SMS Supabase: {ex.Message}");
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Erreur lors de la vérification du code SMS."
            };
        }
    }

    // --- NOUVELLES MÉTHODES SUPABASE AUTH ---

    public async Task<AuthResult> SignUpWithEmailAsync(string email, Dictionary<string, object>? userData = null)
    {
        try
        {
            var options = new SignUpOptions { Data = userData };
            var response = await _supabaseClient.Auth.SignUp(email, null!, options);
            if (response.User != null)
            {
                return new AuthResult
                {
                    IsSuccess = true,
                    Token = response.AccessToken ?? string.Empty,
                    RefreshToken = response.RefreshToken ?? string.Empty,
                    Error = null
                };
            }
            return new AuthResult { IsSuccess = false, Error = "Erreur d'inscription" };
        }
        catch (Exception ex)
        {
            return new AuthResult { IsSuccess = false, Error = ex.Message };
        }
    }

    public async Task<AuthResult> SignUpWithPhoneAsync(string phone, Dictionary<string, object>? userData = null)
    {
        try
        {
            var options = new SignUpOptions { Data = userData };
            var response = await _supabaseClient.Auth.SignUp(phone, null!, options);
            if (response.User != null)
            {
                return new AuthResult
                {
                    IsSuccess = true,
                    Token = response.AccessToken ?? string.Empty,
                    RefreshToken = response.RefreshToken ?? string.Empty,
                    Error = null
                };
            }
            return new AuthResult { IsSuccess = false, Error = "Erreur d'inscription" };
        }
        catch (Exception ex)
        {
            return new AuthResult { IsSuccess = false, Error = ex.Message };
        }
    }

    public async Task<AuthResult> SignUpWithEmailAndPasswordAsync(string email, string password, Dictionary<string, object>? userData = null)
    {
        try
        {
            var options = new SignUpOptions { Data = userData };
            var response = await _supabaseClient.Auth.SignUp(email, password, options);
            if (response.User != null)
            {
                return new AuthResult
                {
                    IsSuccess = true,
                    Token = response.AccessToken ?? string.Empty,
                    RefreshToken = response.RefreshToken ?? string.Empty,
                    Error = null
                };
            }
            return new AuthResult { IsSuccess = false, Error = "Erreur d'inscription" };
        }
        catch (Exception ex)
        {
            return new AuthResult { IsSuccess = false, Error = ex.Message };
        }
    }

    public async Task<AuthResult> SignUpWithPhoneAndPasswordAsync(string phone, string password, Dictionary<string, object>? userData = null)
    {
        try
        {
            var options = new SignUpOptions { Data = userData };
            var response = await _supabaseClient.Auth.SignUp(phone, password, options);
            if (response.User != null)
            {
                return new AuthResult
                {
                    IsSuccess = true,
                    Token = response.AccessToken ?? string.Empty,
                    RefreshToken = response.RefreshToken ?? string.Empty,
                    Error = null
                };
            }
            return new AuthResult { IsSuccess = false, Error = "Erreur d'inscription" };
        }
        catch (Exception ex)
        {
            return new AuthResult { IsSuccess = false, Error = ex.Message };
        }
    }

    public async Task<AuthResult> SignInWithEmailPasswordAsync(string email, string password)
    {
        try
        {
            var response = await _supabaseClient.Auth.SignIn(email, password);
            if (response.User != null)
            {
                return new AuthResult
                {
                    IsSuccess = true,
                    Token = response.AccessToken ?? string.Empty,
                    RefreshToken = response.RefreshToken ?? string.Empty,
                    Error = null
                };
            }
            return new AuthResult { IsSuccess = false, Error = "Email ou mot de passe incorrect" };
        }
        catch (Exception ex)
        {
            return new AuthResult { IsSuccess = false, Error = ex.Message };
        }
    }

    public async Task<AuthResult> SignInWithMagicLinkAsync(string email)
    {
        try
        {
            // Envoi d'un magic link (login sans mot de passe)
            var response = await _supabaseClient.Auth.SignIn(email);
            // Le lien est envoyé par email, pas de session immédiate
            if (response != null)
            {
                return new AuthResult { IsSuccess = true, Error = null };
            }
            return new AuthResult { IsSuccess = false, Error = "Erreur lors de l'envoi du magic link" };
        }
        catch (Exception ex)
        {
            return new AuthResult { IsSuccess = false, Error = ex.Message };
        }
    }

    public async Task<AuthResult> SignInWithOtpAsync(string phoneOrEmail)
    {
        try
        {
            // Envoi d'un code OTP (SMS ou email)
            if (phoneOrEmail.Contains("@"))
            {
                var response = await _supabaseClient.Auth.SignIn(phoneOrEmail);
                if (response != null)
                {
                    return new AuthResult { IsSuccess = true, Error = null };
                }
            }
            else
            {
                var response = await _supabaseClient.Auth.SignIn(phoneOrEmail);
                if (response != null)
                {
                    return new AuthResult { IsSuccess = true, Error = null };
                }
            }
            return new AuthResult { IsSuccess = false, Error = "Erreur lors de l'envoi du code OTP" };
        }
        catch (Exception ex)
        {
            return new AuthResult { IsSuccess = false, Error = ex.Message };
        }
    }

    // Pour la vérification OTP, le SDK .NET ne fournit pas de méthode directe.
    // Il faudrait utiliser l'API REST Supabase ou gérer la vérification côté frontend.
    public Task<AuthResult> VerifyOtpAsync(string phoneOrEmail, string code, string type)
    {
        // À implémenter si besoin via l'API REST Supabase
        return Task.FromResult(new AuthResult { IsSuccess = false, Error = "Vérification OTP non supportée en natif par le SDK .NET. Utilisez le frontend ou l'API REST." });
    }

    /// <summary>
    /// Récupérer un utilisateur par email depuis la base de données Supabase
    /// </summary>
    public async Task<SupabaseUserInfo?> GetUserByEmailAsync(string email)
    {
        try
        {
            // Utiliser l'API REST Supabase pour interroger la table users
            using var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Add("apikey", _settings.ServiceRoleKey ?? _settings.Key);
            httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_settings.ServiceRoleKey ?? _settings.Key}");
            
            var url = $"{_settings.Url}/rest/v1/users?email=eq.{email}&select=id,first_name,last_name,email,phone_number,date_of_birth,bio,profile_picture_url,role,status,created_at,updated_at,username";
            var response = await httpClient.GetAsync(url);
            
            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"Erreur API Supabase: {response.StatusCode}");
                return null;
            }
            
            var jsonContent = await response.Content.ReadAsStringAsync();
            if (string.IsNullOrEmpty(jsonContent) || jsonContent == "[]")
            {
                return null;
            }
            
            // Parser la réponse JSON (simplifié pour l'exemple)
            // En production, utilisez System.Text.Json.JsonSerializer.Deserialize
            var userData = System.Text.Json.JsonSerializer.Deserialize<List<Dictionary<string, object>>>(jsonContent);
            
            if (userData == null || userData.Count == 0)
            {
                return null;
            }
            
            var firstUser = userData[0];
            
            return new SupabaseUserInfo
            {
                Id = Guid.Parse(firstUser["id"]?.ToString() ?? string.Empty),
                Email = firstUser["email"]?.ToString() ?? string.Empty,
                Username = firstUser["username"]?.ToString(),
                FirstName = firstUser["first_name"]?.ToString(),
                LastName = firstUser["last_name"]?.ToString(),
                PhoneNumber = firstUser["phone_number"]?.ToString(),
                DateOfBirth = ParseDateSafely(firstUser["date_of_birth"]),
                Bio = firstUser["bio"]?.ToString(),
                Role = firstUser["role"]?.ToString(),
                Status = firstUser["status"]?.ToString(),
                CreatedAt = ParseDateTimeSafely(firstUser["created_at"]),
                UpdatedAt = ParseDateTimeSafely(firstUser["updated_at"])
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erreur lors de la récupération de l'utilisateur par email: {ex.Message}");
            return null;
        }
    }

    /// <summary>
    /// Envoyer un email de réinitialisation de mot de passe
    /// </summary>
    public async Task<AuthResult> SendPasswordResetEmailAsync(string email)
    {
        try
        {
            // Utiliser l'API Supabase pour envoyer l'email de réinitialisation
            var response = await _supabaseClient.Auth.ResetPasswordForEmail(email);
            
            return new AuthResult
            {
                IsSuccess = true,
                Error = "Email de réinitialisation envoyé avec succès."
            };
        }
        catch (Exception ex)
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = $"Erreur lors de l'envoi de l'email de réinitialisation: {ex.Message}"
            };
        }
    }

    /// <summary>
    /// Réinitialiser le mot de passe avec un token
    /// </summary>
    public async Task<AuthResult> ResetPasswordAsync(string token, string newPassword)
    {
        try
        {
            using var httpClient = new HttpClient();
            
            // Configuration des headers pour l'API Supabase
            httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");
            httpClient.DefaultRequestHeaders.Add("apikey", _settings.ServiceRoleKey ?? _settings.Key);
            httpClient.DefaultRequestHeaders.Add("Content-Type", "application/json");
            
            // Préparation du payload pour la réinitialisation
            var payload = new { password = newPassword };
            var jsonContent = System.Text.Json.JsonSerializer.Serialize(payload);
            var content = new StringContent(jsonContent, System.Text.Encoding.UTF8, "application/json");
            
            // Appel à l'API Supabase pour réinitialiser le mot de passe
            var response = await httpClient.PutAsync($"{_settings.Url}/auth/v1/user", content);
            
            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Réinitialisation du mot de passe réussie: {responseContent}");
                
                return new AuthResult
                {
                    IsSuccess = true,
                    Error = "Mot de passe réinitialisé avec succès."
                };
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Erreur API Supabase: {response.StatusCode} - {errorContent}");
                
                return new AuthResult
                {
                    IsSuccess = false,
                    Error = $"Erreur lors de la réinitialisation: {response.StatusCode} - {errorContent}"
                };
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erreur lors de la réinitialisation du mot de passe: {ex.Message}");
            return new AuthResult
            {
                IsSuccess = false,
                Error = $"Erreur lors de la réinitialisation du mot de passe: {ex.Message}"
            };
        }
    }

    /// <summary>
    /// Mettre à jour un utilisateur dans Supabase
    /// </summary>
    public async Task<AuthResult> UpdateUserAsync(Guid userId, Dictionary<string, object> userData)
    {
        try
        {
            using var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Add("apikey", _settings.ServiceRoleKey ?? _settings.Key);
            httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_settings.ServiceRoleKey ?? _settings.Key}");
            httpClient.DefaultRequestHeaders.Add("Content-Type", "application/json");
            httpClient.DefaultRequestHeaders.Add("Prefer", "return=representation");
            
            var jsonContent = System.Text.Json.JsonSerializer.Serialize(userData);
            var content = new StringContent(jsonContent, System.Text.Encoding.UTF8, "application/json");
            
            var url = $"{_settings.Url}/rest/v1/users?id=eq.{userId}";
            var response = await httpClient.PatchAsync(url, content);
            
            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Utilisateur mis à jour avec succès: {responseContent}");
                
                return new AuthResult
                {
                    IsSuccess = true,
                    Error = "Utilisateur mis à jour avec succès."
                };
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Erreur API Supabase: {response.StatusCode} - {errorContent}");
                
                return new AuthResult
                {
                    IsSuccess = false,
                    Error = $"Erreur lors de la mise à jour: {response.StatusCode} - {errorContent}"
                };
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erreur lors de la mise à jour de l'utilisateur: {ex.Message}");
            return new AuthResult
            {
                IsSuccess = false,
                Error = $"Erreur lors de la mise à jour de l'utilisateur: {ex.Message}"
            };
        }
    }

    /// <summary>
    /// Récupérer un utilisateur depuis un token JWT (version simulée)
    /// </summary>
    public async Task<SupabaseUserInfo?> GetUserFromTokenAsync(string token)
    {
        await Task.Delay(100); // Simulation
        // Décoder le JWT ici si besoin, mais ne va pas en base
        return new SupabaseUserInfo
        {
            Id = Guid.NewGuid(),
            Email = "test@komon.com",
            Username = "testuser",
            FirstName = "Test",
            LastName = "User",
            PhoneNumber = null,
            DateOfBirth = DateTime.Now.AddYears(-25),
            Bio = null,
            Role = "Participant",
            Status = "Active",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    /// <summary>
    /// Parser une date de manière sécurisée
    /// </summary>
    private DateTime? ParseDateSafely(object? dateValue)
    {
        if (dateValue == null) return null;
        
        try
        {
            var dateString = dateValue.ToString();
            if (string.IsNullOrEmpty(dateString)) return null;
            
            // Essayer de parser comme DateTimeOffset pour gérer les timezones
            if (DateTimeOffset.TryParse(dateString, out var parsedDateTimeOffset))
            {
                // Convertir en UTC puis extraire la date
                // Ajouter 1 jour pour compenser le décalage timezone
                return parsedDateTimeOffset.UtcDateTime.Date.AddDays(1);
            }
            
            // Essayer différents formats de date
            if (DateTime.TryParse(dateString, out var parsedDate))
            {
                // S'assurer que c'est bien une date sans heure
                // Ajouter 1 jour pour compenser le décalage timezone
                return parsedDate.Date.AddDays(1);
            }
            
            // Essayer le format ISO spécifique
            if (DateTime.TryParseExact(dateString, "yyyy-MM-dd", null, System.Globalization.DateTimeStyles.None, out var isoDate))
            {
                return isoDate.Date;
            }
            
            // Si c'est un timestamp Unix
            if (long.TryParse(dateString, out var timestamp))
            {
                return DateTimeOffset.FromUnixTimeSeconds(timestamp).UtcDateTime.Date.AddDays(1);
            }
            
            return null;
        }
        catch
        {
            return null;
        }
    }

    /// <summary>
    /// Parser un DateTime de manière sécurisée
    /// </summary>
    private DateTime? ParseDateTimeSafely(object? dateTimeValue)
    {
        if (dateTimeValue == null) return null;
        
        try
        {
            var dateTimeString = dateTimeValue.ToString();
            if (string.IsNullOrEmpty(dateTimeString)) return null;
            
            // Essayer différents formats de DateTime
            if (DateTime.TryParse(dateTimeString, out var parsedDateTime))
            {
                return parsedDateTime;
            }
            
            // Si c'est un timestamp Unix
            if (long.TryParse(dateTimeString, out var timestamp))
            {
                return DateTimeOffset.FromUnixTimeSeconds(timestamp).DateTime;
            }
            
            return null;
        }
        catch
        {
            return null;
        }
    }
}

// Classe pour le résultat d'authentification Supabase
public class AuthResult
{
    public bool IsSuccess { get; set; }
    public string? Error { get; set; }
    public string? Token { get; set; }
    public string? RefreshToken { get; set; }
    public Guid UserId { get; set; } // Ajouté pour la synchro avec Supabase Auth
    public KomOn.Core.Entities.User? User { get; set; } // Ajouté pour les informations utilisateur
}

// Classe pour les informations utilisateur Supabase
public class SupabaseUserInfo
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? Username { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PhoneNumber { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Bio { get; set; }
    public string? Role { get; set; }
    public string? Status { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
} 
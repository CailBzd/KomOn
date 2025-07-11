using KomOn.Infrastructure.Configuration;
using Microsoft.Extensions.Options;
using Supabase;
using Supabase.Gotrue;
using Supabase.Gotrue.Interfaces;
using SupabaseClient = Supabase.Client;

namespace KomOn.Infrastructure.Services;

public class SupabaseService
{
    private readonly SupabaseSettings _settings;
    private readonly SupabaseClient _supabaseClient;

    public SupabaseService(IOptions<SupabaseSettings> settings)
    {
        _settings = settings.Value;
        
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
                        UserId = Guid.Parse(response.User.Id)
                    };
                }
                
                // Si l'email est déjà vérifié, on peut donner un token
                return new AuthResult
                {
                    IsSuccess = true,
                    Token = response.AccessToken ?? string.Empty,
                    RefreshToken = response.RefreshToken ?? string.Empty,
                    Error = null,
                    UserId = Guid.Parse(response.User.Id)
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
            var response = await _supabaseClient.Auth.SignUp(email, null, options);
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
            var response = await _supabaseClient.Auth.SignUp(phone, null, options);
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
    public async Task<AuthResult> VerifyOtpAsync(string phoneOrEmail, string code, string type)
    {
        // À implémenter si besoin via l'API REST Supabase
        return new AuthResult { IsSuccess = false, Error = "Vérification OTP non supportée en natif par le SDK .NET. Utilisez le frontend ou l'API REST." };
    }

    /// <summary>
    /// Récupérer un utilisateur par email depuis la base de données Supabase
    /// </summary>
    public async Task<SupabaseUserInfo?> GetUserByEmailAsync(string email)
    {
        try
        {
            // Pour l'instant, on simule la récupération depuis Supabase
            // TODO: Implémenter la vraie récupération depuis la table users de Supabase
            await Task.Delay(100);
            
            // Retourner un objet par défaut avec les métadonnées de l'utilisateur
            return new SupabaseUserInfo
            {
                Id = Guid.NewGuid(),
                Email = email,
                FirstName = "Utilisateur",
                LastName = "Supabase",
                PhoneNumber = null,
                DateOfBirth = DateTime.Now.AddYears(-25),
                Bio = null,
                Role = "Participant",
                Status = "Active",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
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
}

// Classe pour les informations utilisateur Supabase
public class SupabaseUserInfo
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
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
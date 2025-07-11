using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using KomOn.Core.Entities;
using KomOn.Core.Interfaces;
using KomOn.Core.DTOs;
using KomOn.API.DTOs;
using KomOn.Infrastructure.Services;
using Microsoft.IdentityModel.Tokens;
using BCrypt.Net;
using SupabaseUser = Supabase.Gotrue.User;
using Supabase.Gotrue;

namespace KomOn.API.Services;

public class AuthService
{
    private readonly IUserService _userService;
    private readonly IAuthService _authService;
    private readonly SupabaseService _supabaseService;
    private readonly IConfiguration _configuration;
    private readonly string _jwtSecret;
    private readonly string _jwtIssuer;
    private readonly string _jwtAudience;

    public AuthService(IUserService userService, IAuthService authService, SupabaseService supabaseService, IConfiguration configuration)
    {
        _userService = userService;
        _authService = authService;
        _supabaseService = supabaseService;
        _configuration = configuration;
        _jwtSecret = _configuration["Jwt:Secret"] ?? "your-super-secret-key-with-at-least-32-characters";
        _jwtIssuer = _configuration["Jwt:Issuer"] ?? "KomOn";
        _jwtAudience = _configuration["Jwt:Audience"] ?? "KomOnUsers";
    }

    public async Task<AuthResult> RegisterAsync(RegisterRequest request)
    {
        // Validation des données
        var validationErrors = ValidateRegisterRequest(request);
        if (validationErrors.Any())
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = string.Join("; ", validationErrors)
            };
        }

        try
        {
            // 1. Créer l'utilisateur dans Supabase Auth
            var signUpOptions = new SignUpOptions
            {
                Data = new Dictionary<string, object>
                {
                    { "first_name", request.FirstName },
                    { "last_name", request.LastName },
                    { "phone_number", request.PhoneNumber },
                    { "date_of_birth", request.DateOfBirth.ToString("yyyy-MM-dd") },
                    { "bio", request.Bio ?? "" },
                    { "role", "Participant" }
                }
            };

            var supabaseResponse = await _supabaseService.SignUpAsync(request.Email, request.Password, signUpOptions.Data);
            
            if (!supabaseResponse.IsSuccess)
            {
                return new AuthResult
                {
                    IsSuccess = false,
                    Error = supabaseResponse.Error ?? "Erreur lors de l'inscription avec Supabase."
                };
            }

            // 2. Créer l'utilisateur dans notre base de données locale
            var createUserRequest = new CreateUserRequest
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                DateOfBirth = request.DateOfBirth,
                PhoneNumber = request.PhoneNumber,
                Bio = request.Bio,
                Password = request.Password, // Ne sera pas utilisé car Supabase gère l'auth
                Role = "Participant"
            };

            var createdUser = await _userService.CreateAsync(createUserRequest);

            return new AuthResult
            {
                IsSuccess = true,
                User = createdUser,
                Token = supabaseResponse.Token,
                RefreshToken = supabaseResponse.RefreshToken
            };
        }
        catch (Exception ex)
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = $"Erreur lors de l'inscription: {ex.Message}"
            };
        }
    }

    public async Task<AuthResult> RegisterWithEmailAsync(RegisterEmailRequest request)
    {
        // Validation des données
        var validationErrors = ValidateRegisterEmailRequest(request);
        if (validationErrors.Any())
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = string.Join("; ", validationErrors)
            };
        }

        try
        {
            // 1. Créer l'utilisateur dans Supabase Auth avec email uniquement
            var userData = new Dictionary<string, object>
            {
                { "first_name", request.FirstName },
                { "last_name", request.LastName },
                { "date_of_birth", request.DateOfBirth.ToString("yyyy-MM-dd") },
                { "bio", request.Bio ?? "" },
                { "role", "Participant" }
            };

            var supabaseResponse = await _supabaseService.SignUpWithEmailAsync(request.Email, userData);
            
            if (!supabaseResponse.IsSuccess)
            {
                return new AuthResult
                {
                    IsSuccess = false,
                    Error = supabaseResponse.Error ?? "Erreur lors de l'inscription avec Supabase."
                };
            }

            // 2. Créer l'utilisateur dans notre base de données locale
            var createUserRequest = new CreateUserRequest
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                DateOfBirth = request.DateOfBirth,
                PhoneNumber = null,
                Bio = request.Bio,
                Password = null, // Pas de mot de passe pour l'inscription par email
                Role = "Participant"
            };

            var createdUser = await _userService.CreateAsync(createUserRequest);

            return new AuthResult
            {
                IsSuccess = true,
                User = createdUser,
                Token = supabaseResponse.Token,
                RefreshToken = supabaseResponse.RefreshToken
            };
        }
        catch (Exception ex)
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = $"Erreur lors de l'inscription: {ex.Message}"
            };
        }
    }

    public async Task<AuthResult> RegisterWithPhoneAsync(RegisterPhoneRequest request)
    {
        // Validation des données
        var validationErrors = ValidateRegisterPhoneRequest(request);
        if (validationErrors.Any())
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = string.Join("; ", validationErrors)
            };
        }

        try
        {
            // 1. Créer l'utilisateur dans Supabase Auth avec téléphone uniquement
            var userData = new Dictionary<string, object>
            {
                { "first_name", request.FirstName },
                { "last_name", request.LastName },
                { "date_of_birth", request.DateOfBirth.ToString("yyyy-MM-dd") },
                { "bio", request.Bio ?? "" },
                { "role", "Participant" }
            };

            var supabaseResponse = await _supabaseService.SignUpWithPhoneAsync(request.PhoneNumber, userData);
            
            if (!supabaseResponse.IsSuccess)
            {
                return new AuthResult
                {
                    IsSuccess = false,
                    Error = supabaseResponse.Error ?? "Erreur lors de l'inscription avec Supabase."
                };
            }

            // 2. Créer l'utilisateur dans notre base de données locale
            var createUserRequest = new CreateUserRequest
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = null, // Pas d'email pour l'inscription par téléphone
                DateOfBirth = request.DateOfBirth,
                PhoneNumber = request.PhoneNumber,
                Bio = request.Bio,
                Password = null, // Pas de mot de passe pour l'inscription par téléphone
                Role = "Participant"
            };

            var createdUser = await _userService.CreateAsync(createUserRequest);

            return new AuthResult
            {
                IsSuccess = true,
                User = createdUser,
                Token = supabaseResponse.Token,
                RefreshToken = supabaseResponse.RefreshToken
            };
        }
        catch (Exception ex)
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = $"Erreur lors de l'inscription: {ex.Message}"
            };
        }
    }

    public async Task<AuthResult> LoginAsync(LoginRequest request)
    {
        // Validation des données
        var validationErrors = ValidateLoginRequest(request);
        if (validationErrors.Any())
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = string.Join("; ", validationErrors)
            };
        }

        try
        {
            // 1. Authentifier avec Supabase
            var supabaseResponse = await _supabaseService.SignInAsync(request.Email, request.Password);
            
            if (!supabaseResponse.IsSuccess)
            {
                return new AuthResult
                {
                    IsSuccess = false,
                    Error = supabaseResponse.Error ?? "Email ou mot de passe incorrect."
                };
            }

            // 2. Récupérer l'utilisateur depuis notre base de données
            var user = await _userService.GetByEmailAsync(request.Email);
            if (user == null)
            {
                return new AuthResult
                {
                    IsSuccess = false,
                    Error = "Utilisateur non trouvé dans la base de données locale."
                };
            }

            return new AuthResult
            {
                IsSuccess = true,
                User = user,
                Token = supabaseResponse.Token,
                RefreshToken = supabaseResponse.RefreshToken
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

    public async Task<AuthResult> LoginWithMagicLinkAsync(string email)
    {
        if (string.IsNullOrWhiteSpace(email) || !IsValidEmail(email))
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Email invalide."
            };
        }

        try
        {
            var supabaseResponse = await _supabaseService.SignInWithMagicLinkAsync(email);
            
            if (!supabaseResponse.IsSuccess)
            {
                return new AuthResult
                {
                    IsSuccess = false,
                    Error = supabaseResponse.Error ?? "Erreur lors de l'envoi du magic link."
                };
            }

            return new AuthResult
            {
                IsSuccess = true,
                Error = "Magic link envoyé par email."
            };
        }
        catch (Exception ex)
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = $"Erreur lors de l'envoi du magic link: {ex.Message}"
            };
        }
    }

    public async Task<AuthResult> LoginWithOtpAsync(string emailOrPhone)
    {
        if (string.IsNullOrWhiteSpace(emailOrPhone))
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Email ou numéro de téléphone requis."
            };
        }

        try
        {
            var supabaseResponse = await _supabaseService.SignInWithOtpAsync(emailOrPhone);
            
            if (!supabaseResponse.IsSuccess)
            {
                return new AuthResult
                {
                    IsSuccess = false,
                    Error = supabaseResponse.Error ?? "Erreur lors de l'envoi du code OTP."
                };
            }

            return new AuthResult
            {
                IsSuccess = true,
                Error = "Code OTP envoyé."
            };
        }
        catch (Exception ex)
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = $"Erreur lors de l'envoi du code OTP: {ex.Message}"
            };
        }
    }

    public async Task<AuthResult> VerifyOtpAsync(string emailOrPhone, string code, string type)
    {
        if (string.IsNullOrWhiteSpace(emailOrPhone) || string.IsNullOrWhiteSpace(code))
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Email/téléphone et code requis."
            };
        }

        try
        {
            var supabaseResponse = await _supabaseService.VerifyOtpAsync(emailOrPhone, code, type);
            
            if (!supabaseResponse.IsSuccess)
            {
                return new AuthResult
                {
                    IsSuccess = false,
                    Error = supabaseResponse.Error ?? "Code OTP invalide."
                };
            }

            // Récupérer l'utilisateur depuis notre base de données
            KomOn.Core.Entities.User? user = null;
            if (IsValidEmail(emailOrPhone))
            {
                user = await _userService.GetByEmailAsync(emailOrPhone);
            }
            else
            {
                // Recherche utilisateur par téléphone via Supabase REST
                user = await _userService.GetByPhoneAsync(emailOrPhone);
            }

            if (user == null)
            {
                return new AuthResult
                {
                    IsSuccess = false,
                    Error = "Utilisateur non trouvé dans la base de données locale."
                };
            }

            return new AuthResult
            {
                IsSuccess = true,
                User = user,
                Token = supabaseResponse.Token,
                RefreshToken = supabaseResponse.RefreshToken
            };
        }
        catch (Exception ex)
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = $"Erreur lors de la vérification OTP: {ex.Message}"
            };
        }
    }

    public async Task<AuthResult> RefreshTokenAsync(string refreshToken)
    {
        if (string.IsNullOrWhiteSpace(refreshToken))
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Refresh token requis."
            };
        }

        try
        {
            var success = await _supabaseService.RefreshSessionAsync(refreshToken);
            
            if (!success)
            {
                return new AuthResult
                {
                    IsSuccess = false,
                    Error = "Refresh token invalide ou expiré."
                };
            }

            // TODO: Récupérer le nouvel access token et l'utilisateur
            // Pour l'instant, on simule
            return new AuthResult
            {
                IsSuccess = true,
                Error = "Token rafraîchi avec succès."
            };
        }
        catch (Exception ex)
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = $"Erreur lors du refresh du token: {ex.Message}"
            };
        }
    }

    public async Task<AuthResult> ChangePasswordAsync(ChangePasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.CurrentPassword) || 
            string.IsNullOrWhiteSpace(request.NewPassword) || 
            string.IsNullOrWhiteSpace(request.ConfirmPassword))
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Tous les champs sont requis."
            };
        }

        if (request.NewPassword != request.ConfirmPassword)
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Les mots de passe ne correspondent pas."
            };
        }

        try
        {
            // TODO: Implémenter le changement de mot de passe avec Supabase
            // Pour l'instant, on simule
            await Task.Delay(100);
            
            return new AuthResult
            {
                IsSuccess = true,
                Error = "Mot de passe modifié avec succès."
            };
        }
        catch (Exception ex)
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = $"Erreur lors du changement de mot de passe: {ex.Message}"
            };
        }
    }

    public async Task<AuthResult> ForgotPasswordAsync(string email)
    {
        if (string.IsNullOrWhiteSpace(email) || !IsValidEmail(email))
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Email invalide."
            };
        }

        try
        {
            // TODO: Implémenter la réinitialisation de mot de passe avec Supabase
            // Pour l'instant, on simule
            await Task.Delay(100);
            
            return new AuthResult
            {
                IsSuccess = true,
                Error = "Email de réinitialisation envoyé."
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

    public async Task<AuthResult> ResetPasswordAsync(ResetPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Token) || 
            string.IsNullOrWhiteSpace(request.NewPassword) || 
            string.IsNullOrWhiteSpace(request.ConfirmPassword))
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Tous les champs sont requis."
            };
        }

        if (request.NewPassword != request.ConfirmPassword)
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Les mots de passe ne correspondent pas."
            };
        }

        try
        {
            // TODO: Implémenter la réinitialisation de mot de passe avec Supabase
            // Pour l'instant, on simule
            await Task.Delay(100);
            
            return new AuthResult
            {
                IsSuccess = true,
                Error = "Mot de passe réinitialisé avec succès."
            };
        }
        catch (Exception ex)
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = $"Erreur lors de la réinitialisation du mot de passe: {ex.Message}"
            };
        }
    }

    public async Task<AuthResult> ValidateTokenAsync(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Token requis."
            };
        }

        try
        {
            // TODO: Implémenter la validation de token avec Supabase
            // Pour l'instant, on simule
            await Task.Delay(100);
            
            // TODO: Récupérer l'utilisateur depuis le token
            return new AuthResult
            {
                IsSuccess = true,
                Error = "Token valide."
            };
        }
        catch (Exception ex)
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = $"Erreur lors de la validation du token: {ex.Message}"
            };
        }
    }

    public async Task<AuthResult> LogoutAsync(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Token requis."
            };
        }

        try
        {
            var success = await _supabaseService.SignOutAsync();
            
            if (!success)
            {
                return new AuthResult
                {
                    IsSuccess = false,
                    Error = "Erreur lors de la déconnexion."
                };
            }

            return new AuthResult
            {
                IsSuccess = true,
                Error = "Déconnexion réussie."
            };
        }
        catch (Exception ex)
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = $"Erreur lors de la déconnexion: {ex.Message}"
            };
        }
    }

    public async Task<AuthResult> SendEmailVerificationAsync(string email)
    {
        if (string.IsNullOrWhiteSpace(email) || !IsValidEmail(email))
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Email invalide."
            };
        }

        try
        {
            var supabaseResponse = await _supabaseService.SendEmailVerificationAsync(email);
            
            if (!supabaseResponse.IsSuccess)
            {
                return new AuthResult
                {
                    IsSuccess = false,
                    Error = supabaseResponse.Error ?? "Erreur lors de l'envoi de l'email de vérification."
                };
            }

            return new AuthResult
            {
                IsSuccess = true,
                Error = "Email de vérification envoyé."
            };
        }
        catch (Exception ex)
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = $"Erreur lors de l'envoi de l'email de vérification: {ex.Message}"
            };
        }
    }

    public async Task<AuthResult> SendSmsVerificationAsync(string phoneNumber)
    {
        if (string.IsNullOrWhiteSpace(phoneNumber))
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Numéro de téléphone requis."
            };
        }

        try
        {
            var supabaseResponse = await _supabaseService.SendSmsVerificationAsync(phoneNumber);
            
            if (!supabaseResponse.IsSuccess)
            {
                return new AuthResult
                {
                    IsSuccess = false,
                    Error = supabaseResponse.Error ?? "Erreur lors de l'envoi du SMS de vérification."
                };
            }

            return new AuthResult
            {
                IsSuccess = true,
                Error = "SMS de vérification envoyé."
            };
        }
        catch (Exception ex)
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = $"Erreur lors de l'envoi du SMS de vérification: {ex.Message}"
            };
        }
    }

    public async Task<AuthResult> VerifyEmailCodeAsync(string email, string code)
    {
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(code))
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Email et code requis."
            };
        }

        try
        {
            var supabaseResponse = await _supabaseService.VerifyEmailCodeAsync(email, code);
            
            if (!supabaseResponse.IsSuccess)
            {
                return new AuthResult
                {
                    IsSuccess = false,
                    Error = supabaseResponse.Error ?? "Code de vérification invalide."
                };
            }

            return new AuthResult
            {
                IsSuccess = true,
                Error = "Email vérifié avec succès."
            };
        }
        catch (Exception ex)
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = $"Erreur lors de la vérification de l'email: {ex.Message}"
            };
        }
    }

    public async Task<AuthResult> VerifySmsCodeAsync(string phoneNumber, string code)
    {
        if (string.IsNullOrWhiteSpace(phoneNumber) || string.IsNullOrWhiteSpace(code))
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Numéro de téléphone et code requis."
            };
        }

        try
        {
            var supabaseResponse = await _supabaseService.VerifySmsCodeAsync(phoneNumber, code);
            
            if (!supabaseResponse.IsSuccess)
            {
                return new AuthResult
                {
                    IsSuccess = false,
                    Error = supabaseResponse.Error ?? "Code de vérification invalide."
                };
            }

            return new AuthResult
            {
                IsSuccess = true,
                Error = "SMS vérifié avec succès."
            };
        }
        catch (Exception ex)
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = $"Erreur lors de la vérification du SMS: {ex.Message}"
            };
        }
    }

    private List<string> ValidateRegisterRequest(RegisterRequest request)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(request.FirstName))
            errors.Add("Le prénom est requis.");

        if (string.IsNullOrWhiteSpace(request.LastName))
            errors.Add("Le nom est requis.");

        if (string.IsNullOrWhiteSpace(request.Email))
            errors.Add("L'email est requis.");
        else if (!IsValidEmail(request.Email))
            errors.Add("L'email n'est pas valide.");

        if (string.IsNullOrWhiteSpace(request.Password))
            errors.Add("Le mot de passe est requis.");
        else if (request.Password.Length < 8)
            errors.Add("Le mot de passe doit contenir au moins 8 caractères.");

        return errors;
    }

    private List<string> ValidateRegisterEmailRequest(RegisterEmailRequest request)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(request.FirstName))
            errors.Add("Le prénom est requis.");

        if (string.IsNullOrWhiteSpace(request.LastName))
            errors.Add("Le nom est requis.");

        if (string.IsNullOrWhiteSpace(request.Email))
            errors.Add("L'email est requis.");
        else if (!IsValidEmail(request.Email))
            errors.Add("L'email n'est pas valide.");

        return errors;
    }

    private List<string> ValidateRegisterPhoneRequest(RegisterPhoneRequest request)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(request.FirstName))
            errors.Add("Le prénom est requis.");

        if (string.IsNullOrWhiteSpace(request.LastName))
            errors.Add("Le nom est requis.");

        if (string.IsNullOrWhiteSpace(request.PhoneNumber))
            errors.Add("Le numéro de téléphone est requis.");

        return errors;
    }

    private List<string> ValidateLoginRequest(LoginRequest request)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(request.Email))
            errors.Add("L'email est requis.");
        else if (!IsValidEmail(request.Email))
            errors.Add("L'email n'est pas valide.");

        if (string.IsNullOrWhiteSpace(request.Password))
            errors.Add("Le mot de passe est requis.");

        return errors;
    }

    private bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }
}

public class AuthResult
{
    public bool IsSuccess { get; set; }
    public KomOn.Core.Entities.User? User { get; set; }
    public string? Token { get; set; }
    public string? RefreshToken { get; set; }
    public string? Error { get; set; }
} 
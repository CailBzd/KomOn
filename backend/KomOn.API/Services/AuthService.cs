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
                    { "phone_number", request.PhoneNumber ?? string.Empty },
                    { "date_of_birth", request.DateOfBirth.ToString("yyyy-MM-dd") },
                    { "bio", request.Bio ?? string.Empty },
                    { "role", "Participant" }
                }
            };

            var supabaseResponse = await _supabaseService.SignUpAsync(request.Email, request.Password, signUpOptions.Data);
            
            if (!supabaseResponse.IsSuccess)
            {
                // Cas spécifique : email non confirmé
                if (supabaseResponse.Error != null && supabaseResponse.Error.ToLower().Contains("email not confirmed"))
                {
                    return new AuthResult
                    {
                        IsSuccess = false,
                        Error = "Votre adresse email n’a pas encore été validée. Merci de vérifier votre boîte mail et de cliquer sur le lien de validation."
                    };
                }
                return new AuthResult
                {
                    IsSuccess = false,
                    Error = supabaseResponse.Error ?? "Erreur lors de l'inscription avec Supabase."
                };
            }

            // 2. Créer l'utilisateur dans la base de données avec l'ID Supabase Auth
            var createUserRequest = new CreateUserRequest
            {
                Id = supabaseResponse.UserId, // Utilise le Guid retourné par Supabase
                Username = request.Username,
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

            // Envoyer automatiquement un email de vérification
            await _supabaseService.SendEmailVerificationAsync(request.Email);

            return new AuthResult
            {
                IsSuccess = true,
                User = createdUser,
                Token = supabaseResponse.Token, // Sera null si l'email n'est pas vérifié
                RefreshToken = supabaseResponse.RefreshToken, // Sera null si l'email n'est pas vérifié
                Error = "Inscription réussie ! Veuillez vérifier votre boîte mail et cliquer sur le lien de validation pour activer votre compte."
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

            // 2. Créer l'utilisateur dans la base de données avec l'ID Supabase Auth
            var createUserRequest = new CreateUserRequest
            {
                Id = supabaseResponse.UserId, // <-- Ajout de l'ID Auth
                Username = request.Username,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                DateOfBirth = request.DateOfBirth,
                PhoneNumber = string.Empty,
                Bio = request.Bio,
                Password = string.Empty, // Pas de mot de passe pour l'inscription par email
                Role = "Participant"
            };

            var createdUser = await _userService.CreateAsync(createUserRequest);

            // Envoyer automatiquement un email de vérification
            await _supabaseService.SendEmailVerificationAsync(request.Email);

            return new AuthResult
            {
                IsSuccess = true,
                User = createdUser,
                Token = supabaseResponse.Token, // Sera null si l'email n'est pas vérifié
                RefreshToken = supabaseResponse.RefreshToken, // Sera null si l'email n'est pas vérifié
                Error = supabaseResponse.Error ?? "Inscription réussie. Veuillez vérifier votre email pour valider votre compte."
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
                { "bio", request.Bio ?? string.Empty },
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

            // 2. Créer l'utilisateur dans la base de données avec l'ID Supabase Auth
            var createUserRequest = new CreateUserRequest
            {
                Id = supabaseResponse.UserId, // <-- Ajout de l'ID Auth
                Username = request.Username,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = string.Empty, // Pas d'email pour l'inscription par téléphone
                DateOfBirth = request.DateOfBirth,
                PhoneNumber = request.PhoneNumber,
                Bio = request.Bio,
                Password = string.Empty, // Pas de mot de passe pour l'inscription par téléphone
                Role = "Participant"
            };

            var createdUser = await _userService.CreateAsync(createUserRequest);

            // Pas de vérification SMS, inscription directe
            return new AuthResult
            {
                IsSuccess = true,
                User = createdUser,
                Token = supabaseResponse.Token,
                RefreshToken = supabaseResponse.RefreshToken,
                Error = "Inscription réussie. Veuillez compléter votre profil."
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
        Console.WriteLine($"🔧 AuthService.LoginAsync called with email: {request?.Email}");
        
        // Validation des données
        var validationErrors = ValidateLoginRequest(request);
        if (validationErrors.Any())
        {
            var errorMessage = string.Join("; ", validationErrors);
            Console.WriteLine($"❌ Login validation failed: {errorMessage}");
            return new AuthResult
            {
                IsSuccess = false,
                Error = errorMessage
            };
        }

        Console.WriteLine($"✅ Login validation passed, attempting Supabase authentication");
        
        try
        {
            // 1. Authentifier avec Supabase
            Console.WriteLine($"🔧 Calling SupabaseService.SignInAsync for email: {request.Email}");
            var supabaseResponse = await _supabaseService.SignInAsync(request.Email, request.Password);
            
            Console.WriteLine($"🔧 Supabase response received: Success={supabaseResponse.IsSuccess}, Error={supabaseResponse.Error}");
            
            if (!supabaseResponse.IsSuccess)
            {
                // Cas spécifique : email non confirmé
                if (supabaseResponse.Error != null && supabaseResponse.Error.ToLower().Contains("email not confirmed"))
                {
                    return new AuthResult
                    {
                        IsSuccess = false,
                        Error = "Votre adresse email n’a pas encore été validée. Merci de vérifier votre boîte mail et de cliquer sur le lien de validation."
                    };
                }
                // Cas spécifique : identifiants invalides
                if (supabaseResponse.Error != null && supabaseResponse.Error.ToLower().Contains("invalid login credentials"))
                {
                    Console.WriteLine($"❌ Invalid credentials error");
                    return new AuthResult
                    {
                        IsSuccess = false,
                        Error = "Email ou mot de passe incorrect. Vérifiez vos identifiants et réessayez."
                    };
                }
                
                // Cas spécifique : utilisateur non trouvé
                if (supabaseResponse.Error != null && supabaseResponse.Error.ToLower().Contains("user not found"))
                {
                    Console.WriteLine($"❌ User not found error");
                    return new AuthResult
                    {
                        IsSuccess = false,
                        Error = "Aucun compte trouvé avec cette adresse email."
                    };
                }
                
                Console.WriteLine($"❌ Supabase authentication failed: {supabaseResponse.Error}");
                return new AuthResult
                {
                    IsSuccess = false,
                    Error = "Email ou mot de passe incorrect. Vérifiez vos identifiants et réessayez."
                };
            }

            // 2. Récupérer les informations utilisateur depuis la base de données Supabase
            var supabaseUser = await _supabaseService.GetUserByEmailAsync(request.Email);
            
            if (supabaseUser == null)
            {
                return new AuthResult
                {
                    IsSuccess = false,
                    Error = "Impossible de récupérer les informations utilisateur depuis Supabase."
                };
            }

            // 3. Créer un objet User à partir des données Supabase
            var user = new KomOn.Core.Entities.User
            {
                Id = supabaseUser.Id,
                Email = supabaseUser.Email,
                FirstName = supabaseUser.FirstName ?? "Utilisateur",
                LastName = supabaseUser.LastName ?? "Supabase",
                PhoneNumber = supabaseUser.PhoneNumber,
                DateOfBirth = supabaseUser.DateOfBirth ?? DateTime.Now.AddYears(-25),
                Bio = supabaseUser.Bio,
                Role = supabaseUser.Role ?? "Participant",
                Status = supabaseUser.Status ?? "Active",
                CreatedAt = supabaseUser.CreatedAt ?? DateTime.UtcNow,
                UpdatedAt = supabaseUser.UpdatedAt ?? DateTime.UtcNow,
                Username = supabaseUser.Username!
            };

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
            Console.WriteLine($"❌ Exception during login: {ex.Message}");
            Console.WriteLine($"❌ Stack trace: {ex.StackTrace}");
            
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Erreur de connexion. Veuillez réessayer plus tard."
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

            // Récupérer l'utilisateur depuis Supabase
            KomOn.Core.Entities.User? user = null;
            if (IsValidEmail(emailOrPhone))
            {
                var supabaseUser = await _supabaseService.GetUserByEmailAsync(emailOrPhone);
                if (supabaseUser != null)
                {
                    user = new KomOn.Core.Entities.User
                    {
                        Id = supabaseUser.Id,
                        Email = supabaseUser.Email,
                        FirstName = supabaseUser.FirstName ?? "Utilisateur",
                        LastName = supabaseUser.LastName ?? "Supabase",
                        PhoneNumber = supabaseUser.PhoneNumber,
                        DateOfBirth = supabaseUser.DateOfBirth ?? DateTime.Now.AddYears(-25),
                        Bio = supabaseUser.Bio,
                        Role = supabaseUser.Role ?? "Participant",
                        Status = supabaseUser.Status ?? "Active",
                        CreatedAt = supabaseUser.CreatedAt ?? DateTime.UtcNow,
                        UpdatedAt = supabaseUser.UpdatedAt ?? DateTime.UtcNow
                    };
                }
            }
            else
            {
                // TODO: Implémenter la récupération par téléphone depuis Supabase
                // Pour l'instant, on simule
                user = new KomOn.Core.Entities.User
                {
                    Id = Guid.NewGuid(),
                    Email = string.Empty,
                    FirstName = "Utilisateur",
                    LastName = "Téléphone",
                    PhoneNumber = emailOrPhone,
                    DateOfBirth = DateTime.Now.AddYears(-25),
                    Bio = string.Empty,
                    Role = "Participant",
                    Status = "Active",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
            }

            if (user == null)
            {
                return new AuthResult
                {
                    IsSuccess = false,
                    Error = "Utilisateur non trouvé dans Supabase."
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
            var result = await _supabaseService.SendPasswordResetEmailAsync(email);
            
            if (!result.IsSuccess)
            {
                return new AuthResult
                {
                    IsSuccess = false,
                    Error = result.Error ?? "Erreur lors de l'envoi de l'email de réinitialisation."
                };
            }

            return new AuthResult
            {
                IsSuccess = true,
                Error = "Email de réinitialisation envoyé. Veuillez vérifier votre boîte mail."
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

        // Validation du mot de passe
        var passwordValidationErrors = ValidatePassword(request.NewPassword);
        if (passwordValidationErrors.Any())
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = string.Join("; ", passwordValidationErrors)
            };
        }

        try
        {
            var result = await _supabaseService.ResetPasswordAsync(request.Token, request.NewPassword);
            
            if (!result.IsSuccess)
            {
                return new AuthResult
                {
                    IsSuccess = false,
                    Error = result.Error ?? "Erreur lors de la réinitialisation du mot de passe."
                };
            }

            return new AuthResult
            {
                IsSuccess = true,
                Error = "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter."
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

    public Task<AuthResult> VerifyEmailCodeAsync(string email, string code)
    {
        return Task.FromResult(new AuthResult
        {
            IsSuccess = true,
            Error = "Veuillez vérifier votre email pour valider votre compte."
        });
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

    private List<string> ValidatePassword(string password)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(password))
        {
            errors.Add("Le mot de passe est requis.");
            return errors;
        }

        if (password.Length < 8)
            errors.Add("Le mot de passe doit contenir au moins 8 caractères.");

        if (!password.Any(char.IsLower))
            errors.Add("Le mot de passe doit contenir au moins une minuscule.");

        if (!password.Any(char.IsUpper))
            errors.Add("Le mot de passe doit contenir au moins une majuscule.");

        if (!password.Any(char.IsDigit))
            errors.Add("Le mot de passe doit contenir au moins un chiffre.");

        if (!password.Any(c => !char.IsLetterOrDigit(c) && c != ' '))
            errors.Add("Le mot de passe doit contenir au moins un caractère spécial.");

        return errors;
    }
} 
using System.ComponentModel.DataAnnotations;
using KomOn.Core.Entities;

namespace KomOn.API.DTOs;

public class RegisterRequest
{
    [Required(ErrorMessage = "Le pseudo est requis.")]
    [StringLength(50, ErrorMessage = "Le pseudo ne peut pas dépasser 50 caractères.")]
    [RegularExpression(@"^[a-zA-Z0-9_-]+$", ErrorMessage = "Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores.")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le prénom est requis.")]
    [StringLength(100, ErrorMessage = "Le prénom ne peut pas dépasser 100 caractères.")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le nom est requis.")]
    [StringLength(100, ErrorMessage = "Le nom ne peut pas dépasser 100 caractères.")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "L'email est requis.")]
    [EmailAddress(ErrorMessage = "L'email n'est pas valide.")]
    [StringLength(255, ErrorMessage = "L'email ne peut pas dépasser 255 caractères.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le mot de passe est requis.")]
    [StringLength(100, MinimumLength = 8, ErrorMessage = "Le mot de passe doit contenir entre 8 et 100 caractères.")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-])[A-Za-z\d@$!%*?\-]{8,}$",
     ErrorMessage = "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial.")]
    public string Password { get; set; } = string.Empty;


    [Required(ErrorMessage = "La date de naissance est requise.")]
    public DateTime DateOfBirth { get; set; }

    [Phone(ErrorMessage = "Le numéro de téléphone n'est pas valide.")]
    [StringLength(20, ErrorMessage = "Le numéro de téléphone ne peut pas dépasser 20 caractères.")]
    public string? PhoneNumber { get; set; }

    [StringLength(500, ErrorMessage = "La bio ne peut pas dépasser 500 caractères.")]
    public string? Bio { get; set; }
}

public class RegisterEmailRequest
{
    [Required(ErrorMessage = "Le pseudo est requis.")]
    [StringLength(50, ErrorMessage = "Le pseudo ne peut pas dépasser 50 caractères.")]
    [RegularExpression(@"^[a-zA-Z0-9_-]+$", ErrorMessage = "Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores.")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le prénom est requis.")]
    [StringLength(100, ErrorMessage = "Le prénom ne peut pas dépasser 100 caractères.")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le nom est requis.")]
    [StringLength(100, ErrorMessage = "Le nom ne peut pas dépasser 100 caractères.")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "L'email est requis.")]
    [EmailAddress(ErrorMessage = "L'email n'est pas valide.")]
    [StringLength(255, ErrorMessage = "L'email ne peut pas dépasser 255 caractères.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "La date de naissance est requise.")]
    public DateTime DateOfBirth { get; set; }

    [StringLength(500, ErrorMessage = "La bio ne peut pas dépasser 500 caractères.")]
    public string? Bio { get; set; }
}

public class RegisterPhoneRequest
{
    [Required(ErrorMessage = "Le pseudo est requis.")]
    [StringLength(50, ErrorMessage = "Le pseudo ne peut pas dépasser 50 caractères.")]
    [RegularExpression(@"^[a-zA-Z0-9_-]+$", ErrorMessage = "Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores.")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le prénom est requis.")]
    [StringLength(100, ErrorMessage = "Le prénom ne peut pas dépasser 100 caractères.")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le nom est requis.")]
    [StringLength(100, ErrorMessage = "Le nom ne peut pas dépasser 100 caractères.")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le numéro de téléphone est requis.")]
    [Phone(ErrorMessage = "Le numéro de téléphone n'est pas valide.")]
    [StringLength(20, ErrorMessage = "Le numéro de téléphone ne peut pas dépasser 20 caractères.")]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "La date de naissance est requise.")]
    public DateTime DateOfBirth { get; set; }

    [StringLength(500, ErrorMessage = "La bio ne peut pas dépasser 500 caractères.")]
    public string? Bio { get; set; }
}

public class LoginRequest
{
    [Required(ErrorMessage = "L'email est requis.")]
    [EmailAddress(ErrorMessage = "L'email n'est pas valide.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le mot de passe est requis.")]
    public string Password { get; set; } = string.Empty;

    public bool RememberMe { get; set; } = false;
}

public class MagicLinkRequest
{
    [Required(ErrorMessage = "L'email est requis.")]
    [EmailAddress(ErrorMessage = "L'email n'est pas valide.")]
    public string Email { get; set; } = string.Empty;
}

public class OtpRequest
{
    [Required(ErrorMessage = "L'email ou le numéro de téléphone est requis.")]
    public string EmailOrPhone { get; set; } = string.Empty;
}

public class VerifyOtpRequest
{
    [Required(ErrorMessage = "L'email ou le numéro de téléphone est requis.")]
    public string EmailOrPhone { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le code OTP est requis.")]
    [StringLength(6, MinimumLength = 6, ErrorMessage = "Le code doit contenir 6 chiffres.")]
    [RegularExpression(@"^\d{6}$", ErrorMessage = "Le code doit contenir exactement 6 chiffres.")]
    public string Code { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le type de vérification est requis.")]
    public string Type { get; set; } = string.Empty; // "email" ou "sms"
}

public class AuthResponse
{
    public bool IsSuccess { get; set; }
    public string? Token { get; set; }
    public string? RefreshToken { get; set; }
    public UserDto? User { get; set; }
    public string? Error { get; set; }
    public DateTime ExpiresAt { get; set; }
}

public class UserDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string DateOfBirth { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public string Role { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class RefreshTokenRequest
{
    [Required(ErrorMessage = "Le refresh token est requis.")]
    public string RefreshToken { get; set; } = string.Empty;
}

public class ChangePasswordRequest
{
    [Required(ErrorMessage = "L'ancien mot de passe est requis.")]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le nouveau mot de passe est requis.")]
    [StringLength(100, MinimumLength = 8, ErrorMessage = "Le mot de passe doit contenir entre 8 et 100 caractères.")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-])[A-Za-z\d@$!%*?\-\-]",
        ErrorMessage = "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial.")]
    public string NewPassword { get; set; } = string.Empty;

    [Required(ErrorMessage = "La confirmation du mot de passe est requise.")]
    [Compare("NewPassword", ErrorMessage = "Les mots de passe ne correspondent pas.")]
    public string ConfirmPassword { get; set; } = string.Empty;
}

public class ForgotPasswordRequest
{
    [Required(ErrorMessage = "L'email est requis.")]
    [EmailAddress(ErrorMessage = "L'email n'est pas valide.")]
    public string Email { get; set; } = string.Empty;
}

public class ResetPasswordRequest
{
    [Required(ErrorMessage = "Le token de réinitialisation est requis.")]
    public string Token { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le nouveau mot de passe est requis.")]
    [StringLength(100, MinimumLength = 8, ErrorMessage = "Le mot de passe doit contenir entre 8 et 100 caractères.")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-])[A-Za-z\d@$!%*?\-\-]",
        ErrorMessage = "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial.")]
    public string NewPassword { get; set; } = string.Empty;

    [Required(ErrorMessage = "La confirmation du mot de passe est requise.")]
    [Compare("NewPassword", ErrorMessage = "Les mots de passe ne correspondent pas.")]
    public string ConfirmPassword { get; set; } = string.Empty;
}

public class SendEmailVerificationRequest
{
    [Required(ErrorMessage = "L'email est requis.")]
    [EmailAddress(ErrorMessage = "L'email n'est pas valide.")]
    public string Email { get; set; } = string.Empty;
}

public class SendSmsVerificationRequest
{
    [Required(ErrorMessage = "Le numéro de téléphone est requis.")]
    [Phone(ErrorMessage = "Le numéro de téléphone n'est pas valide.")]
    public string PhoneNumber { get; set; } = string.Empty;
}

public class UpdateProfilePictureRequest
{
    [Required(ErrorMessage = "L'URL de l'image est requise.")]
    [Url(ErrorMessage = "L'URL de l'image n'est pas valide.")]
    public string ImageUrl { get; set; } = string.Empty;
}

public class UpdateProfileRequest
{
    [StringLength(50, ErrorMessage = "Le pseudo ne peut pas dépasser 50 caractères.")]
    [RegularExpression(@"^[a-zA-Z0-9_-]+$", ErrorMessage = "Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores.")]
    public string? Username { get; set; }

    [StringLength(100, ErrorMessage = "Le prénom ne peut pas dépasser 100 caractères.")]
    public string? FirstName { get; set; }

    [StringLength(100, ErrorMessage = "Le nom ne peut pas dépasser 100 caractères.")]
    public string? LastName { get; set; }

    [Phone(ErrorMessage = "Le numéro de téléphone n'est pas valide.")]
    [StringLength(20, ErrorMessage = "Le numéro de téléphone ne peut pas dépasser 20 caractères.")]
    public string? PhoneNumber { get; set; }

    public string? DateOfBirth { get; set; }

    [StringLength(500, ErrorMessage = "La bio ne peut pas dépasser 500 caractères.")]
    public string? Bio { get; set; }
}

public class VerifyEmailCodeRequest
{
    [Required(ErrorMessage = "L'email est requis.")]
    [EmailAddress(ErrorMessage = "L'email n'est pas valide.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le code de vérification est requis.")]
    [StringLength(6, MinimumLength = 6, ErrorMessage = "Le code doit contenir 6 chiffres.")]
    [RegularExpression(@"^\d{6}$", ErrorMessage = "Le code doit contenir exactement 6 chiffres.")]
    public string Code { get; set; } = string.Empty;
}

public class VerifySmsCodeRequest
{
    [Required(ErrorMessage = "Le numéro de téléphone est requis.")]
    [Phone(ErrorMessage = "Le numéro de téléphone n'est pas valide.")]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le code de vérification est requis.")]
    [StringLength(6, MinimumLength = 6, ErrorMessage = "Le code doit contenir 6 chiffres.")]
    [RegularExpression(@"^\d{6}$", ErrorMessage = "Le code doit contenir exactement 6 chiffres.")]
    public string Code { get; set; } = string.Empty;
}
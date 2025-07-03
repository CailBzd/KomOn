using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using KomOn.Core.Entities;
using KomOn.Core.Interfaces;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;

namespace KomOn.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly IUserService _userService;
    private readonly IConfiguration _configuration;
    private readonly string _jwtSecret;
    private readonly string _jwtIssuer;
    private readonly string _jwtAudience;

    public AuthService(IUserService userService, IConfiguration configuration)
    {
        _userService = userService;
        _configuration = configuration;
        _jwtSecret = _configuration["Jwt:Secret"] ?? "your-super-secret-key-with-at-least-32-characters";
        _jwtIssuer = _configuration["Jwt:Issuer"] ?? "KomOn";
        _jwtAudience = _configuration["Jwt:Audience"] ?? "KomOnUsers";
    }

    public async Task<string> GenerateJwtTokenAsync(Guid userId)
    {
        var user = await _userService.GetUserByIdAsync(userId);
        if (user == null)
            throw new ArgumentException("Utilisateur non trouvé");

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_jwtSecret);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
            new(ClaimTypes.Role, user.Role.ToString()),
            new("FirstName", user.FirstName),
            new("LastName", user.LastName)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            Issuer = _jwtIssuer,
            Audience = _jwtAudience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            )
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public async Task<bool> ValidateTokenAsync(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSecret);

            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _jwtIssuer,
                ValidateAudience = true,
                ValidAudience = _jwtAudience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<Guid?> GetUserIdFromTokenAsync(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSecret);

            var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _jwtIssuer,
                ValidateAudience = true,
                ValidAudience = _jwtAudience,
                ValidateLifetime = false,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out Guid userId))
            {
                return userId;
            }

            return null;
        }
        catch
        {
            return null;
        }
    }

    public async Task<string> HashPasswordAsync(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }

    public async Task<bool> VerifyPasswordAsync(string password, string hash)
    {
        var hashedPassword = await HashPasswordAsync(password);
        return hashedPassword == hash;
    }

    public async Task<bool> RefreshTokenAsync(string refreshToken)
    {
        return false;
    }

    public async Task<bool> RevokeTokenAsync(string token)
    {
        return true;
    }

    // Méthodes supplémentaires pour l'authentification
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

        // Vérifier si l'email existe déjà
        var existingUser = await _userService.GetUserByEmailAsync(request.Email);
        if (existingUser != null)
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Un utilisateur avec cet email existe déjà."
            };
        }

        // Créer l'utilisateur
        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            DateOfBirth = request.DateOfBirth,
            PhoneNumber = request.PhoneNumber,
            Bio = request.Bio,
            Role = UserRole.Participant,
            Status = UserStatus.Active,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var createdUser = await _userService.CreateUserAsync(user, request.Password);
        var token = await GenerateJwtTokenAsync(createdUser.Id);

        return new AuthResult
        {
            IsSuccess = true,
            User = createdUser,
            Token = token
        };
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

        // Récupérer l'utilisateur
        var user = await _userService.GetUserByEmailAsync(request.Email);
        if (user == null)
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Email ou mot de passe incorrect."
            };
        }

        // Valider les credentials
        var isValid = await _userService.ValidateUserCredentialsAsync(request.Email, request.Password);
        if (!isValid)
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Email ou mot de passe incorrect."
            };
        }

        // Générer le token
        var token = await GenerateJwtTokenAsync(user.Id);

        return new AuthResult
        {
            IsSuccess = true,
            User = user,
            Token = token
        };
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

// Classes pour les tests et l'API
public class RegisterRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Bio { get; set; }
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public bool RememberMe { get; set; } = false;
}

public class AuthResult
{
    public bool IsSuccess { get; set; }
    public User? User { get; set; }
    public string? Token { get; set; }
    public string? Error { get; set; }
} 
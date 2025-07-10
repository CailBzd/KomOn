using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using KomOn.Core.Entities;
using KomOn.Core.Interfaces;
using KomOn.Core.DTOs;
using KomOn.API.DTOs;
using Microsoft.IdentityModel.Tokens;
using BCrypt.Net;

namespace KomOn.API.Services;

public class AuthService
{
    private readonly IUserService _userService;
    private readonly IAuthService _authService;
    private readonly IConfiguration _configuration;
    private readonly string _jwtSecret;
    private readonly string _jwtIssuer;
    private readonly string _jwtAudience;

    public AuthService(IUserService userService, IAuthService authService, IConfiguration configuration)
    {
        _userService = userService;
        _authService = authService;
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

        // Vérifier si l'email existe déjà
        var existingUser = await _userService.GetByEmailAsync(request.Email);
        if (existingUser != null)
        {
            return new AuthResult
            {
                IsSuccess = false,
                Error = "Un utilisateur avec cet email existe déjà."
            };
        }

        // Créer l'utilisateur
        var createUserRequest = new CreateUserRequest
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            DateOfBirth = request.DateOfBirth,
            PhoneNumber = request.PhoneNumber,
            Bio = request.Bio,
            Password = request.Password,
            Role = "Participant"
        };

        var createdUser = await _userService.CreateAsync(createUserRequest);
        var token = await _authService.GenerateJwtTokenAsync(createdUser.Id);

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
        var user = await _userService.GetByEmailAsync(request.Email);
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
        var token = await _authService.GenerateJwtTokenAsync(user.Id);

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

// Classe pour le résultat d'authentification
public class AuthResult
{
    public bool IsSuccess { get; set; }
    public User? User { get; set; }
    public string? Token { get; set; }
    public string? Error { get; set; }
} 
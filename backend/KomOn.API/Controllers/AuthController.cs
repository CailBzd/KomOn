using Microsoft.AspNetCore.Mvc;
using KomOn.API.DTOs;
using KomOn.Core.Interfaces;
using KomOn.API.Services;
using AutoMapper;

namespace KomOn.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly IUserService _userService;
    private readonly IMapper _mapper;

    public AuthController(AuthService authService, IUserService userService, IMapper mapper)
    {
        _authService = authService;
        _userService = userService;
        _mapper = mapper;
    }

    /// <summary>
    /// Inscription d'un nouvel utilisateur
    /// </summary>
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new AuthResponse
            {
                IsSuccess = false,
                Error = string.Join("; ", ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage))
            });
        }

        var result = await _authService.RegisterAsync(request);

        if (!result.IsSuccess)
        {
            return BadRequest(new AuthResponse
            {
                IsSuccess = false,
                Error = result.Error
            });
        }

        var userDto = _mapper.Map<UserDto>(result.User);
        var response = new AuthResponse
        {
            IsSuccess = true,
            Token = result.Token,
            User = userDto,
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };

        return Ok(response);
    }

    /// <summary>
    /// Connexion d'un utilisateur
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new AuthResponse
            {
                IsSuccess = false,
                Error = string.Join("; ", ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage))
            });
        }

        var result = await _authService.LoginAsync(request);

        if (!result.IsSuccess)
        {
            return Unauthorized(new AuthResponse
            {
                IsSuccess = false,
                Error = result.Error
            });
        }

        var userDto = _mapper.Map<UserDto>(result.User);
        var response = new AuthResponse
        {
            IsSuccess = true,
            Token = result.Token,
            User = userDto,
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };

        return Ok(response);
    }

    /// <summary>
    /// Rafraîchir le token JWT
    /// </summary>
    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponse>> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new AuthResponse
            {
                IsSuccess = false,
                Error = "Token de rafraîchissement invalide."
            });
        }

        // TODO: Implémenter la logique de refresh token
        return BadRequest(new AuthResponse
        {
            IsSuccess = false,
            Error = "Fonctionnalité de refresh token non encore implémentée."
        });
    }

    /// <summary>
    /// Changer le mot de passe
    /// </summary>
    [HttpPost("change-password")]
    public async Task<ActionResult<AuthResponse>> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new AuthResponse
            {
                IsSuccess = false,
                Error = string.Join("; ", ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage))
            });
        }

        // TODO: Implémenter la logique de changement de mot de passe
        return BadRequest(new AuthResponse
        {
            IsSuccess = false,
            Error = "Fonctionnalité de changement de mot de passe non encore implémentée."
        });
    }

    /// <summary>
    /// Demander la réinitialisation du mot de passe
    /// </summary>
    [HttpPost("forgot-password")]
    public async Task<ActionResult<AuthResponse>> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new AuthResponse
            {
                IsSuccess = false,
                Error = string.Join("; ", ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage))
            });
        }

        // TODO: Implémenter la logique de réinitialisation de mot de passe
        return BadRequest(new AuthResponse
        {
            IsSuccess = false,
            Error = "Fonctionnalité de réinitialisation de mot de passe non encore implémentée."
        });
    }

    /// <summary>
    /// Réinitialiser le mot de passe avec un token
    /// </summary>
    [HttpPost("reset-password")]
    public async Task<ActionResult<AuthResponse>> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new AuthResponse
            {
                IsSuccess = false,
                Error = string.Join("; ", ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage))
            });
        }

        // TODO: Implémenter la logique de réinitialisation de mot de passe
        return BadRequest(new AuthResponse
        {
            IsSuccess = false,
            Error = "Fonctionnalité de réinitialisation de mot de passe non encore implémentée."
        });
    }

    /// <summary>
    /// Valider un token JWT
    /// </summary>
    [HttpPost("validate")]
    public async Task<ActionResult<AuthResponse>> ValidateToken([FromBody] string token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return BadRequest(new AuthResponse
            {
                IsSuccess = false,
                Error = "Token requis."
            });
        }

        // TODO: Implémenter la validation de token
        return BadRequest(new AuthResponse
        {
            IsSuccess = false,
            Error = "Fonctionnalité de validation de token non encore implémentée."
        });
    }

    /// <summary>
    /// Déconnexion (révocation du token)
    /// </summary>
    [HttpPost("logout")]
    public async Task<ActionResult<AuthResponse>> Logout([FromBody] string token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return BadRequest(new AuthResponse
            {
                IsSuccess = false,
                Error = "Token requis."
            });
        }

        // TODO: Implémenter la révocation de token
        return Ok(new AuthResponse
        {
            IsSuccess = true,
            Error = "Déconnexion réussie."
        });
    }
} 
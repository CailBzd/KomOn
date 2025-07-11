using Microsoft.AspNetCore.Mvc;
using KomOn.API.DTOs;
using KomOn.Core.Interfaces;
using KomOn.API.Services;
using AutoMapper;
using System.Text.Json;

namespace KomOn.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    // Gestion des requêtes OPTIONS pour CORS
    [HttpOptions]
    public IActionResult Options()
    {
        return Ok();
    }

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
    /// Inscription avec email et mot de passe
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
    /// Inscription avec email uniquement (magic link)
    /// </summary>
    [HttpPost("register-email")]
    public async Task<ActionResult<AuthResponse>> RegisterWithEmail([FromBody] RegisterEmailRequest request)
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

        var result = await _authService.RegisterWithEmailAsync(request);

        if (!result.IsSuccess)
        {
            return BadRequest(new AuthResponse
            {
                IsSuccess = false,
                Error = result.Error
            });
        }

        return Ok(new AuthResponse
        {
            IsSuccess = true,
            Error = "Magic link envoyé par email."
        });
    }

    /// <summary>
    /// Inscription avec téléphone uniquement
    /// </summary>
    [HttpPost("register-phone")]
    public async Task<ActionResult<AuthResponse>> RegisterWithPhone([FromBody] RegisterPhoneRequest request)
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

        var result = await _authService.RegisterWithPhoneAsync(request);

        if (!result.IsSuccess)
        {
            return BadRequest(new AuthResponse
            {
                IsSuccess = false,
                Error = result.Error
            });
        }

        return Ok(new AuthResponse
        {
            IsSuccess = true,
            Error = "Code OTP envoyé par SMS."
        });
    }

    /// <summary>
    /// Connexion avec email et mot de passe
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
    /// Connexion avec magic link
    /// </summary>
    [HttpPost("login-magic-link")]
    public async Task<ActionResult<AuthResponse>> LoginWithMagicLink([FromBody] MagicLinkRequest request)
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

        var result = await _authService.LoginWithMagicLinkAsync(request.Email);

        if (!result.IsSuccess)
        {
            return BadRequest(new AuthResponse
            {
                IsSuccess = false,
                Error = result.Error
            });
        }

        return Ok(new AuthResponse
        {
            IsSuccess = true,
            Error = "Magic link envoyé par email."
        });
    }

    /// <summary>
    /// Connexion avec OTP (email ou téléphone)
    /// </summary>
    [HttpPost("login-otp")]
    public async Task<ActionResult<AuthResponse>> LoginWithOtp([FromBody] OtpRequest request)
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

        var result = await _authService.LoginWithOtpAsync(request.EmailOrPhone);

        if (!result.IsSuccess)
        {
            return BadRequest(new AuthResponse
            {
                IsSuccess = false,
                Error = result.Error
            });
        }

        return Ok(new AuthResponse
        {
            IsSuccess = true,
            Error = "Code OTP envoyé."
        });
    }

    /// <summary>
    /// Vérifier un code OTP
    /// </summary>
    [HttpPost("verify-otp")]
    public async Task<ActionResult<AuthResponse>> VerifyOtp([FromBody] VerifyOtpRequest request)
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

        var result = await _authService.VerifyOtpAsync(request.EmailOrPhone, request.Code, request.Type);

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
    /// Envoyer un code de vérification par email
    /// </summary>
    [HttpPost("send-email-verification")]
    public async Task<ActionResult<AuthResponse>> SendEmailVerification([FromBody] SendEmailVerificationRequest request)
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

        var result = await _authService.SendEmailVerificationAsync(request.Email);

        if (!result.IsSuccess)
        {
            return BadRequest(new AuthResponse
            {
                IsSuccess = false,
                Error = result.Error
            });
        }

        return Ok(new AuthResponse
        {
            IsSuccess = true,
            Error = "Code de vérification envoyé par email."
        });
    }


    /// <summary>
    /// Envoyer un code de vérification par SMS
    /// </summary>
    [HttpPost("send-sms-verification")]
    public async Task<ActionResult<AuthResponse>> SendSmsVerification([FromBody] SendSmsVerificationRequest request)
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

        var result = await _authService.SendSmsVerificationAsync(request.PhoneNumber);
        
        if (!result.IsSuccess)
        {
            return BadRequest(new AuthResponse
            {
                IsSuccess = false,
                Error = result.Error
            });
        }

        return Ok(new AuthResponse
        {
            IsSuccess = true,
            Error = "Code de vérification envoyé par SMS."
        });
    }

    /// <summary>
    /// Vérifier le code email
    /// </summary>
    [HttpPost("verify-email")]
    public async Task<ActionResult<AuthResponse>> VerifyEmail([FromBody] VerifyEmailCodeRequest request)
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

        var result = await _authService.VerifyEmailCodeAsync(request.Email, request.Code);
        
        if (!result.IsSuccess)
        {
            return BadRequest(new AuthResponse
            {
                IsSuccess = false,
                Error = result.Error
            });
        }

        return Ok(new AuthResponse
        {
            IsSuccess = true,
            Error = "Email vérifié avec succès."
        });
    }

    /// <summary>
    /// Vérifier le code SMS
    /// </summary>
    [HttpPost("verify-sms")]
    public async Task<ActionResult<AuthResponse>> VerifySms([FromBody] VerifySmsCodeRequest request)
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

        var result = await _authService.VerifySmsCodeAsync(request.PhoneNumber, request.Code);
        
        if (!result.IsSuccess)
        {
            return BadRequest(new AuthResponse
            {
                IsSuccess = false,
                Error = result.Error
            });
        }

        return Ok(new AuthResponse
        {
            IsSuccess = true,
            Error = "SMS vérifié avec succès."
        });
    }

    /// <summary>
    /// Rafraîchir le token
    /// </summary>
    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponse>> RefreshToken([FromBody] RefreshTokenRequest request)
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

        var result = await _authService.RefreshTokenAsync(request.RefreshToken);

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

        var result = await _authService.ChangePasswordAsync(request);

        if (!result.IsSuccess)
        {
            return BadRequest(new AuthResponse
            {
                IsSuccess = false,
                Error = result.Error
            });
        }

        return Ok(new AuthResponse
        {
            IsSuccess = true,
            Error = "Mot de passe modifié avec succès."
        });
    }

    /// <summary>
    /// Demander une réinitialisation de mot de passe
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

        var result = await _authService.ForgotPasswordAsync(request.Email);

        if (!result.IsSuccess)
        {
            return BadRequest(new AuthResponse
            {
                IsSuccess = false,
                Error = result.Error
            });
        }

        return Ok(new AuthResponse
        {
            IsSuccess = true,
            Error = "Email de réinitialisation envoyé."
        });
    }

    /// <summary>
    /// Réinitialiser le mot de passe
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

        var result = await _authService.ResetPasswordAsync(request);

        if (!result.IsSuccess)
        {
            return BadRequest(new AuthResponse
            {
                IsSuccess = false,
                Error = result.Error
            });
        }

        return Ok(new AuthResponse
        {
            IsSuccess = true,
            Error = "Mot de passe réinitialisé avec succès."
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

        var result = await _authService.ValidateTokenAsync(token);

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
            Token = token,
            User = userDto,
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };

        return Ok(response);
    }

    /// <summary>
    /// Déconnexion
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

        var result = await _authService.LogoutAsync(token);

        if (!result.IsSuccess)
        {
            return BadRequest(new AuthResponse
            {
                IsSuccess = false,
                Error = result.Error
            });
        }

        return Ok(new AuthResponse
        {
            IsSuccess = true,
            Error = "Déconnexion réussie."
        });
    }

    // Méthodes OPTIONS pour CORS
    [HttpOptions("register")]
    [HttpOptions("register-email")]
    [HttpOptions("register-phone")]
    [HttpOptions("login")]
    [HttpOptions("login-magic-link")]
    [HttpOptions("login-otp")]
    [HttpOptions("verify-otp")]
    [HttpOptions("send-email-verification")]
    [HttpOptions("send-sms-verification")]
    [HttpOptions("verify-email")]
    [HttpOptions("verify-sms")]
    [HttpOptions("refresh")]
    [HttpOptions("change-password")]
    [HttpOptions("forgot-password")]
    [HttpOptions("reset-password")]
    [HttpOptions("validate")]
    [HttpOptions("logout")]
    public IActionResult OptionsHandler()
    {
        return Ok();
    }
} 
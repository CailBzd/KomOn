using Microsoft.AspNetCore.Mvc;
using KomOn.Core.Interfaces;
using KomOn.Core.DTOs;

namespace KomOn.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var token = await _authService.LoginAsync(request.Email, request.Password);
        if (token == null)
            return Unauthorized(new { message = "Email ou mot de passe incorrect" });
        return Ok(new { access_token = token });
    }
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
} 
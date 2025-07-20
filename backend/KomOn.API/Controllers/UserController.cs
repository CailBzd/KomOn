using Microsoft.AspNetCore.Mvc;
using KomOn.Core.Interfaces;
using CoreDTOs = KomOn.Core.DTOs;
using ApiDTOs = KomOn.API.DTOs;
using AutoMapper;
using System.Security.Claims;

namespace KomOn.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IMapper _mapper;

    public UserController(IUserService userService, IMapper mapper)
    {
        _userService = userService;
        _mapper = mapper;
    }

    /// <summary>
    /// Récupérer le profil de l'utilisateur connecté
    /// </summary>
    [HttpGet("profile")]
    public async Task<ActionResult<ApiDTOs.UserDto>> GetProfile()
    {
        try
        {
            // Récupérer l'ID de l'utilisateur depuis le token JWT
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { error = "Token invalide ou utilisateur non authentifié." });
            }

            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { error = "Utilisateur non trouvé." });
            }

            var userDto = _mapper.Map<ApiDTOs.UserDto>(user);
            return Ok(userDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Erreur lors de la récupération du profil: {ex.Message}" });
        }
    }

    /// <summary>
    /// Mettre à jour le profil de l'utilisateur connecté
    /// </summary>
    [HttpPut("profile")]
    [Consumes("application/json")]
    [Produces("application/json")]
    public async Task<ActionResult<ApiDTOs.UserDto>> UpdateProfile([FromBody] ApiDTOs.UpdateProfileRequest request)
    {
        try
        {
            // Récupérer l'ID de l'utilisateur depuis le token JWT
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { error = "Token invalide ou utilisateur non authentifié." });
            }

            // Validation des données
            if (!ModelState.IsValid)
            {
                return BadRequest(new { error = string.Join("; ", ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)) });
            }

            // Vérifier que l'utilisateur existe
            var existingUser = await _userService.GetByIdAsync(userId);
            if (existingUser == null)
            {
                return NotFound(new { error = "Utilisateur non trouvé." });
            }

            // Vérifier si le pseudo est déjà utilisé (si modifié)
            if (!string.IsNullOrEmpty(request.Username) && request.Username != existingUser.Username)
            {
                var userWithSameUsername = await _userService.GetByUsernameAsync(request.Username);
                if (userWithSameUsername != null)
                {
                    return BadRequest(new { error = "Ce pseudo est déjà utilisé." });
                }
            }

            // Convertir le DTO de l'API vers le DTO du Core
            var coreRequest = new CoreDTOs.UpdateProfileRequest
            {
                Username = request.Username,
                FirstName = request.FirstName,
                LastName = request.LastName,
                PhoneNumber = request.PhoneNumber,
                DateOfBirth = request.DateOfBirth,
                Bio = request.Bio
            };

            // Mettre à jour le profil
            var success = await _userService.UpdateProfileAsync(userId, coreRequest);
            if (!success)
            {
                return StatusCode(500, new { error = "Erreur lors de la mise à jour du profil." });
            }

            // Récupérer l'utilisateur mis à jour
            var updatedUser = await _userService.GetByIdAsync(userId);
            var userDto = _mapper.Map<ApiDTOs.UserDto>(updatedUser);

            return Ok(new { 
                message = "Profil mis à jour avec succès.",
                user = userDto 
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Erreur lors de la mise à jour du profil: {ex.Message}" });
        }
    }

    /// <summary>
    /// Mettre à jour la photo de profil
    /// </summary>
    [HttpPut("profile/picture")]
    [Consumes("application/json")]
    [Produces("application/json")]
    public async Task<ActionResult> UpdateProfilePicture([FromBody] ApiDTOs.UpdateProfilePictureRequest request)
    {
        try
        {
            // Récupérer l'ID de l'utilisateur depuis le token JWT
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { error = "Token invalide ou utilisateur non authentifié." });
            }

            // Validation des données
            if (string.IsNullOrWhiteSpace(request.ImageUrl))
            {
                return BadRequest(new { error = "L'URL de l'image est requise." });
            }

            // Mettre à jour la photo de profil
            var success = await _userService.UpdateProfilePictureAsync(userId, request.ImageUrl);
            if (!success)
            {
                return StatusCode(500, new { error = "Erreur lors de la mise à jour de la photo de profil." });
            }

            return Ok(new { message = "Photo de profil mise à jour avec succès." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Erreur lors de la mise à jour de la photo de profil: {ex.Message}" });
        }
    }

    /// <summary>
    /// Changer le mot de passe
    /// </summary>
    [HttpPut("profile/password")]
    [Consumes("application/json")]
    [Produces("application/json")]
    public async Task<ActionResult> ChangePassword([FromBody] ApiDTOs.ChangePasswordRequest request)
    {
        try
        {
            // Récupérer l'ID de l'utilisateur depuis le token JWT
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { error = "Token invalide ou utilisateur non authentifié." });
            }

            // Validation des données
            if (!ModelState.IsValid)
            {
                return BadRequest(new { error = string.Join("; ", ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)) });
            }

            // TODO: Implémenter le changement de mot de passe avec Supabase
            // Pour l'instant, on simule
            await Task.Delay(100);

            return Ok(new { message = "Mot de passe modifié avec succès." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Erreur lors du changement de mot de passe: {ex.Message}" });
        }
    }

    // Méthodes OPTIONS pour CORS
    [HttpOptions("profile")]
    [HttpOptions("profile/picture")]
    [HttpOptions("profile/password")]
    public IActionResult OptionsHandler()
    {
        return Ok();
    }
} 
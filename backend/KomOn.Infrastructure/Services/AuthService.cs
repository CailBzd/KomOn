using KomOn.Core.Interfaces;
using KomOn.Core.DTOs;
using BCrypt.Net;

namespace KomOn.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly SupabaseService _supabaseService;
    private readonly IUserService _userService;

    public AuthService(SupabaseService supabaseService, IUserService userService)
    {
        _supabaseService = supabaseService;
        _userService = userService;
    }

    public async Task<string?> LoginAsync(string email, string password)
    {
        var signInResult = await _supabaseService.SignInAsync(email, password);
        if (!signInResult.IsSuccess)
            return null;
        // Optionnel : récupérer l'utilisateur en base pour infos supplémentaires
        // var user = await _userService.GetByEmailAsync(email);
        // Pour l'instant, on retourne un token factice car SupabaseService simule les appels
        return signInResult.Token ?? $"supabase_token_for_{email}";
    }

    public async Task<bool> ValidateTokenAsync(string token)
    {
        try
        {
            // Valider le token avec Supabase
            var isRevoked = await _supabaseService.IsTokenRevokedAsync(token);
            return !isRevoked;
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
            // Pour l'instant, on simule la récupération de l'utilisateur
            // En production, on utiliserait le vrai SDK Supabase
            if (token.StartsWith("supabase_token_for_"))
            {
                var email = token.Replace("supabase_token_for_", "");
                var user = await _userService.GetByEmailAsync(email);
                return user?.Id;
            }
            return null;
        }
        catch
        {
            return null;
        }
    }

    public async Task<bool> RefreshTokenAsync(string refreshToken)
    {
        try
        {
            var result = await _supabaseService.RefreshSessionAsync(refreshToken);
            return result;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> RevokeTokenAsync(string token)
    {
        try
        {
            return await _supabaseService.RevokeTokenAsync(token);
        }
        catch
        {
            return false;
        }
    }

    public async Task<string> HashPasswordAsync(string password)
    {
        return await Task.Run(() => BCrypt.Net.BCrypt.HashPassword(password));
    }

    public async Task<bool> VerifyPasswordAsync(string password, string hash)
    {
        return await Task.Run(() => BCrypt.Net.BCrypt.Verify(password, hash));
    }

    public async Task<string> GenerateJwtTokenAsync(Guid userId)
    {
        // Pour l'instant, on retourne un token factice
        // En production, tu pourrais implémenter une génération JWT locale si nécessaire
        return await Task.FromResult($"jwt_token_for_user_{userId}");
    }
} 
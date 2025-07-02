namespace KomOn.Core.Interfaces;

public interface IAuthService
{
    Task<string> GenerateJwtTokenAsync(Guid userId);
    Task<bool> ValidateTokenAsync(string token);
    Task<Guid?> GetUserIdFromTokenAsync(string token);
    Task<string> HashPasswordAsync(string password);
    Task<bool> VerifyPasswordAsync(string password, string hash);
    Task<bool> RefreshTokenAsync(string refreshToken);
    Task<bool> RevokeTokenAsync(string token);
} 
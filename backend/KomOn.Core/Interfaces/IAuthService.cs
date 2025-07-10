namespace KomOn.Core.Interfaces;

public interface IAuthService
{
    // Méthode principale pour l'authentification Supabase
    Task<string?> LoginAsync(string email, string password);
    
    // Méthodes utilitaires pour la gestion des tokens
    Task<bool> ValidateTokenAsync(string token);
    Task<Guid?> GetUserIdFromTokenAsync(string token);
    Task<bool> RefreshTokenAsync(string refreshToken);
    Task<bool> RevokeTokenAsync(string token);
    
    // Méthodes pour le hachage des mots de passe (si nécessaire)
    Task<string> HashPasswordAsync(string password);
    Task<bool> VerifyPasswordAsync(string password, string hash);
    
    // Méthode pour générer un token JWT (si nécessaire pour des cas spécifiques)
    Task<string> GenerateJwtTokenAsync(Guid userId);
} 
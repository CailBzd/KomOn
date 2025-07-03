using KomOn.Core.Entities;
using KomOn.Core.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace KomOn.Infrastructure.Services;

public class UserService : IUserService
{
    // Stockage temporaire en mémoire pour les tests (sera remplacé par la base de données)
    private static readonly Dictionary<Guid, User> _users = new();
    private static readonly Dictionary<string, User> _usersByEmail = new();

    public async Task<IEnumerable<User>> GetAllUsersAsync()
    {
        return await Task.FromResult(_users.Values);
    }

    public async Task<User?> GetUserByIdAsync(Guid id)
    {
        return await Task.FromResult(_users.TryGetValue(id, out var user) ? user : null);
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await Task.FromResult(_usersByEmail.TryGetValue(email.ToLowerInvariant(), out var user) ? user : null);
    }

    public async Task<User> CreateUserAsync(User user, string password)
    {
        // Hasher le mot de passe
        user.PasswordHash = await HashPasswordAsync(password);
        
        // Ajouter à la collection temporaire
        _users[user.Id] = user;
        _usersByEmail[user.Email.ToLowerInvariant()] = user;
        
        return await Task.FromResult(user);
    }

    public async Task<User> UpdateUserAsync(Guid id, User user)
    {
        if (_users.TryGetValue(id, out var existingUser))
        {
            // Mettre à jour les propriétés
            existingUser.FirstName = user.FirstName;
            existingUser.LastName = user.LastName;
            existingUser.Email = user.Email;
            existingUser.PhoneNumber = user.PhoneNumber;
            existingUser.Bio = user.Bio;
            existingUser.ProfilePictureUrl = user.ProfilePictureUrl;
            existingUser.UpdatedAt = DateTime.UtcNow;
            
            // Mettre à jour l'index par email si nécessaire
            if (existingUser.Email != user.Email)
            {
                _usersByEmail.Remove(existingUser.Email.ToLowerInvariant());
                _usersByEmail[user.Email.ToLowerInvariant()] = existingUser;
            }
            
            return await Task.FromResult(existingUser);
        }
        
        throw new ArgumentException("Utilisateur non trouvé");
    }

    public async Task<bool> DeleteUserAsync(Guid id)
    {
        if (_users.TryGetValue(id, out var user))
        {
            _users.Remove(id);
            _usersByEmail.Remove(user.Email.ToLowerInvariant());
            return await Task.FromResult(true);
        }
        
        return await Task.FromResult(false);
    }

    public async Task<bool> ChangePasswordAsync(Guid userId, string currentPassword, string newPassword)
    {
        if (_users.TryGetValue(userId, out var user))
        {
            // Vérifier l'ancien mot de passe
            var currentHash = await HashPasswordAsync(currentPassword);
            if (user.PasswordHash != currentHash)
            {
                return false;
            }
            
            // Mettre à jour avec le nouveau mot de passe
            user.PasswordHash = await HashPasswordAsync(newPassword);
            user.UpdatedAt = DateTime.UtcNow;
            
            return true;
        }
        
        return false;
    }

    public async Task<bool> UpdateUserRoleAsync(Guid userId, UserRole role)
    {
        if (_users.TryGetValue(userId, out var user))
        {
            user.Role = role;
            user.UpdatedAt = DateTime.UtcNow;
            return await Task.FromResult(true);
        }
        
        return await Task.FromResult(false);
    }

    public async Task<bool> UpdateUserStatusAsync(Guid userId, UserStatus status)
    {
        if (_users.TryGetValue(userId, out var user))
        {
            user.Status = status;
            user.UpdatedAt = DateTime.UtcNow;
            return await Task.FromResult(true);
        }
        
        return await Task.FromResult(false);
    }

    public async Task<IEnumerable<User>> GetUsersByRoleAsync(UserRole role)
    {
        var users = _users.Values.Where(u => u.Role == role);
        return await Task.FromResult(users);
    }

    public async Task<bool> ValidateUserCredentialsAsync(string email, string password)
    {
        var user = await GetUserByEmailAsync(email);
        if (user == null)
        {
            return false;
        }
        
        var hashedPassword = await HashPasswordAsync(password);
        return user.PasswordHash == hashedPassword;
    }

    private async Task<string> HashPasswordAsync(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return await Task.FromResult(Convert.ToBase64String(hashedBytes));
    }

    // Méthode utilitaire pour nettoyer les données de test
    public static void ClearTestData()
    {
        _users.Clear();
        _usersByEmail.Clear();
    }

    // Méthode utilitaire pour ajouter des données de test
    public static async Task<User> AddTestUserAsync(string email, string password, string firstName = "Test", string lastName = "User")
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            DateOfBirth = new DateTime(1990, 1, 1),
            Role = UserRole.Participant,
            Status = UserStatus.Active,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var service = new UserService();
        return await service.CreateUserAsync(user, password);
    }

    // Méthode pour initialiser un utilisateur de test par défaut
    public static async Task InitializeDefaultTestUserAsync()
    {
        // Vérifier si l'utilisateur de test existe déjà
        var existingUser = _usersByEmail.GetValueOrDefault("admin@komon.com");
        if (existingUser == null)
        {
            await AddTestUserAsync(
                email: "admin@komon.com",
                password: "Admin123!",
                firstName: "Admin",
                lastName: "KomOn"
            );
        }
    }
} 
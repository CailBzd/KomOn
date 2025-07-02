using KomOn.Core.Entities;

namespace KomOn.Core.Interfaces;

public interface IUserService
{
    Task<IEnumerable<User>> GetAllUsersAsync();
    Task<User?> GetUserByIdAsync(Guid id);
    Task<User?> GetUserByEmailAsync(string email);
    Task<User> CreateUserAsync(User user, string password);
    Task<User> UpdateUserAsync(Guid id, User user);
    Task<bool> DeleteUserAsync(Guid id);
    Task<bool> ChangePasswordAsync(Guid userId, string currentPassword, string newPassword);
    Task<bool> UpdateUserRoleAsync(Guid userId, UserRole role);
    Task<bool> UpdateUserStatusAsync(Guid userId, UserStatus status);
    Task<IEnumerable<User>> GetUsersByRoleAsync(UserRole role);
    Task<bool> ValidateUserCredentialsAsync(string email, string password);
} 
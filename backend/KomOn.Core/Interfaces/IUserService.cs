using KomOn.Core.Entities;
using KomOn.Core.DTOs;

namespace KomOn.Core.Interfaces;

public interface IUserService
{
    Task<User?> GetByIdAsync(Guid id);
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByPhoneAsync(string phoneNumber);
    Task<IEnumerable<User>> GetAllAsync();
    Task<User> CreateAsync(CreateUserRequest request);
    Task<User> UpdateAsync(Guid id, UpdateUserRequest request);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> UpdateProfileAsync(Guid id, UpdateProfileRequest request);
    Task<bool> UpdateProfilePictureAsync(Guid id, string imageUrl);
    Task<bool> UpdateCreditBalanceAsync(Guid id, decimal amount);
    Task<bool> ChangeRoleAsync(Guid id, string newRole);
    Task<bool> ChangeStatusAsync(Guid id, string newStatus);
    Task<bool> ValidateUserCredentialsAsync(string email, string password);
} 
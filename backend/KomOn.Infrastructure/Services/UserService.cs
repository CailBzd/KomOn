using KomOn.Core.Entities;
using KomOn.Core.Interfaces;
using KomOn.Core.DTOs;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace KomOn.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly HttpClient _httpClient;
    private readonly string _restUrl;
    private readonly string _apiKey;

    public UserService(SupabaseService supabaseService)
    {
        var settings = supabaseService.GetSettings();
        _httpClient = new HttpClient();
        _restUrl = settings.Url.TrimEnd('/') + "/rest/v1";
        _apiKey = settings.ServiceRoleKey ?? settings.Key;
    }

    private void AddHeaders()
    {
        _httpClient.DefaultRequestHeaders.Clear();
        _httpClient.DefaultRequestHeaders.Add("apikey", _apiKey);
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
        _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    }

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        AddHeaders();
        var response = await _httpClient.GetAsync($"{_restUrl}/users?select=*");
        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<List<User>>(json) ?? new List<User>();
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        AddHeaders();
        var response = await _httpClient.GetAsync($"{_restUrl}/users?id=eq.{id}");
        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadAsStringAsync();
        var users = JsonSerializer.Deserialize<List<User>>(json);
        return users?.FirstOrDefault();
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        AddHeaders();
        var response = await _httpClient.GetAsync($"{_restUrl}/users?email=eq.{email}");
        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadAsStringAsync();
        var users = JsonSerializer.Deserialize<List<User>>(json);
        return users?.FirstOrDefault();
    }

    public async Task<User?> GetByPhoneAsync(string phoneNumber)
    {
        AddHeaders();
        var response = await _httpClient.GetAsync($"{_restUrl}/users?phoneNumber=eq.{phoneNumber}");
        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadAsStringAsync();
        var users = JsonSerializer.Deserialize<List<User>>(json);
        return users?.FirstOrDefault();
    }

    public async Task<User> CreateAsync(CreateUserRequest request)
    {
        AddHeaders();
        var user = new User
        {
            Id = Guid.NewGuid(), // En production, utiliser l'ID de Supabase Auth si besoin
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email.ToLower(),
            DateOfBirth = request.DateOfBirth,
            PhoneNumber = request.PhoneNumber,
            Bio = request.Bio,
            Role = request.Role ?? "participant",
            Status = "active",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        // Hasher le mot de passe côté backend si besoin
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        var jsonContent = new StringContent(JsonSerializer.Serialize(user), Encoding.UTF8, "application/json");
        var response = await _httpClient.PostAsync($"{_restUrl}/users", jsonContent);
        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadAsStringAsync();
        var users = JsonSerializer.Deserialize<List<User>>(json);
        return users?.FirstOrDefault()!;
    }

    public async Task<User> UpdateAsync(Guid id, UpdateUserRequest request)
    {
        AddHeaders();
        var existingUser = await GetByIdAsync(id);
        if (existingUser == null)
            throw new ArgumentException("Utilisateur non trouvé");
        if (!string.IsNullOrEmpty(request.FirstName))
            existingUser.FirstName = request.FirstName;
        if (!string.IsNullOrEmpty(request.LastName))
            existingUser.LastName = request.LastName;
        if (!string.IsNullOrEmpty(request.PhoneNumber))
            existingUser.PhoneNumber = request.PhoneNumber;
        if (request.DateOfBirth.HasValue)
            existingUser.DateOfBirth = request.DateOfBirth.Value;
        if (!string.IsNullOrEmpty(request.Bio))
            existingUser.Bio = request.Bio;
        if (!string.IsNullOrEmpty(request.Role))
            existingUser.Role = request.Role;
        if (!string.IsNullOrEmpty(request.Status))
            existingUser.Status = request.Status;
        existingUser.UpdatedAt = DateTime.UtcNow;
        var jsonContent = new StringContent(JsonSerializer.Serialize(existingUser), Encoding.UTF8, "application/json");
        var requestMsg = new HttpRequestMessage(new HttpMethod("PATCH"), $"{_restUrl}/users?id=eq.{id}")
        {
            Content = jsonContent
        };
        var response = await _httpClient.SendAsync(requestMsg);
        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadAsStringAsync();
        var users = JsonSerializer.Deserialize<List<User>>(json);
        return users?.FirstOrDefault()!;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        AddHeaders();
        var response = await _httpClient.DeleteAsync($"{_restUrl}/users?id=eq.{id}");
        return response.IsSuccessStatusCode;
    }

    public async Task<bool> UpdateProfileAsync(Guid id, UpdateProfileRequest request)
    {
        var user = await GetByIdAsync(id);
        if (user == null) return false;
        if (!string.IsNullOrEmpty(request.FirstName))
            user.FirstName = request.FirstName;
        if (!string.IsNullOrEmpty(request.LastName))
            user.LastName = request.LastName;
        if (!string.IsNullOrEmpty(request.PhoneNumber))
            user.PhoneNumber = request.PhoneNumber;
        if (request.DateOfBirth.HasValue)
            user.DateOfBirth = request.DateOfBirth.Value;
        if (!string.IsNullOrEmpty(request.Bio))
            user.Bio = request.Bio;
        user.UpdatedAt = DateTime.UtcNow;
        return (await UpdateAsync(id, new UpdateUserRequest
        {
            FirstName = user.FirstName,
            LastName = user.LastName,
            PhoneNumber = user.PhoneNumber,
            DateOfBirth = user.DateOfBirth,
            Bio = user.Bio
        })) != null;
    }

    public async Task<bool> UpdateProfilePictureAsync(Guid id, string imageUrl)
    {
        var user = await GetByIdAsync(id);
        if (user == null) return false;
        user.ProfilePictureUrl = imageUrl;
        user.UpdatedAt = DateTime.UtcNow;
        return (await UpdateAsync(id, new UpdateUserRequest { })) != null;
    }

    public async Task<bool> UpdateCreditBalanceAsync(Guid id, decimal amount)
    {
        // À implémenter selon la structure de la table
        return false;
    }

    public async Task<bool> ChangeRoleAsync(Guid id, string newRole)
    {
        var user = await GetByIdAsync(id);
        if (user == null) return false;
        user.Role = newRole;
        user.UpdatedAt = DateTime.UtcNow;
        return (await UpdateAsync(id, new UpdateUserRequest { Role = newRole })) != null;
    }

    public async Task<bool> ChangeStatusAsync(Guid id, string newStatus)
    {
        var user = await GetByIdAsync(id);
        if (user == null) return false;
        user.Status = newStatus;
        user.UpdatedAt = DateTime.UtcNow;
        return (await UpdateAsync(id, new UpdateUserRequest { Status = newStatus })) != null;
    }

    public async Task<bool> ValidateUserCredentialsAsync(string email, string password)
    {
        // Pour l'authentification, il faut passer par Supabase Auth (voir SupabaseService)
        // Ici, on ne valide que l'existence de l'utilisateur
        var user = await GetByEmailAsync(email);
        if (user == null) return false;
        return BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
    }


} 
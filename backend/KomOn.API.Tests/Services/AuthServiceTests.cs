using FluentAssertions;
using KomOn.Core.Entities;
using KomOn.Core.Interfaces;
using KomOn.Infrastructure.Services;
using Moq;
using Xunit;
using Microsoft.Extensions.Configuration;
using KomOn.API.DTOs;
using KomOn.Core.DTOs;
using Microsoft.Extensions.Options;
using KomOn.Infrastructure.Configuration;
using KomOn.API.Services;

namespace KomOn.API.Tests.Services;

public class AuthServiceTests
{
    private readonly Mock<IUserService> _mockUserService;
    private readonly Mock<KomOn.Core.Interfaces.IAuthService> _mockAuthService;
    private readonly Mock<SupabaseService> _mockSupabaseService;
    private readonly Mock<IConfiguration> _mockConfig;
    private readonly KomOn.API.Services.AuthService _authService;

    public AuthServiceTests()
    {
        _mockUserService = new Mock<IUserService>();
        _mockAuthService = new Mock<KomOn.Core.Interfaces.IAuthService>();
        
        // Créer un mock pour SupabaseService avec les dépendances nécessaires
        var mockSupabaseSettings = new Mock<IOptions<SupabaseSettings>>();
        mockSupabaseSettings.Setup(x => x.Value).Returns(new SupabaseSettings
        {
            Url = "https://test.supabase.co",
            Key = "test-key",
            ServiceRoleKey = "test-service-role-key"
        });
        
        _mockSupabaseService = new Mock<SupabaseService>(mockSupabaseSettings.Object);
        _mockConfig = new Mock<IConfiguration>();
        
        _mockConfig.Setup(x => x["Jwt:Secret"]).Returns("your-super-secret-key-with-at-least-32-characters-for-jwt-signing");
        _mockConfig.Setup(x => x["Jwt:Issuer"]).Returns("KomOn");
        _mockConfig.Setup(x => x["Jwt:Audience"]).Returns("KomOnUsers");
        
        _authService = new KomOn.API.Services.AuthService(_mockUserService.Object, _mockAuthService.Object, _mockSupabaseService.Object, _mockConfig.Object);
    }

    [Fact]
    public async Task RegisterAsync_WithValidData_ShouldReturnSuccessResult()
    {
        // Arrange
        var registerRequest = new RegisterRequest
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john.doe@example.com",
            Password = "Password123!",
            DateOfBirth = new DateTime(1990, 1, 1)
        };

        var createdUser = new User
        {
            Id = Guid.NewGuid(),
            FirstName = registerRequest.FirstName,
            LastName = registerRequest.LastName,
            Email = registerRequest.Email,
            DateOfBirth = registerRequest.DateOfBirth
        };

        var supabaseResponse = new KomOn.Infrastructure.Services.AuthResult
        {
            IsSuccess = true,
            Token = "supabase-jwt-token",
            RefreshToken = "refresh-token"
        };

        _mockSupabaseService.Setup(x => x.SignUpAsync(registerRequest.Email, registerRequest.Password, It.IsAny<Dictionary<string, object>>()))
            .ReturnsAsync(supabaseResponse);

        _mockUserService.Setup(x => x.CreateAsync(It.IsAny<CreateUserRequest>()))
            .ReturnsAsync(createdUser);

        // Act
        var result = await _authService.RegisterAsync(registerRequest);

        // Assert
        result.Should().NotBeNull();
        result.IsSuccess.Should().BeTrue();
        result.User.Should().NotBeNull();
        result.User!.Email.Should().Be(registerRequest.Email);
        result.Token.Should().Be("supabase-jwt-token");
        result.RefreshToken.Should().Be("refresh-token");

        _mockSupabaseService.Verify(x => x.SignUpAsync(registerRequest.Email, registerRequest.Password, It.IsAny<Dictionary<string, object>>()), Times.Once);
        _mockUserService.Verify(x => x.CreateAsync(It.IsAny<CreateUserRequest>()), Times.Once);
    }

    [Fact]
    public async Task RegisterAsync_WithSupabaseError_ShouldReturnErrorResult()
    {
        // Arrange
        var registerRequest = new RegisterRequest
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john.doe@example.com",
            Password = "Password123!",
            DateOfBirth = new DateTime(1990, 1, 1)
        };

        var supabaseResponse = new KomOn.Infrastructure.Services.AuthResult
        {
            IsSuccess = false,
            Error = "Email already exists"
        };

        _mockSupabaseService.Setup(x => x.SignUpAsync(registerRequest.Email, registerRequest.Password, It.IsAny<Dictionary<string, object>>()))
            .ReturnsAsync(supabaseResponse);

        // Act
        var result = await _authService.RegisterAsync(registerRequest);

        // Assert
        result.Should().NotBeNull();
        result.IsSuccess.Should().BeFalse();
        result.Error.Should().Be("Email already exists");
        result.User.Should().BeNull();
        result.Token.Should().BeNullOrEmpty();

        _mockSupabaseService.Verify(x => x.SignUpAsync(registerRequest.Email, registerRequest.Password, It.IsAny<Dictionary<string, object>>()), Times.Once);
        _mockUserService.Verify(x => x.CreateAsync(It.IsAny<CreateUserRequest>()), Times.Never);
    }

    [Fact]
    public async Task LoginAsync_WithValidCredentials_ShouldReturnSuccessResult()
    {
        // Arrange
        var loginRequest = new LoginRequest
        {
            Email = "john.doe@example.com",
            Password = "Password123!"
        };

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = loginRequest.Email,
            FirstName = "John",
            LastName = "Doe"
        };

        var supabaseResponse = new KomOn.Infrastructure.Services.AuthResult
        {
            IsSuccess = true,
            Token = "supabase-jwt-token",
            RefreshToken = "refresh-token"
        };

        _mockSupabaseService.Setup(x => x.SignInAsync(loginRequest.Email, loginRequest.Password))
            .ReturnsAsync(supabaseResponse);

        _mockUserService.Setup(x => x.GetByEmailAsync(loginRequest.Email))
            .ReturnsAsync(user);

        // Act
        var result = await _authService.LoginAsync(loginRequest);

        // Assert
        result.Should().NotBeNull();
        result.IsSuccess.Should().BeTrue();
        result.User.Should().NotBeNull();
        result.User!.Email.Should().Be(loginRequest.Email);
        result.Token.Should().Be("supabase-jwt-token");
        result.RefreshToken.Should().Be("refresh-token");

        _mockSupabaseService.Verify(x => x.SignInAsync(loginRequest.Email, loginRequest.Password), Times.Once);
        _mockUserService.Verify(x => x.GetByEmailAsync(loginRequest.Email), Times.Once);
    }

    [Fact]
    public async Task LoginAsync_WithInvalidCredentials_ShouldReturnErrorResult()
    {
        // Arrange
        var loginRequest = new LoginRequest
        {
            Email = "john.doe@example.com",
            Password = "WrongPassword"
        };

        var supabaseResponse = new KomOn.Infrastructure.Services.AuthResult
        {
            IsSuccess = false,
            Error = "Invalid credentials"
        };

        _mockSupabaseService.Setup(x => x.SignInAsync(loginRequest.Email, loginRequest.Password))
            .ReturnsAsync(supabaseResponse);

        // Act
        var result = await _authService.LoginAsync(loginRequest);

        // Assert
        result.Should().NotBeNull();
        result.IsSuccess.Should().BeFalse();
        result.Error.Should().Be("Invalid credentials");
        result.User.Should().BeNull();
        result.Token.Should().BeNullOrEmpty();

        _mockSupabaseService.Verify(x => x.SignInAsync(loginRequest.Email, loginRequest.Password), Times.Once);
        _mockUserService.Verify(x => x.GetByEmailAsync(It.IsAny<string>()), Times.Never);
    }

    [Theory]
    [InlineData("", "Doe", "valid@email.com", "Password123!", "Le prénom est requis.")]
    [InlineData("John", "", "valid@email.com", "Password123!", "Le nom est requis.")]
    [InlineData("John", "Doe", "", "Password123!", "L'email est requis.")]
    [InlineData("John", "Doe", "invalid-email", "Password123!", "L'email n'est pas valide.")]
    [InlineData("John", "Doe", "valid@email.com", "", "Le mot de passe est requis.")]
    [InlineData("John", "Doe", "valid@email.com", "weak", "Le mot de passe doit contenir au moins 8 caractères.")]
    public async Task RegisterAsync_WithInvalidData_ShouldReturnValidationErrors(
        string firstName, string lastName, string email, string password, string expectedError)
    {
        // Arrange
        var registerRequest = new RegisterRequest
        {
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            Password = password,
            DateOfBirth = new DateTime(1990, 1, 1)
        };

        // Act
        var result = await _authService.RegisterAsync(registerRequest);

        // Assert
        result.Should().NotBeNull();
        result.IsSuccess.Should().BeFalse();
        result.Error.Should().Contain(expectedError);
        result.User.Should().BeNull();
        result.Token.Should().BeNullOrEmpty();
    }

    [Theory]
    [InlineData("", "Password123!", "L'email est requis.")]
    [InlineData("invalid-email", "Password123!", "L'email n'est pas valide.")]
    [InlineData("valid@email.com", "", "Le mot de passe est requis.")]
    public async Task LoginAsync_WithInvalidData_ShouldReturnValidationErrors(
        string email, string password, string expectedError)
    {
        // Arrange
        var loginRequest = new LoginRequest
        {
            Email = email,
            Password = password
        };

        // Act
        var result = await _authService.LoginAsync(loginRequest);

        // Assert
        result.Should().NotBeNull();
        result.IsSuccess.Should().BeFalse();
        result.Error.Should().Contain(expectedError);
        result.User.Should().BeNull();
        result.Token.Should().BeNullOrEmpty();
    }
} 
using FluentAssertions;
using KomOn.Core.Entities;
using KomOn.Core.Interfaces;
using KomOn.Infrastructure.Services;
using Moq;
using Xunit;
using Microsoft.Extensions.Configuration;

namespace KomOn.API.Tests.Services;

public class AuthServiceTests
{
    private readonly Mock<IUserService> _mockUserService;
    private readonly Mock<IConfiguration> _mockConfig;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _mockUserService = new Mock<IUserService>();
        _mockConfig = new Mock<IConfiguration>();
        _mockConfig.Setup(x => x[It.IsAny<string>()]).Returns("your-super-secret-key-with-at-least-32-characters-for-jwt-signing");
        _authService = new AuthService(_mockUserService.Object, _mockConfig.Object);
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

        _mockUserService.Setup(x => x.GetUserByEmailAsync(registerRequest.Email))
            .ReturnsAsync((User?)null);

        _mockUserService.Setup(x => x.CreateUserAsync(It.IsAny<User>(), registerRequest.Password))
            .ReturnsAsync(createdUser);

        _mockUserService.Setup(x => x.GetUserByIdAsync(createdUser.Id))
            .ReturnsAsync(createdUser);

        // Act
        var result = await _authService.RegisterAsync(registerRequest);

        // Assert
        result.Should().NotBeNull();
        result.IsSuccess.Should().BeTrue();
        result.User.Should().NotBeNull();
        result.User!.Email.Should().Be(registerRequest.Email);
        result.Token.Should().NotBeNullOrEmpty();

        _mockUserService.Verify(x => x.GetUserByEmailAsync(registerRequest.Email), Times.Once);
        _mockUserService.Verify(x => x.CreateUserAsync(It.IsAny<User>(), registerRequest.Password), Times.Once);
    }

    [Fact]
    public async Task RegisterAsync_WithExistingEmail_ShouldReturnErrorResult()
    {
        // Arrange
        var registerRequest = new RegisterRequest
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "existing@example.com",
            Password = "Password123!",
            DateOfBirth = new DateTime(1990, 1, 1)
        };

        var existingUser = new User
        {
            Id = Guid.NewGuid(),
            Email = registerRequest.Email
        };

        _mockUserService.Setup(x => x.GetUserByEmailAsync(registerRequest.Email))
            .ReturnsAsync(existingUser);

        // Act
        var result = await _authService.RegisterAsync(registerRequest);

        // Assert
        result.Should().NotBeNull();
        result.IsSuccess.Should().BeFalse();
        result.Error.Should().Be("Un utilisateur avec cet email existe déjà.");
        result.User.Should().BeNull();
        result.Token.Should().BeNullOrEmpty();

        _mockUserService.Verify(x => x.GetUserByEmailAsync(registerRequest.Email), Times.Once);
        _mockUserService.Verify(x => x.CreateUserAsync(It.IsAny<User>(), It.IsAny<string>()), Times.Never);
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

        _mockUserService.Setup(x => x.GetUserByEmailAsync(loginRequest.Email))
            .ReturnsAsync(user);

        _mockUserService.Setup(x => x.ValidateUserCredentialsAsync(loginRequest.Email, loginRequest.Password))
            .ReturnsAsync(true);

        _mockUserService.Setup(x => x.GetUserByIdAsync(user.Id))
            .ReturnsAsync(user);

        // Act
        var result = await _authService.LoginAsync(loginRequest);

        // Assert
        result.Should().NotBeNull();
        result.IsSuccess.Should().BeTrue();
        result.User.Should().NotBeNull();
        result.User!.Email.Should().Be(loginRequest.Email);
        result.Token.Should().NotBeNullOrEmpty();

        _mockUserService.Verify(x => x.GetUserByEmailAsync(loginRequest.Email), Times.Once);
        _mockUserService.Verify(x => x.ValidateUserCredentialsAsync(loginRequest.Email, loginRequest.Password), Times.Once);
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

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = loginRequest.Email
        };

        _mockUserService.Setup(x => x.GetUserByEmailAsync(loginRequest.Email))
            .ReturnsAsync(user);

        _mockUserService.Setup(x => x.ValidateUserCredentialsAsync(loginRequest.Email, loginRequest.Password))
            .ReturnsAsync(false);

        // Act
        var result = await _authService.LoginAsync(loginRequest);

        // Assert
        result.Should().NotBeNull();
        result.IsSuccess.Should().BeFalse();
        result.Error.Should().Be("Email ou mot de passe incorrect.");
        result.User.Should().BeNull();
        result.Token.Should().BeNullOrEmpty();

        _mockUserService.Verify(x => x.GetUserByEmailAsync(loginRequest.Email), Times.Once);
        _mockUserService.Verify(x => x.ValidateUserCredentialsAsync(loginRequest.Email, loginRequest.Password), Times.Once);
    }

    [Fact]
    public async Task LoginAsync_WithNonExistentUser_ShouldReturnErrorResult()
    {
        // Arrange
        var loginRequest = new LoginRequest
        {
            Email = "nonexistent@example.com",
            Password = "Password123!"
        };

        _mockUserService.Setup(x => x.GetUserByEmailAsync(loginRequest.Email))
            .ReturnsAsync((User?)null);

        // Act
        var result = await _authService.LoginAsync(loginRequest);

        // Assert
        result.Should().NotBeNull();
        result.IsSuccess.Should().BeFalse();
        result.Error.Should().Be("Email ou mot de passe incorrect.");
        result.User.Should().BeNull();
        result.Token.Should().BeNullOrEmpty();

        _mockUserService.Verify(x => x.GetUserByEmailAsync(loginRequest.Email), Times.Once);
        _mockUserService.Verify(x => x.ValidateUserCredentialsAsync(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
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
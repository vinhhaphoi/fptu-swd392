using Application.DTOs.Auth;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Domain.Entities;
using Domain.Enums;
using System.Security.Cryptography;

namespace Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IUserProfileRepository _userProfileRepository;
    private readonly ILevelRepository _levelRepository;
    private readonly IPasswordResetTokenRepository _passwordResetTokenRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtService _jwtService;
    private const int ResetTokenExpirationHours = 24;

    public AuthService(
        IUserRepository userRepository,
        IUserProfileRepository userProfileRepository,
        ILevelRepository levelRepository,
        IPasswordResetTokenRepository passwordResetTokenRepository,
        IPasswordHasher passwordHasher,
        IJwtService jwtService)
    {
        _userRepository = userRepository;
        _userProfileRepository = userProfileRepository;
        _levelRepository = levelRepository;
        _passwordResetTokenRepository = passwordResetTokenRepository;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        // Accept username or email in the same field
        var user = await _userRepository.GetByUsernameAsync(request.Username)
            ?? await _userRepository.GetByEmailAsync(request.Username);

        if (user == null)
            throw new UnauthorizedAccessException("Invalid username or password");

        if (string.IsNullOrEmpty(user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid username or password");

        if (!_passwordHasher.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid username or password");

        if (!user.IsActive)
            throw new UnauthorizedAccessException("Account is deactivated");

        var roleName = user.Role.ToString();
        var token = _jwtService.GenerateToken(user.Id, user.Username!, user.Email!, roleName);
        var expMinutes = _jwtService.GetExpirationMinutes();

        return new AuthResponse
        {
            Token = token,
            UserId = user.Id,
            Username = user.Username!,
            Email = user.Email!,
            Role = roleName,
            ExpiresAt = DateTime.UtcNow.AddMinutes(expMinutes)
        };
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        // Treat Guid.Empty / default as null (client may omit targetLevelId or send "00000000-0000-0000-...")
        var targetLevelId = request.TargetLevelId is { } id && id != Guid.Empty ? id : (Guid?)null;

        if (targetLevelId.HasValue)
        {
            var level = await _levelRepository.GetByIdAsync(targetLevelId.Value);
            if (level == null)
                throw new ArgumentException("The selected level does not exist. Please choose a valid level (call GET /api/levels to list available levels).");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Username = request.Username,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            PasswordHash = _passwordHasher.Hash(request.Password),
            Role = Role.User,
            TargetLevelId = targetLevelId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.CreateAsync(user);

        var profile = new UserProfile
        {
            UserId = user.Id,
            FullName = request.Name,
            EstimatedBandScore = 0,
            StreakDays = 0,
            UpdatedAt = DateTime.UtcNow
        };

        await _userProfileRepository.CreateAsync(profile);

        var roleName = user.Role.ToString();
        var token = _jwtService.GenerateToken(user.Id, user.Username, user.Email, roleName);
        var expMinutes = _jwtService.GetExpirationMinutes();

        return new AuthResponse
        {
            Token = token,
            UserId = user.Id,
            Username = user.Username,
            Email = user.Email,
            Role = roleName,
            ExpiresAt = DateTime.UtcNow.AddMinutes(expMinutes)
        };
    }

    public Task<bool> ValidateTokenAsync(string token)
    {
        // Validation is done by JWT middleware; this is for interface compatibility.
        return Task.FromResult(true);
    }

    public async Task ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null)
            return;

        var tokenValue = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32)).Replace("+", "-").Replace("/", "_").TrimEnd('=');
        var resetToken = new PasswordResetToken
        {
            UserId = user.Id,
            Token = tokenValue,
            ExpiresAt = DateTime.UtcNow.AddHours(ResetTokenExpirationHours),
            Used = false,
            CreatedAt = DateTime.UtcNow
        };
        await _passwordResetTokenRepository.CreateAsync(resetToken);
        // TODO: Send email with reset link containing tokenValue
    }

    public async Task ResetPasswordAsync(ResetPasswordRequest request)
    {
        var resetToken = await _passwordResetTokenRepository.GetByTokenAsync(request.Token);
        if (resetToken == null || resetToken.Used || resetToken.ExpiresAt < DateTime.UtcNow)
            throw new UnauthorizedAccessException("Invalid or expired reset token");

        var user = await _userRepository.GetByIdAsync(resetToken.UserId);
        if (user == null)
            throw new InvalidOperationException("User not found");

        user.PasswordHash = _passwordHasher.Hash(request.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        resetToken.Used = true;
        await _passwordResetTokenRepository.UpdateAsync(resetToken);
    }

    public async Task ChangePasswordAsync(Guid userId, ChangePasswordRequest request)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            throw new UnauthorizedAccessException("User not found");

        if (string.IsNullOrEmpty(user.PasswordHash) || !_passwordHasher.Verify(request.CurrentPassword, user.PasswordHash))
            throw new UnauthorizedAccessException("Current password is incorrect");

        user.PasswordHash = _passwordHasher.Hash(request.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);
    }
}

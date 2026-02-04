using Application.DTOs.Auth;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Domain.Entities;
using Domain.Enums;
using System.Security.Cryptography;
using SupabaseUser = Supabase.Gotrue.User;

namespace Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;
    private readonly IPasswordResetTokenRepository _passwordResetTokenRepository;
    private readonly Supabase.Client _supabaseClient;

    public const int ResetTokenExpirationHours = 24;

    public AuthService(
        IUserRepository userRepository,
        IJwtService jwtService,
        IPasswordResetTokenRepository passwordResetTokenRepository,
        Supabase.Client supabaseClient)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
        _passwordResetTokenRepository = passwordResetTokenRepository;
        _supabaseClient = supabaseClient;
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        // First authenticate with Supabase
        try
        {
            // Try to find user by email first (Supabase primary authentication method)
            var userByEmail = await _userRepository.GetByEmailAsync(request.Username);
            var email = userByEmail?.Email ?? request.Username; // If request.Username is actually an email
            
            var session = await _supabaseClient.Auth.SignIn(email, request.Password);
            
            // If authentication succeeds with Supabase, get user profile from our database
            var user = await _userRepository.GetByUsernameAsync(request.Username);
            
            // If not found by username, try to find by email
            if (user == null)
            {
                user = await _userRepository.GetByEmailAsync(request.Username);
            }
            
            if (user == null)
            {
                // If user exists in auth but not in profiles, create the profile
                user = new User
                {
                    Id = Guid.Parse(session.User.Id),
                    Name = request.Username, // Default name
                    Username = request.Username,
                    Email = session.User.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                    Role = Role.User,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };
                user = await _userRepository.CreateAsync(user);
            }
            
            if (!user.IsActive)
            {
                throw new UnauthorizedAccessException("Account is deactivated");
            }

            var token = _jwtService.GenerateToken(user);
            var tokenHandler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadJwtToken(token);
            var expiresAt = jwtToken.ValidTo;

            return new AuthResponse
            {
                Token = token,
                UserId = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role.ToString(),
                ExpiresAt = expiresAt
            };
        }
        catch (Exception)
        {
            throw new UnauthorizedAccessException("Invalid username or password");
        }
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        // Note: Username and email uniqueness validation is now handled by FluentValidation
        // in RegisterRequestValidator before this method is called
        
        // First, create the user in Supabase Auth
        var session = await _supabaseClient.Auth.SignUp(request.Email, request.Password);
        
        // Now create the profile in our application database with the same UUID
        var appUser = new User
        {
            Id = Guid.Parse(session.User.Id), // Use the UUID from Supabase Auth
            Name = string.IsNullOrWhiteSpace(request.Name) ? request.Username : request.Name,
            Username = request.Username,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            // We don't store the password hash here since Supabase handles authentication
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = Role.User, // Always User role for new registrations
            TargetLevelId = null, // Will be set later if needed
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        var createdUser = await _userRepository.CreateAsync(appUser);
        var token = _jwtService.GenerateToken(createdUser);
        var tokenHandler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
        var jwtToken = tokenHandler.ReadJwtToken(token);
        var expiresAt = jwtToken.ValidTo;

        return new AuthResponse
        {
            Token = token,
            UserId = createdUser.Id,
            Username = createdUser.Username,
            Email = createdUser.Email,
            Role = createdUser.Role.ToString(),
            ExpiresAt = expiresAt
        };
    }

    public async Task<bool> ValidateTokenAsync(string token)
    {
        return _jwtService.ValidateToken(token);
    }

    public async Task ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null)
            return; // Don't reveal whether email exists

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
        // TODO: Send email with reset link containing tokenValue (e.g. https://yourapp.com/reset-password?token=...)
    }

    public async Task ResetPasswordAsync(ResetPasswordRequest request)
    {
        var resetToken = await _passwordResetTokenRepository.GetByTokenAsync(request.Token);
        if (resetToken == null || resetToken.Used || resetToken.ExpiresAt < DateTime.UtcNow)
            throw new UnauthorizedAccessException("Invalid or expired reset token");

        var user = await _userRepository.GetByIdAsync(resetToken.UserId);
        if (user == null)
            throw new InvalidOperationException("User not found");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
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

        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
            throw new UnauthorizedAccessException("Current password is incorrect");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);
    }
}


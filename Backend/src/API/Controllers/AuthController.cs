using Application.DTOs.Auth;
using Application.Interfaces.Services;
using Application.Validators;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;
    private readonly IValidator<RegisterRequest> _registerValidator;
    private readonly IHostEnvironment _env;

    public AuthController(
        IAuthService authService,
        ILogger<AuthController> logger,
        IValidator<RegisterRequest> registerValidator,
        IHostEnvironment env)
    {
        _authService = authService;
        _logger = logger;
        _registerValidator = registerValidator;
        _env = env;
    }

    /// <summary>
    /// 🔐 Authenticate user and receive JWT token
    /// </summary>
    /// <remarks>
    /// Use this endpoint to login with username and password.
    /// Returns a JWT token that must be included in the Authorization header for subsequent requests.
    /// Token expires after 2 hours.
    /// 
    /// Example request:
    /// POST /api/auth/login
    /// {
    ///   "username": "john_doe",
    ///   "password": "SecurePass123!"
    /// }
    /// </remarks>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponse), 200)]
    [ProducesResponseType(typeof(object), 400)]
    [ProducesResponseType(typeof(object), 401)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.Username))
        {
            return BadRequest(new { message = "Username and password are required." });
        }

        try
        {
            var response = await _authService.LoginAsync(request);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Failed login attempt for username: {Username}", request.Username);
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during login for username: {Username}", request?.Username);
            // In Development, return actual error so you can fix config/DB issues
            if (_env.IsDevelopment())
            {
                var detail = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new { message = "An error occurred during login.", detail, stackTrace = ex.StackTrace });
            }
            return BadRequest(new { message = "An error occurred during login. Please try again." });
        }
    }

    /// <summary>
    /// 📝 Register a new user account
    /// </summary>
    /// <remarks>
    /// Creates a new user account with "User" role by default.
    /// All fields are required except phoneNumber.
    /// Username and email must be unique.
    /// 
    /// Example request:
    /// POST /api/auth/register
    /// {
    ///   "name": "John Smith",
    ///   "username": "john_smith",
    ///   "email": "john@example.com",
    ///   "phoneNumber": "+1234567890",
    ///   "password": "SecurePass123!"
    /// }
    /// </remarks>
    /// Validation Rules:
    /// - Name: 2-100 characters, letters only
    /// - Username: 3-50 characters, alphanumeric with _ and -, must be unique
    /// - Email: Valid email format, max 150 characters, must be unique
    /// - Phone: Vietnamese format (0912345678 or +84912345678) - optional
    /// - Password: Min 8 chars, uppercase, lowercase, digit, special character
    /// 
    /// Note: Username and email uniqueness are validated asynchronously before database operations.
    /// </remarks>
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponse), 200)]
    [ProducesResponseType(typeof(object), 400)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            _logger.LogDebug("Starting registration for username: {Username}, email: {Email}", request.Username, request.Email);
            
            // Manual validation to support async rules (username/email uniqueness)
            var validationResult = await _registerValidator.ValidateAsync(request);
            
            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Validation failed for user {Username}: {Errors}", request.Username, string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage)));
                
                // Return validation errors in standard format
                var errors = validationResult.Errors
                    .GroupBy(e => e.PropertyName)
                    .ToDictionary(
                        g => g.Key,
                        g => g.Select(e => e.ErrorMessage).ToArray()
                    );
                
                return BadRequest(new 
                { 
                    type = "https://tools.ietf.org/html/rfc9110#section-15.5.1",
                    title = "One or more validation errors occurred.",
                    status = 400,
                    errors 
                });
            }
            
            _logger.LogDebug("Validation passed for user {Username}, proceeding with registration", request.Username);

            var response = await _authService.RegisterAsync(request);
            
            _logger.LogInformation("User registered successfully: {Username}, Email: {Email}", 
                request.Username, request.Email);
            
            return Ok(response);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid registration data: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
        catch (DbUpdateException ex)
        {
            // Database constraint violations (rare, as validation happens first)
            _logger.LogError(ex, "Database error during registration. Username: {Username}, Email: {Email}. InnerException: {InnerException}", 
                request.Username, request.Email, ex.InnerException?.Message);
            
            // Extract meaningful error message
            var errorMessage = ExtractDbErrorMessage(ex);
            return BadRequest(new { message = errorMessage });
        }
        catch (Exception ex)
        {
            // Unexpected errors - log full detail; in Development return actual error for debugging
            _logger.LogError(ex, "Unexpected error during registration. Username: {Username}, Email: {Email}. Exception: {Exception}",
                request.Username, request.Email, ex);

            var message = "An unexpected error occurred during registration. Please try again later.";
            if (_env.IsDevelopment())
            {
                var detail = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new { message, detail, stackTrace = ex.StackTrace });
            }
            return StatusCode(500, new { message });
        }
    }

    /// <summary>
    /// 🔓 Logout current user session
    /// </summary>
    /// <remarks>
    /// Since JWT is stateless, logout is handled client-side by removing the token.
    /// This endpoint confirms successful logout and provides client-side instructions.
    /// </remarks>
    [HttpPost("logout")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public IActionResult Logout()
    {
        // JWT is stateless, so logout is handled on the client side by removing the token
        // Optionally, you can implement token blacklisting here if needed
        return Ok(new { message = "Logged out successfully. Please remove the token from client storage." });
    }

    /// <summary>
    /// ✅ Validate JWT token authenticity
    /// </summary>
    /// <remarks>
    /// Validates the provided JWT token and returns user information if valid.
    /// Use this to check if a stored token is still valid before making other API calls.
    /// 
    /// Example response:
    /// {
    ///   "isValid": true,
    ///   "userId": 123,
    ///   "username": "john_doe",
    ///   "role": "User"
    /// }
    /// </remarks>
    [HttpPost("validate")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> ValidateToken()
    {
        var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        var isValid = await _authService.ValidateTokenAsync(token);
        return Ok(new { isValid });
    }

    /// <summary>
    /// 🔑 Request password reset email
    /// </summary>
    /// <remarks>
    /// Sends a password reset email to the specified email address.
    /// Email must be registered in the system.
    /// User will receive a reset link with token to change password.
    /// 
    /// Example request:
    /// POST /api/auth/forgot-password
    /// {
    ///   "email": "john@example.com"
    /// }
    /// </remarks>
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        await _authService.ForgotPasswordAsync(request);
        return Ok(new { message = "If the email exists, a reset link has been sent." });
    }

    /// <summary>
    /// 🔁 Reset password with token
    /// </summary>
    /// <remarks>
    /// Completes the password reset process using the token received via email.
    /// Token expires after 1 hour for security.
    /// 
    /// Example request:
    /// POST /api/auth/reset-password
    /// {
    ///   "token": "reset_token_from_email",
    ///   "newPassword": "NewSecurePass456!"
    /// }
    /// </remarks>
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        try
        {
            await _authService.ResetPasswordAsync(request);
            return Ok(new { message = "Password has been reset successfully." });
        }
        catch (UnauthorizedAccessException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>Change password for the currently logged-in user.</summary>
    [HttpPost("change-password")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();
        try
        {
            await _authService.ChangePasswordAsync(userId, request);
            return Ok(new { message = "Password changed successfully." });
        }
        catch (UnauthorizedAccessException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Extracts meaningful error messages from DbUpdateException
    /// Common causes of DbUpdateException:
    /// 1. Unique constraint violations (duplicate username/email)
    /// 2. Foreign key constraint violations
    /// 3. Required field violations (NOT NULL)
    /// 4. Data type mismatches
    /// 5. String length violations
    /// </summary>
    private string ExtractDbErrorMessage(DbUpdateException ex)
    {
        var innerException = ex.InnerException?.Message ?? ex.Message;

        // PostgreSQL specific error messages
        if (innerException.Contains("duplicate key value violates unique constraint", StringComparison.OrdinalIgnoreCase))
        {
            if (innerException.Contains("username"))
                return "Username already exists. Please choose a different username.";
            if (innerException.Contains("email"))
                return "Email already exists. Please use a different email address.";
            if (innerException.Contains("phone_number"))
                return "Phone number already exists. Please use a different phone number.";
            if (innerException.Contains("ix_users_email"))
                return "Email already exists. Please use a different email address.";
            if (innerException.Contains("ix_users_username"))
                return "Username already exists. Please choose a different username.";
            if (innerException.Contains("ix_users_phone_number"))
                return "Phone number already exists. Please use a different phone number.";
            
            return "A record with this information already exists.";
        }

        // MySQL specific error messages (for backward compatibility)
        if (innerException.Contains("Duplicate entry") || innerException.Contains("UNIQUE"))
        {
            if (innerException.Contains("username"))
                return "Username already exists. Please choose a different username.";
            if (innerException.Contains("email"))
                return "Email already exists. Please use a different email address.";
            if (innerException.Contains("phone"))
                return "Phone number already exists. Please use a different phone number.";
            
            return "A record with this information already exists.";
        }

        if (innerException.Contains("foreign key constraint", StringComparison.OrdinalIgnoreCase) || 
            innerException.Contains("violates foreign key constraint", StringComparison.OrdinalIgnoreCase))
        {
            return "Invalid reference data provided. Please check your input.";
        }

        if (innerException.Contains("cannot be null", StringComparison.OrdinalIgnoreCase) ||
            innerException.Contains("null value in column", StringComparison.OrdinalIgnoreCase))
        {
            return "Required field is missing. Please check your input.";
        }

        if (innerException.Contains("Data too long", StringComparison.OrdinalIgnoreCase) ||
            innerException.Contains("value too long for type", StringComparison.OrdinalIgnoreCase))
        {
            return "One or more fields exceed the maximum allowed length.";
        }

        if (innerException.Contains("check constraint", StringComparison.OrdinalIgnoreCase))
        {
            return "Input validation failed. Please check your input format.";
        }

        if (innerException.Contains("invalid input syntax", StringComparison.OrdinalIgnoreCase))
        {
            return "Invalid input format. Please check your input.";
        }

        if (innerException.Contains("does not exist", StringComparison.OrdinalIgnoreCase))
        {
            // Check if this is specifically a level reference issue
            if (innerException.Contains("target_level", StringComparison.OrdinalIgnoreCase) ||
                innerException.Contains("level", StringComparison.OrdinalIgnoreCase))
            {
                return "Required level data is missing from the database. Please contact administrator to ensure reference data is seeded.";
            }
            return "Referenced data does not exist.";
        }

        // Default error message for production (don't expose internal details)
        return "Unable to save changes. Please verify your input and try again.";
    }
}


using Application.DTOs.User;
using Application.DTOs.Auth;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

/// <summary>
/// 👤 User Profile Management APIs
/// </summary>
/// <remarks>
/// APIs for managing authenticated user's profile, settings, and personal data.
/// All endpoints require valid JWT authentication.
/// </remarks>
[ApiController]
[Route("api/user")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IAuthService _authService;
    private readonly ILogger<UsersController> _logger;

    public UsersController(
        IUserService userService,
        IAuthService authService,
        ILogger<UsersController> logger)
    {
        _userService = userService;
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// 📋 Get current user profile
    /// </summary>
    /// <remarks>
    /// Retrieve complete profile information for the authenticated user.
    /// Includes user details, role, and account status.
    /// 
    /// Example response:
    /// {
    ///   "id": 123,
    ///   "name": "John Smith",
    ///   "username": "john_smith",
    ///   "email": "john@example.com",
    ///   "role": "User",
    ///   "targetLevelId": 2,
    ///   "createdAt": "2026-01-31T10:00:00Z",
    ///   "updatedAt": "2026-01-31T11:00:00Z",
    ///   "isActive": true
    /// }
    /// </remarks>
    /// <returns>User profile information</returns>
    [HttpGet("profile")]
    [ProducesResponseType(typeof(UserProfileResponse), 200)]
    [ProducesResponseType(401)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetProfile()
    {
        try
        {
            var username = User.Identity?.Name;
            if (string.IsNullOrEmpty(username))
                return Unauthorized();
            
            var profile = await _userService.GetProfileByUsernameAsync(username);
            if (profile == null)
                return NotFound(new { message = "User not found" });
            
            return Ok(profile);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user profile for username: {Username}", User.Identity?.Name);
            return StatusCode(500, new { message = "An error occurred while retrieving profile" });
        }
    }

    /// <summary>
    /// ✏️ Update current user profile
    /// </summary>
    /// <remarks>
    /// Update profile information for the currently authenticated user.
    /// Email must be unique across the system.
    /// 
    /// Example request:
    /// PUT /api/user/profile
    /// {
    ///   "name": "John Smith Updated",
    ///   "email": "john.updated@example.com",
    ///   "phoneNumber": "+1987654321"
    /// }
    /// </remarks>
    /// <param name="request">Profile update request</param>
    /// <returns>Updated profile information</returns>
    [HttpPut("profile")]
    [ProducesResponseType(typeof(UserProfileResponse), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]
    [ProducesResponseType(404)]
    [ProducesResponseType(409)]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized();
            
            // Validate request
            if (string.IsNullOrWhiteSpace(request.Name))
                return BadRequest(new { message = "Name is required" });
            
            if (string.IsNullOrWhiteSpace(request.Email))
                return BadRequest(new { message = "Email is required" });
            
            var profile = await _userService.UpdateProfileAsync(userId, request);
            if (profile == null) 
                return NotFound(new { message = "User not found" });
            
            return Ok(profile);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user profile for user ID: {UserId}", User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
            return StatusCode(500, new { message = "An error occurred while updating profile" });
        }
    }

    /// <summary>
    /// 🎯 Set or update target level (sau khi đăng ký không có target level)
    /// </summary>
    /// <remarks>
    /// Ghi nhận target level cho user đã đăng nhập.
    /// Gọi GET /api/levels để lấy danh sách level và chọn id hợp lệ.
    /// Gửi targetLevelId = null để xóa target level.
    /// 
    /// Example: PUT /api/user/target-level
    /// { "targetLevelId": "10000000-0000-0000-0000-000000000003" }
    /// </remarks>
    [HttpPut("target-level")]
    [ProducesResponseType(typeof(UserProfileResponse), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> SetTargetLevel([FromBody] SetTargetLevelRequest request)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        try
        {
            var profile = await _userService.SetTargetLevelAsync(userId, request?.TargetLevelId);
            if (profile == null)
                return NotFound(new { message = "User not found" });
            return Ok(profile);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("user-only")]
    [Authorize]
    public IActionResult UserOnly()
    {
        return Ok(new { message = "This endpoint is accessible to authenticated users" });
    }

    [HttpGet("manager-only")]
    [Authorize]
    public IActionResult ManagerOnly()
    {
        return Ok(new { message = "This endpoint is accessible to authenticated users (role checking via RLS)" });
    }

    [HttpGet("admin-only")]
    [Authorize]
    public IActionResult AdminOnly()
    {
        return Ok(new { message = "This endpoint is accessible to authenticated users (role checking via RLS)" });
    }

    /// <summary>
    /// 🔐 Change current user password
    /// </summary>
    /// <remarks>
    /// Change password for the currently authenticated user.
    /// Requires current password for verification.
    /// 
    /// Example request:
    /// POST /api/user/change-password
    /// {
    ///   "currentPassword": "OldPassword123!",
    ///   "newPassword": "NewPassword456!"
    /// }
    /// </remarks>
    /// <param name="request">Password change request</param>
    /// <returns>Success message</returns>
    [HttpPost("change-password")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            // Validate request
            if (string.IsNullOrWhiteSpace(request.CurrentPassword))
                return BadRequest(new { message = "Current password is required" });
            
            if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 8)
                return BadRequest(new { message = "New password must be at least 8 characters" });

            await _authService.ChangePasswordAsync(userId, request);
            return Ok(new { message = "Password changed successfully" });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error changing password for user ID: {UserId}", User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
            return StatusCode(500, new { message = "An error occurred while changing password" });
        }
    }

    /// <summary>
    /// Get user statistics and activity summary
    /// </summary>
    /// <returns>User statistics</returns>
    [HttpGet("stats")]
    [ProducesResponseType(typeof(object), 200)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> GetUserStats()
    {
        try
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            // TODO: Implement user statistics service
            // This would typically return:
            // - Total practice sessions
            // - Total submissions
            // - Average scores
            // - Most practiced topics
            // - Progress by level
            
            return Ok(new { 
                message = "User statistics endpoint - implementation pending",
                userId = userId
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user stats for user ID: {UserId}", User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
            return StatusCode(500, new { message = "An error occurred while retrieving user statistics" });
        }
    }

    /// <summary>
    /// Get user practice history
    /// </summary>
    /// <param name="limit">Number of recent sessions to return (default: 10, max: 50)</param>
    /// <returns>User practice history</returns>
    [HttpGet("practice-history")]
    [ProducesResponseType(typeof(object), 200)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> GetPracticeHistory([FromQuery] int limit = 10)
    {
        try
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            // Validate limit parameter
            if (limit < 1) limit = 10;
            if (limit > 50) limit = 50;

            // TODO: Implement practice history retrieval
            // This would typically return:
            // - Recent practice sessions
            // - Session details (mode, date, duration)
            // - Submission counts per session
            // - Performance metrics
            
            return Ok(new { 
                message = "Practice history endpoint - implementation pending",
                userId = userId,
                limit = limit
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving practice history for user ID: {UserId}", User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
            return StatusCode(500, new { message = "An error occurred while retrieving practice history" });
        }
    }
}


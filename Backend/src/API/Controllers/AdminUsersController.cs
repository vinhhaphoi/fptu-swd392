using Application.DTOs.User;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

/// <summary>
/// 👮 Admin User Management APIs
/// </summary>
/// <remarks>
/// Admin-only APIs for managing all users in the system.
/// Requires Admin role with full permissions.
/// Features include CRUD operations, pagination, search, and sorting.
/// </remarks>
[ApiController]
[Route("api/admin/users")]
[Authorize(Policy = "AdminOnly")]
public class AdminUsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<AdminUsersController> _logger;

    public AdminUsersController(
        IUserService userService,
        ILogger<AdminUsersController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    /// <summary>
    /// 📋 Get all users with advanced filtering
    /// </summary>
    /// <remarks>
    /// Retrieve paginated list of all users with optional search and sorting.
    /// Supports filtering by name, username, or email.
    /// 
    /// Query Parameters:
    /// - page: Page number (default: 1)
    /// - pageSize: Items per page (default: 10)
    /// - search: Search term for name/username/email
    /// - sortBy: Field to sort by (name, email, createdAt, etc.)
    /// - sortOrder: asc or desc (default: asc)
    /// 
    /// Example response:
    /// {
    ///   "items": [...],
    ///   "totalItems": 25,
    ///   "currentPage": 1,
    ///   "totalPages": 3,
    ///   "pageSize": 10
    /// }
    /// </remarks>
    /// <param name="page">Page number (default: 1)</param>
    /// <param name="pageSize">Number of items per page (default: 10, max: 100)</param>
    /// <param name="search">Search term for name, username, or email</param>
    /// <param name="sortBy">Field to sort by (id, name, username, email, role, createdat)</param>
    /// <param name="sortDesc">Sort in descending order (default: false)</param>
    /// <returns>Paginated list of users</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<UserListResponse>), 200)]
    public async Task<IActionResult> GetAllUsers(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? sortBy = null,
        [FromQuery] bool sortDesc = false)
    {
        try
        {
            // Validate parameters
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 100) pageSize = 100;

            var users = await _userService.GetAllUsersAsync(page, pageSize, search, sortBy, sortDesc);
            var totalCount = await _userService.GetTotalUserCountAsync();
            
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);
            
            Response.Headers.Append("X-Total-Count", totalCount.ToString());
            Response.Headers.Append("X-Total-Pages", totalPages.ToString());
            Response.Headers.Append("X-Current-Page", page.ToString());
            Response.Headers.Append("X-Page-Size", pageSize.ToString());

            return Ok(users);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving users");
            return StatusCode(500, new { message = "An error occurred while retrieving users" });
        }
    }

    /// <summary>
    /// 🔍 Get user details by ID
    /// </summary>
    /// <remarks>
    /// Retrieve detailed information for a specific user by ID.
    /// Includes complete profile data and account status.
    /// </remarks>
    /// <param name="id">User ID</param>
    /// <returns>User details</returns>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(AdminUserResponse), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetUserById(Guid id)
    {
        try
        {
            var user = await _userService.GetUserByIdForAdminAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });
            
            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user with ID {UserId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving user" });
        }
    }

    /// <summary>
    /// ➕ Create a new user account
    /// </summary>
    /// <remarks>
    /// Create a new user account with specified role and settings.
    /// Username and email must be unique across the system.
    /// 
    /// Example request:
    /// POST /api/admin/users
    /// {
    ///   "name": "New User",
    ///   "username": "new_user",
    ///   "email": "new@example.com",
    ///   "phoneNumber": "+1234567890",
    ///   "password": "SecurePass123!",
    ///   "role": "User",
    ///   "targetLevelId": 2,
    ///   "isActive": true
    /// }
    /// </remarks>
    /// <param name="request">User creation request</param>
    /// <returns>Created user details</returns>
    [HttpPost]
    [ProducesResponseType(typeof(AdminUserResponse), 201)]
    [ProducesResponseType(typeof(object), 400)]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
    {
        try
        {
            // Validate request
            if (string.IsNullOrWhiteSpace(request.Name))
                return BadRequest(new { message = "Name is required" });
            
            if (string.IsNullOrWhiteSpace(request.Username))
                return BadRequest(new { message = "Username is required" });
            
            if (string.IsNullOrWhiteSpace(request.Email))
                return BadRequest(new { message = "Email is required" });
            
            if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 8)
                return BadRequest(new { message = "Password must be at least 8 characters" });

            var user = await _userService.CreateUserAsync(request);
            return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user");
            return StatusCode(500, new { message = "An error occurred while creating user" });
        }
    }

    /// <summary>
    /// ✏️ Update user information
    /// </summary>
    /// <remarks>
    /// Update an existing user's information and settings.
    /// Cannot change password through this endpoint (use change-password endpoint).
    /// 
    /// Example request:
    /// PUT /api/admin/users/123
    /// {
    ///   "name": "Updated Name",
    ///   "username": "updated_username",
    ///   "email": "updated@example.com",
    ///   "phoneNumber": "+1987654321",
    ///   "role": "Manager",
    ///   "targetLevelId": 3,
    ///   "isActive": true
    /// }
    /// </remarks>
    /// <param name="id">User ID</param>
    /// <param name="request">Update request</param>
    /// <returns>Updated user details</returns>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(AdminUserResponse), 200)]
    [ProducesResponseType(404)]
    [ProducesResponseType(typeof(object), 400)]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserRequest request)
    {
        try
        {
            var user = await _userService.UpdateUserAsync(id, request);
            if (user == null)
                return NotFound(new { message = "User not found" });
            
            return Ok(user);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user with ID {UserId}", id);
            return StatusCode(500, new { message = "An error occurred while updating user" });
        }
    }

    /// <summary>
    /// 🔐 Update user password (admin)
    /// </summary>
    /// <remarks>
    /// Reset a user's password as an administrator.
    /// Does not require knowledge of current password.
    /// 
    /// Example request:
    /// PUT /api/admin/users/123/password
    /// {
    ///   "newPassword": "NewSecurePass456!"
    /// }
    /// </remarks>
    /// <param name="id">User ID</param>
    /// <param name="request">Password update request</param>
    /// <returns>Success status</returns>
    [HttpPut("{id:guid}/password")]
    [ProducesResponseType(200)]
    [ProducesResponseType(404)]
    [ProducesResponseType(typeof(object), 400)]
    public async Task<IActionResult> UpdateUserPassword(Guid id, [FromBody] UpdateUserPasswordRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 8)
                return BadRequest(new { message = "Password must be at least 8 characters" });

            var success = await _userService.UpdateUserPasswordAsync(id, request);
            if (!success)
                return NotFound(new { message = "User not found" });
            
            return Ok(new { message = "Password updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating password for user ID {UserId}", id);
            return StatusCode(500, new { message = "An error occurred while updating password" });
        }
    }

    /// <summary>
    /// 🗑️ Delete a user account
    /// </summary>
    /// <remarks>
    /// Permanently delete a user account from the system.
    /// This action cannot be undone.
    /// All associated data will be removed.
    /// Cannot delete admin users for security.
    /// </remarks>
    /// <param name="id">User ID</param>
    /// <returns>Success status</returns>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(200)]
    [ProducesResponseType(404)]
    [ProducesResponseType(typeof(object), 400)]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        try
        {
            var success = await _userService.DeleteUserAsync(id);
            if (!success)
                return NotFound(new { message = "User not found" });
            
            return Ok(new { message = "User deleted successfully" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user with ID {UserId}", id);
            return StatusCode(500, new { message = "An error occurred while deleting user" });
        }
    }

    /// <summary>
    /// Toggle user active status (activate/deactivate)
    /// </summary>
    /// <param name="id">User ID</param>
    /// <returns>Success status with new status</returns>
    [HttpPatch("{id:guid}/toggle-status")]
    [ProducesResponseType(200)]
    [ProducesResponseType(404)]
    [ProducesResponseType(typeof(object), 400)]
    public async Task<IActionResult> ToggleUserStatus(Guid id)
    {
        try
        {
            var success = await _userService.ToggleUserStatusAsync(id);
            if (!success)
                return NotFound(new { message = "User not found" });
            
            // Get updated user to return current status
            var user = await _userService.GetUserByIdForAdminAsync(id);
            return Ok(new { 
                message = "User status updated successfully",
                isActive = user?.IsActive
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling status for user ID {UserId}", id);
            return StatusCode(500, new { message = "An error occurred while updating user status" });
        }
    }

    /// <summary>
    /// Get total user count
    /// </summary>
    /// <returns>Total number of users</returns>
    [HttpGet("count")]
    [ProducesResponseType(typeof(object), 200)]
    public async Task<IActionResult> GetUserCount()
    {
        try
        {
            var count = await _userService.GetTotalUserCountAsync();
            return Ok(new { count });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user count");
            return StatusCode(500, new { message = "An error occurred while retrieving user count" });
        }
    }
}
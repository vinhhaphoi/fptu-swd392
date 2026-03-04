using Application.DTOs.User;

namespace Application.Interfaces.Services;

public interface IUserService
{
    // User profile management (for authenticated users)
    Task<UserProfileResponse?> GetProfileByUsernameAsync(string username);
    Task<UserProfileResponse?> GetProfileByIdAsync(Guid userId);
    Task<UserProfileResponse?> UpdateProfileAsync(Guid userId, UpdateProfileRequest request);
    /// <summary>Set or clear the user's target level. Valid level IDs from GET /api/levels.</summary>
    Task<UserProfileResponse?> SetTargetLevelAsync(Guid userId, Guid? targetLevelId);

    // Admin user management
    Task<IEnumerable<UserListResponse>> GetAllUsersAsync(int page = 1, int pageSize = 10, string? search = null, string? sortBy = null, bool sortDesc = false);
    Task<AdminUserResponse?> GetUserByIdForAdminAsync(Guid userId);
    Task<AdminUserResponse> CreateUserAsync(CreateUserRequest request);
    Task<AdminUserResponse?> UpdateUserAsync(Guid userId, UpdateUserRequest request);
    Task<bool> UpdateUserPasswordAsync(Guid userId, UpdateUserPasswordRequest request);
    Task<bool> DeleteUserAsync(Guid userId);
    Task<bool> ToggleUserStatusAsync(Guid userId);
    Task<int> GetTotalUserCountAsync();
}

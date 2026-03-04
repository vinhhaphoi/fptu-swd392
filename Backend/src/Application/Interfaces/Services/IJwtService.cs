namespace Application.Interfaces.Services;

/// <summary>
/// Generates and validates JWT tokens for backend-only authentication.
/// </summary>
public interface IJwtService
{
    /// <summary>
    /// Generates a JWT access token for the user with role claim.
    /// </summary>
    string GenerateToken(Guid userId, string username, string email, string role);

    /// <summary>
    /// Token expiration in minutes (from config).
    /// </summary>
    int GetExpirationMinutes();
}

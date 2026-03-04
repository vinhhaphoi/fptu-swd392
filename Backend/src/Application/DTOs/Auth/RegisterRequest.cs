namespace Application.DTOs.Auth;

public class RegisterRequest
{
    public string Name { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string Password { get; set; } = string.Empty;
    /// <summary>Optional. Must be a valid level ID from GET /api/levels if provided.</summary>
    public Guid? TargetLevelId { get; set; }
}


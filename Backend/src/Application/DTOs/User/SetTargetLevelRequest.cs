namespace Application.DTOs.User;

/// <summary>
/// Request to set or clear the current user's target level.
/// Call GET /api/levels to get valid level IDs.
/// </summary>
public class SetTargetLevelRequest
{
    /// <summary>Level ID from GET /api/levels. Pass null to clear target level.</summary>
    public Guid? TargetLevelId { get; set; }
}

namespace Application.DTOs.User;

public class UpdateProfileRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime? Dob { get; set; }
    public Guid? TargetLevelId { get; set; }
}

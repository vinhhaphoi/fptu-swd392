namespace Application.DTOs.Practice;

public class PracticeSessionResponse
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string ModeCode { get; set; } = string.Empty;
    public Guid? TopicId { get; set; }
    public Guid? PracticeModeId { get; set; }
    public Guid? ExamAttemptId { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime StartedAt { get; set; }
}

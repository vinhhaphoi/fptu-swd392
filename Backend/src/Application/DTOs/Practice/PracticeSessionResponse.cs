namespace Application.DTOs.Practice;

public class PracticeSessionResponse
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string ModeCode { get; set; } = string.Empty;
    public Guid? TopicId { get; set; }
    public Guid? ExamAttemptId { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime StartedAt { get; set; }
}

namespace Application.DTOs.Writing;

public class SaveSubmissionRequest
{
    public Guid PracticeSessionId { get; set; }
    public string SubmissionText { get; set; } = string.Empty;
    public int WritingTimeSeconds { get; set; }
    public bool IsFinal { get; set; }
}

namespace Application.DTOs.Writing;

public class UserSubmissionResponse
{
    public Guid Id { get; set; }
    public Guid PracticeSessionId { get; set; }
    public int VersionNumber { get; set; }
    public bool IsFinal { get; set; }
    public string SubmissionText { get; set; } = string.Empty;
    public int WordCount { get; set; }
    public int WritingTimeSeconds { get; set; }
    public DateTime CreatedAt { get; set; }
}

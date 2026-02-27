namespace Domain.Entities;

public class LanguageCheck
{
    public Guid Id { get; set; }
    public Guid UserSubmissionId { get; set; }
    public string CheckType { get; set; } = "Spelling/Grammar";
    public string? AiModelVersion { get; set; }
    public string? GrammarErrors { get; set; } // JSON format
    public string? SpellingErrors { get; set; } // JSON format
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual UserSubmission? Submission { get; set; }
}

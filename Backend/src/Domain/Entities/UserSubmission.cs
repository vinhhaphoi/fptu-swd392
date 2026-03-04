namespace Domain.Entities;

using System;

public class UserSubmission
{
    public Guid Id { get; set; }
    public Guid PracticeSessionId { get; set; }
    public Guid? PartId { get; set; }
    public int VersionNumber { get; set; }
    public bool IsFinal { get; set; }
    public string SubmissionText { get; set; } = string.Empty;
    public int WordCount { get; set; }
    public int WritingTimeSeconds { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? SubmittedAt { get; set; }

    // Navigation properties
    public virtual PracticeSession? PracticeSession { get; set; }
    public virtual Part? Part { get; set; }
    public virtual ICollection<LanguageCheck> LanguageChecks { get; set; } = new List<LanguageCheck>();
    public virtual ICollection<SubmissionScore> SubmissionScores { get; set; } = new List<SubmissionScore>();
    public virtual ICollection<AIFeedback> AIFeedbacks { get; set; } = new List<AIFeedback>();
}

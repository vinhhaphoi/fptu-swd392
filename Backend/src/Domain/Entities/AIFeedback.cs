using System;

namespace Domain.Entities;

public class AIFeedback
{
    public Guid Id { get; set; }
    public Guid SubmissionId { get; set; }
    public Guid CriteriaId { get; set; }
    public string? FeedbackText { get; set; }
    public string? Suggestions { get; set; }
    public string? ImprovedVersion { get; set; }

    // Navigation properties
    public virtual UserSubmission? Submission { get; set; }
    public virtual ScoringCriteria? Criteria { get; set; }
}

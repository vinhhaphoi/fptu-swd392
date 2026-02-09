namespace Domain.Entities;

using System;

public class AIEvaluation
{
    public Guid Id { get; set; }           // Changed from int to Guid to match evaluation_id in DB
    public Guid SubmissionId { get; set; } // Changed from int to Guid to match submission_id in DB
    public float? TotalScore { get; set; }
    public int? EstimatedLevelId { get; set; }
    public string? OverallFeedback { get; set; }
    public string? Strengths { get; set; }
    public string? Weaknesses { get; set; }
    public string? Suggestions { get; set; }
    public DateTime EvaluatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual UserSubmission? Submission { get; set; }
    public virtual Level? EstimatedLevel { get; set; }
    public virtual ICollection<CriteriaScore> CriteriaScores { get; set; } = new List<CriteriaScore>();
}

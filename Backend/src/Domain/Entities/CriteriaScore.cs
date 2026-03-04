namespace Domain.Entities;

using System;

public class CriteriaScore
{
    public Guid Id { get; set; }
    public Guid SubmissionScoreId { get; set; }
    public Guid CriteriaId { get; set; }
    public float? Score { get; set; }
    public string? Feedback { get; set; }

    // Navigation properties
    public virtual SubmissionScore? SubmissionScore { get; set; }
    public virtual ScoringCriteria? Criteria { get; set; }
}

namespace Domain.Entities;

using System;

public class CriteriaScore
{
    public int Id { get; set; }
    public Guid SubmissionScoreId { get; set; }
    public int CriteriaId { get; set; }
    public float? Score { get; set; }
    public string? Feedback { get; set; }

    // Navigation properties
    public virtual SubmissionScore? SubmissionScore { get; set; }
    public virtual ScoringCriteria? Criteria { get; set; }
}

namespace Domain.Entities;

using System;

public class CriteriaScore
{
    public int Id { get; set; }          // Kept as int to match criteria_score_id in DB
    public Guid EvaluationId { get; set; } // Changed from int to Guid to match evaluation_id in DB
    public int CriteriaId { get; set; }   // Matches criteria_id in DB
    public float? Score { get; set; }
    public string? Feedback { get; set; }

    // Navigation properties
    public virtual AIEvaluation? Evaluation { get; set; }
    public virtual ScoringCriteria? Criteria { get; set; }
}

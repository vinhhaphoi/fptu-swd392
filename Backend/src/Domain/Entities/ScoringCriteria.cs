namespace Domain.Entities;

using System;

public class ScoringCriteria
{
    public Guid Id { get; set; }
    public Guid RubricId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public float Weight { get; set; }
    public float MaxScore { get; set; }

    // Navigation properties
    public virtual Rubric? Rubric { get; set; }
    public virtual ICollection<CriteriaScore> CriteriaScores { get; set; } = new List<CriteriaScore>();
    public virtual ICollection<UserErrorStatistic> ErrorStatistics { get; set; } = new List<UserErrorStatistic>();
}

namespace Domain.Entities;

using System;

public class ScoringCriteria
{
    public int Id { get; set; }      // Kept as int to match criteria_id in DB
    public int PartId { get; set; }  // Matches part_id in DB
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public float Weight { get; set; }
    public int MaxScore { get; set; } = 10;

    // Navigation properties
    public virtual Part? Part { get; set; }
    public virtual ICollection<CriteriaScore> CriteriaScores { get; set; } = new List<CriteriaScore>();
}

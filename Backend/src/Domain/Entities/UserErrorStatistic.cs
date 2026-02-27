using System;

namespace Domain.Entities;

public class UserErrorStatistic
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public int CriteriaId { get; set; }
    public int PartId { get; set; }
    public int LevelId { get; set; }
    public int OccurrenceCount { get; set; }
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual User? User { get; set; }
    public virtual ScoringCriteria? Criteria { get; set; }
    public virtual Part? Part { get; set; }
    public virtual Level? Level { get; set; }
}

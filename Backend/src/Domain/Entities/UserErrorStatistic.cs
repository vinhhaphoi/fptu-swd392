using System;

namespace Domain.Entities;

public class UserErrorStatistic
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid CriteriaId { get; set; }
    public Guid PartId { get; set; }
    public Guid LevelId { get; set; }
    public int OccurrenceCount { get; set; }
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual User? User { get; set; }
    public virtual ScoringCriteria? Criteria { get; set; }
    public virtual Part? Part { get; set; }
    public virtual Level? Level { get; set; }
}

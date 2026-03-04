namespace Domain.Entities;

using System;

public class LearningPlan
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid TargetLevelId { get; set; }
    public int TotalRequiredSessions { get; set; }
    public int CompletedSessions { get; set; }
    public string? WeakArea { get; set; }
    public float ProgressPercentage { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual User? User { get; set; }
    public virtual Level? TargetLevel { get; set; }
}

using System;

namespace Domain.Entities;

public class UserTopicProgress
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid TopicId { get; set; }
    public int AttemptsCount { get; set; }
    public string BestBandScore { get; set; } = "0.0";
    public float AverageScore { get; set; }
    public DateTime LastAttemptAt { get; set; } = DateTime.UtcNow;
    public string? MasteryLevel { get; set; }

    // Navigation properties
    public virtual User User { get; set; } = null!;
    public virtual Topic Topic { get; set; } = null!;
}

namespace Domain.Entities;

using System;

public class PracticeSession
{
    public Guid Id { get; set; }           // Changed from int to Guid to match session_id in DB
    public Guid UserId { get; set; }       // Matches user_id in DB
    public int ModeId { get; set; }        // Matches mode_id in DB
    public bool IsRandom { get; set; } = true;
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? EndedAt { get; set; }
    public string? Status { get; set; }

    // Navigation properties
    public virtual User? User { get; set; }
    public virtual PracticeMode? Mode { get; set; }
    public virtual ICollection<UserSubmission> UserSubmissions { get; set; } = new List<UserSubmission>();
}

using System;
using System.Collections.Generic;

namespace Domain.Entities;

public class ExamAttempt
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid ExamStructureId { get; set; }
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? SubmittedAt { get; set; }
    public float OverallScore { get; set; }
    public float EstimatedBand { get; set; }
    public string Status { get; set; } = "IN_PROGRESS";

    // Navigation properties
    public virtual User User { get; set; } = null!;
    public virtual ExamStructure ExamStructure { get; set; } = null!;
    public virtual ICollection<PracticeSession> PracticeSessions { get; set; } = new List<PracticeSession>();
}

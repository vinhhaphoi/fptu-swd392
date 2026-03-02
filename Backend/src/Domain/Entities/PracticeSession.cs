using System;
using Domain.Enums;

namespace Domain.Entities;

public class PracticeSession
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public Guid? TopicId { get; set; }
    public int? PracticeModeId { get; set; }
    public Guid? ExamAttemptId { get; set; }
    public WritingSessionStatus Status { get; set; } = WritingSessionStatus.InProgress;
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? SubmittedAt { get; set; }

    // Navigation properties
    public virtual User? User { get; set; }
    public virtual Topic? Topic { get; set; }
    public virtual PracticeMode? PracticeMode { get; set; }
    public virtual ExamAttempt? ExamAttempt { get; set; }
    public virtual ICollection<UserSubmission> UserSubmissions { get; set; } = new List<UserSubmission>();
}

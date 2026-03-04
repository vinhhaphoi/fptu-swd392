using System;
using Domain.Enums;

namespace Domain.Entities;

public class PracticeSession
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid? TopicId { get; set; }
    public Guid? PracticeModeId { get; set; }
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

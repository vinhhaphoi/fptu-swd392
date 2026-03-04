using Domain.Enums;

namespace Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime? Dob { get; set; }
    public string? PhoneNumber { get; set; }
    public string? PasswordHash { get; set; }
    public Role Role { get; set; } = Role.Guest;
    public Guid? TargetLevelId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual Level? TargetLevel { get; set; }
    public virtual UserProfile? UserProfile { get; set; }
    public virtual ICollection<PracticeSession> PracticeSessions { get; set; } = new List<PracticeSession>();
    public virtual ICollection<PasswordResetToken> PasswordResetTokens { get; set; } = new List<PasswordResetToken>();
    public virtual ICollection<UserTopicProgress> TopicProgresses { get; set; } = new List<UserTopicProgress>();
    public virtual ICollection<ExamAttempt> ExamAttempts { get; set; } = new List<ExamAttempt>();
    public virtual ICollection<UserErrorStatistic> ErrorStatistics { get; set; } = new List<UserErrorStatistic>();
}


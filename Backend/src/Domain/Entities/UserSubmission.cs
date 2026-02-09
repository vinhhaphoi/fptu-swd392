namespace Domain.Entities;

using System;

public class UserSubmission
{
    public Guid Id { get; set; }           // Changed from int to Guid to match submission_id in DB
    public Guid SessionId { get; set; }    // Changed from int to Guid to match session_id in DB
    public int TopicId { get; set; }       // Matches topic_id in DB
    public int PartId { get; set; }        // Matches part_id in DB
    public string Content { get; set; } = string.Empty;
    public int? WordCount { get; set; }
    public bool EnableHint { get; set; }
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual PracticeSession? Session { get; set; }
    public virtual Topic? Topic { get; set; }
    public virtual Part? Part { get; set; }
    public virtual LanguageCheck? LanguageCheck { get; set; }
    public virtual AIEvaluation? AIEvaluation { get; set; }
}

namespace Domain.Entities;

using System;

public class Topic
{
    public int Id { get; set; }              // Kept as int to match topic_id in DB
    public int PartId { get; set; }          // Matches part_id in DB
    public int DifficultyLevelId { get; set; } // Matches difficulty_level_id in DB
    public string TopicName { get; set; } = string.Empty;
    public string? Description { get; set; } // Added to match description in DB
    public string? Content { get; set; }     // Added to match content in DB
    public string? Context { get; set; }
    public string? Purpose { get; set; }
    public string? RecipientRole { get; set; }
    public int? MinWords { get; set; }       // Added to match min_words in DB
    public int? MaxWords { get; set; }       // Added to match max_words in DB
    public bool IsActive { get; set; } = true; // Added to match is_active in DB
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Added to match created_at in DB

    // Navigation properties
    public virtual Part? Part { get; set; }
    public virtual Level? DifficultyLevel { get; set; }
    public virtual ICollection<UserSubmission> UserSubmissions { get; set; } = new List<UserSubmission>();
    public virtual ICollection<VocabularySet> VocabularySets { get; set; } = new List<VocabularySet>();
    public virtual ICollection<SampleText> SampleTexts { get; set; } = new List<SampleText>();
    public virtual ICollection<Hint> Hints { get; set; } = new List<Hint>();
}

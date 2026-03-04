namespace Domain.Entities;

using System;

public class Topic
{
    public Guid Id { get; set; }
    public Guid PartId { get; set; }
    public Guid LevelId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Prompt { get; set; } = string.Empty;
    public string? Purpose { get; set; }
    public string? RecipientRole { get; set; }
    public int Version { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Part? Part { get; set; }
    public virtual Level? Level { get; set; }
    public virtual ICollection<TopicVocabularySet> TopicVocabularySets { get; set; } = new List<TopicVocabularySet>();
    public virtual ICollection<SampleText> SampleTexts { get; set; } = new List<SampleText>();
    public virtual ICollection<SentenceStructure> SentenceStructures { get; set; } = new List<SentenceStructure>();
    public virtual ICollection<UserTopicProgress> UserTopicProgresses { get; set; } = new List<UserTopicProgress>();
    public virtual ICollection<PracticeSession> PracticeSessions { get; set; } = new List<PracticeSession>();
    public virtual ICollection<Hint> Hints { get; set; } = new List<Hint>();
}

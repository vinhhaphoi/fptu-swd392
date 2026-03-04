namespace Domain.Entities;

using System;

public class VocabularySet
{
    public Guid Id { get; set; }
    public Guid LevelId { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual Level? Level { get; set; }
    public virtual ICollection<TopicVocabularySet> TopicVocabularySets { get; set; } = new List<TopicVocabularySet>();
    public virtual ICollection<VocabularyItem> VocabularyItems { get; set; } = new List<VocabularyItem>();
}

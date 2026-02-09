namespace Domain.Entities;

using System;

public class VocabularySet
{
    public int Id { get; set; }      // Kept as int to match vocab_set_id in DB
    public int TopicId { get; set; } // Matches topic_id in DB
    public int LevelId { get; set; } // Matches level_id in DB
    public string? Name { get; set; }
    public string? Description { get; set; }

    // Navigation properties
    public virtual Topic? Topic { get; set; }
    public virtual Level? Level { get; set; }
    public virtual ICollection<VocabularyItem> VocabularyItems { get; set; } = new List<VocabularyItem>();
    public virtual ICollection<SentenceStructure> SentenceStructures { get; set; } = new List<SentenceStructure>();
}

using System;

namespace Domain.Entities;

public class TopicVocabularySet
{
    public Guid TopicId { get; set; }
    public Guid VocabularySetId { get; set; }

    // Navigation properties
    public virtual Topic Topic { get; set; } = null!;
    public virtual VocabularySet VocabularySet { get; set; } = null!;
}

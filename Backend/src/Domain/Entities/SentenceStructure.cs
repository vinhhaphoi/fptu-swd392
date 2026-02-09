namespace Domain.Entities;

using System;

public class SentenceStructure
{
    public int Id { get; set; }      // Kept as int to match structure_id in DB
    public int VocabSetId { get; set; } // Matches vocab_set_id in DB
    public string Pattern { get; set; } = string.Empty;
    public string? UsageNote { get; set; }
    public string? Example { get; set; }

    // Navigation properties
    public virtual VocabularySet? VocabularySet { get; set; }
}

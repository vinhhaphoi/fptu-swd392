namespace Domain.Entities;

using System;

public class VocabularyItem
{
    public int Id { get; set; }      // Kept as int to match vocab_id in DB
    public int VocabSetId { get; set; } // Matches vocab_set_id in DB
    public string Word { get; set; } = string.Empty;
    public string? Meaning { get; set; }
    public string? ExampleSentence { get; set; }
    public string? PartOfSpeech { get; set; }

    // Navigation properties
    public virtual VocabularySet? VocabularySet { get; set; }
}

namespace Domain.Entities;

using System;

public class VocabularyItem
{
    public int Id { get; set; }
    public int VocabularySetId { get; set; }
    public string Word { get; set; } = string.Empty;
    public string Meaning { get; set; } = string.Empty;
    public string? Example { get; set; }

    // Navigation properties
    public virtual VocabularySet? VocabularySet { get; set; }
}

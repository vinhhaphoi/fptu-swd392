namespace Domain.Entities;

using System;

public class VocabularyItem
{
    public Guid Id { get; set; }
    public Guid VocabularySetId { get; set; }
    public string Word { get; set; } = string.Empty;
    public string Meaning { get; set; } = string.Empty;
    public string? Example { get; set; }

    // Navigation properties
    public virtual VocabularySet? VocabularySet { get; set; }
}

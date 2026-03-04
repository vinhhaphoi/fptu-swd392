namespace Domain.Entities;

using System;

public class SampleType
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }

    // Navigation properties
    public virtual ICollection<SampleText> SampleTexts { get; set; } = new List<SampleText>();
}

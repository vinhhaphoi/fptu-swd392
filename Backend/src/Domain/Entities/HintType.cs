namespace Domain.Entities;

using System;

public class HintType
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }

    // Navigation properties
    public virtual ICollection<Hint> Hints { get; set; } = new List<Hint>();
}

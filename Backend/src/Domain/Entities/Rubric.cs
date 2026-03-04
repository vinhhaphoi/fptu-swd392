using System;
using System.Collections.Generic;

namespace Domain.Entities;

public class Rubric
{
    public Guid Id { get; set; }
    public Guid PartId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Version { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual Part? Part { get; set; }
    public virtual ICollection<ScoringCriteria> ScoringCriteria { get; set; } = new List<ScoringCriteria>();
}

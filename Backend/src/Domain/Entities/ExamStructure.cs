using System;
using System.Collections.Generic;

namespace Domain.Entities;

public class ExamStructure
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int TotalParts { get; set; }
    public string? Description { get; set; }
    public int? DurationMinutes { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public virtual ICollection<Part> Parts { get; set; } = new List<Part>();
}

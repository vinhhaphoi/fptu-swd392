namespace Domain.Entities;

using System;

public class SentenceStructure
{
    public Guid Id { get; set; }
    public Guid TopicId { get; set; }
    public Guid LevelId { get; set; }
    public string StructurePattern { get; set; } = string.Empty;
    public string? Explanation { get; set; }

    // Navigation properties
    public virtual Topic? Topic { get; set; }
    public virtual Level? Level { get; set; }
}

namespace Domain.Entities;

using System;

public class SampleText
{
    public int Id { get; set; }
    public Guid TopicId { get; set; }
    public int LevelId { get; set; }
    public string Content { get; set; } = string.Empty;
    public float SampleBandScore { get; set; }
    public int Version { get; set; }

    // Navigation properties
    public virtual Topic? Topic { get; set; }
    public virtual Level? Level { get; set; }
}

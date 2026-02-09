namespace Domain.Entities;

using System;

public class SampleText
{
    public int Id { get; set; }        // Kept as int to match sample_id in DB
    public int TopicId { get; set; }   // Matches topic_id in DB
    public int LevelId { get; set; }   // Matches level_id in DB
    public int SampleTypeId { get; set; } // Matches sample_type_id in DB
    public string Content { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? Author { get; set; }

    // Navigation properties
    public virtual Topic? Topic { get; set; }
    public virtual Level? Level { get; set; }
    public virtual SampleType? SampleType { get; set; }
}

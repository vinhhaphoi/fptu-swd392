namespace Domain.Entities;

public class Hint
{
    public Guid Id { get; set; }
    public Guid TopicId { get; set; }
    public Guid LevelId { get; set; }
    public Guid HintTypeId { get; set; }
    public string Content { get; set; } = string.Empty;
    public int? DisplayOrder { get; set; }

    // Navigation properties
    public virtual Topic? Topic { get; set; }
    public virtual Level? Level { get; set; }
    public virtual HintType? HintType { get; set; }
}

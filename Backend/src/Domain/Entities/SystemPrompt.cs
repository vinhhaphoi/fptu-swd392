namespace Domain.Entities;

using System;

public class SystemPrompt
{
    public Guid Id { get; set; }
    public Guid PartId { get; set; }
    public Guid LevelId { get; set; }
    public Guid PurposeId { get; set; }
    public string PromptContent { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public virtual Part? Part { get; set; }
    public virtual Level? Level { get; set; }
    public virtual PromptPurpose? Purpose { get; set; }
}

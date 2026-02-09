namespace Domain.Entities;

using System;

public class SystemPrompt
{
    public int Id { get; set; }      // Kept as int to match prompt_id in DB
    public int PartId { get; set; }  // Matches part_id in DB
    public int LevelId { get; set; } // Matches level_id in DB
    public int PurposeId { get; set; } // Matches purpose_id in DB
    public string PromptContent { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public virtual Part? Part { get; set; }
    public virtual Level? Level { get; set; }
    public virtual PromptPurpose? Purpose { get; set; }
}

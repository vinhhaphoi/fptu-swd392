namespace Domain.Entities;

using System;

public class Part
{
    public int Id { get; set; }              // Kept as int to match part_id in DB
    public int ExamStructureId { get; set; } // Matches exam_structure_id in DB
    public int PartTypeId { get; set; }      // Matches part_type_id in DB
    public int PartNumber { get; set; }      // Added to match part_number in DB
    public string? Title { get; set; }       // Added to match title in DB
    public string? Description { get; set; }
    public string? Instructions { get; set; } // Added to match instructions in DB
    public int? TimeLimit { get; set; }
    public int? MinWords { get; set; }
    public int? MaxWords { get; set; }

    // Navigation properties
    public virtual ExamStructure? ExamStructure { get; set; }
    public virtual PartType? PartType { get; set; }
    public virtual ICollection<Topic> Topics { get; set; } = new List<Topic>();
    public virtual ICollection<UserSubmission> UserSubmissions { get; set; } = new List<UserSubmission>();
    public virtual ICollection<ScoringCriteria> ScoringCriteria { get; set; } = new List<ScoringCriteria>();
    public virtual ICollection<SystemPrompt> SystemPrompts { get; set; } = new List<SystemPrompt>();
}

using System;
using System.Collections.Generic;

namespace Domain.Entities;

public class SubmissionScore
{
    public Guid Id { get; set; }
    public Guid SubmissionId { get; set; }
    public float OverallScore { get; set; }
    public string EstimatedBand { get; set; } = string.Empty;
    public string? AiModelVersion { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual UserSubmission? Submission { get; set; }
    public virtual ICollection<CriteriaScore> CriteriaScores { get; set; } = new List<CriteriaScore>();
}

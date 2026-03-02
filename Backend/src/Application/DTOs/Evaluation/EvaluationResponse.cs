namespace Application.DTOs.Evaluation;

public class CriteriaScoreDto
{
    public int CriteriaId { get; set; }
    public string CriteriaName { get; set; } = string.Empty;
    public float Score { get; set; }
}

public class AIFeedbackDto
{
    public int CriteriaId { get; set; }
    public string? FeedbackText { get; set; }
    public string? Suggestions { get; set; }
    public string? ImprovedVersion { get; set; }
}

public class EvaluationResponse
{
    public int SubmissionId { get; set; }
    public float OverallScore { get; set; }
    public string EstimatedBand { get; set; } = string.Empty;
    public string? AiModelVersion { get; set; }
    public List<CriteriaScoreDto> CriteriaScores { get; set; } = new();
    public List<AIFeedbackDto> Feedbacks { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

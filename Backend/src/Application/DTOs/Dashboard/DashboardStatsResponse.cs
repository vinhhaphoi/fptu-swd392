namespace Application.DTOs.Dashboard;

public class CriteriaAvgScore
{
    public string CriteriaName { get; set; } = string.Empty;
    public float AverageScore { get; set; }
}

public class ProgressPoint
{
    public DateTime Date { get; set; }
    public float Score { get; set; }
}

public class DashboardSuggestions
{
    public List<string> Topics { get; set; } = new();
    public List<string> Parts { get; set; } = new();
    public List<string> Criteria { get; set; } = new();
    public List<string> VocabularySets { get; set; } = new();
}

public class DashboardStatsResponse
{
    public string TargetLevel { get; set; } = string.Empty;
    public string EstimatedCurrentLevel { get; set; } = string.Empty;
    public int TotalPracticeSessions { get; set; }
    public int TotalSubmissions { get; set; }
    public float AverageWritingScore { get; set; }
    public List<CriteriaAvgScore> CriteriaAverages { get; set; } = new();
    public List<ProgressPoint> ProgressChart { get; set; } = new();
    public DashboardSuggestions Suggestions { get; set; } = new();
}

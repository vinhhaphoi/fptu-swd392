using Application.DTOs.Dashboard;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Domain.Entities;

namespace Application.Services;

public class DashboardService : IDashboardService
{
    private readonly IUserRepository _userRepository;
    private readonly IUserProfileRepository _userProfileRepository;
    private readonly IPracticeSessionRepository _practiceSessionRepository;
    private readonly IUserSubmissionRepository _submissionRepository;
    private readonly ITopicRepository _topicRepository;
    private readonly IExamStructureRepository _examStructureRepository;
    private readonly IPartRepository _partRepository;

    public DashboardService(
        IUserRepository userRepository,
        IUserProfileRepository userProfileRepository,
        IPracticeSessionRepository practiceSessionRepository,
        IUserSubmissionRepository submissionRepository,
        ITopicRepository topicRepository,
        IExamStructureRepository examStructureRepository,
        IPartRepository partRepository)
    {
        _userRepository = userRepository;
        _userProfileRepository = userProfileRepository;
        _practiceSessionRepository = practiceSessionRepository;
        _submissionRepository = submissionRepository;
        _topicRepository = topicRepository;
        _examStructureRepository = examStructureRepository;
        _partRepository = partRepository;
    }

    public async Task<DashboardStatsResponse> GetUserStatsAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) throw new InvalidOperationException("User not found");

        var profile = await _userProfileRepository.GetByUserIdAsync(userId);
        var practiceSessions = await _practiceSessionRepository.GetByUserIdAsync(userId);
        var submissions = await _submissionRepository.GetByUserIdAsync(userId);
        
        // Get all submission scores for analytics
        var allScores = submissions
            .SelectMany(s => s.SubmissionScores)
            .OrderBy(ss => ss.CreatedAt)
            .ToList();

        var criteriaAverages = allScores
            .SelectMany(ss => ss.CriteriaScores)
            .GroupBy(cs => cs.Criteria?.Name ?? "Unknown")
            .Select(g => new CriteriaAvgScore
            {
                CriteriaName = g.Key,
                AverageScore = g.Average(cs => cs.Score ?? 0)
            })
            .OrderBy(c => c.AverageScore)
            .ToList();

        var progressChart = allScores
            .Select(ss => new ProgressPoint
            {
                Date = ss.CreatedAt,
                Score = ss.OverallScore
            })
            .ToList();

        var avgScore = allScores.Any() ? allScores.Average(ss => ss.OverallScore) : 0;

        // Suggestions logic
        var suggestions = new DashboardSuggestions();
        
        // 1. Topics not yet practiced in target level
        var submittedTopicIds = practiceSessions.Select(ps => ps.TopicId).Where(id => id.HasValue).Select(id => id!.Value).Distinct().ToList();
        var firstPartId = (await _examStructureRepository.GetAllAsync()).FirstOrDefault() is { } es
            ? (await _partRepository.GetByExamStructureIdAsync(es.Id)).FirstOrDefault()?.Id
            : null;
        var targetLevelTopics = firstPartId.HasValue
            ? await _topicRepository.GetByPartIdAsync(firstPartId.Value)
            : new List<Topic>();
        suggestions.Topics = targetLevelTopics
            .Where(t => !submittedTopicIds.Contains(t.Id))
            .Take(2)
            .Select(t => t.Title)
            .ToList();

        // 2. Weakest criteria
        if (criteriaAverages.Any())
        {
            suggestions.Criteria = criteriaAverages.Take(2).Select(c => c.CriteriaName).ToList();
        }

        return new DashboardStatsResponse
        {
            TargetLevel = user.TargetLevel?.Name ?? "N/A",
            EstimatedCurrentLevel = profile?.EstimatedBandScore.ToString() ?? "0.0",
            TotalPracticeSessions = practiceSessions.Count,
            TotalSubmissions = submissions.Count,
            AverageWritingScore = (float)avgScore,
            CriteriaAverages = criteriaAverages,
            ProgressChart = progressChart,
            Suggestions = suggestions
        };
    }
}

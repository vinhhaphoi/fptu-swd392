using Application.DTOs.Evaluation;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Domain.Entities;

namespace Application.Services;

public class AIEvaluationService : IAIEvaluationService
{
    private readonly IUserSubmissionRepository _submissionRepository;
    private readonly IPracticeSessionRepository _sessionRepository;
    private readonly ISubmissionScoreRepository _scoreRepository;
    private readonly ICriteriaScoreRepository _criteriaScoreRepository;
    private readonly IAIFeedbackRepository _feedbackRepository;
    private readonly IRubricRepository _rubricRepository;
    private readonly IScoringCriteriaRepository _criteriaRepository;
    private readonly IUserProfileRepository _userProfileRepository;
    private readonly IUserTopicProgressRepository _topicProgressRepository;
    private readonly ILearningPathService _learningPathService;

    public AIEvaluationService(
        IUserSubmissionRepository submissionRepository,
        IPracticeSessionRepository sessionRepository,
        ISubmissionScoreRepository scoreRepository,
        ICriteriaScoreRepository criteriaScoreRepository,
        IAIFeedbackRepository feedbackRepository,
        IRubricRepository rubricRepository,
        IScoringCriteriaRepository criteriaRepository,
        IUserProfileRepository userProfileRepository,
        IUserTopicProgressRepository topicProgressRepository,
        ILearningPathService learningPathService)
    {
        _submissionRepository = submissionRepository;
        _sessionRepository = sessionRepository;
        _scoreRepository = scoreRepository;
        _criteriaScoreRepository = criteriaScoreRepository;
        _feedbackRepository = feedbackRepository;
        _rubricRepository = rubricRepository;
        _criteriaRepository = criteriaRepository;
        _userProfileRepository = userProfileRepository;
        _topicProgressRepository = topicProgressRepository;
        _learningPathService = learningPathService;
    }

    public async Task<EvaluationResponse> EvaluateSubmissionAsync(Guid submissionId)
    {
        var submission = await _submissionRepository.GetByIdAsync(submissionId);
        if (submission == null) throw new InvalidOperationException("Submission not found");

        var session = await _sessionRepository.GetByIdAsync(submission.PracticeSessionId);
        if (session == null) throw new InvalidOperationException("Practice session not found");

        if (session.Topic == null) throw new InvalidOperationException("Topic information missing from session");
        
        var rubric = (await _rubricRepository.GetByPartIdAsync(session.Topic.PartId))
            .FirstOrDefault(r => r.IsActive) ?? throw new InvalidOperationException("Active rubric not found for this part");

        var criteria = await _criteriaRepository.GetByRubricIdAsync(rubric.Id);

        var submissionScore = new SubmissionScore
        {
            Id = Guid.NewGuid(),
            SubmissionId = submissionId,
            OverallScore = 0,
            EstimatedBand = "6.5", // Mock AI prediction
            AiModelVersion = "gpt-4-turbo",
            CreatedAt = DateTime.UtcNow
        };

        var scores = new List<CriteriaScoreDto>();
        var feedbacks = new List<AIFeedbackDto>();

        float totalScore = 0;

        foreach (var c in criteria)
        {
            float mockScore = 7.0f; // Mock AI score
            totalScore += mockScore;

            var criteriaScore = new CriteriaScore
            {
                SubmissionScoreId = submissionScore.Id,
                CriteriaId = c.Id,
                Score = mockScore
            };
            await _criteriaScoreRepository.CreateAsync(criteriaScore);
            
            scores.Add(new CriteriaScoreDto
            {
                CriteriaId = c.Id,
                CriteriaName = c.Name,
                Score = mockScore
            });

            var aiFeedback = new AIFeedback
            {
                Id = Guid.NewGuid(),
                SubmissionId = submissionId,
                CriteriaId = c.Id,
                FeedbackText = $"Good performance in {c.Name}.",
                Suggestions = "Consider adding more transitions.",
                ImprovedVersion = "..."
            };
            await _feedbackRepository.CreateAsync(aiFeedback);

            feedbacks.Add(new AIFeedbackDto
            {
                CriteriaId = c.Id,
                FeedbackText = aiFeedback.FeedbackText,
                Suggestions = aiFeedback.Suggestions,
                ImprovedVersion = aiFeedback.ImprovedVersion
            });
        }

        // VSTEP Score Calculation: (Task1 + Task2 * 2) / 3
        // Note: In this mock implementation, we assume overallScore is calculated from two virtual tasks
        // For a single submission covering both, we might need a more complex structure (UserSubmission with Task1, Task2 fields)
        // But for now, we'll apply the rounding to the average criteria score.
        
        submissionScore.OverallScore = RoundToVstep(totalScore / criteria.Count);
        await _scoreRepository.CreateAsync(submissionScore);

        // Update learning path
        await _learningPathService.UpdatePlanAfterEvaluationAsync(session.UserId, submissionScore.OverallScore);

        // Adaptive Loop: Update user profile's estimated band score
        var profile = await _userProfileRepository.GetByUserIdAsync(session.UserId);
        if (profile != null)
        {
            profile.EstimatedBandScore = (profile.EstimatedBandScore + submissionScore.OverallScore) / 2;
            await _userProfileRepository.UpdateAsync(profile);
        }

        // Topic Progress tracking
        if (session.TopicId.HasValue)
        {
            var progress = await _topicProgressRepository.GetAsync(session.UserId, session.TopicId.Value);
            if (progress == null)
            {
                progress = new UserTopicProgress
                {
                    UserId = session.UserId,
                    TopicId = session.TopicId.Value,
                    BestBandScore = submissionScore.OverallScore.ToString("F1"),
                    AttemptsCount = 1,
                    LastAttemptAt = DateTime.UtcNow
                };
                await _topicProgressRepository.CreateAsync(progress);
            }
            else
            {
                progress.AttemptsCount++;
                progress.LastAttemptAt = DateTime.UtcNow;
                if (float.Parse(progress.BestBandScore) < submissionScore.OverallScore)
                {
                    progress.BestBandScore = submissionScore.OverallScore.ToString("F1");
                }
                await _topicProgressRepository.UpdateAsync(progress);
            }
        }

        return new EvaluationResponse
        {
            SubmissionId = submissionId,
            OverallScore = submissionScore.OverallScore,
            EstimatedBand = submissionScore.EstimatedBand,
            AiModelVersion = submissionScore.AiModelVersion,
            CriteriaScores = scores,
            Feedbacks = feedbacks,
            CreatedAt = submissionScore.CreatedAt
        };
    }

    public async Task<EvaluationResponse?> GetEvaluationResultAsync(Guid submissionId)
    {
        var submissionScore = await _scoreRepository.GetBySubmissionIdAsync(submissionId);
        if (submissionScore == null) return null;

        var feedbacks = await _feedbackRepository.GetBySubmissionIdAsync(submissionId);
        var criteriaScores = await _criteriaScoreRepository.GetBySubmissionScoreIdAsync(submissionScore.Id);

        return new EvaluationResponse
        {
            SubmissionId = submissionId,
            OverallScore = submissionScore.OverallScore,
            EstimatedBand = submissionScore.EstimatedBand,
            AiModelVersion = submissionScore.AiModelVersion,
            CriteriaScores = criteriaScores.Select(cs => new CriteriaScoreDto
            {
                CriteriaId = cs.CriteriaId,
                CriteriaName = cs.Criteria?.Name ?? "Unknown",
                Score = cs.Score ?? 0
            }).ToList(),
            Feedbacks = feedbacks.Select(f => new AIFeedbackDto
            {
                CriteriaId = f.CriteriaId,
                FeedbackText = f.FeedbackText,
                Suggestions = f.Suggestions,
                ImprovedVersion = f.ImprovedVersion
            }).ToList(),
            CreatedAt = submissionScore.CreatedAt
        };
    }

    private float RoundToVstep(float score)
    {
        // VSTEP rounding usually to nearest 0.5 or 0.25 depending on policy.
        // Standard .NET Math.Round to 0.5:
        return (float)Math.Round(score * 2, MidpointRounding.AwayFromZero) / 2;
    }
}

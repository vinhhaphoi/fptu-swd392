using Domain.Entities;

namespace Application.Interfaces.Services;

public interface ILearningPathService
{
    Task<LearningPlan> GenerateInitialPlanAsync(int userId, int targetLevelId);
    Task UpdatePlanAfterEvaluationAsync(int userId, float lastOverallScore);
    Task<LearningPlan?> GetUserPlanAsync(int userId);
}

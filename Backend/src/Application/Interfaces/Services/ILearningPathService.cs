using Domain.Entities;

namespace Application.Interfaces.Services;

public interface ILearningPathService
{
    Task<LearningPlan> GenerateInitialPlanAsync(Guid userId, Guid targetLevelId);
    Task UpdatePlanAfterEvaluationAsync(Guid userId, float lastOverallScore);
    Task<LearningPlan?> GetUserPlanAsync(Guid userId);
}

using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface ILearningPlanRepository
{
    Task<LearningPlan?> GetByUserIdAsync(int userId);
    Task<LearningPlan> CreateAsync(LearningPlan entity);
    Task<LearningPlan> UpdateAsync(LearningPlan entity);
}

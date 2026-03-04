using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Domain.Entities;

namespace Application.Services;

public class LearningPathService : ILearningPathService
{
    private readonly ILearningPlanRepository _planRepository;

    public LearningPathService(ILearningPlanRepository planRepository)
    {
        _planRepository = planRepository;
    }

    public async Task<LearningPlan> GenerateInitialPlanAsync(Guid userId, Guid targetLevelId)
    {
        var plan = new LearningPlan
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            TargetLevelId = targetLevelId,
            TotalRequiredSessions = 20, // Default for now
            CompletedSessions = 0,
            ProgressPercentage = 0,
            CreatedAt = DateTime.UtcNow
        };

        return await _planRepository.CreateAsync(plan);
    }

    public async Task UpdatePlanAfterEvaluationAsync(Guid userId, float lastOverallScore)
    {
        var plan = await _planRepository.GetByUserIdAsync(userId);
        if (plan == null) return;

        plan.CompletedSessions++;
        plan.ProgressPercentage = (float)plan.CompletedSessions / plan.TotalRequiredSessions * 100;
        
        // Simple adaptive logic based on score
        if (lastOverallScore < 4.0) // If below B1/B2 threshold
        {
            plan.WeakArea = "General Writing Foundations";
            plan.TotalRequiredSessions += 2; // Increase requirement for more practice
        }
        else if (lastOverallScore > 7.0)
        {
            plan.WeakArea = "Advanced Structures & Cohesion";
        }

        plan.UpdatedAt = DateTime.UtcNow;
        await _planRepository.UpdateAsync(plan);
    }

    public async Task<LearningPlan?> GetUserPlanAsync(Guid userId)
    {
        return await _planRepository.GetByUserIdAsync(userId);
    }
}

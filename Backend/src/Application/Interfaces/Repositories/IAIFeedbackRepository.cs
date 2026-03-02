using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IAIFeedbackRepository
{
    Task<List<AIFeedback>> GetBySubmissionIdAsync(int submissionId);
    Task<AIFeedback> CreateAsync(AIFeedback feedback);
}

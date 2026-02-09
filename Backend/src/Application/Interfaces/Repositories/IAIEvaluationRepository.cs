using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IAIEvaluationRepository
{
    Task<AIEvaluation?> GetBySubmissionIdAsync(Guid submissionId);
    Task<AIEvaluation?> GetByIdAsync(Guid id);
    Task<AIEvaluation> CreateAsync(AIEvaluation entity);
    Task<AIEvaluation> UpdateAsync(AIEvaluation entity);
}

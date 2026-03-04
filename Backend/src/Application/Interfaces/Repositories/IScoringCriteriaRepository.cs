using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IScoringCriteriaRepository
{
    Task<List<ScoringCriteria>> GetByRubricIdAsync(Guid rubricId);
    Task<ScoringCriteria?> GetByIdAsync(Guid id);
}

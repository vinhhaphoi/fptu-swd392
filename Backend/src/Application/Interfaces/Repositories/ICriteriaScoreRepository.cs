using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface ICriteriaScoreRepository
{
    Task<List<CriteriaScore>> GetBySubmissionScoreIdAsync(Guid submissionScoreId);
    Task<CriteriaScore> CreateAsync(CriteriaScore score);
}

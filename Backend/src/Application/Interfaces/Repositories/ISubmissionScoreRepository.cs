using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface ISubmissionScoreRepository
{
    Task<SubmissionScore?> GetBySubmissionIdAsync(int submissionId);
    Task<SubmissionScore> CreateAsync(SubmissionScore score);
    Task<SubmissionScore> UpdateAsync(SubmissionScore score);
}

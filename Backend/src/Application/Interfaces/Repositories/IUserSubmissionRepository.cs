using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IUserSubmissionRepository
{
    Task<List<UserSubmission>> GetByPracticeSessionIdAsync(Guid practiceSessionId);
    Task<UserSubmission?> GetByIdAsync(Guid id);
    Task<UserSubmission?> GetLatestVersionAsync(Guid practiceSessionId);
    Task<UserSubmission> CreateAsync(UserSubmission submission);
    Task<UserSubmission> UpdateAsync(UserSubmission submission);
    Task<List<UserSubmission>> GetByUserIdAsync(Guid userId);
}

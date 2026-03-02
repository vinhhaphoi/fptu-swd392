using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IUserSubmissionRepository
{
    Task<List<UserSubmission>> GetByPracticeSessionIdAsync(int practiceSessionId);
    Task<UserSubmission?> GetByIdAsync(int id);
    Task<UserSubmission?> GetLatestVersionAsync(int practiceSessionId);
    Task<UserSubmission> CreateAsync(UserSubmission submission);
    Task<UserSubmission> UpdateAsync(UserSubmission submission);
    Task<List<UserSubmission>> GetByUserIdAsync(int userId);
}

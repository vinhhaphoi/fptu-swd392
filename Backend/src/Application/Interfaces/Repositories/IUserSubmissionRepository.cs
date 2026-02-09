using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IUserSubmissionRepository
{
    Task<List<UserSubmission>> GetBySessionIdAsync(Guid sessionId);
    Task<List<UserSubmission>> GetByUserIdAsync(Guid userId);
    Task<UserSubmission?> GetByIdAsync(Guid id);
    Task<UserSubmission> CreateAsync(UserSubmission entity);
}

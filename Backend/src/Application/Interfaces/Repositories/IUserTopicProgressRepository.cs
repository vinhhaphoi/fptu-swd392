using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IUserTopicProgressRepository
{
    Task<UserTopicProgress?> GetAsync(Guid userId, Guid topicId);
    Task<List<UserTopicProgress>> GetByUserIdAsync(Guid userId);
    Task<UserTopicProgress> CreateAsync(UserTopicProgress progress);
    Task<UserTopicProgress> UpdateAsync(UserTopicProgress progress);
}

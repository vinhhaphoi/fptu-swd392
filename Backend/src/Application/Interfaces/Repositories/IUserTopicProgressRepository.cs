using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IUserTopicProgressRepository
{
    Task<UserTopicProgress?> GetAsync(int userId, Guid topicId);
    Task<List<UserTopicProgress>> GetByUserIdAsync(int userId);
    Task<UserTopicProgress> CreateAsync(UserTopicProgress progress);
    Task<UserTopicProgress> UpdateAsync(UserTopicProgress progress);
}

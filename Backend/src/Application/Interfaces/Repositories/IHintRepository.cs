using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IHintRepository
{
    Task<List<Hint>> GetByTopicAndLevelAsync(Guid topicId, int levelId);
    Task<Hint?> GetByIdAsync(int id);
    Task<Hint> CreateAsync(Hint entity);
    Task<Hint> UpdateAsync(Hint entity);
    Task DeleteAsync(int id);
}

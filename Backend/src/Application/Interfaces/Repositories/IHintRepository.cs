using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IHintRepository
{
    Task<List<Hint>> GetByTopicAndLevelAsync(Guid topicId, Guid levelId);
    Task<Hint?> GetByIdAsync(Guid id);
    Task<Hint> CreateAsync(Hint entity);
    Task<Hint> UpdateAsync(Hint entity);
    Task DeleteAsync(Guid id);
}

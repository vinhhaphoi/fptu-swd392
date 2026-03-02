using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface ITopicRepository
{
    /// <summary>Topics for writing/practice: active only, optional filter by part and/or level.</summary>
    Task<List<Topic>> GetActiveTopicsAsync(int? partId = null, int? levelId = null);
    Task<List<Topic>> GetByPartIdAsync(int partId);
    Task<Topic?> GetByIdAsync(Guid id);
    Task<Topic> CreateAsync(Topic entity);
    Task<Topic> UpdateAsync(Topic entity);
    Task DeleteAsync(Guid id);
}

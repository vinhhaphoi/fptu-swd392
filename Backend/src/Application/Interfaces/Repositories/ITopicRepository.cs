using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface ITopicRepository
{
    Task<List<Topic>> GetByPartIdAsync(Guid partId);
    Task<Topic?> GetByIdAsync(Guid id);
    Task<Topic> CreateAsync(Topic entity);
    Task<Topic> UpdateAsync(Topic entity);
    Task DeleteAsync(Guid id);
}

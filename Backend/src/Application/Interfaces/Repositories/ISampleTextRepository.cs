using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface ISampleTextRepository
{
    Task<List<SampleText>> GetByTopicAndLevelAsync(Guid topicId, Guid levelId);
    Task<SampleText?> GetByIdAsync(Guid id);
    Task<SampleText> CreateAsync(SampleText entity);
    Task<SampleText> UpdateAsync(SampleText entity);
    Task DeleteAsync(Guid id);
}

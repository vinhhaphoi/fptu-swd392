using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface ISentenceStructureRepository
{
    Task<List<SentenceStructure>> GetByTopicAndLevelAsync(Guid topicId, Guid levelId);
    Task<SentenceStructure> CreateAsync(SentenceStructure structure);
    Task<SentenceStructure> UpdateAsync(SentenceStructure structure);
    Task DeleteAsync(Guid id);
}

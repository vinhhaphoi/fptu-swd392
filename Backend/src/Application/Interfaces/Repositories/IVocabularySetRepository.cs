using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IVocabularySetRepository
{
    Task<List<VocabularySet>> GetByTopicAndLevelAsync(Guid topicId, Guid levelId);
    Task<VocabularySet?> GetByIdAsync(Guid id);
    Task<VocabularySet> CreateAsync(VocabularySet entity);
    Task<VocabularySet> UpdateAsync(VocabularySet entity);
    Task DeleteAsync(Guid id);
}

using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface ITopicVocabularySetRepository
{
    Task<List<TopicVocabularySet>> GetByTopicIdAsync(Guid topicId);
    Task<List<TopicVocabularySet>> GetByVocabularySetIdAsync(Guid vocabularySetId);
    Task CreateAsync(TopicVocabularySet mapping);
    Task DeleteAsync(Guid topicId, Guid vocabularySetId);
}

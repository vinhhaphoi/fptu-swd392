using Application.DTOs.Learning;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;

namespace Application.Services;

public class LearningService : ILearningService
{
    private readonly IVocabularySetRepository _vocabSetRepository;
    private readonly ISentenceStructureRepository _sentenceStructureRepository;
    private readonly ISampleTextRepository _sampleTextRepository;

    public LearningService(
        IVocabularySetRepository vocabSetRepository,
        ISentenceStructureRepository sentenceStructureRepository,
        ISampleTextRepository sampleTextRepository)
    {
        _vocabSetRepository = vocabSetRepository;
        _sentenceStructureRepository = sentenceStructureRepository;
        _sampleTextRepository = sampleTextRepository;
    }

    public async Task<TopicLearningResourcesResponse> GetTopicResourcesAsync(Guid topicId, Guid levelId)
    {
        var vocabSets = await _vocabSetRepository.GetByTopicAndLevelAsync(topicId, levelId);
        var sentenceStructures = await _sentenceStructureRepository.GetByTopicAndLevelAsync(topicId, levelId);
        var sampleTexts = await _sampleTextRepository.GetByTopicAndLevelAsync(topicId, levelId);

        return new TopicLearningResourcesResponse
        {
            TopicId = topicId,
            VocabularySets = vocabSets.Select(s => new VocabularySetResponse
            {
                Id = s.Id,
                Name = s.Name,
                VocabularyItems = s.VocabularyItems.Select(v => new VocabularyItemResponse
                {
                    Id = v.Id,
                    Word = v.Word,
                    Meaning = v.Meaning,
                    Example = v.Example
                }).ToList()
            }).ToList(),
            SentenceStructures = sentenceStructures.Select(st => new SentenceStructureResponse
            {
                Id = st.Id,
                StructurePattern = st.StructurePattern,
                Explanation = st.Explanation
            }).ToList(),
            SampleTexts = sampleTexts.Select(t => new SampleTextResponse
            {
                Id = t.Id,
                Content = t.Content,
                SampleBandScore = t.SampleBandScore,
                Version = t.Version
            }).ToList()
        };
    }
}

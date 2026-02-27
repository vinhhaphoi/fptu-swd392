namespace Application.DTOs.Learning;

public class TopicLearningResourcesResponse
{
    public Guid TopicId { get; set; }
    public List<VocabularySetResponse> VocabularySets { get; set; } = new();
    public List<SentenceStructureResponse> SentenceStructures { get; set; } = new();
    public List<SampleTextResponse> SampleTexts { get; set; } = new();
}

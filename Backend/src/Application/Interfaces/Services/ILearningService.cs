using Application.DTOs.Learning;

namespace Application.Interfaces.Services;

public interface ILearningService
{
    Task<TopicLearningResourcesResponse> GetTopicResourcesAsync(Guid topicId, int levelId);
}

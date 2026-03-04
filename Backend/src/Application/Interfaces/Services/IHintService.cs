using Application.DTOs.Learning;

namespace Application.Interfaces.Services;

public interface IHintService
{
    Task<List<HintResponse>> GetHintsAsync(Guid topicId, Guid levelId);
}

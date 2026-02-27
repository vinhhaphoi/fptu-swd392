using Application.DTOs.Practice;

namespace Application.Interfaces.Services;

public interface IPracticeSessionService
{
    Task<PracticeSessionResponse> StartSessionAsync(Guid userId, StartSessionRequest request);
    Task<PracticeSessionResponse> GetSessionAsync(Guid sessionId);
    Task<bool> EndSessionAsync(Guid sessionId);
}

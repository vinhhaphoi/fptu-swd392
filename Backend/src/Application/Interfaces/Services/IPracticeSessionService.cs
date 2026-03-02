using Application.DTOs.Practice;

namespace Application.Interfaces.Services;

public interface IPracticeSessionService
{
    Task<PracticeSessionResponse> StartSessionAsync(int userId, StartSessionRequest request);
    Task<PracticeSessionResponse> GetSessionAsync(int sessionId);
    Task<bool> EndSessionAsync(int sessionId);
}

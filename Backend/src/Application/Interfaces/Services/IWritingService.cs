using Application.DTOs.Writing;

namespace Application.Interfaces.Services;

public interface IWritingService
{
    Task<UserSubmissionResponse> SaveSubmissionAsync(SaveSubmissionRequest request);
    Task<List<UserSubmissionResponse>> GetSubmissionHistoryAsync(int practiceSessionId);
    Task<UserSubmissionResponse?> GetLatestSubmissionAsync(int practiceSessionId);
}

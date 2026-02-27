using Application.DTOs.Writing;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Domain.Entities;

namespace Application.Services;

public class WritingService : IWritingService
{
    private readonly IUserSubmissionRepository _submissionRepository;

    public WritingService(IUserSubmissionRepository submissionRepository)
    {
        _submissionRepository = submissionRepository;
    }

    public async Task<UserSubmissionResponse> SaveSubmissionAsync(SaveSubmissionRequest request)
    {
        var latest = await _submissionRepository.GetLatestVersionAsync(request.PracticeSessionId);
        int nextVersion = (latest?.VersionNumber ?? 0) + 1;

        var submission = new UserSubmission
        {
            Id = Guid.NewGuid(),
            PracticeSessionId = request.PracticeSessionId,
            VersionNumber = nextVersion,
            IsFinal = request.IsFinal,
            SubmissionText = request.SubmissionText,
            WordCount = CountWords(request.SubmissionText),
            WritingTimeSeconds = request.WritingTimeSeconds,
            CreatedAt = DateTime.UtcNow
        };

        await _submissionRepository.CreateAsync(submission);

        return MapToResponse(submission);
    }

    public async Task<List<UserSubmissionResponse>> GetSubmissionHistoryAsync(Guid practiceSessionId)
    {
        var history = await _submissionRepository.GetByPracticeSessionIdAsync(practiceSessionId);
        return history.OrderByDescending(s => s.VersionNumber).Select(MapToResponse).ToList();
    }

    public async Task<UserSubmissionResponse?> GetLatestSubmissionAsync(Guid practiceSessionId)
    {
        var latest = await _submissionRepository.GetLatestVersionAsync(practiceSessionId);
        return latest != null ? MapToResponse(latest) : null;
    }

    private int CountWords(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return 0;
        return text.Split(new[] { ' ', '\r', '\n', '\t' }, StringSplitOptions.RemoveEmptyEntries).Length;
    }

    private UserSubmissionResponse MapToResponse(UserSubmission s)
    {
        return new UserSubmissionResponse
        {
            Id = s.Id,
            PracticeSessionId = s.PracticeSessionId,
            VersionNumber = s.VersionNumber,
            IsFinal = s.IsFinal,
            SubmissionText = s.SubmissionText,
            WordCount = s.WordCount,
            WritingTimeSeconds = s.WritingTimeSeconds,
            CreatedAt = s.CreatedAt
        };
    }
}

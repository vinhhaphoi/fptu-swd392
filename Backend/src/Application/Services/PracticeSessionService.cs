using Application.DTOs.Practice;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Domain.Entities;
using Domain.Enums;

namespace Application.Services;

public class PracticeSessionService : IPracticeSessionService
{
    private readonly IPracticeSessionRepository _sessionRepository;
    private readonly IPracticeModeRepository _modeRepository;
    private readonly IExamAttemptRepository _examAttemptRepository;

    public PracticeSessionService(
        IPracticeSessionRepository sessionRepository,
        IPracticeModeRepository modeRepository,
        IExamAttemptRepository examAttemptRepository)
    {
        _sessionRepository = sessionRepository;
        _modeRepository = modeRepository;
        _examAttemptRepository = examAttemptRepository;
    }

    public async Task<PracticeSessionResponse> StartSessionAsync(Guid userId, StartSessionRequest request)
    {
        var mode = await _modeRepository.GetByIdAsync(request.PracticeModeId);
        if (mode == null) throw new InvalidOperationException("Invalid practice mode");

        Guid? examAttemptId = null;

        // If it's a mock exam (assuming mode code 'MOCK' or similar), create an attempt
        if (mode.Code == "MOCK_EXAM" && request.ExamStructureId.HasValue)
        {
            var attempt = new ExamAttempt
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ExamStructureId = request.ExamStructureId.Value,
                OverallScore = 0,
                Status = "IN_PROGRESS",
                StartedAt = DateTime.UtcNow
            };
            await _examAttemptRepository.CreateAsync(attempt);
            examAttemptId = attempt.Id;
        }

        var session = new PracticeSession
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            PracticeModeId = request.PracticeModeId,
            TopicId = request.TopicId,
            ExamAttemptId = examAttemptId,
            Status = WritingSessionStatus.InProgress,
            StartedAt = DateTime.UtcNow
        };

        await _sessionRepository.CreateAsync(session);

        return new PracticeSessionResponse
        {
            Id = session.Id,
            UserId = session.UserId,
            ModeCode = mode.Code,
            TopicId = session.TopicId,
            PracticeModeId = session.PracticeModeId,
            ExamAttemptId = session.ExamAttemptId,
            Status = session.Status.ToString(),
            StartedAt = session.StartedAt
        };
    }

    public async Task<PracticeSessionResponse> GetSessionAsync(Guid sessionId)
    {
        var session = await _sessionRepository.GetByIdAsync(sessionId);
        if (session == null) throw new InvalidOperationException("Session not found");

        return new PracticeSessionResponse
        {
            Id = session.Id,
            UserId = session.UserId,
            ModeCode = session.PracticeMode?.Code ?? "UNKNOWN",
            TopicId = session.TopicId,
            PracticeModeId = session.PracticeModeId,
            ExamAttemptId = session.ExamAttemptId,
            Status = session.Status.ToString(),
            StartedAt = session.StartedAt
        };
    }

    public async Task<bool> EndSessionAsync(Guid sessionId)
    {
        var session = await _sessionRepository.GetByIdAsync(sessionId);
        if (session == null) return false;

        session.Status = WritingSessionStatus.Completed;
        session.SubmittedAt = DateTime.UtcNow;
        await _sessionRepository.UpdateAsync(session);
        return true;
    }
}

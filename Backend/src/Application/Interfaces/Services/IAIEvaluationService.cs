using Application.DTOs.Evaluation;

namespace Application.Interfaces.Services;

public interface IAIEvaluationService
{
    Task<EvaluationResponse> EvaluateSubmissionAsync(Guid submissionId);
    Task<EvaluationResponse?> GetEvaluationResultAsync(Guid submissionId);
}

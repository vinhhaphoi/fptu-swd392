using Application.DTOs.Evaluation;

namespace Application.Interfaces.Services;

public interface IAIEvaluationService
{
    Task<EvaluationResponse> EvaluateSubmissionAsync(int submissionId);
    Task<EvaluationResponse?> GetEvaluationResultAsync(int submissionId);
}

using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IExamAttemptRepository
{
    Task<ExamAttempt?> GetByIdAsync(Guid id);
    Task<List<ExamAttempt>> GetByUserIdAsync(int userId);
    Task<ExamAttempt> CreateAsync(ExamAttempt attempt);
    Task<ExamAttempt> UpdateAsync(ExamAttempt attempt);
}

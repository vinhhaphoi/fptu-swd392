using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IPracticeSessionRepository
{
    Task<List<PracticeSession>> GetByUserIdAsync(Guid userId);
    Task<PracticeSession?> GetByIdAsync(Guid id);
    Task<PracticeSession> CreateAsync(PracticeSession entity);
    Task<PracticeSession> UpdateAsync(PracticeSession entity);
}

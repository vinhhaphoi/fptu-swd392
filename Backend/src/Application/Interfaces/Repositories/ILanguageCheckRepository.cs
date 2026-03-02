using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface ILanguageCheckRepository
{
    Task<LanguageCheck?> GetByUserSubmissionIdAsync(int userSubmissionId);
    Task<LanguageCheck> CreateAsync(LanguageCheck entity);
}

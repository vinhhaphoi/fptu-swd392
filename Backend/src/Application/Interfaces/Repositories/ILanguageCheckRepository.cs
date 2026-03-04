using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface ILanguageCheckRepository
{
    Task<LanguageCheck?> GetByUserSubmissionIdAsync(Guid userSubmissionId);
    Task<LanguageCheck> CreateAsync(LanguageCheck entity);
}

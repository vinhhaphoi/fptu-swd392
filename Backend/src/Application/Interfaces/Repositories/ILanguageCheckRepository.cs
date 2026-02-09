using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface ILanguageCheckRepository
{
    Task<LanguageCheck?> GetBySubmissionIdAsync(Guid submissionId);
    Task<LanguageCheck> CreateAsync(LanguageCheck entity);
}

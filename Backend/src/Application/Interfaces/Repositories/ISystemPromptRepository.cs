using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface ISystemPromptRepository
{
    Task<SystemPrompt?> GetActivePromptAsync(Guid partId, Guid levelId, string purposeCode);
    Task<List<SystemPrompt>> GetAllAsync();
    Task<SystemPrompt?> GetByIdAsync(Guid id);
    Task<SystemPrompt> CreateAsync(SystemPrompt entity);
    Task UpdateAsync(SystemPrompt entity);
}

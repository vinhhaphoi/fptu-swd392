using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IRubricRepository
{
    Task<Rubric?> GetByIdAsync(Guid id);
    Task<List<Rubric>> GetByPartIdAsync(Guid partId);
    Task<Rubric> CreateAsync(Rubric rubric);
    Task<Rubric> UpdateAsync(Rubric rubric);
}

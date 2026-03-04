using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface ILevelRepository
{
    Task<List<Level>> GetAllAsync();
    Task<Level?> GetByIdAsync(Guid id);
}

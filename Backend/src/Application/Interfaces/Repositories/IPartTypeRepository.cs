using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IPartTypeRepository
{
    Task<List<PartType>> GetAllAsync();
    Task<PartType?> GetByIdAsync(Guid id);
    Task<PartType> CreateAsync(PartType entity);
}

using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IPartRepository
{
    Task<List<Part>> GetByExamStructureIdAsync(Guid examStructureId);
    Task<Part?> GetByIdAsync(Guid id);
    Task<Part> CreateAsync(Part entity);
    Task<Part> UpdateAsync(Part entity);
    Task DeleteAsync(Guid id);
}

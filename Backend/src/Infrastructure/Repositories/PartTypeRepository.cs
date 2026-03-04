using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class PartTypeRepository : IPartTypeRepository
{
    private readonly ApplicationDbContext _context;

    public PartTypeRepository(ApplicationDbContext context) => _context = context;

    public async Task<List<PartType>> GetAllAsync() =>
        await _context.PartTypes.AsNoTracking().OrderBy(x => x.Code).ToListAsync();

    public async Task<PartType?> GetByIdAsync(Guid id) =>
        await _context.PartTypes.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);

    public async Task<PartType> CreateAsync(PartType entity)
    {
        _context.PartTypes.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }
}

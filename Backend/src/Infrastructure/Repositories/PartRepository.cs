using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class PartRepository : IPartRepository
{
    private readonly ApplicationDbContext _context;

    public PartRepository(ApplicationDbContext context) => _context = context;

    public async Task<List<Part>> GetByExamStructureIdAsync(Guid examStructureId) =>
        await _context.Parts.AsNoTracking().Where(x => x.ExamStructureId == examStructureId).ToListAsync();

    public async Task<Part?> GetByIdAsync(Guid id) => await _context.Parts.FindAsync(id);

    public async Task<Part> CreateAsync(Part entity)
    {
        _context.Parts.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<Part> UpdateAsync(Part entity)
    {
        _context.Parts.Update(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task DeleteAsync(Guid id)
    {
        var e = await _context.Parts.FindAsync(id);
        if (e != null) { _context.Parts.Remove(e); await _context.SaveChangesAsync(); }
    }
}

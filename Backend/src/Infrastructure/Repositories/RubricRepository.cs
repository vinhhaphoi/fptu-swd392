using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class RubricRepository : IRubricRepository
{
    private readonly ApplicationDbContext _context;

    public RubricRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Rubric>> GetByPartIdAsync(Guid partId)
    {
        return await _context.Rubrics.Where(r => r.PartId == partId).ToListAsync();
    }

    public async Task<Rubric?> GetByIdAsync(Guid id)
    {
        return await _context.Rubrics.FindAsync(id);
    }

    public async Task<Rubric> CreateAsync(Rubric rubric)
    {
        _context.Rubrics.Add(rubric);
        await _context.SaveChangesAsync();
        return rubric;
    }

    public async Task<Rubric> UpdateAsync(Rubric rubric)
    {
        _context.Rubrics.Update(rubric);
        await _context.SaveChangesAsync();
        return rubric;
    }
}

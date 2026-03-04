using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class LearningPlanRepository : ILearningPlanRepository
{
    private readonly ApplicationDbContext _context;

    public LearningPlanRepository(ApplicationDbContext context) => _context = context;

    public async Task<LearningPlan?> GetByUserIdAsync(Guid userId) =>
        await _context.Set<LearningPlan>()
            .Include(p => p.TargetLevel)
            .FirstOrDefaultAsync(x => x.UserId == userId);

    public async Task<LearningPlan> CreateAsync(LearningPlan entity)
    {
        _context.Set<LearningPlan>().Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<LearningPlan> UpdateAsync(LearningPlan entity)
    {
        _context.Set<LearningPlan>().Update(entity);
        await _context.SaveChangesAsync();
        return entity;
    }
}

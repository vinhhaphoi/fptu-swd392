using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class UserErrorStatisticRepository : IUserErrorStatisticRepository
{
    private readonly ApplicationDbContext _context;

    public UserErrorStatisticRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserErrorStatistic>> GetByUserIdAsync(Guid userId)
    {
        return await _context.UserErrorStatistics.AsNoTracking().Where(s => s.UserId == userId).ToListAsync();
    }

    public async Task<UserErrorStatistic?> GetAsync(Guid userId, Guid criteriaId, Guid partId, Guid levelId)
    {
        return await _context.UserErrorStatistics
            .FirstOrDefaultAsync(x => x.UserId == userId && x.CriteriaId == criteriaId && x.PartId == partId && x.LevelId == levelId);
    }

    public async Task<UserErrorStatistic> CreateAsync(UserErrorStatistic statistic)
    {
        _context.UserErrorStatistics.Add(statistic);
        await _context.SaveChangesAsync();
        return statistic;
    }

    public async Task<UserErrorStatistic> UpdateAsync(UserErrorStatistic statistic)
    {
        _context.UserErrorStatistics.Update(statistic);
        await _context.SaveChangesAsync();
        return statistic;
    }

    public async Task<UserErrorStatistic> IncrementErrorCountAsync(Guid userId, Guid criteriaId, Guid partId, Guid levelId)
    {
        var existing = await _context.UserErrorStatistics
            .FirstOrDefaultAsync(s => s.UserId == userId && s.CriteriaId == criteriaId && s.PartId == partId && s.LevelId == levelId);
        
        if (existing == null)
        {
            existing = new UserErrorStatistic
            {
                UserId = userId,
                CriteriaId = criteriaId,
                PartId = partId,
                LevelId = levelId,
                OccurrenceCount = 1,
                LastUpdated = DateTime.UtcNow
            };
            _context.UserErrorStatistics.Add(existing);
        }
        else
        {
            existing.OccurrenceCount++;
            existing.LastUpdated = DateTime.UtcNow;
        }
        await _context.SaveChangesAsync();
        return existing;
    }
}

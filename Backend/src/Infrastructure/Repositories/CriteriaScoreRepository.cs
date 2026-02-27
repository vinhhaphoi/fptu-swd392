using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class CriteriaScoreRepository : ICriteriaScoreRepository
{
    private readonly ApplicationDbContext _context;

    public CriteriaScoreRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<CriteriaScore>> GetBySubmissionScoreIdAsync(Guid submissionScoreId)
    {
        return await _context.CriteriaScores
            .Include(cs => cs.Criteria)
            .Where(cs => cs.SubmissionScoreId == submissionScoreId)
            .ToListAsync();
    }

    public async Task<CriteriaScore> CreateAsync(CriteriaScore score)
    {
        _context.CriteriaScores.Add(score);
        await _context.SaveChangesAsync();
        return score;
    }
}

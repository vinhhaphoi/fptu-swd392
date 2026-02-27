using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class SubmissionScoreRepository : ISubmissionScoreRepository
{
    private readonly ApplicationDbContext _context;

    public SubmissionScoreRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<SubmissionScore?> GetBySubmissionIdAsync(Guid submissionId)
    {
        return await _context.SubmissionScores
            .Include(ss => ss.CriteriaScores)
            .FirstOrDefaultAsync(ss => ss.SubmissionId == submissionId);
    }

    public async Task<SubmissionScore> CreateAsync(SubmissionScore score)
    {
        _context.SubmissionScores.Add(score);
        await _context.SaveChangesAsync();
        return score;
    }

    public async Task<SubmissionScore> UpdateAsync(SubmissionScore score)
    {
        _context.SubmissionScores.Update(score);
        await _context.SaveChangesAsync();
        return score;
    }
}

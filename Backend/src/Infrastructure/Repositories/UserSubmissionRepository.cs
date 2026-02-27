using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class UserSubmissionRepository : IUserSubmissionRepository
{
    private readonly ApplicationDbContext _context;

    public UserSubmissionRepository(ApplicationDbContext context) => _context = context;

    public async Task<List<UserSubmission>> GetByPracticeSessionIdAsync(Guid practiceSessionId) =>
        await _context.UserSubmissions.AsNoTracking().Where(x => x.PracticeSessionId == practiceSessionId).OrderByDescending(x => x.SubmittedAt).ToListAsync();

    public async Task<UserSubmission?> GetLatestVersionAsync(Guid practiceSessionId) =>
        await _context.UserSubmissions
            .AsNoTracking()
            .Where(x => x.PracticeSessionId == practiceSessionId)
            .OrderByDescending(x => x.VersionNumber)
            .FirstOrDefaultAsync();

    public async Task<List<UserSubmission>> GetByUserIdAsync(Guid userId) =>
        await _context.UserSubmissions
            .AsNoTracking()
            .Include(x => x.PracticeSession)
            .Include(x => x.SubmissionScores)
                .ThenInclude(ss => ss.CriteriaScores)
                    .ThenInclude(cs => cs.Criteria)
            .Include(x => x.AIFeedbacks)
            .Where(x => x.PracticeSession != null && x.PracticeSession.UserId == userId)
            .OrderByDescending(x => x.SubmittedAt)
            .ToListAsync();

    public async Task<UserSubmission?> GetByIdAsync(Guid id) => await _context.UserSubmissions.FindAsync(id);

    public async Task<UserSubmission> CreateAsync(UserSubmission entity)
    {
        _context.UserSubmissions.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<UserSubmission> UpdateAsync(UserSubmission entity)
    {
        _context.UserSubmissions.Update(entity);
        await _context.SaveChangesAsync();
        return entity;
    }
}

using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class UserTopicProgressRepository : IUserTopicProgressRepository
{
    private readonly ApplicationDbContext _context;

    public UserTopicProgressRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<UserTopicProgress?> GetAsync(Guid userId, Guid topicId)
    {
        return await _context.UserTopicProgresses.FirstOrDefaultAsync(p => p.UserId == userId && p.TopicId == topicId);
    }

    public async Task<List<UserTopicProgress>> GetByUserIdAsync(Guid userId)
    {
        return await _context.UserTopicProgresses.Where(p => p.UserId == userId).ToListAsync();
    }

    public async Task<UserTopicProgress> CreateAsync(UserTopicProgress progress)
    {
        _context.UserTopicProgresses.Add(progress);
        await _context.SaveChangesAsync();
        return progress;
    }

    public async Task<UserTopicProgress> UpdateAsync(UserTopicProgress progress)
    {
        _context.UserTopicProgresses.Update(progress);
        await _context.SaveChangesAsync();
        return progress;
    }
}

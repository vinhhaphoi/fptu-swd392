using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class UserProfileRepository : IUserProfileRepository
{
    private readonly ApplicationDbContext _context;

    public UserProfileRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<UserProfile?> GetByUserIdAsync(Guid userId)
    {
        return await _context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
    }

    public async Task<UserProfile> CreateAsync(UserProfile profile)
    {
        _context.UserProfiles.Add(profile);
        await _context.SaveChangesAsync();
        return profile;
    }

    public async Task<UserProfile> UpdateAsync(UserProfile profile)
    {
        _context.UserProfiles.Update(profile);
        await _context.SaveChangesAsync();
        return profile;
    }
}

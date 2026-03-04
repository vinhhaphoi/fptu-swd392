using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ExamAttemptRepository : IExamAttemptRepository
{
    private readonly ApplicationDbContext _context;

    public ExamAttemptRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ExamAttempt?> GetByIdAsync(Guid id)
    {
        return await _context.ExamAttempts.FindAsync(id);
    }

    public async Task<List<ExamAttempt>> GetByUserIdAsync(Guid userId)
    {
        return await _context.ExamAttempts.Where(a => a.UserId == userId).ToListAsync();
    }

    public async Task<ExamAttempt> CreateAsync(ExamAttempt attempt)
    {
        _context.ExamAttempts.Add(attempt);
        await _context.SaveChangesAsync();
        return attempt;
    }

    public async Task<ExamAttempt> UpdateAsync(ExamAttempt attempt)
    {
        _context.ExamAttempts.Update(attempt);
        await _context.SaveChangesAsync();
        return attempt;
    }
}

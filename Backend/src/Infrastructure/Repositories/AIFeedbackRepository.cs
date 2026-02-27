using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class AIFeedbackRepository : IAIFeedbackRepository
{
    private readonly ApplicationDbContext _context;

    public AIFeedbackRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<AIFeedback>> GetBySubmissionIdAsync(Guid submissionId)
    {
        return await _context.AIFeedbacks
            .Where(f => f.SubmissionId == submissionId)
            .ToListAsync();
    }

    public async Task<AIFeedback> CreateAsync(AIFeedback feedback)
    {
        _context.AIFeedbacks.Add(feedback);
        await _context.SaveChangesAsync();
        return feedback;
    }
}

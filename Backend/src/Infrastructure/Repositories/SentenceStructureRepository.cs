using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class SentenceStructureRepository : ISentenceStructureRepository
{
    private readonly ApplicationDbContext _context;

    public SentenceStructureRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<SentenceStructure>> GetByTopicAndLevelAsync(Guid topicId, Guid levelId)
    {
        return await _context.SentenceStructures.Where(s => s.TopicId == topicId && s.LevelId == levelId).ToListAsync();
    }

    public async Task<SentenceStructure> CreateAsync(SentenceStructure structure)
    {
        _context.SentenceStructures.Add(structure);
        await _context.SaveChangesAsync();
        return structure;
    }

    public async Task<SentenceStructure> UpdateAsync(SentenceStructure structure)
    {
        _context.SentenceStructures.Update(structure);
        await _context.SaveChangesAsync();
        return structure;
    }

    public async Task DeleteAsync(Guid id)
    {
        var structure = await _context.SentenceStructures.FindAsync(id);
        if (structure != null)
        {
            _context.SentenceStructures.Remove(structure);
            await _context.SaveChangesAsync();
        }
    }
}

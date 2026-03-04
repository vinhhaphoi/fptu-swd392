using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class VocabularySetRepository : IVocabularySetRepository
{
    private readonly ApplicationDbContext _context;

    public VocabularySetRepository(ApplicationDbContext context) => _context = context;

    public async Task<List<VocabularySet>> GetByTopicAndLevelAsync(Guid topicId, Guid levelId) =>
        await _context.VocabularySets
            .AsNoTracking()
            .Include(x => x.VocabularyItems)
            .Where(x => x.LevelId == levelId && x.TopicVocabularySets.Any(tvs => tvs.TopicId == topicId))
            .ToListAsync();

    public async Task<VocabularySet?> GetByIdAsync(Guid id) => 
        await _context.VocabularySets
            .Include(x => x.VocabularyItems)
            .FirstOrDefaultAsync(x => x.Id == id);

    public async Task<VocabularySet> CreateAsync(VocabularySet entity)
    {
        _context.VocabularySets.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<VocabularySet> UpdateAsync(VocabularySet entity)
    {
        _context.VocabularySets.Update(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task DeleteAsync(Guid id)
    {
        var e = await _context.VocabularySets.FindAsync(id);
        if (e != null) { _context.VocabularySets.Remove(e); await _context.SaveChangesAsync(); }
    }
}

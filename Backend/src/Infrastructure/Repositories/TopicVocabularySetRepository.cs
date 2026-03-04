using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class TopicVocabularySetRepository : ITopicVocabularySetRepository
{
    private readonly ApplicationDbContext _context;

    public TopicVocabularySetRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<TopicVocabularySet>> GetByTopicIdAsync(Guid topicId)
    {
        return await _context.TopicVocabularySets.Where(t => t.TopicId == topicId).ToListAsync();
    }

    public async Task<List<TopicVocabularySet>> GetByVocabularySetIdAsync(Guid vocabularySetId)
    {
        return await _context.TopicVocabularySets.Where(t => t.VocabularySetId == vocabularySetId).ToListAsync();
    }

    public async Task CreateAsync(TopicVocabularySet mapping)
    {
        _context.TopicVocabularySets.Add(mapping);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid topicId, Guid vocabularySetId)
    {
        var mapping = await _context.TopicVocabularySets
            .FirstOrDefaultAsync(t => t.TopicId == topicId && t.VocabularySetId == vocabularySetId);
        if (mapping != null)
        {
            _context.TopicVocabularySets.Remove(mapping);
            await _context.SaveChangesAsync();
        }
    }
}

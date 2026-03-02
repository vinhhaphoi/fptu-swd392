using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class TopicRepository : ITopicRepository
{
    private readonly ApplicationDbContext _context;

    public TopicRepository(ApplicationDbContext context) => _context = context;

    public async Task<List<Topic>> GetActiveTopicsAsync(int? partId = null, int? levelId = null)
    {
        var q = _context.Topics.AsNoTracking().Where(x => x.IsActive);
        if (partId.HasValue) q = q.Where(x => x.PartId == partId.Value);
        if (levelId.HasValue) q = q.Where(x => x.LevelId == levelId.Value);
        return await q.OrderBy(x => x.PartId).ThenBy(x => x.LevelId).ThenBy(x => x.Title).ToListAsync();
    }

    public async Task<List<Topic>> GetByPartIdAsync(int partId) =>
        await _context.Topics.AsNoTracking().Where(x => x.PartId == partId).ToListAsync();

    public async Task<Topic?> GetByIdAsync(Guid id) => await _context.Topics.FindAsync(id);

    public async Task<Topic> CreateAsync(Topic entity)
    {
        _context.Topics.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<Topic> UpdateAsync(Topic entity)
    {
        _context.Topics.Update(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task DeleteAsync(Guid id)
    {
        var e = await _context.Topics.FindAsync(id);
        if (e != null) { _context.Topics.Remove(e); await _context.SaveChangesAsync(); }
    }
}

using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

/// <summary>
/// 📚 Topic and Learning Resources Management APIs
/// </summary>
/// <remarks>
/// APIs for managing writing topics, learning resources, and educational content.
/// Supports CRUD operations for topics and retrieval of associated learning materials.
/// </remarks>
[ApiController]
[Route("api/topics")]
public class TopicsController : ControllerBase
{
    private readonly ITopicRepository _repo;
    private readonly ILearningService _learningService;
    private readonly IHintService _hintService;

    public TopicsController(
        ITopicRepository repo,
        ILearningService learningService,
        IHintService hintService)
    {
        _repo = repo;
        _learningService = learningService;
        _hintService = hintService;
    }

    /// <summary>
    /// 📋 Get all topics by part ID
    /// </summary>
    /// <remarks>
    /// Retrieve all topics associated with a specific exam part.
    /// Used to organize topics by VSTEP exam sections.
    /// </remarks>
    /// <param name="partId">Part ID to filter topics</param>
    /// <returns>List of topics for the specified part</returns>
    [HttpGet("by-part/{partId:guid}")]
    public async Task<IActionResult> GetByPart(Guid partId) =>
        Ok(await _repo.GetByPartIdAsync(partId));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item == null ? NotFound() : Ok(item);
    }

    [HttpGet("{id:guid}/learning-resources/{levelId:guid}")]
    public async Task<IActionResult> GetLearningResources(Guid id, Guid levelId)
    {
        var resources = await _learningService.GetTopicResourcesAsync(id, levelId);
        return Ok(resources);
    }

    [HttpGet("{id:guid}/hints/{levelId:guid}")]
    public async Task<IActionResult> GetHints(Guid id, Guid levelId)
    {
        var hints = await _hintService.GetHintsAsync(id, levelId);
        return Ok(hints);
    }

    [HttpPost]
    [Authorize(Policy = "Authenticated")]
    public async Task<IActionResult> Create([FromBody] CreateTopicRequest request)
    {
        var entity = new Topic
        {
            PartId = request.PartId,
            Title = request.Title,
            Prompt = request.Prompt,
            Purpose = request.Purpose,
            RecipientRole = request.RecipientRole,
            LevelId = request.LevelId
        };
        var created = await _repo.CreateAsync(entity);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = "Authenticated")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreateTopicRequest request)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing == null) return NotFound();
        existing.PartId = request.PartId;
        existing.Title = request.Title;
        existing.Prompt = request.Prompt;
        existing.Purpose = request.Purpose;
        existing.RecipientRole = request.RecipientRole;
        existing.LevelId = request.LevelId;
        await _repo.UpdateAsync(existing);
        return Ok(existing);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing == null) return NotFound();
        await _repo.DeleteAsync(id);
        return NoContent();
    }
}

public class CreateTopicRequest
{
    public Guid PartId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Prompt { get; set; }
    public string? Purpose { get; set; }
    public string? RecipientRole { get; set; }
    public Guid LevelId { get; set; }
}

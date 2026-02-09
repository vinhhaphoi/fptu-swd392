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
    [HttpGet("by-part/{partId:int}")]
    public async Task<IActionResult> GetByPart(int partId) =>
        Ok(await _repo.GetByPartIdAsync(partId));

    /// <summary>
    /// 🔍 Get topic by ID
    /// </summary>
    /// <remarks>
    /// Retrieve detailed information for a specific topic by ID.
    /// Includes topic content, context, and metadata.
    /// </remarks>
    /// <param name="id">Topic ID</param>
    /// <returns>Topic details</returns>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item == null ? NotFound() : Ok(item);
    }

    /// <summary>
    /// 📖 Get learning resources for topic
    /// </summary>
    /// <remarks>
    /// Retrieve all learning resources (vocabulary sets, sample texts) for a specific topic at given difficulty level.
    /// Used for student learning and practice.
    /// 
    /// Example response:
    /// {
    ///   "topicId": 1,
    ///   "vocabularySets": [...],
    ///   "sampleTexts": [...]
    /// }
    /// </remarks>
    /// <param name="id">Topic ID</param>
    /// <param name="levelId">Difficulty level ID</param>
    /// <returns>Learning resources for the topic</returns>
    [HttpGet("{id:int}/learning-resources/{levelId:int}")]
    public async Task<IActionResult> GetLearningResources(int id, int levelId)
    {
        var resources = await _learningService.GetTopicResourcesAsync(id, levelId);
        return Ok(resources);
    }

    /// <summary>
    /// 💡 Get hints for topic
    /// </summary>
    /// <remarks>
    /// Retrieve helpful hints and guidance for a specific topic at given difficulty level.
    /// Provides writing tips and strategies for students.
    /// </remarks>
    /// <param name="id">Topic ID</param>
    /// <param name="levelId">Difficulty level ID</param>
    /// <returns>List of hints for the topic</returns>
    [HttpGet("{id:int}/hints/{levelId:int}")]
    public async Task<IActionResult> GetHints(int id, int levelId)
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
            TopicName = request.TopicName,
            Context = request.Context,
            Purpose = request.Purpose,
            RecipientRole = request.RecipientRole,
            DifficultyLevelId = request.DifficultyLevelId
        };
        var created = await _repo.CreateAsync(entity);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    [Authorize(Policy = "Authenticated")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateTopicRequest request)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing == null) return NotFound();
        existing.PartId = request.PartId;
        existing.TopicName = request.TopicName;
        existing.Context = request.Context;
        existing.Purpose = request.Purpose;
        existing.RecipientRole = request.RecipientRole;
        existing.DifficultyLevelId = request.DifficultyLevelId;
        await _repo.UpdateAsync(existing);
        return Ok(existing);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Delete(int id)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing == null) return NotFound();
        await _repo.DeleteAsync(id);
        return NoContent();
    }
}

/// <summary>
/// Request model for creating/updating topics
/// </summary>
public class CreateTopicRequest
{
    /// <summary>
    /// ID of the exam part this topic belongs to
    /// </summary>
    public int PartId { get; set; }
    
    /// <summary>
    /// Name of the topic (required)
    /// </summary>
    public string TopicName { get; set; } = string.Empty;
    
    /// <summary>
    /// Context or background information for the topic
    /// </summary>
    public string? Context { get; set; }
    
    /// <summary>
    /// Purpose or objective of the topic
    /// </summary>
    public string? Purpose { get; set; }
    
    /// <summary>
    /// Target recipient role for this topic
    /// </summary>
    public string? RecipientRole { get; set; }
    
    /// <summary>
    /// Difficulty level ID for this topic
    /// </summary>
    public int DifficultyLevelId { get; set; }
}

using Application.Interfaces.Repositories;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/practice-sessions")]
[Authorize]
public class PracticeSessionsController : ControllerBase
{
    private readonly IPracticeSessionRepository _repo;

    public PracticeSessionsController(IPracticeSessionRepository repo) => _repo = repo;

    private Guid? GetCurrentUserId()
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var id) ? id : null;
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMySessions()
    {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();
        return Ok(await _repo.GetByUserIdAsync(userId.Value));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var item = await _repo.GetByIdAsync(id);
        if (item == null) return NotFound();
        var userId = GetCurrentUserId();
        if (userId != item.UserId) return Forbid();
        return Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePracticeSessionRequest request)
    {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();
        var entity = new PracticeSession
        {
            UserId = userId.Value,
            PracticeModeId = request.PracticeModeId
        };
        var created = await _repo.CreateAsync(entity);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }
}

public class CreatePracticeSessionRequest
{
    public Guid PracticeModeId { get; set; }
}

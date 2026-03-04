using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/user-submissions")]
[Authorize]
public class UserSubmissionsController : ControllerBase
{
    private readonly IUserSubmissionRepository _repo;
    private readonly IPracticeSessionRepository _sessionRepo;
    private readonly IAIEvaluationService _evaluationService;

    public UserSubmissionsController(
        IUserSubmissionRepository repo,
        IPracticeSessionRepository sessionRepo,
        IAIEvaluationService evaluationService)
    {
        _repo = repo;
        _sessionRepo = sessionRepo;
        _evaluationService = evaluationService;
    }

    private Guid? GetCurrentUserId()
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var id) ? id : null;
    }

    [HttpGet("by-session/{sessionId:guid}")]
    public async Task<IActionResult> GetBySession(Guid sessionId)
    {
        var session = await _sessionRepo.GetByIdAsync(sessionId);
        if (session == null) return NotFound();
        var userId = GetCurrentUserId();
        if (userId == null || userId != session.UserId) return Forbid();
        return Ok(await _repo.GetByPracticeSessionIdAsync(sessionId));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var item = await _repo.GetByIdAsync(id);
        if (item == null) return NotFound();
        var session = await _sessionRepo.GetByIdAsync(item.PracticeSessionId);
        if (session == null) return NotFound();
        var userId = GetCurrentUserId();
        if (userId == null || userId != session.UserId) return Forbid();
        return Ok(item);
    }

    [HttpGet("{id:guid}/evaluation")]
    public async Task<IActionResult> GetEvaluation(Guid id)
    {
        var submission = await _repo.GetByIdAsync(id);
        if (submission == null) return NotFound();
        
        var session = await _sessionRepo.GetByIdAsync(submission.PracticeSessionId);
        if (session == null) return NotFound();
        
        var userId = GetCurrentUserId();
        if (userId == null || userId != session.UserId) return Forbid();

        try 
        {
            var evaluation = await _evaluationService.EvaluateSubmissionAsync(id);
            return Ok(evaluation);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserSubmissionRequest request)
    {
        var session = await _sessionRepo.GetByIdAsync(request.PracticeSessionId);
        if (session == null) return NotFound("Session not found");
        var userId = GetCurrentUserId();
        if (userId == null || userId != session.UserId) return Forbid();
        var entity = new UserSubmission
        {
            PracticeSessionId = request.PracticeSessionId,
            PartId = request.PartId,
            SubmissionText = request.SubmissionText,
            WordCount = request.WordCount ?? request.SubmissionText.Trim().Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries).Length
        };
        var created = await _repo.CreateAsync(entity);
        
        // Trigger evaluation immediately (optional, or can be called separately)
        var evaluation = await _evaluationService.EvaluateSubmissionAsync(created.Id);

        return CreatedAtAction(nameof(GetById), new { id = created.Id }, new { submission = created, evaluation });
    }
}

public class CreateUserSubmissionRequest
{
    public Guid PracticeSessionId { get; set; }
    public Guid? PartId { get; set; }
    public string SubmissionText { get; set; } = string.Empty;
    public int? WordCount { get; set; }
}

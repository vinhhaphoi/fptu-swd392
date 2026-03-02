using Application.DTOs.Practice;
using Application.DTOs.Writing;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/writing")]
[Authorize]
public class WritingController : ControllerBase
{
    private readonly IPracticeSessionService _sessionService;
    private readonly ITopicRepository _topicRepository;

    public WritingController(IPracticeSessionService sessionService, ITopicRepository topicRepository)
    {
        _sessionService = sessionService;
        _topicRepository = topicRepository;
    }

    /// <summary>
    /// Danh sách topic dùng cho màn hình writing/practice. Chỉ trả về topic đang active.
    /// </summary>
    /// <param name="level">LevelId (optional) - lọc theo level, ví dụ 1=A1, 2=A2...</param>
    /// <param name="part">PartId (optional) - lọc theo part, ví dụ 1=Task1, 2=Task2</param>
    [HttpGet("topics")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTopics([FromQuery] int? level, [FromQuery] int? part)
    {
        var list = await _topicRepository.GetActiveTopicsAsync(part, level);
        return Ok(list);
    }

    [HttpPost("session/start")]
    public async Task<IActionResult> StartSession([FromBody] StartSessionRequest request)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var session = await _sessionService.StartSessionAsync(userId, request);
        return Ok(session);
    }

    [HttpPost("session/submit")]
    public async Task<IActionResult> SubmitSession([FromBody] SubmitSessionRequest request)
    {
        // Logic to transition session state to Processing/Completed
        // Integration with WritingService to save final tasks
        return Ok(new { message = "Submission received and processing" });
    }
}

public class SubmitSessionRequest
{
    public Guid SessionId { get; set; }
    public string Task1 { get; set; } = string.Empty;
    public string Task2 { get; set; } = string.Empty;
}

using Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

/// <summary>
/// Import VSTEP questions from JSON (VSTEPQuestions.json) into Topics.
/// </summary>
[ApiController]
[Route("api/admin/seed")]
[Authorize(Policy = "AdminOnly")]
public class VstepImportController : ControllerBase
{
    private readonly IVstepQuestionImportService _importService;
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<VstepImportController> _logger;

    public VstepImportController(
        IVstepQuestionImportService importService,
        IWebHostEnvironment env,
        ILogger<VstepImportController> logger)
    {
        _importService = importService;
        _env = env;
        _logger = logger;
    }

    /// <summary>
    /// Import all questions from JSON/VSTEPQuestions.json into Topics (Part 1 and Part 2).
    /// Ensures VSTEP exam structure and parts exist. Requires Admin.
    /// </summary>
    [HttpPost("vstep-questions")]
    [ProducesResponseType(typeof(object), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]
    [ProducesResponseType(403)]
    public async Task<IActionResult> ImportVstepQuestions()
    {
        var path = Path.Combine(_env.ContentRootPath, "..", "..", "JSON", "VSTEPQuestions.json");
        path = Path.GetFullPath(path);
        if (!System.IO.File.Exists(path))
        {
            _logger.LogWarning("VSTEPQuestions.json not found at {Path}", path);
            return BadRequest(new { message = "VSTEPQuestions.json not found. Ensure file exists at Backend/JSON/VSTEPQuestions.json." });
        }
        try
        {
            var count = await _importService.ImportFromFileAsync(path);
            _logger.LogInformation("Imported {Count} VSTEP questions from JSON", count);
            return Ok(new { message = $"Imported {count} topics from VSTEPQuestions.json.", count });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Import failed: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during VSTEP import");
            return StatusCode(500, new { message = "Import failed. Check logs.", detail = ex.Message });
        }
    }
}

using Infrastructure.Data.DbContexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace API.Controllers;

/// <summary>
/// Các API cơ bản để test BE và kết nối database.
/// </summary>
[ApiController]
[Route("api")]
public class HealthController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public HealthController(ApplicationDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Ping API – kiểm tra backend đang chạy (không dùng DB).
    /// </summary>
    [HttpGet("ping")]
    public IActionResult Ping()
    {
        return Ok(new
        {
            message = "Pong",
            timestamp = DateTime.UtcNow,
            service = "VSTEP Writing System API"
        });
    }

    /// <summary>
    /// Kiểm tra kết nối PostgreSQL: có kết nối được không, thời gian phản hồi, số bản ghi levels (nếu có).
    /// </summary>
    [HttpGet("health/db")]
    public async Task<IActionResult> CheckDatabase(CancellationToken cancellationToken = default)
    {
        var sw = System.Diagnostics.Stopwatch.StartNew();
        try
        {
            var canConnect = await _db.Database.CanConnectAsync(cancellationToken);
            if (!canConnect)
            {
                sw.Stop();
                return StatusCode(503, new
                {
                    database = "disconnected",
                    message = "Cannot connect to database",
                    elapsedMs = sw.ElapsedMilliseconds,
                    timestamp = DateTime.UtcNow
                });
            }

            // Check if the levels table exists and has data
            var levelCount = await _db.Levels.CountAsync(cancellationToken);
            sw.Stop();

            return Ok(new
            {
                database = "connected",
                message = "PostgreSQL connection OK",
                elapsedMs = sw.ElapsedMilliseconds,
                levelCount,
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            sw.Stop();
            return StatusCode(503, new
            {
                database = "error",
                message = ex.Message,
                elapsedMs = sw.ElapsedMilliseconds,
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// Kiểm tra dữ liệu tham chiếu cần cho đăng ký người dùng.
    /// </summary>
    [HttpGet("health/refdata")]
    public async Task<IActionResult> CheckReferenceData(CancellationToken cancellationToken = default)
    {
        try
        {
            var levelsCount = await _db.Levels.CountAsync(cancellationToken);
            var levelExists = await _db.Levels.AnyAsync(cancellationToken);
            
            var result = new
            {
                levelsCount,
                hasLevels = levelExists,
                message = levelExists ? "Reference data exists - registration should work" : "Missing reference data - registration may fail",
                timestamp = DateTime.UtcNow
            };
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Error checking reference data",
                error = ex.Message,
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// Test kết nối DB trực tiếp bằng Npgsql (như yêu cầu)
    /// </summary>
    [HttpGet("health/direct-db-test")]
    public async Task<IActionResult> DirectDbTest(CancellationToken cancellationToken = default)
    {
        try
        {
            var connStr = _db.Database.GetConnectionString();
            using var conn = new NpgsqlConnection(connStr);
            await conn.OpenAsync(cancellationToken);
            
            // Test a simple query
            using var cmd = new NpgsqlCommand("SELECT 1", conn);
            var result = await cmd.ExecuteScalarAsync(cancellationToken);
            
            return Ok(new
            {
                message = "DB CONNECT OK",
                result = result?.ToString(),
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "DB CONNECT FAILED",
                error = ex.Message,
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// Thông tin môi trường + DB status (gọn để test nhanh).
    /// </summary>
    [HttpGet("health")]
    public async Task<IActionResult> Health(CancellationToken cancellationToken = default)
    {
        var dbOk = false;
        try
        {
            dbOk = await _db.Database.CanConnectAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = "error",
                error = ex.Message,
                stackTrace = ex.StackTrace
            });
        }

        return Ok(new
        {
            status = dbOk ? "healthy" : "degraded",
            environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production",
            database = dbOk ? "connected" : "disconnected",
            timestamp = DateTime.UtcNow
        });
    }

    /// <summary>
    /// Simple database connection test
    /// </summary>
    [HttpGet("health/simple")]
    public async Task<IActionResult> SimpleHealth(CancellationToken cancellationToken = default)
    {
        try
        {
            var canConnect = await _db.Database.CanConnectAsync(cancellationToken);
            return Ok(new
            {
                database = canConnect ? "connected" : "disconnected",
                message = canConnect ? "Database connection successful" : "Database connection failed"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                database = "error",
                message = ex.Message,
                stackTrace = ex.StackTrace
            });
        }
    }

}

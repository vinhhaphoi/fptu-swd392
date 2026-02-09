using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Application.Services;

public class JwtService : IJwtService
{
    private readonly IConfiguration _configuration;

    public JwtService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(Guid userId, string username, string email, string role)
    {
        var secretKey = _configuration["Jwt:SecretKey"] ?? throw new InvalidOperationException("Jwt:SecretKey is required");
        var issuer = _configuration["Jwt:Issuer"] ?? "VSTEP.Backend";
        var audience = _configuration["Jwt:Audience"] ?? "VSTEP.Client";
        var expirationMinutes = int.TryParse(_configuration["Jwt:ExpirationMinutes"], out var m) ? m : 60;

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Role, role)
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public int GetExpirationMinutes()
    {
        return int.TryParse(_configuration["Jwt:ExpirationMinutes"], out var m) ? m : 60;
    }
}

namespace Application.Interfaces.Services;

/// <summary>
/// Hashes and verifies passwords (BCrypt) for backend-only auth.
/// </summary>
public interface IPasswordHasher
{
    string Hash(string password);
    bool Verify(string password, string hash);
}

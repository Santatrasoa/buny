using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BunyApi.Models;
using Microsoft.IdentityModel.Tokens;

namespace BunyApi.Services;

public interface IAuthService
{
    string GenerateToken(User user);
    bool   VerifyPassword(string plaintext, string hash);
    string HashPassword(string plaintext);
}

public class AuthService(IConfiguration config) : IAuthService
{
    // Fallback identique à celui de Program.cs pour garantir la cohérence.
    // En production, Jwt:Key DOIT être défini dans les variables d'environnement
    // ou dans appsettings.json — ne jamais utiliser la valeur par défaut ci-dessous.
    private const string FallbackKey = "BunySecretKey_ChangeInProduction_2024!MinLength32Chars";

    private string JwtKey => config["Jwt:Key"] ?? FallbackKey;

    public string GenerateToken(User user)
    {
        var key     = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtKey));
        var creds   = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddDays(7);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email,          user.Email),
        };
        foreach (var role in user.RolesList)
            claims.Add(new Claim(ClaimTypes.Role, role));

        var token = new JwtSecurityToken(
            issuer:             config["Jwt:Issuer"],
            audience:           config["Jwt:Audience"],
            claims:             claims,
            expires:            expires,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public bool   VerifyPassword(string plaintext, string hash) =>
        BCrypt.Net.BCrypt.Verify(plaintext, hash);

    public string HashPassword(string plaintext) =>
        BCrypt.Net.BCrypt.HashPassword(plaintext);
}

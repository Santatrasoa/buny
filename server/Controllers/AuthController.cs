using BunyApi.DTOs;
using BunyApi.Repositories;
using BunyApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BunyApi.Controllers;

[ApiController]
[Route("api/auth")]
[Produces("application/json")]
public class AuthController(IUserRepository repo, IAuthService auth) : ControllerBase
{
    // POST /api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await repo.GetByEmailAsync(dto.Email);

        if (user is null || !auth.VerifyPassword(dto.Password, user.PasswordHash))
            return Unauthorized(new ErrorDto("Email ou mot de passe incorrect"));

        if (!user.Active)
            return Unauthorized(new ErrorDto("Compte désactivé"));

        var token = auth.GenerateToken(user);
        return Ok(new AuthResponseDto(token, user.ToDto()));
    }

    // GET /api/auth/me  (protégé JWT en production)
    [HttpGet("me")]
    public IActionResult Me()
    {
        var idClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (idClaim is null) return Unauthorized(new ErrorDto("Non authentifié"));
        return Ok(new { userId = int.Parse(idClaim) });
    }
}

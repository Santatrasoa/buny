using BunyApi.DTOs;
using BunyApi.Models;
using BunyApi.Repositories;
using BunyApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BunyApi.Controllers;

[ApiController]
[Route("api/users")]
[Produces("application/json")]
public class UsersController(IUserRepository repo, IAuthService auth) : ControllerBase
{
    // GET /api/users
    [HttpGet]
    public async Task<IActionResult> List(
        [FromQuery] string? search = null,
        [FromQuery] bool?   active = null,
        [FromQuery] int     page   = 1,
        [FromQuery] int     limit  = 10)
    {
        var q      = new UserQueryParams(search, active, Math.Max(1, page), Math.Clamp(limit, 1, 100));
        var result = await repo.GetAllAsync(q);

        return Ok(new PaginatedResponse<UserDto>(
            result.Data.Select(u => u.ToDto()).ToList(),
            result.Total, result.Page, result.Limit, result.TotalPages
        ));
    }

    // GET /api/users/stats
    [HttpGet("stats")]
    public async Task<IActionResult> Stats() =>
        Ok(await repo.GetStatsAsync());

    // GET /api/users/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> Show(int id)
    {
        var user = await repo.GetByIdAsync(id);
        return user is null ? NotFound(new ErrorDto("Utilisateur introuvable")) : Ok(user.ToDto());
    }

    // POST /api/users
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (await repo.GetByEmailAsync(dto.Email) is not null)
            return Conflict(new ErrorDto("Cet email est déjà utilisé"));

        var user = new User
        {
            Email        = dto.Email,
            PasswordHash = auth.HashPassword(dto.Password),
            FirstName    = dto.FirstName,
            LastName     = dto.LastName,
            Phone        = dto.Phone,
            Active       = dto.Active,
        };
        user.RolesList = dto.Roles ?? ["ROLE_USER"];

        var created = await repo.CreateAsync(user);
        return CreatedAtAction(nameof(Show), new { id = created.Id }, created.ToDto());
    }

    // PUT /api/users/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto dto)
    {
        var user = await repo.GetByIdAsync(id);
        if (user is null)
            return NotFound(new ErrorDto("Utilisateur introuvable"));

        if (dto.Email is not null)
        {
            var existing = await repo.GetByEmailAsync(dto.Email);
            if (existing is not null && existing.Id != id)
                return Conflict(new ErrorDto("Cet email est déjà utilisé"));
            user.Email = dto.Email;
        }

        if (!string.IsNullOrWhiteSpace(dto.Password))
            user.PasswordHash = auth.HashPassword(dto.Password);

        if (dto.FirstName is not null) user.FirstName = dto.FirstName;
        if (dto.LastName  is not null) user.LastName  = dto.LastName;
        if (dto.Phone     is not null) user.Phone     = dto.Phone;
        if (dto.Roles     is not null) user.RolesList = dto.Roles;
        if (dto.Active    is not null) user.Active    = dto.Active.Value;

        return Ok((await repo.UpdateAsync(user)).ToDto());
    }

    // PATCH /api/users/{id}
    [HttpPatch("{id:int}")]
    public Task<IActionResult> Patch(int id, [FromBody] UpdateUserDto dto) =>
        Update(id, dto);

    // DELETE /api/users/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await repo.GetByIdAsync(id);
        if (user is null)
            return NotFound(new ErrorDto("Utilisateur introuvable"));

        await repo.DeleteAsync(user);
        return Ok(new { message = "Utilisateur supprimé avec succès" });
    }
}

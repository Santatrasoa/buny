using BunyApi.Data;
using BunyApi.DTOs;
using BunyApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BunyApi.Repositories;

public interface IUserRepository
{
    Task<PaginatedResponse<User>> GetAllAsync(UserQueryParams q);
    Task<User?>                   GetByIdAsync(int id);
    Task<User?>                   GetByEmailAsync(string email);
    Task<User>                    CreateAsync(User user);
    Task<User>                    UpdateAsync(User user);
    Task                          DeleteAsync(User user);
    Task<UserStatsDto>            GetStatsAsync();
}

public record UserQueryParams(
    string? Search = null,
    bool?   Active = null,
    int     Page   = 1,
    int     Limit  = 10
);

public class UserRepository(AppDbContext db) : IUserRepository
{
    public async Task<PaginatedResponse<User>> GetAllAsync(UserQueryParams q)
    {
        var query = db.Users.AsQueryable();

        if (!string.IsNullOrWhiteSpace(q.Search))
            query = query.Where(u =>
                u.Email.Contains(q.Search) ||
                (u.FirstName != null && u.FirstName.Contains(q.Search)) ||
                (u.LastName  != null && u.LastName.Contains(q.Search)));

        if (q.Active.HasValue)
            query = query.Where(u => u.Active == q.Active.Value);

        var total = await query.CountAsync();
        var data  = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((q.Page - 1) * q.Limit)
            .Take(q.Limit)
            .ToListAsync();

        return new PaginatedResponse<User>(
            data, total, q.Page, q.Limit,
            (int)Math.Ceiling((double)total / q.Limit)
        );
    }

    public Task<User?> GetByIdAsync(int id)  => db.Users.FindAsync(id).AsTask();
    public Task<User?> GetByEmailAsync(string email) =>
        db.Users.FirstOrDefaultAsync(u => u.Email == email);

    public async Task<User> CreateAsync(User user)
    {
        user.CreatedAt = DateTime.UtcNow;
        db.Users.Add(user);
        await db.SaveChangesAsync();
        return user;
    }

    public async Task<User> UpdateAsync(User user)
    {
        user.UpdatedAt = DateTime.UtcNow;
        db.Users.Update(user);
        await db.SaveChangesAsync();
        return user;
    }

    public async Task DeleteAsync(User user)
    {
        db.Users.Remove(user);
        await db.SaveChangesAsync();
    }

    public async Task<UserStatsDto> GetStatsAsync() =>
        new UserStatsDto(
            Total:  await db.Users.CountAsync(),
            Active: await db.Users.CountAsync(u => u.Active),
            Admins: await db.Users.CountAsync(u => u.Roles.Contains("ROLE_ADMIN"))
        );
}

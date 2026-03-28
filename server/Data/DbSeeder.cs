using BunyApi.Data;
using BunyApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BunyApi.Data;

/// <summary>
/// Seed the database at startup — runs after migrations.
/// This is the ONLY place BCrypt should be called for seed data,
/// because BCrypt generates a different hash each call (random salt),
/// which would break EF migrations if used inside OnModelCreating.
/// </summary>
public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db, ILogger logger)
    {
        try
        {
            // Ne crée l'admin que si aucun utilisateur n'existe
            if (await db.Users.AnyAsync())
                return;

            var admin = new User
            {
                Email        = "admin@buny.mg",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@1234"),
                FirstName    = "Admin",
                LastName     = "Buny",
                Active       = true,
                CreatedAt    = DateTime.UtcNow,
            };
            admin.RolesList = ["ROLE_USER", "ROLE_ADMIN"];

            db.Users.Add(admin);
            await db.SaveChangesAsync();

            logger.LogInformation("Default admin user created: {Email}", admin.Email);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database.");
            // On ne relance pas l'exception pour ne pas bloquer le démarrage
        }
    }
}

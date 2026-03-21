using BunyApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BunyApi.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<User>    Users    => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>(e =>
        {
            e.HasIndex(p => p.Category);
            e.HasIndex(p => p.Active);
            e.Property(p => p.Price).HasPrecision(10, 2);
        });

        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            e.Ignore(u => u.RolesList);
            e.Ignore(u => u.IsAdmin);
        });

        // Seed admin par défaut
        modelBuilder.Entity<User>().HasData(new User
        {
            Id           = 1,
            Email        = "admin@buny.mg",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@1234"),
            FirstName    = "Admin",
            LastName     = "Buny",
            Roles        = """["ROLE_USER","ROLE_ADMIN"]""",
            Active       = true,
            CreatedAt    = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        });
    }
}

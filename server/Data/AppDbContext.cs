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

        // IMPORTANT: Le seed de l'admin est géré par DbSeeder au démarrage,
        // PAS ici. BCrypt.HashPassword() génère un hash différent à chaque
        // appel (salt aléatoire), ce qui force EF à créer une nouvelle
        // migration à chaque fois en voyant les données comme "modifiées".
    }
}

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
            e.Property(p => p.CreatedAt).HasColumnType("timestamp with time zone");
            e.Property(p => p.UpdatedAt).HasColumnType("timestamp with time zone");
        });

        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            e.Ignore(u => u.RolesList);
            e.Ignore(u => u.IsAdmin);
            e.Property(u => u.CreatedAt).HasColumnType("timestamp with time zone");
            e.Property(u => u.UpdatedAt).HasColumnType("timestamp with time zone");
        });
    }
}
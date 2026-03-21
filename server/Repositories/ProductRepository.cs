using BunyApi.Data;
using BunyApi.DTOs;
using BunyApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BunyApi.Repositories;

public interface IProductRepository
{
    Task<PaginatedResponse<Product>> GetAllAsync(ProductQueryParams q);
    Task<Product?>                   GetByIdAsync(int id);
    Task<Product>                    CreateAsync(Product product);
    Task<Product>                    UpdateAsync(Product product);
    Task                             DeleteAsync(Product product);
    Task<ProductStatsDto>            GetStatsAsync();
    Task<List<string>>               GetCategoriesAsync();
}

public record ProductQueryParams(
    string?  Search   = null,
    string?  Category = null,
    bool?    Active   = null,
    decimal? MinPrice = null,
    decimal? MaxPrice = null,
    int      Page     = 1,
    int      Limit    = 10
);

public class ProductRepository(AppDbContext db) : IProductRepository
{
    public async Task<PaginatedResponse<Product>> GetAllAsync(ProductQueryParams q)
    {
        var query = db.Products.AsQueryable();

        if (!string.IsNullOrWhiteSpace(q.Search))
            query = query.Where(p =>
                p.Name.Contains(q.Search) ||
                (p.Description != null && p.Description.Contains(q.Search)));

        if (!string.IsNullOrWhiteSpace(q.Category))
            query = query.Where(p => p.Category == q.Category);

        if (q.Active.HasValue)
            query = query.Where(p => p.Active == q.Active.Value);

        if (q.MinPrice.HasValue)
            query = query.Where(p => p.Price >= q.MinPrice.Value);

        if (q.MaxPrice.HasValue)
            query = query.Where(p => p.Price <= q.MaxPrice.Value);

        var total = await query.CountAsync();
        var data  = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((q.Page - 1) * q.Limit)
            .Take(q.Limit)
            .ToListAsync();

        return new PaginatedResponse<Product>(
            data, total, q.Page, q.Limit,
            (int)Math.Ceiling((double)total / q.Limit)
        );
    }

    public Task<Product?> GetByIdAsync(int id) =>
        db.Products.FindAsync(id).AsTask();

    public async Task<Product> CreateAsync(Product product)
    {
        product.CreatedAt = DateTime.UtcNow;
        db.Products.Add(product);
        await db.SaveChangesAsync();
        return product;
    }

    public async Task<Product> UpdateAsync(Product product)
    {
        product.UpdatedAt = DateTime.UtcNow;
        db.Products.Update(product);
        await db.SaveChangesAsync();
        return product;
    }

    public async Task DeleteAsync(Product product)
    {
        db.Products.Remove(product);
        await db.SaveChangesAsync();
    }

    public async Task<ProductStatsDto> GetStatsAsync() =>
        new ProductStatsDto(
            Total:      await db.Products.CountAsync(),
            Active:     await db.Products.CountAsync(p => p.Active),
            LowStock:   await db.Products.CountAsync(p => p.Stock > 0 && p.Stock <= 5),
            OutOfStock: await db.Products.CountAsync(p => p.Stock == 0)
        );

    public async Task<List<string>> GetCategoriesAsync() =>
        await db.Products
            .Where(p => p.Category != null)
            .Select(p => p.Category!)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();
}

using BunyApi.DTOs;
using BunyApi.Models;
using BunyApi.Repositories;
using BunyApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BunyApi.Controllers;

[ApiController]
[Route("api/products")]
[Produces("application/json")]
public class ProductsController(IProductRepository repo) : ControllerBase
{
    // GET /api/products
    [HttpGet]
    public async Task<IActionResult> List(
        [FromQuery] string?  search   = null,
        [FromQuery] string?  category = null,
        [FromQuery] bool?    active   = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null,
        [FromQuery] int      page     = 1,
        [FromQuery] int      limit    = 10)
    {
        var q      = new ProductQueryParams(search, category, active, minPrice, maxPrice,
                                            Math.Max(1, page), Math.Clamp(limit, 1, 100));
        var result = await repo.GetAllAsync(q);

        return Ok(new PaginatedResponse<ProductDto>(
            result.Data.Select(p => p.ToDto()).ToList(),
            result.Total, result.Page, result.Limit, result.TotalPages
        ));
    }

    // GET /api/products/stats
    [HttpGet("stats")]
    public async Task<IActionResult> Stats() =>
        Ok(await repo.GetStatsAsync());

    // GET /api/products/categories
    [HttpGet("categories")]
    public async Task<IActionResult> Categories() =>
        Ok(await repo.GetCategoriesAsync());

    // GET /api/products/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> Show(int id)
    {
        var product = await repo.GetByIdAsync(id);
        return product is null ? NotFound(new ErrorDto("Produit introuvable")) : Ok(product.ToDto());
    }

    // POST /api/products
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var product = new Product
        {
            Name        = dto.Name,
            Description = dto.Description,
            Price       = dto.Price,
            Stock       = dto.Stock,
            Image       = dto.Image,
            Category    = dto.Category,
            Active      = dto.Active,
        };

        var created = await repo.CreateAsync(product);
        return CreatedAtAction(nameof(Show), new { id = created.Id }, created.ToDto());
    }

    // PUT /api/products/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDto dto)
    {
        var product = await repo.GetByIdAsync(id);
        if (product is null)
            return NotFound(new ErrorDto("Produit introuvable"));

        if (dto.Name        is not null) product.Name        = dto.Name;
        if (dto.Description is not null) product.Description = dto.Description;
        if (dto.Price       is not null) product.Price       = dto.Price.Value;
        if (dto.Stock       is not null) product.Stock       = dto.Stock.Value;
        if (dto.Image       is not null) product.Image       = dto.Image;
        if (dto.Category    is not null) product.Category    = dto.Category;
        if (dto.Active      is not null) product.Active      = dto.Active.Value;

        return Ok((await repo.UpdateAsync(product)).ToDto());
    }

    // PATCH /api/products/{id}
    [HttpPatch("{id:int}")]
    public Task<IActionResult> Patch(int id, [FromBody] UpdateProductDto dto) =>
        Update(id, dto);

    // DELETE /api/products/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await repo.GetByIdAsync(id);
        if (product is null)
            return NotFound(new ErrorDto("Produit introuvable"));

        await repo.DeleteAsync(product);
        return Ok(new { message = "Produit supprimé avec succès" });
    }
}

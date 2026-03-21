using BunyApi.DTOs;
using BunyApi.Repositories;
using BunyApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BunyApi.Controllers;

[ApiController]
[Route("api/dashboard")]
[Produces("application/json")]
public class DashboardController(
    IProductRepository productRepo,
    IUserRepository    userRepo) : ControllerBase
{
    // GET /api/dashboard
    [HttpGet]
    public async Task<IActionResult> Stats()
    {
        var productStats = await productRepo.GetStatsAsync();
        var userStats    = await userRepo.GetStatsAsync();

        var latestProducts = await productRepo.GetAllAsync(
            new ProductQueryParams(Page: 1, Limit: 5));
        var latestUsers = await userRepo.GetAllAsync(
            new UserQueryParams(Page: 1, Limit: 5));

        return Ok(new DashboardDto(
            productStats,
            userStats,
            latestProducts.Data.Select(p => p.ToDto()).ToList(),
            latestUsers.Data.Select(u => u.ToDto()).ToList()
        ));
    }
}

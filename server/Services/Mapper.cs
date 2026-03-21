using BunyApi.DTOs;
using BunyApi.Models;

namespace BunyApi.Services;

public static class Mapper
{
    public static ProductDto ToDto(this Product p) => new(
        p.Id, p.Name, p.Description, p.Price,
        p.Stock, p.Image, p.Category, p.Active,
        p.CreatedAt, p.UpdatedAt
    );

    public static UserDto ToDto(this User u) => new(
        u.Id, u.Email, u.FirstName, u.LastName,
        u.Phone, u.RolesList, u.Active,
        u.CreatedAt, u.UpdatedAt
    );
}

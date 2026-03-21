using System.ComponentModel.DataAnnotations;

namespace BunyApi.DTOs;

// ── PRODUCT ──────────────────────────────────────────────────────────────────

public record ProductDto(
    int      Id,
    string   Name,
    string?  Description,
    decimal  Price,
    int      Stock,
    string?  Image,
    string?  Category,
    bool     Active,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record CreateProductDto(
    [Required, MaxLength(255)] string Name,
    string?  Description,
    [Required, Range(0, double.MaxValue)] decimal Price,
    int      Stock    = 0,
    string?  Image    = null,
    string?  Category = null,
    bool     Active   = true
);

public record UpdateProductDto(
    string?  Name,
    string?  Description,
    decimal? Price,
    int?     Stock,
    string?  Image,
    string?  Category,
    bool?    Active
);

// ── USER ─────────────────────────────────────────────────────────────────────

public record UserDto(
    int           Id,
    string        Email,
    string?       FirstName,
    string?       LastName,
    string?       Phone,
    List<string>  Roles,
    bool          Active,
    DateTime      CreatedAt,
    DateTime?     UpdatedAt
);

public record CreateUserDto(
    [Required, EmailAddress] string Email,
    [Required, MinLength(6)] string Password,
    string?       FirstName = null,
    string?       LastName  = null,
    string?       Phone     = null,
    List<string>? Roles     = null,
    bool          Active    = true
);

public record UpdateUserDto(
    string?       Email,
    string?       Password,
    string?       FirstName,
    string?       LastName,
    string?       Phone,
    List<string>? Roles,
    bool?         Active
);

// ── AUTH ─────────────────────────────────────────────────────────────────────

public record LoginDto(
    [Required, EmailAddress] string Email,
    [Required]               string Password
);

public record AuthResponseDto(
    string  Token,
    UserDto User
);

// ── PAGINATION ────────────────────────────────────────────────────────────────

public record PaginatedResponse<T>(
    List<T> Data,
    int     Total,
    int     Page,
    int     Limit,
    int     TotalPages
);

// ── STATS ─────────────────────────────────────────────────────────────────────

public record ProductStatsDto(int Total, int Active, int LowStock, int OutOfStock);
public record UserStatsDto(int Total, int Active, int Admins);

public record DashboardDto(
    ProductStatsDto  Products,
    UserStatsDto     Users,
    List<ProductDto> LatestProducts,
    List<UserDto>    LatestUsers
);

// ── ERROR ─────────────────────────────────────────────────────────────────────

public record ErrorDto(string Error);

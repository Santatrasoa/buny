using System.ComponentModel.DataAnnotations;

namespace BunyApi.Models;

public class User
{
    [Key]
    public int Id { get; set; }

    [Required, MaxLength(180)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? FirstName { get; set; }

    [MaxLength(100)]
    public string? LastName { get; set; }

    [MaxLength(20)]
    public string? Phone { get; set; }

    // Stocké comme chaîne JSON : ["ROLE_USER"] ou ["ROLE_USER","ROLE_ADMIN"]
    public string Roles { get; set; } = """["ROLE_USER"]""";

    public bool Active { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Helpers non mappés
    public List<string> RolesList
    {
        get => System.Text.Json.JsonSerializer.Deserialize<List<string>>(Roles) ?? ["ROLE_USER"];
        set => Roles = System.Text.Json.JsonSerializer.Serialize(value);
    }

    public bool IsAdmin => RolesList.Contains("ROLE_ADMIN");
}

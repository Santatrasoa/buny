using System.Text;
using BunyApi.Data;
using BunyApi.Middleware;
using BunyApi.Repositories;
using BunyApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ── Base de données ────────────────────────────────────────────────────────────
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var useSqlite        = builder.Environment.IsDevelopment() && string.IsNullOrEmpty(connectionString);

if (useSqlite)
{
    builder.Services.AddDbContext<AppDbContext>(opt =>
        opt.UseSqlite("Data Source=buny.db"));
}
else
{
    if (string.IsNullOrEmpty(connectionString))
        throw new InvalidOperationException(
            "La chaîne de connexion 'DefaultConnection' est manquante dans appsettings.json.");

    builder.Services.AddDbContext<AppDbContext>(opt =>
        opt.UseNpgsql(connectionString));
}

// ── Services ──────────────────────────────────────────────────────────────────
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IUserRepository,    UserRepository>();
builder.Services.AddScoped<IAuthService,       AuthService>();

// ── JWT ───────────────────────────────────────────────────────────────────────
// Fallback identique à celui d'AuthService pour éviter toute incohérence de clé.
const string JwtFallbackKey = "BunySecretKey_ChangeInProduction_2024!MinLength32Chars";
var jwtKey = builder.Configuration["Jwt:Key"] ?? JwtFallbackKey;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey        = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer          = false,
            ValidateAudience        = false,
            ClockSkew               = TimeSpan.Zero,
        };
    });

builder.Services.AddAuthorization();

// ── CORS ──────────────────────────────────────────────────────────────────────
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("BunyPolicy", policy =>
        policy.WithOrigins(
            "http://localhost:5173",
            "http://localhost:3000",
            "http://localhost:5174"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

// ── Controllers + Swagger ─────────────────────────────────────────────────────
builder.Services.AddControllers()
    .AddJsonOptions(opt =>
    {
        opt.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        opt.JsonSerializerOptions.DefaultIgnoreCondition =
            System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title       = "Buny API",
        Version     = "v1",
        Description = "API REST pour la boutique Buny"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization: Bearer {token}",
        Name        = "Authorization",
        In          = ParameterLocation.Header,
        Type        = SecuritySchemeType.ApiKey,
        Scheme      = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {{
        new OpenApiSecurityScheme {
            Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
        },
        Array.Empty<string>()
    }});
});

// ── Build ─────────────────────────────────────────────────────────────────────
var app = builder.Build();

// ── Migration + Seed au démarrage ─────────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db     = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    try
    {
        // Applique les migrations en attente (crée la DB si elle n'existe pas).
        await db.Database.MigrateAsync();
        logger.LogInformation(
            "Database migration applied. Provider: {Provider}",
            useSqlite ? "SQLite (dev)" : "PostgreSQL");
    }
    catch (Exception ex)
    {
        logger.LogError(ex,
            "Failed to apply database migrations. " +
            "Verify your connection string and that the database server is running.");
        // On ne termine pas le process pour laisser Swagger/health accessible,
        // mais les endpoints de données retourneront 500 tant que la DB est down.
    }

    // Seed des données initiales (admin par défaut) si la table Users est vide.
    await DbSeeder.SeedAsync(db, logger);
}

// ── Middleware pipeline ────────────────────────────────────────────────────────
app.UseMiddleware<ErrorHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Buny API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("BunyPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Routes utilitaires
app.MapGet("/",       () => new { status = "ok",   api = "Buny API", version = "1.0.0" });
app.MapGet("/health", () => new { healthy = true, timestamp = DateTime.UtcNow });

app.Run();

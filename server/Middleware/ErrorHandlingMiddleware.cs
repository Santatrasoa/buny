using System.Net;
using System.Text.Json;
using BunyApi.DTOs;

namespace BunyApi.Middleware;

public class ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode  = ex switch
        {
            ArgumentException   => (int)HttpStatusCode.BadRequest,
            UnauthorizedAccessException => (int)HttpStatusCode.Unauthorized,
            KeyNotFoundException => (int)HttpStatusCode.NotFound,
            _                   => (int)HttpStatusCode.InternalServerError,
        };

        var message = context.Response.StatusCode == 500
            ? "Une erreur interne est survenue"
            : ex.Message;

        return context.Response.WriteAsync(
            JsonSerializer.Serialize(new ErrorDto(message),
                new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase })
        );
    }
}

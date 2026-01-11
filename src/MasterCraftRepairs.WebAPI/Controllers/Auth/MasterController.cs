using System.Security.Claims;
using MasterCraftRepairs.Application.DTOs;
using MasterCraftRepairs.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MasterCraftRepairs.WebAPI.Controllers.Authorization;

[ApiController]
[Route("api/[controller]")]
public class MasterController : ControllerBase
{
    private readonly IMasterService _masterService;

    public MasterController(IMasterService masterService)
    {
        _masterService = masterService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterMasterRequestDto request)
    {
        if (request == null)
        {
            return BadRequest(new { errors = new[] { "Тело запроса не может быть пустым" } });
        }
        
        if (!ModelState.IsValid)
        {
            var modelErrors = ModelState
                .Where(x => x.Value?.Errors.Count > 0)
                .SelectMany(x => x.Value!.Errors.Select(e => e.ErrorMessage))
                .ToList();
            return BadRequest(new { errors = modelErrors });
        }

        var result = await _masterService.RegisterMasterAsync(request);
        
        if (result.Succeeded)
        {
            return Ok(new { message = "Ьастер успешно зарегистрирован" });
        }
        
        return BadRequest(new { errors = result.Errors });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginUserDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _masterService.LoginMasterAsync(request);
        
        if (result.Succeeded)
        {
            HttpContext.Response.Cookies.Append(
                "ZaxarCrumbleCookie",
                result.Token,
                new CookieOptions
                {
                    HttpOnly = true,
                    SameSite = SameSiteMode.Lax,
                    Path = "/",
                    Expires = DateTimeOffset.UtcNow.AddDays(7),
                }
            );

            return Ok(new { token = result.Token, message = "Вы успешно вошли в аккаунт" });
        }
        
        return BadRequest(new { errors = result.Errors });
    }
    
    [Authorize(Roles = "Master")]
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { error = "Пользователь не авторизован" });
        }

        if (!Guid.TryParse(userId, out var clientId))
        {
            return BadRequest(new { error = "Неверный формат идентификатора пользователя" });
        }

        var profile = await _masterService.GetProfileAsync(clientId);

        if (profile == null)
        {
            return NotFound(new { error = "Профиль ьастера не найден" });
        }

        return Ok(profile);
    }
    
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        HttpContext.Response.Cookies.Delete(
            "ZaxarCrumbleCookie",
            new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Lax,
                Path = "/",
            }
        );
        return Ok(new { message = "Вы успешно вышли из аккаунта" });
    }
}
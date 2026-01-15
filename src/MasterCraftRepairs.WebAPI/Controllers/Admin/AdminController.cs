using MasterCraftRepairs.Application.Common.Interfaces;
using MasterCraftRepairs.Application.DTOs;
using MasterCraftRepairs.Application.DTOs.Admin;
using MasterCraftRepairs.Application.Services.Admin;
using MasterCraftRepairs.Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MasterCraftRepairs.WebAPI.Controllers.Admin;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IJwtProvider _jwtProvider;

    public AdminController(
        IAdminService adminService,
        UserManager<ApplicationUser> userManager,
        IJwtProvider jwtProvider)
    {
        _adminService = adminService;
        _userManager = userManager;
        _jwtProvider = jwtProvider;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginUserDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return BadRequest(new { errors = new[] { "Неверный email или пароль" } });
        }

        var isValidPassword = await _userManager.CheckPasswordAsync(user, request.Password);
        if (!isValidPassword)
        {
            return BadRequest(new { errors = new[] { "Неверный email или пароль" } });
        }

        var roles = await _userManager.GetRolesAsync(user);
        if (!roles.Contains("Admin"))
        {
            return BadRequest(new { errors = new[] { "Доступ запрещен. Требуется роль администратора" } });
        }

        var token = _jwtProvider.GenerateToken(user.Id, request.Email, roles);

        Response.Cookies.Append(
            "ZaxarCrumbleCookie",
            token,
            new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Lax,
                Path = "/",
                Expires = DateTimeOffset.UtcNow.AddDays(7),
            }
        );

        return Ok(new { token = token, message = "Вы успешно вошли в админ-панель" });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete(
            "ZaxarCrumbleCookie",
            new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Lax,
                Path = "/",
            }
        );
        return Ok(new { message = "Вы успешно вышли из админ-панели" });
    }

    // Clients
    [Authorize(Roles = "Admin")]
    [HttpGet("clients")]
    public async Task<IActionResult> GetAllClients()
    {
        var clients = await _adminService.GetAllClientsAsync();
        return Ok(new { clients });
    }

    [HttpGet("clients/{id}")]
    public async Task<IActionResult> GetClientById(Guid id)
    {
        var client = await _adminService.GetClientByIdAsync(id);
        if (client == null)
        {
            return NotFound(new { error = "Клиент не найден" });
        }
        return Ok(new { client });
    }

    [HttpPost("clients")]
    public async Task<IActionResult> CreateClient([FromBody] CreateClientDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _adminService.CreateClientAsync(dto);
        if (result.Succeeded)
        {
            return Ok(new { message = "Клиент успешно создан" });
        }

        return BadRequest(new { errors = result.Errors });
    }

    [HttpPut("clients/{id}")]
    public async Task<IActionResult> UpdateClient(Guid id, [FromBody] UpdateClientDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _adminService.UpdateClientAsync(id, dto);
        if (result.Succeeded)
        {
            return Ok(new { message = "Клиент успешно обновлен" });
        }

        return BadRequest(new { errors = result.Errors });
    }

    [HttpDelete("clients/{id}")]
    public async Task<IActionResult> DeleteClient(Guid id)
    {
        var result = await _adminService.DeleteClientAsync(id);
        if (result.Succeeded)
        {
            return Ok(new { message = "Клиент успешно удален" });
        }

        return BadRequest(new { errors = result.Errors });
    }

    // Masters
    [HttpGet("masters")]
    public async Task<IActionResult> GetAllMasters()
    {
        var masters = await _adminService.GetAllMastersAsync();
        return Ok(new { masters });
    }

    [HttpGet("masters/{id}")]
    public async Task<IActionResult> GetMasterById(Guid id)
    {
        var master = await _adminService.GetMasterByIdAsync(id);
        if (master == null)
        {
            return NotFound(new { error = "Мастер не найден" });
        }
        return Ok(new { master });
    }

    [HttpPost("masters")]
    public async Task<IActionResult> CreateMaster([FromBody] CreateMasterDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _adminService.CreateMasterAsync(dto);
        if (result.Succeeded)
        {
            return Ok(new { message = "Мастер успешно создан" });
        }

        return BadRequest(new { errors = result.Errors });
    }

    [HttpPut("masters/{id}")]
    public async Task<IActionResult> UpdateMaster(Guid id, [FromBody] UpdateMasterDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _adminService.UpdateMasterAsync(id, dto);
        if (result.Succeeded)
        {
            return Ok(new { message = "Мастер успешно обновлен" });
        }

        return BadRequest(new { errors = result.Errors });
    }

    [HttpDelete("masters/{id}")]
    public async Task<IActionResult> DeleteMaster(Guid id)
    {
        var result = await _adminService.DeleteMasterAsync(id);
        if (result.Succeeded)
        {
            return Ok(new { message = "Мастер успешно удален" });
        }

        return BadRequest(new { errors = result.Errors });
    }

    // Categories
    [HttpGet("categories")]
    public async Task<IActionResult> GetAllCategories()
    {
        var categories = await _adminService.GetAllCategoriesAsync();
        return Ok(new { categories });
    }

    [HttpGet("categories/{id}")]
    public async Task<IActionResult> GetCategoryById(Guid id)
    {
        var category = await _adminService.GetCategoryByIdAsync(id);
        if (category == null)
        {
            return NotFound(new { error = "Категория не найдена" });
        }
        return Ok(new { category });
    }

    [HttpPost("categories")]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _adminService.CreateCategoryAsync(dto);
        if (result.Succeeded)
        {
            return Ok(new { message = "Категория успешно создана" });
        }

        return BadRequest(new { errors = result.Errors });
    }

    [HttpPut("categories/{id}")]
    public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] UpdateCategoryDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _adminService.UpdateCategoryAsync(id, dto);
        if (result.Succeeded)
        {
            return Ok(new { message = "Категория успешно обновлена" });
        }

        return BadRequest(new { errors = result.Errors });
    }

    [HttpDelete("categories/{id}")]
    public async Task<IActionResult> DeleteCategory(Guid id)
    {
        var result = await _adminService.DeleteCategoryAsync(id);
        if (result.Succeeded)
        {
            return Ok(new { message = "Категория успешно удалена" });
        }

        return BadRequest(new { errors = result.Errors });
    }

    // Orders
    [HttpGet("orders")]
    public async Task<IActionResult> GetAllOrders()
    {
        var orders = await _adminService.GetAllOrdersAsync();
        return Ok(new { orders });
    }

    [HttpGet("masters/{masterId}/orders")]
    public async Task<IActionResult> GetMasterOrders(Guid masterId)
    {
        var orders = await _adminService.GetMasterOrdersAsync(masterId);
        return Ok(new { orders });
    }
}

using System.Linq;
using System.Security.Claims;
using MasterCraftRepairs.Application.DTOs;
using MasterCraftRepairs.Application.Services.Other;
using MasterCraftRepairs.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MasterCraftRepairs.WebAPI.Controllers.Other;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [Authorize(Roles = "Client")]
    [HttpPost("create")]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto request)
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


        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { error = "Пользователь не авторизован" });
        }

        if (!Guid.TryParse(userId, out var clientId))
        {
            return BadRequest(new { error = "Неверный формат идентификатора пользователя" });
        }

        var result = await _orderService.CreateOrderAsync(request, clientId);

        if (result.Succeeded)
        {
            return Ok(new { message = "Обращение успешно создано" });
        }

        return BadRequest(new { errors = result.Errors });
    }

    [Authorize(Roles = "Master")]
    [HttpPost("take/{orderId}")]
    public async Task<IActionResult> TakeOrder(Guid orderId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { error = "Пользователь не авторизован" });
        }

        if (!Guid.TryParse(userId, out var masterId))
        {
            return BadRequest(new { error = "Неверный формат идентификатора пользователя" });
        }

        var result = await _orderService.TakeOrderAsync(orderId, masterId);

        if (result.Succeeded)
        {
            return Ok(new { message = "Заказ успешно взят в обработку" });
        }

        return BadRequest(new { errors = result.Errors });
    }

    [Authorize(Roles = "Client")]
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _orderService.GetCategoriesAsync();

        if (result != null)
        {
            return Ok(new
            {
                categories = result
            });
        }

        return BadRequest(new { error = "Категории не найдены" });
    }

    [Authorize(Roles = "Client")]
    [HttpGet("my-orders")]
    public async Task<IActionResult> GetMyOrders()
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

        var orders = await _orderService.GetClientOrdersAsync(clientId);
        return Ok(new { orders });
    }

    [Authorize(Roles = "Client")]
    [HttpPost("{orderId}/cancel")]
    public async Task<IActionResult> CancelOrder(Guid orderId)
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

        var result = await _orderService.CancelOrderAsync(orderId, clientId);
        if (result.Succeeded)
        {
            return Ok(new { message = "Обращение отменено" });
        }

        return BadRequest(new { errors = result.Errors });
    }

    [Authorize(Roles = "Client")]
    [HttpPatch("{orderId}/description")]
    public async Task<IActionResult> UpdateOrderDescription(Guid orderId, [FromBody] UpdateOrderDescriptionDto request)
    {
        if (request == null)
        {
            return BadRequest(new { errors = new[] { "Тело запроса не может быть пустым" } });
        }

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { error = "Пользователь не авторизован" });
        }

        if (!Guid.TryParse(userId, out var clientId))
        {
            return BadRequest(new { error = "Неверный формат идентификатора пользователя" });
        }

        var result = await _orderService.UpdateOrderDescriptionAsync(orderId, clientId, request.Description);
        if (result.Succeeded)
        {
            return Ok(new { message = "Описание обновлено" });
        }

        return BadRequest(new { errors = result.Errors });
    }

    [Authorize(Roles = "Master")]
    [HttpGet("available")]
    public async Task<IActionResult> GetAvailableOrders()
    {
        var orders = await _orderService.GetAvailableOrdersAsync();
        return Ok(new { orders });
    }

    [Authorize(Roles = "Master")]
    [HttpGet("master-orders")]
    public async Task<IActionResult> GetMasterInProgressOrders()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { error = "Пользователь не авторизован" });
        }

        if (!Guid.TryParse(userId, out var masterId))
        {
            return BadRequest(new { error = "Неверный формат идентификатора пользователя" });
        }

        var orders = await _orderService.GetMasterOrdersAsync(masterId);
        return Ok(new { orders });
    }

    [Authorize(Roles = "Master")]
    [HttpGet("completed")]
    public async Task<IActionResult> GetCompletedOrders()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { error = "Пользователь не авторизован" });
        }

        if (!Guid.TryParse(userId, out var masterId))
        {
            return BadRequest(new { error = "Неверный формат идентификатора пользователя" });
        }

        var orders = await _orderService.GetMasterCompletedOrdersAsync(masterId);
        return Ok(new { orders });
    }

    [Authorize(Roles = "Master")]
    [HttpPost("complete/{orderId}")]
    public async Task<IActionResult> CompleteOrder(Guid orderId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { error = "Пользователь не авторизован" });
        }

        if (!Guid.TryParse(userId, out var masterId))
        {
            return BadRequest(new { error = "Неверный формат идентификатора пользователя" });
        }

        var result = await _orderService.CompleteOrderAsync(orderId, masterId);

        if (result.Succeeded)
        {
            return Ok(new { message = "Заказ успешно завершен" });
        }

        return BadRequest(new { errors = result.Errors });
    }

    [Authorize(Roles = "Master")]
    [HttpGet("updateListOrders")]
    public async Task<IActionResult> UpdateListOrders()
    {
        var orders = await _orderService.GetAllOrdersAsync();
        return Ok(new { orders });
    }
}

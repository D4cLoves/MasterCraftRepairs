using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MasterCraftRepairs.Application.DTOs;
using MasterCraftRepairs.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace MasterCraftRepairs.WebAPI.Controllers.Authorization
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientController : ControllerBase
    {
        private readonly IClientService _clientService;

        public ClientController(IClientService clientService)
        {
            _clientService = clientService;
        }

        [HttpPost("register")]        
        public async Task<IActionResult> Register([FromBody] RegisterClientRequestDto request)
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

            var result = await _clientService.RegisterClientAsync(request);

            if (result.Succeeded)
            {
                return Ok(new { message = "Клиент успешно зарегистрирован" });
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

            var result = await _clientService.LoginClientAsync(request);
            
            if (result.Succeeded)
            {
                HttpContext.Response.Cookies.Append("ZaxarCrumbleCookie", result.Token);
                
                return Ok(new { token = result.Token, message = "Вы успешно вошли в аккаунт" });
            }

            return BadRequest(new { errors = result.Errors });
        }
    }
}

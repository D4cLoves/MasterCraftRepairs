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
        private readonly IClientRegistrationService _registrationService;

        public ClientController(IClientRegistrationService registrationService)
        {
            _registrationService = registrationService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterClientRequestDto request)
        {
            // Добавь логирование для отладки
            if (request == null)
            {
                return BadRequest(new { error = "Request body is null" });
            }

            // Логируй ModelState ошибки
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Values.SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return BadRequest(new { errors = errors, modelState = ModelState });
            }

            var result = await _registrationService.RegisterClientAsync(request);

            if (result.Succeeded)
            {
                return Ok(new { message = "Клиент успешно зарегистрирован" });
            }
            else
            {
                return BadRequest(new { errors = result.Errors });
            }
        }
    }
}

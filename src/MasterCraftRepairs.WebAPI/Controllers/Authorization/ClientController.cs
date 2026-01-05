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
                return BadRequest(new { error = "Request body is null" });
            }

            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Values.SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return BadRequest(new { errors = errors, modelState = ModelState });
            }

            var result = await _clientService.RegisterClientAsync(request);

            if (result.Succeeded)
            {
                return Ok(new { message = "Клиент успешно зарегистрирован" });
            }
            else
            {
                return BadRequest(new { errors = result.Errors });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDto request)
        {
            if (request == null)
            {
                return BadRequest(new { error = "Request body is null" });
            }

            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Values.SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return BadRequest(new { errors = errors, modelState = ModelState });
            }

            var result = await _clientService.LoginClientAsync(request);

            if (!result.Succeeded)
            {
                return BadRequest(new { errors = result.Errors });
            }

            return Ok(new { token = result.Token, message = "Успешный вход" });
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MasterCraftRepairs.Application.Common.Interfaces;
using MasterCraftRepairs.Application.Common.Results;
using MasterCraftRepairs.Application.DTOs;
using MasterCraftRepairs.Domain.Entities;

namespace MasterCraftRepairs.Application.Services
{
    public class ClientService : IClientService
    {
        private readonly IIdentityService _identityservice;
        private readonly IClientRepository _clientRepository;

        public ClientService(IIdentityService identityService, IClientRepository clientRepository)
        {
            _identityservice = identityService;
            _clientRepository = clientRepository;
        }

        public async Task<OperationResults> RegisterClientAsync(RegisterClientRequestDto request)
        {
            if (request.Password != request.ConfirmPassword)
            {
                return new OperationResults
                {
                    Succeeded = false,
                    Errors = new List<string> { "Пароли не одинаковы" },
                };
            }

            if (string.IsNullOrWhiteSpace(request.Birthday))
            {
                return new OperationResults
                {
                    Succeeded = false,
                    Errors = new List<string> { "Дата рождения обязательна" },
                };
            }

            var birthdayString = request.Birthday.Trim();
            DateOnly birthday;

            if (
                DateOnly.TryParseExact(
                    birthdayString,
                    "yyyy-MM-dd",
                    System.Globalization.CultureInfo.InvariantCulture,
                    System.Globalization.DateTimeStyles.None,
                    out birthday
                )
            ) { }
            else if (
                DateTime.TryParseExact(
                    birthdayString,
                    "yyyy-MM-ddTHH:mm:ss",
                    System.Globalization.CultureInfo.InvariantCulture,
                    System.Globalization.DateTimeStyles.None,
                    out var dateTime
                )
            )
            {
                birthday = DateOnly.FromDateTime(dateTime);
            }
            else if (
                DateOnly.TryParse(
                    birthdayString,
                    System.Globalization.CultureInfo.InvariantCulture,
                    System.Globalization.DateTimeStyles.None,
                    out birthday
                )
            ) { }
            else
            {
                return new OperationResults
                {
                    Succeeded = false,
                    Errors = new List<string>
                    {
                        $"Неверный формат даты рождения: '{birthdayString}'. Ожидается формат: ГГГГ-ММ-ДД (например: 2000-01-15)",
                    },
                };
            }
            Client client;
            try
            {
                client = new Client(
                    firstName: request.FirstName,
                    lastName: request.LastName,
                    phone: request.Phone,
                    passport: request.Passport,
                    address: request.Address,
                    birthday: birthday
                );
            }
            catch (ArgumentException ex)
            {
                return new OperationResults
                {
                    Succeeded = false,
                    Errors = new List<string> { ex.Message },
                };
            }

            var identityResult = await _identityservice.CreateClientAsync(
                client,
                request.Email,
                request.Password
            );

            if (!identityResult.Succeeded)
            {
                return identityResult;
            }

            try
            {
                await _clientRepository.AddClientAsync(client);
            }
            catch (Exception ex)
            {
                return new OperationResults
                {
                    Succeeded = false,
                    Errors = new List<string> { $"ошибка сохранения клиента : = {ex.Message}" },
                };
            }

            return new OperationResults { Succeeded = true };
        }

        public async Task<OperationResults> LoginClientAsync(LoginUserDto request)
        {
            if (
                string.IsNullOrWhiteSpace(request.Email)
                || string.IsNullOrWhiteSpace(request.Password)
            )
            {
                return new OperationResults
                {
                    Succeeded = false,
                    Errors = new List<string> { "Email и пароль обязательны" },
                };
            }

            var result = await _identityservice.LoginClientAsync(request.Email, request.Password);

            return result;
        }
    }
}

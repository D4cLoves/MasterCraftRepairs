using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;
using MasterCraftRepairs.Application.Common.Interfaces;
using MasterCraftRepairs.Application.Common.Results;
using MasterCraftRepairs.Application.DTOs;
using MasterCraftRepairs.Domain.Entities;

namespace MasterCraftRepairs.Application.Services
{
    public class ClientRegistrationService : IClientRegistrationService
    {
        private readonly IIdentityService _identityservice;
        private readonly IClientRepository _clientRepository;

        public ClientRegistrationService(
            IIdentityService identityService,
            IClientRepository clientRepository
        )
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

            // Парсим дату рождения
            if (string.IsNullOrWhiteSpace(request.Birthday))
            {
                return new OperationResults
                {
                    Succeeded = false,
                    Errors = new List<string> { "Дата рождения обязательна" },
                };
            }

            // Убираем пробелы и пробуем разные форматы
            var birthdayString = request.Birthday.Trim();
            DateOnly birthday;

            // Пробуем стандартный формат HTML input type="date" (YYYY-MM-DD)
            if (
                DateOnly.TryParseExact(
                    birthdayString,
                    "yyyy-MM-dd",
                    System.Globalization.CultureInfo.InvariantCulture,
                    System.Globalization.DateTimeStyles.None,
                    out birthday
                )
            )
            {
                // Успешно распарсили
            }
            // Пробуем ISO формат (на случай если придет с временем)
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
            // Пробуем просто TryParse (на случай другого формата)
            else if (
                DateOnly.TryParse(
                    birthdayString,
                    System.Globalization.CultureInfo.InvariantCulture,
                    System.Globalization.DateTimeStyles.None,
                    out birthday
                )
            )
            {
                // Успешно распарсили
            }
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
    }
}

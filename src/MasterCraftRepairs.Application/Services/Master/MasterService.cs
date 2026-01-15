using MasterCraftRepairs.Application.Common.Interfaces;
using MasterCraftRepairs.Application.Common.Interfaces.MasterRepo;
using MasterCraftRepairs.Application.Common.Results;
using MasterCraftRepairs.Application.DTOs;
using MasterCraftRepairs.Application.Services;
using MasterCraftRepairs.Domain.Entities;

namespace MasterCraftRepairs.Application.Services
{
    public class MasterService : IMasterService
    {
        private readonly IIdentityMasterService _identityservice;
        private readonly IMasterRepository _Repository;

        public MasterService(IIdentityMasterService identityMasterService, IMasterRepository masterRepository)
        {
            _identityservice = identityMasterService;
            _Repository = masterRepository;
        }

        public async Task<OperationResults> RegisterMasterAsync(RegisterMasterRequestDto request)
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
            )
            {
            }
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
            )
            {
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

            Domain.Entities.Master master;
            try
            {
                master = new Domain.Entities.Master(
                    firstName: request.FirstName,
                    lastName: request.LastName,
                    phone: request.Phone,
                    passport: request.Passport,
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

            var identityResult = await _identityservice.CreateMasterAsync(
                master,
                request.Password,
                request.Email
            );

            if (!identityResult.Succeeded)
            {
                return identityResult;
            }

            try
            {
                await _Repository.AddMasterAsync(master);
            }
            catch (Exception ex)
            {
                return new OperationResults
                {
                    Succeeded = false,
                    Errors = new List<string> { $"ошибка сохранения мастера : = {ex.Message}" },
                };
            }

            return new OperationResults { Succeeded = true };
        }

        public async Task<OperationResults> LoginMasterAsync(LoginUserDto request)
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

            var result = await _identityservice.LoginMasterAsync(request.Email, request.Password);

            return result;
        }

        public async Task<MasterProfileDto?> GetProfileAsync(Guid masterId)
        {
            var master = await _Repository.GetMasterByIdAsync(masterId);

            if (master == null)
            {
                return null;
            }

            var userEmail = await _identityservice.FindByIdAsyncUserEmail(masterId.ToString());
            var email = userEmail ?? string.Empty;

            return new MasterProfileDto
            {
                Id = master.Id,
                FirstName = master.Name.FirstName,
                LastName = master.Name.LastName,
                Phone = master.Phone.Value,
                Passport = master.Passport.Value,
                Birthday = master.Birthday,
                Email = email,
            };
        }

        public async Task<OperationResults> UpdateProfileAsync(Guid masterId, UpdateMasterProfileDto request)
        {
            var master = await _Repository.GetMasterByIdAsync(masterId);
            if (master == null)
            {
                return new OperationResults
                {
                    Succeeded = false,
                    Errors = new List<string> { "Профиль мастера не найден" },
                };
            }

            try
            {
                if (!string.IsNullOrWhiteSpace(request.Phone))
                    master.UpdatePhone(request.Phone);

                if (!string.IsNullOrWhiteSpace(request.Passport))
                    master.UpdatePassport(request.Passport);
            }
            catch (ArgumentException ex)
            {
                return new OperationResults
                {
                    Succeeded = false,
                    Errors = new List<string> { ex.Message },
                };
            }

            await _Repository.UpdateMasterAsync(master);
            return new OperationResults { Succeeded = true };
        }
    }
}

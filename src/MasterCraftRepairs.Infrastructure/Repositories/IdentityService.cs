using System;
using System.ClientModel.Primitives;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MasterCraftRepairs.Application.Common.Interfaces;
using MasterCraftRepairs.Application.Common.Results;
using MasterCraftRepairs.Domain.Entities;
using MasterCraftRepairs.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;

namespace MasterCraftRepairs.Infrastructure.Repositories
{
    public class IdentityService : IIdentityService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IJwtProvider _jwtProvider;

        public IdentityService(UserManager<ApplicationUser> userManager, IJwtProvider jwtProvider)
        {
            _userManager = userManager;
            _jwtProvider = jwtProvider;
        }

        public async Task<OperationResults> CreateClientAsync(
            Client client,
            string email,
            string password
        )
        {
            var appClient = new ApplicationUser
            {
                Id = client.Id.ToString(),
                UserName = email,
                Email = email,
                EmailConfirmed = false,
            };

            var identityResult = await _userManager.CreateAsync(appClient, password);

            if (identityResult.Succeeded)
            {
                return new OperationResults { Succeeded = true };
            }
            else
            {
                return new OperationResults
                {
                    Succeeded = false,
                    Errors = identityResult.Errors.Select(e => e.Description).ToList(),
                };
            }
        }

        public async Task<OperationResults> LoginClientAsync(string email, string password)
        {
            var client = await _userManager.FindByEmailAsync(email);
            if (client == null)
            {
                return new OperationResults
                {
                    Succeeded = false,
                    Errors = new List<string> { "Пользователь с таким email не найден" },
                };
            }

            var passwordValid = await _userManager.CheckPasswordAsync(client, password);
            if (!passwordValid)
            {
                return new OperationResults
                {
                    Succeeded = false,
                    Errors = new List<string> { "Неверный пароль" },
                };
            }

            var roles = await _userManager.GetRolesAsync(client);

            var token = _jwtProvider.GenerateToken(
                userId: client.Id,
                email: client.Email ?? string.Empty,
                roles: roles
            );

            return new OperationResults { Succeeded = true, Token = token };
        }
    }
}

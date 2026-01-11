using System;
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
    public class IdentityClientService : IIdentityClientService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IJwtProvider _jwtProvider;

        public IdentityClientService(UserManager<ApplicationUser> userManager, IJwtProvider jwtProvider)
        {
            _userManager = userManager;
            _jwtProvider = jwtProvider;
        }

        public async Task<OperationResults> CreateClientAsync(
            Client client,
            string password,
            string email
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

            if (!identityResult.Succeeded)
            {
                return new OperationResults
                {
                    Succeeded = false,
                    Errors = identityResult.Errors.Select(e => e.Description).ToList(),
                };
            }

            var roleResult = await _userManager.AddToRoleAsync(appClient, "Client");

            if (!roleResult.Succeeded)
            {
                await _userManager.DeleteAsync(appClient);
                return new OperationResults
                {
                    Succeeded = false,
                    Errors = roleResult.Errors.Select(e => e.Description).ToList(),
                };
            }

            return new OperationResults { Succeeded = true };
        }

        public async Task<OperationResults> LoginClientAsync(string email, string password)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return new OperationResults
                {
                    Succeeded = false,
                    Errors = new List<string> { "Неверный email или пароль" },
                };
            }

            var isValidPassword = await _userManager.CheckPasswordAsync(user, password);
            if (!isValidPassword)
            {
                return new OperationResults
                {
                    Succeeded = false,
                    Errors = new List<string> { "Неверный email или пароль" },
                };
            }

            var roles = await _userManager.GetRolesAsync(user);
            var token = _jwtProvider.GenerateToken(user.Id, email, roles);

            return new OperationResults { Succeeded = true, Token = token };
        }

        public async Task<string> FindByIdAsyncUserEmail(string clientId)
        {
            var user = await _userManager.FindByIdAsync(clientId);
            string email = user.Email;
            return email;
        }
    }
}

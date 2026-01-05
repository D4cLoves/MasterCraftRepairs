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

        public IdentityService(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
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
    }
}

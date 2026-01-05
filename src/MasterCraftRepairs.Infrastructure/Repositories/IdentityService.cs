using System;
using System.ClientModel.Primitives;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MasterCraftRepairs.Application.Common.Interfaces;
using MasterCraftRepairs.Domain.Entities;
using MasterCraftRepairs.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;

namespace MasterCraftRepairs.Infrastructure.Repositories
{
    public class IdentityService : IIdentityService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        public async Task<OperationResult> CreateClientAsync(Client client, string password)
		{
			var appClient = new ApplicationUser
			{
				Id = client.Id,
                Email = client.email
			}
		}
    }
}

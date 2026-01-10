using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MasterCraftRepairs.Application.Common.Results;
using MasterCraftRepairs.Domain.Entities;

namespace MasterCraftRepairs.Application.Common.Interfaces
{
    public interface IIdentityService
    {
        Task<OperationResults> CreateClientAsync(Client client, string password, string email);
        Task<OperationResults> LoginClientAsync(string email, string password);
    }
}

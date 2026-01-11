using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MasterCraftRepairs.Domain.Entities;

namespace MasterCraftRepairs.Application.Common.Interfaces
{
    public interface IClientRepository
    {
        Task AddClientAsync(Client client);
        Task<Client?> GetClientByIdAsync(Guid id);
    }
}

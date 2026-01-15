using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MasterCraftRepairs.Application.Common.Interfaces;
using MasterCraftRepairs.Domain.Entities;
using MasterCraftRepairs.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MasterCraftRepairs.Infrastructure.Repositories
{
    public class ClientRepository : IClientRepository
    {
        private readonly ApplicationDbContext _context;

        public ClientRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddClientAsync(Client client)
        {
            _context.Clients.Add(client);
            await _context.SaveChangesAsync();
        }

        public async Task<Client?> GetClientByIdAsync(Guid id)
        {
            return await _context.Clients.FindAsync(id);
        }

        public async Task<IEnumerable<Client>> GetAllClientsAsync()
        {
            return await _context.Clients.ToListAsync();
        }

        public async Task UpdateClientAsync(Client client)
        {
            _context.Clients.Update(client);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteClientAsync(Guid id)
        {
            var client = await _context.Clients.FindAsync(id);
            if (client != null)
            {
                _context.Clients.Remove(client);
                await _context.SaveChangesAsync();
            }
        }
    }
}

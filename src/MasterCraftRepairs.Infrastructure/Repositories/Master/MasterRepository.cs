using MasterCraftRepairs.Application.Common.Interfaces.MasterRepo;
using MasterCraftRepairs.Domain.Entities;
using MasterCraftRepairs.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MasterCraftRepairs.Infrastructure.Repositories.Master;

public class MasterRepository : IMasterRepository
{
    private readonly ApplicationDbContext _context;

    public MasterRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddMasterAsync(Domain.Entities.Master master)
    {
        _context.Masters.Add(master);
        await _context.SaveChangesAsync();
    }

    public async Task<Domain.Entities.Master?> GetMasterByIdAsync(Guid id)
    {
        return await _context.Masters.FindAsync(id);
    }

    public async Task<IEnumerable<Domain.Entities.Master>> GetAllMastersAsync()
    {
        return await _context.Masters.ToListAsync();
    }

    public async Task UpdateMasterAsync(Domain.Entities.Master master)
    {
        _context.Masters.Update(master);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteMasterAsync(Guid id)
    {
        var master = await _context.Masters.FindAsync(id);
        if (master != null)
        {
            _context.Masters.Remove(master);
            await _context.SaveChangesAsync();
        }
    }
}

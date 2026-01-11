using MasterCraftRepairs.Application.Common.Interfaces.MasterRepo;
using MasterCraftRepairs.Domain.Entities;
using MasterCraftRepairs.Infrastructure.Data;

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
}
using MasterCraftRepairs.Domain.Entities;

namespace MasterCraftRepairs.Application.Common.Interfaces.MasterRepo;

public interface IMasterRepository
{
    Task AddMasterAsync(Master master);
    Task<Master?> GetMasterByIdAsync(Guid id);
    Task<IEnumerable<Master>> GetAllMastersAsync();
    Task UpdateMasterAsync(Master master);
    Task DeleteMasterAsync(Guid id);
}

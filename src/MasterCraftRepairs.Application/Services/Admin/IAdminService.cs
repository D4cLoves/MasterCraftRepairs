using MasterCraftRepairs.Application.Common.Results;
using MasterCraftRepairs.Application.DTOs.Admin;

namespace MasterCraftRepairs.Application.Services.Admin;

public interface IAdminService
{
    // Clients
    Task<IEnumerable<AdminClientDto>> GetAllClientsAsync();
    Task<AdminClientDto?> GetClientByIdAsync(Guid id);
    Task<OperationResults> CreateClientAsync(CreateClientDto dto);
    Task<OperationResults> UpdateClientAsync(Guid id, UpdateClientDto dto);
    Task<OperationResults> DeleteClientAsync(Guid id);

    // Masters
    Task<IEnumerable<AdminMasterDto>> GetAllMastersAsync();
    Task<AdminMasterDto?> GetMasterByIdAsync(Guid id);
    Task<OperationResults> CreateMasterAsync(CreateMasterDto dto);
    Task<OperationResults> UpdateMasterAsync(Guid id, UpdateMasterDto dto);
    Task<OperationResults> DeleteMasterAsync(Guid id);

    // Categories
    Task<IEnumerable<AdminCategoryDto>> GetAllCategoriesAsync();
    Task<AdminCategoryDto?> GetCategoryByIdAsync(Guid id);
    Task<OperationResults> CreateCategoryAsync(CreateCategoryDto dto);
    Task<OperationResults> UpdateCategoryAsync(Guid id, UpdateCategoryDto dto);
    Task<OperationResults> DeleteCategoryAsync(Guid id);

    // Orders
    Task<IEnumerable<AdminOrderDto>> GetAllOrdersAsync();
    Task<IEnumerable<AdminOrderDto>> GetMasterOrdersAsync(Guid masterId);
}

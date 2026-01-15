using MasterCraftRepairs.Application.Common.Results;
using MasterCraftRepairs.Application.DTOs;
using MasterCraftRepairs.Domain.Entities;

namespace MasterCraftRepairs.Application.Services.Other;

public interface IOrderService
{
    Task<OperationResults> CreateOrderAsync(CreateOrderDto request, Guid clientId);
    Task<OperationResults> TakeOrderAsync(Guid orderId, Guid masterId);
    Task<OperationResults> CompleteOrderAsync(Guid orderId, Guid masterId);
    Task<IEnumerable<Category>> GetCategoriesAsync();
    Task<IEnumerable<GetClientOrdersDto>> GetClientOrdersAsync(Guid clientId);
    Task<OperationResults> CancelOrderAsync(Guid orderId, Guid clientId);
    Task<OperationResults> UpdateOrderDescriptionAsync(Guid orderId, Guid clientId, string description);
    Task<IEnumerable<GetClientOrdersDto>> GetAllOrdersAsync();
    Task<IEnumerable<GetClientOrdersDto>> GetAvailableOrdersAsync();
    Task<IEnumerable<GetClientOrdersDto>> GetMasterOrdersAsync(Guid masterId);
    Task<IEnumerable<GetClientOrdersDto>> GetMasterCompletedOrdersAsync(Guid masterId);
}

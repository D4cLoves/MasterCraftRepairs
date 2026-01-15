using MasterCraftRepairs.Domain.Entities;

namespace MasterCraftRepairs.Application.Common.Interfaces;

public interface IOrderRepo
{
    Task AddOrderAsync(Order order);
    Task<Order?> GetOrderByIdAsync(Guid orderId);
    Task UpdateOrderStatusAsync(Order order);
    Task<IEnumerable<Order>> GetOrdersByClientIdAsync(Guid clientId);
    Task<Master?> GetMasterByIdAsync(Guid masterId);
    Task<IEnumerable<Order>> GetOrdersAsync();
    Task<IEnumerable<Order>> GetAvailableOrdersAsync();
    Task<IEnumerable<Order>> GetMasterOrdersAsync(Guid masterId);
    Task<IEnumerable<Order>> GetMasterCompletedOrdersAsync(Guid masterId);
}

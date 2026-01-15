using System.Linq;
using MasterCraftRepairs.Application.Common.Interfaces;
using MasterCraftRepairs.Domain.Entities;
using MasterCraftRepairs.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MasterCraftRepairs.Infrastructure;

public class OrderRepo : IOrderRepo
{
    private readonly ApplicationDbContext _context;

    public OrderRepo(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddOrderAsync(Order order)
    {
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();
    }

    public async Task<Order?> GetOrderByIdAsync(Guid orderId)
    {
        return await _context.Orders.FindAsync(orderId);
    }

    public async Task UpdateOrderStatusAsync(Order order)
    {
        var trackedEntry = _context.Orders.Local.FirstOrDefault(e => e.Id == order.Id);

        if (trackedEntry != null && ReferenceEquals(trackedEntry, order))
        {
            await _context.SaveChangesAsync();
            return;
        }

        if (trackedEntry != null)
        {
            _context.Entry(trackedEntry).State = EntityState.Detached;
        }

        var existingOrder = await _context.Orders
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.Id == order.Id);

        if (existingOrder == null)
        {
            throw new InvalidOperationException($"Order with id {order.Id} not found");
        }

        string newDiscriminatorValue = order.GetType().Name switch
        {
            nameof(NewOrder) => "New",
            nameof(OrderInProgress) => "InProgress",
            nameof(CompletedOrder) => "Completed",
            nameof(CancelledOrder) => "Cancelled",
            _ => throw new InvalidOperationException($"Unknown order type: {order.GetType().Name}")
        };

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            if (existingOrder.GetType() != order.GetType())
            {
                await _context.Database.ExecuteSqlRawAsync(
                    "UPDATE [Orders] SET [OrderType] = {0} WHERE [Id] = {1}",
                    newDiscriminatorValue,
                    order.Id);
            }

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<IEnumerable<Order>> GetOrdersByClientIdAsync(Guid clientId)
    {
        return await _context.Orders
            .Include(o => o.Product)
            .Where(o => o.ClientId == clientId)
            .ToListAsync();
    }

    public async Task<Master?> GetMasterByIdAsync(Guid masterId)
    {
        return await _context.Masters.FindAsync(masterId);
    }

    public async Task<IEnumerable<Order>> GetOrdersAsync()
    {
        return await _context.Orders
            .ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetAvailableOrdersAsync()
    {
        return await _context.Orders
            .Where(o => o is NewOrder)
            .Include(o => o.Product)
            .ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetMasterOrdersAsync(Guid masterId)
    {
        return await _context.Orders
            .Where(o => o.MasterId == masterId && o is OrderInProgress)
            .Include(o => o.Product)
            .ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetMasterCompletedOrdersAsync(Guid masterId)
    {
        return await _context.Orders
            .Where(o => o.MasterId == masterId && o is CompletedOrder)
            .Include(o => o.Product)
            .ToListAsync();
    }
}

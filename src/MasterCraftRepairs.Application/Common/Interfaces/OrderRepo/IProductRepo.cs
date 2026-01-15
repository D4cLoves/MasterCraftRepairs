using MasterCraftRepairs.Domain.Entities;

namespace MasterCraftRepairs.Application.Common.Interfaces;

public interface IProductRepo
{
    Task AddProductAsync(Product product);
    Task<Product?> GetProductByIdAsync(Guid productId);
}

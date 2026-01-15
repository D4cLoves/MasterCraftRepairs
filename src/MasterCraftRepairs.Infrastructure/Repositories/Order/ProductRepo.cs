using MasterCraftRepairs.Application.Common.Interfaces;
using MasterCraftRepairs.Domain.Entities;
using MasterCraftRepairs.Infrastructure.Data;

namespace MasterCraftRepairs.Infrastructure;

public class ProductRepo : IProductRepo
{
    private readonly ApplicationDbContext _context;
    
    public ProductRepo(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public async Task AddProductAsync(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
    }

    public async Task<Product?> GetProductByIdAsync(Guid productId)
    {
        return await _context.Products.FindAsync(productId);
    }
}

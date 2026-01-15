using MasterCraftRepairs.Application.Common.Interfaces;
using MasterCraftRepairs.Domain.Entities;
using MasterCraftRepairs.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MasterCraftRepairs.Infrastructure;

public class CategoriesRepo : ICategoriesRepo
{
    private readonly ApplicationDbContext _context;

    public CategoriesRepo(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Category>> GetCategoriesAsync()
    {
        return await _context.Categories.ToListAsync();
    }

    public async Task<Category?> GetCategoryByIdAsync(Guid categoryId)
    {
        return await _context.Categories.FindAsync(categoryId);
    }

    public async Task<Category> CreateCategoryAsync(Category category)
    {
        await _context.Categories.AddAsync(category);
        await _context.SaveChangesAsync();
        return category;
    }

    public async Task UpdateCategoryAsync(Category category)
    {
        _context.Categories.Update(category);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteCategoryAsync(Guid categoryId)
    {
        var category = await _context.Categories.FindAsync(categoryId);
        if (category != null)
        {
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
        }
    }
}

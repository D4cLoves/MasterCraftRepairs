using MasterCraftRepairs.Domain.Entities;

namespace MasterCraftRepairs.Application.Common.Interfaces;

public interface ICategoriesRepo
{
    public Task<IEnumerable<Category>> GetCategoriesAsync();
    public Task<Category?> GetCategoryByIdAsync(Guid categoryId);
    public Task<Category> CreateCategoryAsync(Category category);
    public Task UpdateCategoryAsync(Category category);
    public Task DeleteCategoryAsync(Guid categoryId);
}

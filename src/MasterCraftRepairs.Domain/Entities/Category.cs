using MasterCraftRepairs.Domain.ValueObjects;

namespace MasterCraftRepairs.Domain.Entities;

public class Category
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public CategoryName Name { get; private set; } = null!;

    // Навигационное свойство - товары категории
    private readonly List<Product> _products = new();
    public IReadOnlyCollection<Product> Products => _products.AsReadOnly();
    
    private Category() { } // For EF Core
    
    public Category(string categoryName) => Name = new CategoryName(categoryName);
    
    public void Rename(string newName) => Name = new CategoryName(newName);
}
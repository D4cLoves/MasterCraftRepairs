using MasterCraftRepairs.Domain.ValueObjects;

namespace MasterCraftRepairs.Domain.Entities;

public class Product
{
    public Guid Id { get; init; } =  Guid.NewGuid();
    public Guid CategoryId { get; private set; }
    
    public Serial SerialNumber { get; private set; }
    public Money Price { get; private set; }
    public DateOnly RealeseYear {get; private set;}
    public Brand BrandName { get; private set; }
    public Model ModelName { get; private set; }

    // Навигационное свойство - категория товара
    public Category Category { get; private set; } = null!;

    // Навигационное свойство - заказы по этому товару
    private readonly List<Order> _orders = new();
    public IReadOnlyCollection<Order> Orders => _orders.AsReadOnly();

    private Product() { } // For EF Core

    public Product(Guid categoryId, string serialNumber, decimal price, DateOnly realeseYear, string brandName,
        string modelName)
    {
        CategoryId = categoryId;
        SerialNumber = new Serial(serialNumber);
        Price = new Money(price);
        RealeseYear = realeseYear;
        BrandName = new Brand(brandName);
        ModelName = new Model(modelName);
    }

    public void UpdatePrice(decimal newPrice) => Price = new Money(newPrice);
    public void UpdateBrand(string newBrand) => BrandName = new Brand(newBrand);
    public void UpdateModel(string newModel) => ModelName = new Model(newModel);
    
    public string GetFullInfo() => $"{BrandName} {ModelName} {Price}";
}
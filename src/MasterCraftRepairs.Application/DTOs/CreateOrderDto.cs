namespace MasterCraftRepairs.Application.DTOs;

public class CreateOrderDto
{
    public string CategoryId { get; set; } = string.Empty;
    public string SerialNumber { get; set; } = string.Empty;
    public string ReleaseYear { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string Price { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

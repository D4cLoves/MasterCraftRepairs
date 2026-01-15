using MasterCraftRepairs.Domain.Entities;

namespace MasterCraftRepairs.Application.DTOs
{
    public class GetClientOrdersDto
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public Guid? MasterId { get; set; }
        public Guid ClientId { get; set; }
        
        public string CategoryName { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
        public string ReleaseYear { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public decimal Price { get; set; }
        public string OrderType { get; set; } = string.Empty;
        public string MasterName { get; set; } = string.Empty;
    }
}

namespace MasterCraftRepairs.Application.DTOs.Admin;

public class AdminClientDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Passport { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public DateOnly Birthday { get; set; }
    public string Email { get; set; } = string.Empty;
}

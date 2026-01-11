namespace MasterCraftRepairs.Application.DTOs;

public class RegisterMasterRequestDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Phone { get; set; }
    public string Passport { get; set; }
    public string Birthday { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string ConfirmPassword { get; set; }
}
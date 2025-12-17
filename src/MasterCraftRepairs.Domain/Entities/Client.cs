using MasterCraftRepairs.Domain.ValueObjects;

namespace MasterCraftRepairs.Domain.Entities;

public class Client
{
    public Guid Id { get; private set; } =  Guid.NewGuid();
    public FullName Name { get; private set; }
    public PhoneNumber Phone { get; private set; }
    public PassportNumber Passport { get; private set; }
    public Address Address { get; private set; }
    public DateOnly Birthday { get; private set; }

    private Client() { } // For EF Core

    public Client(string firstName, string lastName, string phone, 
        string passport, string address, DateOnly birthday)
    {
        Name = new FullName(firstName, lastName);
        Phone = new PhoneNumber(phone);
        Passport = new PassportNumber(passport);
        Address = new Address(address);
        Birthday = birthday;
    }
    
    public void UpdatePhone(string newPhone) => Phone = new PhoneNumber(newPhone);
    public void UpdatePassport(string newPassport) => Passport = new PassportNumber(newPassport);
    public void UpdateAddress(string newAddress) => Address = new Address(newAddress);
    internal void UpdateBirthday(DateOnly birthday) => Birthday = birthday;
    public string GetFullName() => $"{Name.FirstName} {Name.LastName}";
}
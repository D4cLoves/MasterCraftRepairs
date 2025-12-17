namespace MasterCraftRepairs.Domain.ValueObjects;

public record FullName
{
    public string FirstName { get; init; }
    public string LastName { get; init; }

    public FullName(string firstName, string lastName)
    {
        FirstName = ValidateName(firstName, nameof(firstName));
        LastName = ValidateName(lastName, nameof(lastName));
    }

    private static string ValidateName(string? value, string paramName)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Имя не может быть пустым", paramName);

        var trimmed = value.Trim();

        if (trimmed.Length == 0)
            throw new ArgumentException("Имя не может состоять только из пробелов", paramName);

        return char.ToUpper(trimmed[0]) + trimmed[1..].ToLower();
    }

    public override string ToString() => $"{LastName} {FirstName}";
}
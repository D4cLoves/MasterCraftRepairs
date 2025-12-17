namespace MasterCraftRepairs.Domain.ValueObjects;

public record Address
{
    public string Value { get; init; }

    public Address(string value)
    {
        Value = Validate(value);
    }

    private static string Validate(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Адрес не может быть пустым", nameof(value));

        var trimmed = value.Trim();

        if (trimmed.Length == 0)
            throw new ArgumentException("Адрес не может состоять только из пробелов", nameof(value));

        return char.ToUpper(trimmed[0]) + trimmed[1..].ToLower();
    }

    public override string ToString() => Value;
}
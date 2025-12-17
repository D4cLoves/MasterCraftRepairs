namespace MasterCraftRepairs.Domain.ValueObjects;

public record Brand
{
    public string Value { get; init; }

    public Brand(string value)
    {
        Value = Validate(value);
    }

    private static string Validate(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Название бренда не может быть пустым", nameof(value));

        var trimmed = value.Trim();

        if (trimmed.Length == 0)
            throw new ArgumentException("Название бренда не может состоять только из пробелов", nameof(value));

        if (trimmed.Length > 100)
            throw new ArgumentException("Название бренда слишком длинное", nameof(value));

        return char.ToUpper(trimmed[0]) + trimmed[1..].ToLower();
    }

    public override string ToString() => Value;
}
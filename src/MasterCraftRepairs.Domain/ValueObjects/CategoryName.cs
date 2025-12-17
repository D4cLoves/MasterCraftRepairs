namespace MasterCraftRepairs.Domain.ValueObjects;

public record CategoryName
{
    public string Value { get; init; }

    public CategoryName(string value)
    {
        Value = Validate(value);
    }

    private static string Validate(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Название категории не может быть пустым", nameof(value));

        var trimmed = value.Trim();

        if (trimmed.Length < 2)
            throw new ArgumentException("Название категории слишком короткое (минимум 2 символа)", nameof(value));

        if (trimmed.Length > 50)
            throw new ArgumentException("Название категории слишком длинное (максимум 50 символов)", nameof(value));

        return char.ToUpper(trimmed[0]) + trimmed[1..].ToLower();
    }

    public override string ToString() => Value;
}
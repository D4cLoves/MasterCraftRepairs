namespace MasterCraftRepairs.Domain.ValueObjects;

public record Description
{
    public string Value { get; init; }

    public Description(string value)
    {
        Value = Validate(value);
    }
    
    private static string Validate(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Описание не может быть пустым", nameof(value));

        var trimmed = value.Trim();

        if (trimmed.Length == 0)
            throw new ArgumentException("Описание состоять только из пробелов", nameof(value));

        if (trimmed.Length > 1000)
            throw new ArgumentException("Описание слишком длинное", nameof(value));

        return char.ToUpper(trimmed[0]) + trimmed[1..].ToLower();
    }
    
    public override string ToString() => Value;
}
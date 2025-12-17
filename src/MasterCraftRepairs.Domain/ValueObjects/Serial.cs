namespace MasterCraftRepairs.Domain.ValueObjects;

public record Serial
{
    public string Value { get; init; }

    public Serial(string value)
    {
        Value = Validate(value);
    }

    private static string Validate(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Серийный номер не может быть пустым", nameof(value));

        var trimmed = value.Trim();

        if (trimmed.Length == 0)
            throw new ArgumentException("Серийный номер не может состоять только из пробелов", nameof(value));

        if (trimmed.Length > 100)
            throw new ArgumentException("Серийный номер слишком длинный", nameof(value));

        return trimmed.ToUpper();
    }

    public override string ToString() => Value;
}
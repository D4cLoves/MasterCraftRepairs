namespace MasterCraftRepairs.Domain.ValueObjects;

public record Model
{
    public string Value { get; init; }

    public Model(string value)
    {
        Value = Validate(value);
    }

    private static string Validate(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Название модели не может быть пустым", nameof(value));

        var trimmed = value.Trim();

        if (trimmed.Length == 0)
            throw new ArgumentException("Название модели не может состоять только из пробелов", nameof(value));

        if (trimmed.Length > 100)
            throw new ArgumentException("Название модели слишком длинное", nameof(value));

        return trimmed.ToUpper();
    }

    public override string ToString() => Value;
}
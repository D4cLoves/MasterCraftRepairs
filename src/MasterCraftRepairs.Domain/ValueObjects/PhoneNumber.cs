namespace MasterCraftRepairs.Domain.ValueObjects;

public record PhoneNumber
{
    public string Value { get; init; }

    public PhoneNumber(string value)
    {
        Value = Validate(value);
    }

    private static string Validate(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Номер телефона не может быть пустым", nameof(value));

        var cleaned = value.Replace(" ", "").Replace("-", "").Replace("(", "").Replace(")", "");

        if (!cleaned.StartsWith("+7") && !cleaned.StartsWith("8"))
            throw new ArgumentException("Номер телефона должен начинаться с +7 или 8", nameof(value));

        if (cleaned.Length < 11)
            throw new ArgumentException("Номер телефона слишком короткий", nameof(value));

        if (cleaned.Length > 12)
            throw new ArgumentException("Номер телефона слишком длинный", nameof(value));

        return cleaned.StartsWith("+7") ? cleaned : "+7" + cleaned[1..];
    }

    public override string ToString() => Value;
}
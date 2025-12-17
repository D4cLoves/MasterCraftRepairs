namespace MasterCraftRepairs.Domain.ValueObjects;

public record PassportNumber
{
    public string Value { get; init; }

    public PassportNumber(string value)
    {
        Value = Validate(value);
    }

    private static string Validate(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Номер паспорта не может быть пустым", nameof(value));

        var cleaned = value.Trim().Replace(" ", "");

        if (cleaned.Length != 10)
            throw new ArgumentException("Номер паспорта должен содержать 10 символов", nameof(value));

        if (!cleaned.All(char.IsDigit))
            throw new ArgumentException("Номер паспорта должен содержать только цифры", nameof(value));

        return cleaned;
    }

    public override string ToString() => Value;
}
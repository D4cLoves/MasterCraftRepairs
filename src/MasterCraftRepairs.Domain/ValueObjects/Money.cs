namespace MasterCraftRepairs.Domain.ValueObjects;

public record Money
{
    public decimal Amount { get; init; }

    public Money(decimal amount)
    {
        if (amount < 0)
            throw new ArgumentException("Сумма не может быть отрицательной", nameof(amount));

        Amount = amount;
    }

    public override string ToString() => $"{Amount:C}";
}
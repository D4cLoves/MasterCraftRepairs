using System;
using MasterCraftRepairs.Domain.ValueObjects;

namespace MasterCraftRepairs.Domain.Entities;

public abstract class Order
{
    public Guid Id { get; protected set; } = Guid.NewGuid();

    public Guid ProductId { get; private set; }
    public Guid? MasterId { get; private set; }
    public Guid ClientId { get; private set; }

    public Product Product { get; private set; } = null!;
    public Master? Master { get; private set; }
    public Client Client { get; private set; } = null!;

    public DateTime StartDate { get; protected set; }
    public DateTime? EndDate { get; protected set; }

    public Money Price { get; private set; }

    public Description DescriptionOrder { get; private set; } = null!;

    protected Order() { }

    protected Order(
        Guid productId,
        Guid? masterId,
        Guid clientId,
        decimal price,
        Description descriptionOrder
    )
    {
        ProductId = productId;
        MasterId = masterId;
        ClientId = clientId;
        StartDate = DateTime.UtcNow;
        Price = new Money(price);
        DescriptionOrder = descriptionOrder;
    }

    public void UpdateDescription(string description)
    {
        DescriptionOrder = new Description(description);
    }

    public abstract Order PutIntoWork(Guid masterId);
    public abstract Order Complete(DateTime endDate);
    public abstract Order Cancel();
}

public class NewOrder : Order
{
    private NewOrder() { } // For EF Core

    public NewOrder(
        Guid productId,
        Guid? masterId,
        Guid clientId,
        decimal price,
        Description descriptionOrder
    )
        : base(productId, masterId, clientId, price, descriptionOrder) { }

    public override Order PutIntoWork(Guid masterId) =>
        new OrderInProgress(Id, ProductId, masterId, ClientId, Price, StartDate, DescriptionOrder);

    public override Order Complete(DateTime endDate) => throw new InvalidOperationException("нет");

    public override Order Cancel() =>
        new CancelledOrder(Id, ProductId, MasterId, ClientId, Price, StartDate, DescriptionOrder);
}

public class OrderInProgress : Order
{
    private OrderInProgress() { } // For EF Core

    public OrderInProgress(
        Guid id,
        Guid productId,
        Guid masterId,
        Guid clientId,
        Money price,
        DateTime startDate,
        Description descriptionOrder
    )
        : base(productId, masterId, clientId, price.Amount, descriptionOrder)
    {
        Id = id;
        StartDate = startDate;
    }

    public override Order PutIntoWork(Guid masterId) => this;

    public override Order Complete(DateTime endDate) =>
        new CompletedOrder(
            Id,
            ProductId,
            MasterId,
            ClientId,
            Price,
            StartDate,
            endDate,
            DescriptionOrder
        );

    public override Order Cancel() =>
        new CancelledOrder(Id, ProductId, MasterId, ClientId, Price, StartDate, DescriptionOrder);
}

public class CompletedOrder : Order
{
    private CompletedOrder() { } // For EF Core

    public CompletedOrder(
        Guid id,
        Guid productId,
        Guid? masterId,
        Guid clientId,
        Money price,
        DateTime startDate,
        DateTime endDate,
        Description descriptionOrder
    )
        : base(productId, masterId, clientId, price.Amount, descriptionOrder)
    {
        Id = id;
        StartDate = startDate;
        EndDate = endDate;
    }

    public override Order PutIntoWork(Guid masterId) =>
        throw new InvalidOperationException("нет, он уже завершен");

    public override Order Complete(DateTime endDate) => this;

    public override Order Cancel() => throw new InvalidOperationException("нет, он уже завершен");
}

public class CancelledOrder : Order
{
    private CancelledOrder() { } // For EF Core

    public CancelledOrder(
        Guid id,
        Guid productId,
        Guid? masterId,
        Guid clientId,
        Money price,
        DateTime startDate,
        Description descriptionOrder
    )
        : base(productId, masterId, clientId, price.Amount, descriptionOrder)
    {
        Id = id;
        StartDate = startDate;
    }

    public override Order PutIntoWork(Guid masterId) =>
        throw new InvalidOperationException("нет, он уже отменен");

    public override Order Complete(DateTime endDate) =>
        throw new InvalidOperationException("нет, он уже отменен");

    public override Order Cancel() => this;
}

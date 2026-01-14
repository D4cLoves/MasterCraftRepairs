using MasterCraftRepairs.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MasterCraftRepairs.Infrastructure.Data.Configurations;

public class OrderConfigurations : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> entity)
    {
        entity.HasKey(e => e.Id);
        entity.Property(e => e.Id).ValueGeneratedNever();

        entity.HasDiscriminator<string>("OrderType")
            .HasValue<NewOrder>("New")
            .HasValue<OrderInProgress>("InProgress")
            .HasValue<CompletedOrder>("Completed")
            .HasValue<CancelledOrder>("Cancelled");

        entity.Property(e => e.ProductId).IsRequired();
        entity.Property(e => e.MasterId);
        entity.Property(e => e.ClientId).IsRequired();

        entity.OwnsOne(o => o.Price, price =>
        {
            price.Property(m => m.Amount)
                .HasColumnName("Price")
                .HasColumnType("decimal(18,2)")
                .IsRequired();
        });

        entity.OwnsOne(o => o.DescriptionOrder, description =>
        {
            description.Property(d => d.Value)
                .HasColumnName("Description")
                .HasMaxLength(1000)
                .IsRequired();
        });

        entity.Property(e => e.StartDate)
            .HasColumnType("datetime2")
            .IsRequired();

        entity.Property(e => e.EndDate)
            .HasColumnType("datetime2");
    }
}

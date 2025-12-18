using MasterCraftRepairs.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MasterCraftRepairs.Infrastructure.Data.Configurations;

public class ProductConfigurations : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> entity)
    {
        entity.HasKey(e => e.Id);
        entity.Property(e => e.Id).ValueGeneratedNever();

        entity.Property(e => e.CategoryId)
            .IsRequired();

        entity.OwnsOne(p => p.SerialNumber, serial =>
        {
            serial.Property(s => s.Value)
                .HasColumnName("SerialNumber")
                .HasMaxLength(100)
                .IsRequired();
        });

        entity.OwnsOne(p => p.Price, price =>
        {
            price.Property(m => m.Amount)
                .HasColumnName("Price")
                .HasColumnType("decimal(18,2)")
                .IsRequired();
        });

        entity.Property(e => e.RealeseYear)
            .HasColumnType("date")
            .IsRequired();

        entity.OwnsOne(p => p.BrandName, brand =>
        {
            brand.Property(b => b.Value)
                .HasColumnName("Brand")
                .HasMaxLength(100)
                .IsRequired();
        });

        entity.OwnsOne(p => p.ModelName, model =>
        {
            model.Property(m => m.Value)
                .HasColumnName("ModelName")
                .HasMaxLength(100)
                .IsRequired();
        });

        entity.HasMany(p => p.Orders)
            .WithOne(o => o.Product)
            .HasForeignKey(o => o.ProductId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
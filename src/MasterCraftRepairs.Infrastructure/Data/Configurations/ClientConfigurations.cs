using MasterCraftRepairs.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MasterCraftRepairs.Infrastructure.Data.Configurations;

public class ClientConfigurations : IEntityTypeConfiguration<Client>
{
    public void Configure(EntityTypeBuilder<Client> entity)
    {
        entity.HasKey(e => e.Id);
        entity.Property(e => e.Id).ValueGeneratedNever();

        entity.OwnsOne(c => c.Name, name =>
        {
            name.Property(n => n.FirstName)
                .HasColumnName("FirstName")
                .HasMaxLength(100)
                .IsRequired();

            name.Property(n => n.LastName)
                .HasColumnName("LastName")
                .HasMaxLength(100)
                .IsRequired();
        });

        entity.OwnsOne(c => c.Phone, phone =>
        {
            phone.Property(e => e.Value)
                .HasColumnName("Phone")
                .HasMaxLength(20)
                .IsRequired();
        });

        entity.OwnsOne(c => c.Passport, passport =>
        {
            passport.Property(e => e.Value)
                .HasColumnName("Passport")
                .HasMaxLength(50)
                .IsRequired();
        });

        entity.OwnsOne(c => c.Address, address =>
        {
            address.Property(e => e.Value)
                .HasColumnName("Address")
                .HasMaxLength(500)
                .IsRequired();
        });

        entity.Property(e => e.Birthday)
            .HasColumnType("date")
            .IsRequired();

        entity.HasMany(c => c.Orders)
            .WithOne(o => o.Client)
            .HasForeignKey(o => o.ClientId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
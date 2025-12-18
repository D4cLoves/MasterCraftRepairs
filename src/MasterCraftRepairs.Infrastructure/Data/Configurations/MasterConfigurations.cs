using MasterCraftRepairs.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MasterCraftRepairs.Infrastructure.Data.Configurations;

public class MasterConfigurations : IEntityTypeConfiguration<Master>
{
    public void Configure(EntityTypeBuilder<Master> entity)
    {
        entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedNever();

            entity.OwnsOne(m => m.Name, name =>
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

            entity.OwnsOne(m => m.Phone, phone =>
            {
                phone.Property(e => e.Value)
                    .HasColumnName("Phone")
                    .HasMaxLength(20)
                    .IsRequired();
            });

            entity.OwnsOne(m => m.Passport, passport =>
            {
                passport.Property(e => e.Value)
                    .HasColumnName("Passport")
                    .HasMaxLength(50)
                    .IsRequired();
            });

            entity.Property(e => e.Birthday)
                .HasColumnType("date")
                .IsRequired();

            entity.HasMany(m => m.Orders)
                .WithOne(o => o.Master)
                .HasForeignKey(o => o.MasterId)
                .OnDelete(DeleteBehavior.Restrict);
    }
}
using MasterCraftRepairs.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace MasterCraftRepairs.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public DbSet<Client> Clients { get; set; }
    public DbSet<Master> Masters { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Order> Orders { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Client>(entity =>
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

            // Client - Orders (one-to-many)
            entity.HasMany(c => c.Orders)
                .WithOne(o => o.Client)
                .HasForeignKey(o => o.ClientId)
                .OnDelete(DeleteBehavior.Restrict);
        });
        
        modelBuilder.Entity<Master>(entity =>
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

            // Master - Orders (one-to-many)
            entity.HasMany(m => m.Orders)
                .WithOne(o => o.Master)
                .HasForeignKey(o => o.MasterId)
                .OnDelete(DeleteBehavior.Restrict);
        });
        
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedNever();

            entity.OwnsOne(c => c.Name, name =>
            {
                name.Property(n => n.Value)
                    .HasColumnName("CategoryName")
                    .HasMaxLength(100)
                    .IsRequired();
            });

            // Category - Products (one-to-many)
            entity.HasMany(c => c.Products)
                .WithOne(p => p.Category)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });
        
        modelBuilder.Entity<Product>(entity =>
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

            // Product - Orders (one-to-many)
            entity.HasMany(p => p.Orders)
                .WithOne(o => o.Product)
                .HasForeignKey(o => o.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedNever();

            entity.HasDiscriminator<string>("OrderType")
                .HasValue<NewOrder>("New")
                .HasValue<OrderInProgress>("InProgress")
                .HasValue<CompletedOrder>("Completed")
                .HasValue<CancelledOrder>("Cancelled");

            entity.Property(e => e.ProductId).IsRequired();
            entity.Property(e => e.MasterId).IsRequired();
            entity.Property(e => e.ClientId).IsRequired();

            entity.OwnsOne(o => o.Price, price =>
            {
                price.Property(m => m.Amount)
                    .HasColumnName("Price")
                    .HasColumnType("decimal(18,2)")
                    .IsRequired();
            });

            entity.Property(e => e.StartDate)
                .HasColumnType("datetime2")
                .IsRequired();

            entity.Property(e => e.EndDate)
                .HasColumnType("datetime2");
        });
    }
}
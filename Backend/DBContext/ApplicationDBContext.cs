using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore;
using API.Model;
using Backend.Model;

namespace API.DBContext
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
        {
        }


        public DbSet<User> Users { get; set; }
        public DbSet<TokenModel> TokenModels { get; set; }
        public DbSet<SystemSetting> SystemSetting { get; set; }
        public DbSet<ChatModel> ChatModels { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<SaleDetail> SaleDetails { get; set; }
        public DbSet<Sale> Sales { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // modelBuilder.Entity<GateModel>().Property(e => e.CreatedDate)
            // .Metadata.SetAfterSaveBehavior(PropertySaveBehavior.Ignore);

            // // Adding the code below tells DB "NumericId is an AlternateKey and don't update".
            // // modelBuilder.Entity<CertificateModel>().Property(e => e.applicationNo)
            // // .Metadata.SetAfterSaveBehavior(PropertySaveBehavior.Ignore);

            modelBuilder.Entity<SystemSetting>()
                .Property(e => e.IMAmount)
                .HasPrecision(18, 4); // e.g., 18 total digits, 4 after decimal

            modelBuilder.Entity<SystemSetting>()
                .Property(e => e.MOCAmount)
                .HasPrecision(18, 4);

            modelBuilder.Entity<SystemSetting>()
                .Property(e => e.OnlineFees)
                .HasPrecision(18, 4);

            modelBuilder.Entity<Product>(entity =>
            {
                entity.Property(p => p.CostPrice).HasPrecision(18, 4);
                entity.Property(p => p.RetailPrice).HasPrecision(18, 4);
                entity.Property(p => p.WholesalePrice).HasPrecision(18, 4);
            });

            modelBuilder.Entity<Sale>(entity =>
            {
                entity.Property(p => p.AmountPaid).HasPrecision(18, 4);
                entity.Property(p => p.DeliveryFee).HasPrecision(18, 4);
                entity.Property(p => p.Discount).HasPrecision(18, 4);
                entity.Property(p => p.Subtotal).HasPrecision(18, 4);
                entity.Property(p => p.Tax).HasPrecision(18, 4);
            });

            modelBuilder.Entity<SaleDetail>(entity =>
            {
                entity.Property(p => p.UnitPrice).HasPrecision(18, 4);
            });
        }
    }
}

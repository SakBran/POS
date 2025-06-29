using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Model
{
    public class Sale : BasePOSClass
    {

        [Key]
        public required int Id { get; set; }

        // Optional: For credit or wholesale customers
        public string? CustomerId { get; set; }
        public string? CustomerName { get; set; } = "Walk in customer";

        public DateTime SaleDate { get; set; } = DateTime.Now;
        public string VoucherNumber { get; set; } = string.Empty;

        public string SaleType { get; set; } = "Retail"; // Retail or Wholesale

        // Financial fields
        public decimal Subtotal { get; set; }
        public decimal Discount { get; set; }
        public decimal Total => Subtotal - Discount;

        public decimal AmountPaid { get; set; }
        public decimal Balance => Total - AmountPaid;

        public string PaymentMethod { get; set; } = "Cash"; // Cash, KPay, Credit, etc.

        public bool IsPaidInFull => Balance <= 0;

        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

    }
}
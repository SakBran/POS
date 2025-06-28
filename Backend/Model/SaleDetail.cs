using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Model
{
    public class SaleDetail : BasePOSClass
    {
        public SaleDetail()
        {
            Id = Guid.NewGuid().ToString();
        }
        [Key]
        public string Id { get; set; }

        public required string SaleId { get; set; } = String.Empty;

        public required string ProductId { get; set; }
        public required string Name { get; set; }

        public required string UnitId { get; set; }                // e.g., Box, Dozen

        public int Quantity { get; set; }              // e.g., 2 Dozen
        public int QuantityInBase { get; set; }        // Auto-calculated: 2 × 12 = 24

        public decimal UnitPrice { get; set; }         // Price per base unit
        public decimal Total => UnitPrice * QuantityInBase;
        public string? Remarks { get; set; }
    }
}
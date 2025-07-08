using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Model
{
    public class ProductUnit
    {
        public ProductUnit()
        {
            Id = Guid.NewGuid().ToString();
        }

        public string Id { get; set; }
        public string? ProductId { get; set; } // FK to Product
        public string UnitName { get; set; } = string.Empty; // e.g., "Dozen"
        public int QuantityInBaseUnit { get; set; } // e.g., 12
        public decimal Price { get; set; } // Price for this unit (optional)
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Model
{
    public class Product
    {
        public Product()
        {
            this.Id = Guid.NewGuid().ToString();
        }
        public string Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Barcode { get; set; } = string.Empty;
        public string? CategoryId { get; set; }

        // Pricing
        public decimal CostPrice { get; set; }         // Price you bought it for
        public decimal RetailPrice { get; set; }       // Price to retail customers
        public decimal WholesalePrice { get; set; }    // Price to wholesale customers

        public bool IsActive { get; set; } = true;
        public string CreatedUserId { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
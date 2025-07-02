using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
        [Key]
        public string Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
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

        public bool HasVariants { get; set; } = false;
        public string? ParentId { get; set; }
    }
}
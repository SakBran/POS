using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers.Products.Request
{
    public class VariantDto
    {
        public bool HasVariants { get; set; } = false;
        public Dictionary<string, string> VariantInputs { get; set; } = new Dictionary<string, string>();
        public List<VariantGroupDto> Variants { get; set; } = new List<VariantGroupDto>();
        public string? ProductId { get; set; }
    }

    public class VariantInputs
    {
        public string? Colour { get; set; } // Example: "Red,Green,Blue"
        public string? Size { get; set; }   // Example: "Small,Medium,Large"
        public string? ProductId { get; set; }
    }

    public class VariantGroupDto
    {
        public string? Title { get; set; } // Colour name
        public List<VariantItemDto> Items { get; set; } = new List<VariantItemDto>();
    }

    public class VariantItemDto
    {
        public string? Name { get; set; } // Size
        public decimal Price { get; set; }
        public int Stock { get; set; }
    }
}
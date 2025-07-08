using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers.Products.DTO
{
    public class ProductUnitDTO
    {
        public string ProductId { get; set; } = string.Empty;

        public string UnitName { get; set; } = string.Empty;

        public int QuantityInBaseUnit { get; set; }

        public decimal Price { get; set; }
    }
    public class ProductUnitListDTO
    {
        public List<ProductUnitDTO> Units { get; set; } = new();
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Model
{
    public class VariantInput
    {
        public VariantInput()
        {
            Id = Guid.NewGuid().ToString();
        }
        public string Id { get; set; }
        public string? VariantKey { get; set; }
        public string? VariantInputs { get; set; }
        public string? ProductId { get; set; }
    }
}
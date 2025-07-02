using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Model
{
    public class ColourAttrributes : BasePOSClass
    {
        public ColourAttrributes()
        {
            Id = Guid.NewGuid().ToString();
        }
        public string Id { get; set; }

        public required string Colour { get; set; }
    }
}
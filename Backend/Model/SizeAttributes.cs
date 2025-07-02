using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Model
{

    public class SizeAttributes : BasePOSClass
    {
        public SizeAttributes()
        {
            Id = Guid.NewGuid().ToString();
        }
        public string Id { get; set; }

        public required string Size { get; set; }
    }
}
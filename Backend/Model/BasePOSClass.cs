using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Model
{
    public class BasePOSClass
    {
        public string? StoreId { get; set; }
        public string? StoreName { get; set; }
        public string? RootUserId { get; set; }
    }
}
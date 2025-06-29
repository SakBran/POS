using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers.Sale.Request
{
    public class AddRequest
    {
        public required string ProductId { get; set; }
        public required string SalesId { get; set; }
    }
}
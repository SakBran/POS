using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers.Sale.Request
{
    public class EditQuantityRequest : AddRequest
    {
        public int Quantity { get; set; }
    }
}
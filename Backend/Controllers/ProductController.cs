using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Controllers;
using API.DBContext;
using Backend.Model;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : BaseAPIController<Product>
    {
        public ProductController(ApplicationDbContext context) : base(context)
        {
        }
    }
}
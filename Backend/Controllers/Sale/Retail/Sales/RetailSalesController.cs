using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DBContext;
using API.Migrations;
using Backend.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers.Sale.Retail.Sales
{
    [ApiController]
    [Route("api/[controller]")]
    public class RetailSalesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IGetaccessTokenService _loginCredential;
        public RetailSalesController(ApplicationDbContext context, IGetaccessTokenService loginCredential)
        {
            _context = context;
            _loginCredential = loginCredential;
        }

        [HttpPut("PaymentRecord/{id}")]
        public async Task<IActionResult> PaymentRecord([FromRoute] string id, [FromBody] Model.Sale data)
        {
            data.Id = id;
            if (await _context.Sales.AnyAsync(x => x.Id == id))
            {
                var oldData = await _context.Sales.FirstOrDefaultAsync(x => x.Id == id);
                if (oldData != null)
                {
                    _context.Entry(oldData).State = EntityState.Detached;
                }
                _context.Entry(data).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok(data);
            }

            data.Id = data.VoucherNumber;
            data.RootUserId = await _loginCredential.GetLoginUserId();
            await _context.Sales.AddAsync(data);
            await _context.SaveChangesAsync();
            return Ok(data);
        }

        [HttpGet("GetByVoucherNo/{id}")]
        public async Task<IActionResult> GetByVoucherNo(string id)
        {
            if (await _context.Sales.AnyAsync(x => x.Id == id))
            {
                return Ok(await _context.Sales.FirstOrDefaultAsync(x => x.Id == id));
            }

            return NotFound();
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DBContext;
using API.Model;
using Backend.Controllers.Sale.Request;
using Backend.Interface;
using Backend.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Controllers.Sale
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class RetailController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IGetaccessTokenService _loginCredential;
        public RetailController(ApplicationDbContext context, IGetaccessTokenService loginCredential)
        {
            _context = context;
            _loginCredential = loginCredential;
        }

        [HttpGet("GetByCartId")]
        public async Task<ApiResult<SaleDetail>> GetByCartId(int pageIndex = 0,
                  int pageSize = 10,
                  string? sortColumn = null,
                  string? sortOrder = null,
                  string? filterColumn = null,
                  string? filterQuery = null,
                  string? saleId = null)
        {
            var loginUserId = await _loginCredential.GetLoginUserId();
            var query = _context.SaleDetails.Where(x => x.RootUserId == loginUserId).AsNoTracking();
            if (!saleId.IsNullOrEmpty())
            {
                query = query.Where(x => x.SaleId == saleId);
            }
            var result = await ApiResult<SaleDetail>.CreateAsync(
                    query,
                    pageIndex,
                    pageSize,
                    sortColumn,
                    sortOrder,
                    filterColumn,
                    filterQuery);
            return result;
        }

        [HttpPost("AddByTable")]
        public async Task<IActionResult> AddByTable(AddRequest data)
        {
            var loginUserId = await _loginCredential.GetLoginUserId();
            if (loginUserId == null)
            {
                return Unauthorized("Request User is not valid!");
            }
            var product = await _context.Products.AsNoTracking().Where(x => x.Id == data.ProductId && x.IsActive != false).FirstOrDefaultAsync();

            if (product != null)
            {
                var saleData = await _context.SaleDetails.Where(x => x.RootUserId == loginUserId && x.ProductId == product.Id && x.SaleId == data.SalesId).FirstOrDefaultAsync();
                if (saleData != null)
                {
                    saleData.Quantity = saleData.Quantity + 1;
                    await _context.SaveChangesAsync();
                }
                else
                {
                    saleData = new SaleDetail
                    {
                        SaleId = data.SalesId,
                        ProductId = product.Id,
                        UnitPrice = product.RetailPrice,
                        Name = product.Name,
                        RootUserId = loginUserId,
                        UnitId = "1",
                        Quantity = 1,
                        QuantityInBase = 1
                    };
                    await _context.SaleDetails.AddAsync(saleData);
                    await _context.SaveChangesAsync();
                }

                return Ok(saleData);
            }
            else
            {
                return NotFound("Product does not exist anymore!");
            }

        }

    }
}
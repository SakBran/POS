using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Controllers;
using API.DBContext;
using API.Model;
using Backend.Controllers.Products.DTO;
using Backend.Controllers.Products.Request;
using Backend.Interface;
using Backend.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : BaseAPIController<Product>
    {
        private readonly ApplicationDbContext _context;
        private readonly IGetaccessTokenService _loginCredential;
        public ProductController(ApplicationDbContext context, IGetaccessTokenService loginCredential) : base(context)
        {
            _context = context;
            _loginCredential = loginCredential;
        }
        [HttpGet]
        [Authorize]
        public override async Task<ActionResult<ApiResult<Product>>> Get(
                  int pageIndex = 0,
                  int pageSize = 10,
                  string? sortColumn = null,
                  string? sortOrder = null,
                  string? filterColumn = null,
                  string? filterQuery = null)
        {

            var loginUserId = await _loginCredential.GetLoginUserId();
            var query = _context.Products.Where(x => x.RootUserId == loginUserId && x.ParentId == null);
            //query = query.Where(x => x.HasVariants == false);
            return await ApiResult<Product>.CreateAsync(
                    query,
                    pageIndex,
                    pageSize,
                    sortColumn,
                    sortOrder,
                    filterColumn,
                    filterQuery);
        }

        [HttpGet("GetVariantProducts")]
        [Authorize]
        public async Task<ActionResult<ApiResult<Product>>> GetVariantProducts(
                  int pageIndex = 0,
                  int pageSize = 10,
                  string? sortColumn = null,
                  string? sortOrder = null,
                  string? filterColumn = null,
                  string? filterQuery = null)
        {

            var loginUserId = await _loginCredential.GetLoginUserId();
            var query = _context.Products.Where(x => x.RootUserId == loginUserId);
            query = query.Where(x => x.HasVariants == false);
            return await ApiResult<Product>.CreateAsync(
                    query,
                    pageIndex,
                    pageSize,
                    sortColumn,
                    sortOrder,
                    filterColumn,
                    filterQuery);
        }

        [Authorize]
        [HttpPost]
        public override async Task<ActionResult<Product>> PostData(Product data)
        {
            var loginUserId = await _loginCredential.GetLoginUserId();
            data.RootUserId = loginUserId;
            await _context.Products.AddAsync(data);
            await _context.SaveChangesAsync();
            return Ok(data);
        }

        [Authorize]
        [HttpPut("{id}")]
        public override async Task<IActionResult> PutData(string id, Product obj)
        {
            var loginUserId = await _loginCredential.GetLoginUserId();
            obj.RootUserId = loginUserId;
            var oldData = await _context.FindAsync<Product>(id);
            if (oldData != null)
            {
                _context.Entry(oldData).State = EntityState.Detached;
            }

            _context.Entry(obj).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Concurrency error occurred.");
            }
            return Ok(obj);
        }

        [HttpPut("Variants/{id}")]
        [Authorize]
        public async Task<IActionResult> Variants(string id, VariantDto postData)
        {
            var loginUserId = await _loginCredential.GetLoginUserId();
            var product = await _context.Products.Where(x => x.Id == id && x.RootUserId == loginUserId).FirstOrDefaultAsync();
            if (product == null)
            {
                return NotFound();
            }

            product.HasVariants = postData.HasVariants;

            List<VariantInput> vinputList = new List<VariantInput>();
            if (postData.VariantInputs is Dictionary<string, string> variantInputs)
            {
                foreach (var kv in variantInputs)
                {
                    var vi = new VariantInput
                    {
                        ProductId = product.Id,
                        VariantKey = kv.Key,      // "Colour"
                        VariantInputs = kv.Value     // "Red,Green,Blue"
                    };
                    var isV_Exist = await _context.VariantInputs.Where(x => x.VariantKey == vi.VariantKey && x.ProductId == vi.ProductId).FirstOrDefaultAsync();
                    if (isV_Exist != null)
                    {
                        isV_Exist.VariantInputs = vi.VariantInputs;
                    }
                    else
                    {
                        vinputList.Add(vi);
                    }

                }
            }
            await _context.VariantInputs.AddRangeAsync(vinputList);

            var ProductListToSave = new List<Product>();
            foreach (var Variant in postData.Variants)
            {

                foreach (var value in Variant.Items)
                {
                    var existingProduct = await _context.Products.Where(x => x.Id == value.Id).FirstOrDefaultAsync();
                    if (existingProduct != null)
                    {
                        existingProduct.Name = product.Name + " " + Variant.Title + " " + (value?.Name ?? "");
                        existingProduct.Stock = value?.Stock ?? existingProduct.Stock;
                        existingProduct.RetailPrice = value?.Price ?? product.RetailPrice;
                        existingProduct.WholesalePrice = value?.Price ?? product.WholesalePrice;
                        existingProduct.RootUserId = loginUserId;
                    }
                    else
                    {
                        var p = new Product();
                        p.ParentId = product.Id;
                        p.Title = Variant.Title;
                        p.Name = product.Name + " " + Variant.Title + " " + value?.Name ?? "";
                        p.RetailPrice = value?.Price ?? product.RetailPrice;
                        p.WholesalePrice = value?.Price ?? product.WholesalePrice;
                        p.Stock = value?.Stock ?? 0;
                        p.RootUserId = loginUserId;
                        ProductListToSave.Add(p);
                    }
                }
            }
            await _context.AddRangeAsync(ProductListToSave);

            await _context.SaveChangesAsync();
            var dto = await GetVariantsForProduct(id);
            return Ok(dto);
        }

        [HttpPut("Units/{id}")]
        [Authorize]
        public async Task<IActionResult> Units(string id, ProductUnitListDTO postData)
        {
            var loginUserId = await _loginCredential.GetLoginUserId();
            var product = await _context.Products.Where(x => x.Id == id && x.RootUserId == loginUserId).FirstOrDefaultAsync();
            if (product == null)
            {
                return NotFound();
            }

            // Clear existing units
            var existingUnits = await _context.ProductUnits.Where(x => x.ProductId == id).ToListAsync();
            _context.ProductUnits.RemoveRange(existingUnits);

            // Add new units
            var newUnits = postData.Units.Select(unit => new ProductUnit
            {
                ProductId = id,
                UnitName = unit.UnitName,
                QuantityInBaseUnit = unit.QuantityInBaseUnit,
                Price = unit.Price
            });
            await _context.ProductUnits.AddRangeAsync(newUnits);

            await _context.SaveChangesAsync();
            var dto = await GetUnitsForProduct(id);
            return Ok(dto);
        }

        [HttpGet("GetProductWithUnits/{id}")]
        [Authorize]

        public async Task<IActionResult> GetProductWithUnits(string id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }
            var dto = await GetUnitsForProduct(id);

            return Ok(dto);
        }


        [HttpGet("GetProductWithVariants/{id}")]
        [Authorize]

        public async Task<IActionResult> GetProductWithVariants(string id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }
            var dto = await GetVariantsForProduct(id);

            return Ok(dto);
        }

        private async Task<VariantDto> GetVariantsForProduct(string productId)
        {
            // 1. Fetch saved VariantInputs (Colour, Size, etc.)
            var inputs = await _context.VariantInputs
                .Where(v => v.ProductId == productId)
                .ToListAsync();

            // Build the dictionary: { "Colour": "Red,Green,Blue", ... }
            var variantInputsDict = inputs
                .GroupBy(vi => vi.VariantKey!)
                .ToDictionary(
                    g => g.Key,
                    g => string.Join(",", g.Select(x => x.VariantInputs))
                );

            // 2. Fetch all child products you saved as variants
            var variantProducts = await _context.Products
                .Where(p => p.ParentId == productId)
                .ToListAsync();

            // 3. Group by Title (e.g. "Red", "Green", "Blue") to form VariantGroupDto
            var variantGroups = variantProducts
                .GroupBy(p => p.Title)
                .Select(g => new VariantGroupDto
                {
                    Title = g.Key,                     // Colour name
                    Items = g.Select(p => new VariantItemDto
                    {
                        Id = p.Id,
                        Name = p.Name,                // Size name
                        Price = p.RetailPrice,         // or choose the right price field
                        Stock = p.Stock
                    }).ToList()
                })
                .ToList();

            // 4. Put it all into your VariantDto
            var dto = new VariantDto
            {
                ProductId = productId,
                HasVariants = variantGroups.Count > 0,
                VariantInputs = variantInputsDict,
                Variants = variantGroups
            };

            return dto;
        }


        private async Task<ProductUnitListDTO> GetUnitsForProduct(string productId)
        {
            // 1. Fetch saved UnitInputs (e.g., Box, Dozen)
            var inputs = await _context.ProductUnits
                .Where(v => v.ProductId == productId)
                .ToListAsync();

            // 2. Map to ProductUnitDTO
            var dtos = inputs.Select(v => new ProductUnitDTO
            {
                ProductId = v.ProductId ?? string.Empty,
                UnitName = v.UnitName,
                QuantityInBaseUnit = v.QuantityInBaseUnit,
                Price = v.Price
            }).ToList();
            var dto = new ProductUnitListDTO
            {
                Units = dtos
            };
            return dto;
        }


    }
}
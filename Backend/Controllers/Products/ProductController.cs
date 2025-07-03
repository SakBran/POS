using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Controllers;
using API.DBContext;
using Backend.Controllers.Products.Request;
using Backend.Interface;
using Backend.Model;
using Microsoft.AspNetCore.Authorization;
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

        [HttpPut("Variants")]
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
                    vinputList.Add(vi);
                }
            }
            await _context.VariantInputs.AddRangeAsync(vinputList);

            var ProductListToSave = new List<Product>();
            foreach (var Variant in postData.Variants)
            {

                foreach (var value in Variant.Items)
                {
                    var p = new Product();
                    p.ParentId = product.Id;
                    p.Title = Variant.Title;
                    p.Name = value?.Name ?? "";
                    p.RetailPrice = value?.Price ?? product.RetailPrice;
                    p.WholesalePrice = value?.Price ?? product.WholesalePrice;
                    p.Stock = value?.Stock ?? 0;
                    ProductListToSave.Add(p);
                }
            }
            await _context.AddRangeAsync(ProductListToSave);

            await _context.SaveChangesAsync();
            return Ok();
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
                .ToDictionary(
                    vi => vi.VariantKey!,
                    vi => vi.VariantInputs!
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





    }
}
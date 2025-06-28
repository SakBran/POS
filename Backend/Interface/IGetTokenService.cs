using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DBContext;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Backend.Interface
{
    public class GetAccessTokenService : IGetaccessTokenService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ApplicationDbContext _context;

        public GetAccessTokenService(IHttpContextAccessor httpContextAccessor, ApplicationDbContext context)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
        }
        public string GetaccessTokenAsync()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null)
            {
                return "";
            }

            var authHeader = httpContext.Request.Headers.Authorization.ToString();
            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
            {
                string accessToken = authHeader["Bearer ".Length..].Trim();
                return accessToken;
            }
            return "";
        }

        public async Task<string?> GetLoginUserId()
        {
            var member = await _context.TokenModels.Where(x => x.Token == GetaccessTokenAsync()).FirstOrDefaultAsync();
            return member?.UserId;
        }
    }

    public interface IGetaccessTokenService
    {
        string GetaccessTokenAsync();
        Task<string?> GetLoginUserId();
    }
}
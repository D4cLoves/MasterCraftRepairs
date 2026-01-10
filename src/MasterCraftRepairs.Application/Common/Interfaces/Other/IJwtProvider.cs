using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterCraftRepairs.Application.Common.Interfaces
{
    public interface IJwtProvider
    {
        public string GenerateToken(string userId, string email, IList<string> roles);
    }
}

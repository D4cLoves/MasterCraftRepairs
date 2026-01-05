using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterCraftRepairs.Application.Common.Results
{
    public class UserResult
    {
        public bool Found { get; set; }
        public string? Id { get; set; }
        public string? Email { get; set; }
        public List<string> Roles { get; set; } = new();
        public Dictionary<string, string> Claims { get; set; } = new();
    }
}

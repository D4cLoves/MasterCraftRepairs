using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterCraftRepairs.Application.Common.Results
{
    public class OperationResults
    {
        public bool Succeeded { get; set; }
        public List<string> Errors { get; set; } = new();
        public string? Token { get; set; }
    }
}

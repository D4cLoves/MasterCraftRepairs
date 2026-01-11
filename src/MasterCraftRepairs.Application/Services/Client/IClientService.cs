using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MasterCraftRepairs.Application.Common.Results;
using MasterCraftRepairs.Application.DTOs;

namespace MasterCraftRepairs.Application.Services
{
    public interface IClientService
    {
        Task<OperationResults> RegisterClientAsync(RegisterClientRequestDto request);
        Task<OperationResults> LoginClientAsync(LoginUserDto request);
    }
}

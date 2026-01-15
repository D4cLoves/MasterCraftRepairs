using MasterCraftRepairs.Application.Common.Results;
using MasterCraftRepairs.Application.DTOs;

namespace MasterCraftRepairs.Application.Services
{
    public interface IMasterService
    {
        Task<OperationResults> RegisterMasterAsync(RegisterMasterRequestDto request);
        Task<OperationResults> LoginMasterAsync(LoginUserDto request);
        Task<MasterProfileDto?> GetProfileAsync(Guid masterId);
        Task<OperationResults> UpdateProfileAsync(Guid masterId, UpdateMasterProfileDto request);
    }
}

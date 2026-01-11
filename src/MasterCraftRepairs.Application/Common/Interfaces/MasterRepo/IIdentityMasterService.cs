using MasterCraftRepairs.Application.Common.Results;
using MasterCraftRepairs.Domain.Entities;

namespace MasterCraftRepairs.Application.Common.Interfaces.MasterRepo;

public interface IIdentityMasterService
{
    Task<OperationResults> CreateMasterAsync(Master master, string password, string email);
    Task<OperationResults> LoginMasterAsync(string email, string password);
    Task<string> FindByIdAsyncUserEmail(string clientId);
}
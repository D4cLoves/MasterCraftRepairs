using System.Reflection;
using MasterCraftRepairs.Application.Common.Interfaces;
using MasterCraftRepairs.Application.Common.Interfaces.MasterRepo;
using MasterCraftRepairs.Application.Common.Results;
using MasterCraftRepairs.Application.DTOs.Admin;
using MasterCraftRepairs.Application.Services.Admin;
using MasterCraftRepairs.Domain.Entities;
using MasterCraftRepairs.Domain.ValueObjects;
using MasterCraftRepairs.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;

namespace MasterCraftRepairs.Infrastructure.Services.Admin;

public class AdminService : IAdminService
{
    private readonly IClientRepository _clientRepository;
    private readonly IMasterRepository _masterRepository;
    private readonly ICategoriesRepo _categoriesRepo;
    private readonly IOrderRepo _orderRepo;
    private readonly IProductRepo _productRepo;
    private readonly IIdentityClientService _identityClientService;
    private readonly IIdentityMasterService _identityMasterService;
    private readonly UserManager<ApplicationUser> _userManager;

    public AdminService(
        IClientRepository clientRepository,
        IMasterRepository masterRepository,
        ICategoriesRepo categoriesRepo,
        IOrderRepo orderRepo,
        IProductRepo productRepo,
        IIdentityClientService identityClientService,
        IIdentityMasterService identityMasterService,
        UserManager<ApplicationUser> userManager)
    {
        _clientRepository = clientRepository;
        _masterRepository = masterRepository;
        _categoriesRepo = categoriesRepo;
        _orderRepo = orderRepo;
        _productRepo = productRepo;
        _identityClientService = identityClientService;
        _identityMasterService = identityMasterService;
        _userManager = userManager;
    }

    public async Task<IEnumerable<AdminClientDto>> GetAllClientsAsync()
    {
        var clients = await _clientRepository.GetAllClientsAsync();
        var result = new List<AdminClientDto>();

        foreach (var client in clients)
        {
            var email = await _identityClientService.FindByIdAsyncUserEmail(client.Id.ToString());
            result.Add(new AdminClientDto
            {
                Id = client.Id,
                FirstName = client.Name.FirstName,
                LastName = client.Name.LastName,
                Phone = client.Phone.Value,
                Passport = client.Passport.Value,
                Address = client.Address.Value,
                Birthday = client.Birthday,
                Email = email
            });
        }

        return result;
    }

    public async Task<AdminClientDto?> GetClientByIdAsync(Guid id)
    {
        var client = await _clientRepository.GetClientByIdAsync(id);
        if (client == null) return null;

        var email = await _identityClientService.FindByIdAsyncUserEmail(client.Id.ToString());
        return new AdminClientDto
        {
            Id = client.Id,
            FirstName = client.Name.FirstName,
            LastName = client.Name.LastName,
            Phone = client.Phone.Value,
            Passport = client.Passport.Value,
            Address = client.Address.Value,
            Birthday = client.Birthday,
            Email = email
        };
    }

    public async Task<OperationResults> CreateClientAsync(CreateClientDto dto)
    {
        try
        {
            var client = new Client(
                dto.FirstName,
                dto.LastName,
                dto.Phone,
                dto.Passport,
                dto.Address,
                dto.Birthday
            );

            var identityResult = await _identityClientService.CreateClientAsync(client, dto.Password, dto.Email);
            if (!identityResult.Succeeded)
            {
                return identityResult;
            }

            await _clientRepository.AddClientAsync(client);
            return new OperationResults { Succeeded = true };
        }
        catch (Exception ex)
        {
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { ex.Message }
            };
        }
    }

    public async Task<OperationResults> UpdateClientAsync(Guid id, UpdateClientDto dto)
    {
        var client = await _clientRepository.GetClientByIdAsync(id);
        if (client == null)
        {
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { "Клиент не найден" }
            };
        }

        try
        {
            client.UpdatePhone(dto.Phone);
            client.UpdatePassport(dto.Passport);
            client.UpdateAddress(dto.Address);

            var birthdayProperty = typeof(Client).GetProperty("Birthday", BindingFlags.Public | BindingFlags.Instance);
            if (birthdayProperty != null)
            {
                birthdayProperty.SetValue(client, dto.Birthday);
            }

            var nameProperty = typeof(Client).GetProperty("Name", BindingFlags.Public | BindingFlags.Instance);
            if (nameProperty != null)
            {
                var name = new FullName(dto.FirstName, dto.LastName);
                nameProperty.SetValue(client, name);
            }

            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user != null && user.Email != dto.Email)
            {
                user.Email = dto.Email;
                user.UserName = dto.Email;
                await _userManager.UpdateAsync(user);
            }

            await _clientRepository.UpdateClientAsync(client);
            return new OperationResults { Succeeded = true };
        }
        catch (Exception ex)
        {
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { ex.Message }
            };
        }
    }

    public async Task<OperationResults> DeleteClientAsync(Guid id)
    {
        var client = await _clientRepository.GetClientByIdAsync(id);
        if (client == null)
        {
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { "Клиент не найден" }
            };
        }

        try
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user != null)
            {
                await _userManager.DeleteAsync(user);
            }

            await _clientRepository.DeleteClientAsync(id);
            return new OperationResults { Succeeded = true };
        }
        catch (Exception ex)
        {
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { ex.Message }
            };
        }
    }

    public async Task<IEnumerable<AdminMasterDto>> GetAllMastersAsync()
    {
        var masters = await _masterRepository.GetAllMastersAsync();
        var orders = await _orderRepo.GetOrdersAsync();
        var result = new List<AdminMasterDto>();

        foreach (var master in masters)
        {
            var email = await _identityMasterService.FindByIdAsyncUserEmail(master.Id.ToString());
            var masterOrders = orders.Where(o => o.MasterId == master.Id && o is CompletedOrder);
            var totalEarnings = masterOrders.Sum(o => o.Price.Amount);
            var completedCount = masterOrders.Count();

            result.Add(new AdminMasterDto
            {
                Id = master.Id,
                FirstName = master.Name.FirstName,
                LastName = master.Name.LastName,
                Phone = master.Phone.Value,
                Passport = master.Passport.Value,
                Birthday = master.Birthday,
                Email = email,
                TotalEarnings = totalEarnings,
                CompletedOrdersCount = completedCount
            });
        }

        return result;
    }

    public async Task<AdminMasterDto?> GetMasterByIdAsync(Guid id)
    {
        var master = await _masterRepository.GetMasterByIdAsync(id);
        if (master == null) return null;

        var email = await _identityMasterService.FindByIdAsyncUserEmail(master.Id.ToString());
        var orders = await _orderRepo.GetOrdersAsync();
        var masterOrders = orders.Where(o => o.MasterId == master.Id && o is CompletedOrder);
        var totalEarnings = masterOrders.Sum(o => o.Price.Amount);
        var completedCount = masterOrders.Count();

        return new AdminMasterDto
        {
            Id = master.Id,
            FirstName = master.Name.FirstName,
            LastName = master.Name.LastName,
            Phone = master.Phone.Value,
            Passport = master.Passport.Value,
            Birthday = master.Birthday,
            Email = email,
            TotalEarnings = totalEarnings,
            CompletedOrdersCount = completedCount
        };
    }

    public async Task<OperationResults> CreateMasterAsync(CreateMasterDto dto)
    {
        try
        {
            var master = new Master(
                dto.FirstName,
                dto.LastName,
                dto.Phone,
                dto.Passport,
                dto.Birthday
            );

            var identityResult = await _identityMasterService.CreateMasterAsync(master, dto.Password, dto.Email);
            if (!identityResult.Succeeded)
            {
                return identityResult;
            }

            await _masterRepository.AddMasterAsync(master);
            return new OperationResults { Succeeded = true };
        }
        catch (Exception ex)
        {
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { ex.Message }
            };
        }
    }

    public async Task<OperationResults> UpdateMasterAsync(Guid id, UpdateMasterDto dto)
    {
        var master = await _masterRepository.GetMasterByIdAsync(id);
        if (master == null)
        {
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { "Мастер не найден" }
            };
        }

        try
        {
            master.UpdatePhone(dto.Phone);
            master.UpdatePassport(dto.Passport);

            var birthdayProperty = typeof(Master).GetProperty("Birthday", BindingFlags.Public | BindingFlags.Instance);
            if (birthdayProperty != null)
            {
                birthdayProperty.SetValue(master, dto.Birthday);
            }

            var nameProperty = typeof(Master).GetProperty("Name", BindingFlags.Public | BindingFlags.Instance);
            if (nameProperty != null)
            {
                var name = new FullName(dto.FirstName, dto.LastName);
                nameProperty.SetValue(master, name);
            }

            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user != null && user.Email != dto.Email)
            {
                user.Email = dto.Email;
                user.UserName = dto.Email;
                await _userManager.UpdateAsync(user);
            }

            await _masterRepository.UpdateMasterAsync(master);
            return new OperationResults { Succeeded = true };
        }
        catch (Exception ex)
        {
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { ex.Message }
            };
        }
    }

    public async Task<OperationResults> DeleteMasterAsync(Guid id)
    {
        var master = await _masterRepository.GetMasterByIdAsync(id);
        if (master == null)
        {
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { "Мастер не найден" }
            };
        }

        try
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user != null)
            {
                await _userManager.DeleteAsync(user);
            }

            await _masterRepository.DeleteMasterAsync(id);
            return new OperationResults { Succeeded = true };
        }
        catch (Exception ex)
        {
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { ex.Message }
            };
        }
    }

    public async Task<IEnumerable<AdminCategoryDto>> GetAllCategoriesAsync()
    {
        var categories = await _categoriesRepo.GetCategoriesAsync();
        return categories.Select(c => new AdminCategoryDto
        {
            Id = c.Id,
            Name = c.Name.Value
        });
    }

    public async Task<AdminCategoryDto?> GetCategoryByIdAsync(Guid id)
    {
        var category = await _categoriesRepo.GetCategoryByIdAsync(id);
        if (category == null) return null;

        return new AdminCategoryDto
        {
            Id = category.Id,
            Name = category.Name.Value
        };
    }

    public async Task<OperationResults> CreateCategoryAsync(CreateCategoryDto dto)
    {
        try
        {
            var category = new Category(dto.Name);
            await _categoriesRepo.CreateCategoryAsync(category);
            return new OperationResults { Succeeded = true };
        }
        catch (Exception ex)
        {
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { ex.Message }
            };
        }
    }

    public async Task<OperationResults> UpdateCategoryAsync(Guid id, UpdateCategoryDto dto)
    {
        var category = await _categoriesRepo.GetCategoryByIdAsync(id);
        if (category == null)
        {
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { "Категория не найдена" }
            };
        }

        try
        {
            category.Rename(dto.Name);
            await _categoriesRepo.UpdateCategoryAsync(category);
            return new OperationResults { Succeeded = true };
        }
        catch (Exception ex)
        {
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { ex.Message }
            };
        }
    }

    public async Task<OperationResults> DeleteCategoryAsync(Guid id)
    {
        var category = await _categoriesRepo.GetCategoryByIdAsync(id);
        if (category == null)
        {
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { "Категория не найдена" }
            };
        }

        try
        {
            await _categoriesRepo.DeleteCategoryAsync(id);
            return new OperationResults { Succeeded = true };
        }
        catch (Exception ex)
        {
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { ex.Message }
            };
        }
    }

    public async Task<IEnumerable<AdminOrderDto>> GetAllOrdersAsync()
    {
        var orders = await _orderRepo.GetOrdersAsync();
        var result = new List<AdminOrderDto>();

        foreach (var order in orders)
        {
            var product = await _productRepo.GetProductByIdAsync(order.ProductId);
            if (product == null) continue;

            var category = await _categoriesRepo.GetCategoryByIdAsync(product.CategoryId);
            if (category == null) continue;

            var client = await _clientRepository.GetClientByIdAsync(order.ClientId);
            if (client == null) continue;

            var orderDto = new AdminOrderDto
            {
                Id = order.Id,
                CategoryName = category.Name.Value,
                SerialNumber = product.SerialNumber.Value,
                Brand = product.BrandName.Value,
                Model = product.ModelName.Value,
                Description = order.DescriptionOrder.Value,
                StartDate = order.StartDate,
                EndDate = order.EndDate,
                Price = order.Price.Amount,
                OrderType = GetOrderType(order.GetType().Name),
                ClientName = client.GetFullName()
            };

            if (order.MasterId.HasValue)
            {
                var master = await _masterRepository.GetMasterByIdAsync(order.MasterId.Value);
                orderDto.MasterName = master?.GetFullName();
            }

            result.Add(orderDto);
        }

        return result;
    }

    public async Task<IEnumerable<AdminOrderDto>> GetMasterOrdersAsync(Guid masterId)
    {
        var orders = await _orderRepo.GetMasterOrdersAsync(masterId);
        var result = new List<AdminOrderDto>();

        foreach (var order in orders)
        {
            var product = await _productRepo.GetProductByIdAsync(order.ProductId);
            if (product == null) continue;

            var category = await _categoriesRepo.GetCategoryByIdAsync(product.CategoryId);
            if (category == null) continue;

            var client = await _clientRepository.GetClientByIdAsync(order.ClientId);
            if (client == null) continue;

            var orderDto = new AdminOrderDto
            {
                Id = order.Id,
                CategoryName = category.Name.Value,
                SerialNumber = product.SerialNumber.Value,
                Brand = product.BrandName.Value,
                Model = product.ModelName.Value,
                Description = order.DescriptionOrder.Value,
                StartDate = order.StartDate,
                EndDate = order.EndDate,
                Price = order.Price.Amount,
                OrderType = GetOrderType(order.GetType().Name),
                ClientName = client.GetFullName()
            };

            if (order.MasterId.HasValue)
            {
                var master = await _masterRepository.GetMasterByIdAsync(order.MasterId.Value);
                orderDto.MasterName = master?.GetFullName();
            }

            result.Add(orderDto);
        }

        return result;
    }

    private string GetOrderType(string typeName)
    {
        return typeName switch
        {
            "NewOrder" => "Новый",
            "OrderInProgress" => "В процессе",
            "CompletedOrder" => "Завершен",
            "CancelledOrder" => "Отменен",
            _ => "Неизвестно"
        };
    }
}

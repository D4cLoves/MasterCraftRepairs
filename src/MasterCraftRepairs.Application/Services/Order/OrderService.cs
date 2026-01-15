using MasterCraftRepairs.Application.Common.Interfaces;
using MasterCraftRepairs.Application.Common.Results;
using MasterCraftRepairs.Application.DTOs;
using MasterCraftRepairs.Domain.Entities;
using MasterCraftRepairs.Domain.ValueObjects;

namespace MasterCraftRepairs.Application.Services.Other;

public class OrderService : IOrderService
{
    private readonly IOrderRepo _orderRepo;
    private readonly IProductRepo _productRepo;
    private readonly ICategoriesRepo _categoriesRepo;

    public OrderService(IOrderRepo orderRepo, IProductRepo productRepo,  ICategoriesRepo categoriesRepo)
    {
        _orderRepo = orderRepo;
        _productRepo = productRepo;
        _categoriesRepo = categoriesRepo;
    }
    public async Task<OperationResults> CreateOrderAsync(CreateOrderDto request, Guid clientId)
    {
        Product product;
        try
        {
            DateOnly releaseDate;
            if (int.TryParse(request.ReleaseYear.Split('-')[0], out int year))
            {
                releaseDate = new DateOnly(year, 1, 1);
            }
            else
            {
                return new OperationResults
                {
                    Succeeded = false,
                    Errors = new List<string> { "Неверный формат года выпуска" },
                };
            }

            product = new Product(
                Guid.Parse(request.CategoryId),
                request.SerialNumber,
                decimal.Parse(request.Price),
                releaseDate,
                request.Brand,
                request.Model
            );
        }
        catch (ArgumentException ex)
        {
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { ex.Message },
            };
        }

        await _productRepo.AddProductAsync(product);

        NewOrder order;
        try
        {
            order = new NewOrder(
                product.Id,
                null,
                clientId,
                decimal.Parse(request.Price),
                new Description(request.Description)
            );
        }
        catch (ArgumentException ex)
        {
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { ex.Message },
            };
        }

        await _orderRepo.AddOrderAsync(order);

        return new OperationResults
        {
            Succeeded = true,
        };
    }

    public async Task<OperationResults> TakeOrderAsync(Guid orderId, Guid masterId)
    {
        var existingOrder = await _orderRepo.GetOrderByIdAsync(orderId);

        if (existingOrder == null)
        {
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { "Заказ не найден" },
            };
        }

        if (existingOrder is not NewOrder newOrder)
        {
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { "Заказ уже в обработке или завершен" },
            };
        }

        var orderInProgress = newOrder.PutIntoWork(masterId);
        await _orderRepo.UpdateOrderStatusAsync(orderInProgress);

        return new OperationResults
        {
            Succeeded = true,
        };
    }

    public async Task<IEnumerable<Category>> GetCategoriesAsync()
    {
        return await _categoriesRepo.GetCategoriesAsync();
    }

    public async Task<IEnumerable<GetClientOrdersDto>> GetClientOrdersAsync(Guid clientId)
    {
        var orders = await _orderRepo.GetOrdersByClientIdAsync(clientId);
        var clientOrders = new List<GetClientOrdersDto>();

        foreach (var order in orders)
        {
            var product = await _productRepo.GetProductByIdAsync(order.ProductId);
            var category = await _categoriesRepo.GetCategoryByIdAsync(product.CategoryId);

            var clientOrder = new GetClientOrdersDto
            {
                Id = order.Id,
                ProductId = order.ProductId,
                MasterId = order.MasterId,
                ClientId = order.ClientId,
                CategoryName = category.Name.Value,
                SerialNumber = product.SerialNumber.Value,
                ReleaseYear = product.RealeseYear.ToString(),
                Brand = product.BrandName.Value,
                Model = product.ModelName.Value,
                Description = order.DescriptionOrder.Value,
                StartDate = order.StartDate,
                EndDate = order.EndDate,
                Price = order.Price.Amount,
                OrderType = GetOrderType(order.GetType().Name)
            };

            if (order.MasterId.HasValue)
            {
                var master = await _orderRepo.GetMasterByIdAsync(order.MasterId.Value);
                clientOrder.MasterName = master.GetFullName();
            }

            clientOrders.Add(clientOrder);
        }

        return clientOrders;
    }

    public async Task<OperationResults> CancelOrderAsync(Guid orderId, Guid clientId)
    {
        var existingOrder = await _orderRepo.GetOrderByIdAsync(orderId);

        if (existingOrder == null)
        {
            Console.WriteLine($"Service: Order {orderId} not found");
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { "Обращение не найдено" },
            };
        }

        if (existingOrder.ClientId != clientId)
        {
            Console.WriteLine($"Service: Access denied for order {orderId}, owner: {existingOrder.ClientId}, requested by: {clientId}");
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { "Нет доступа к этому обращению" },
            };
        }

        if (existingOrder is not NewOrder newOrder)
        {
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { "Отменить можно только новый заказ" },
            };
        }

        var cancelled = newOrder.Cancel();
        await _orderRepo.UpdateOrderStatusAsync(cancelled);

        return new OperationResults { Succeeded = true };
    }

    public async Task<OperationResults> UpdateOrderDescriptionAsync(Guid orderId, Guid clientId, string description)
    {
        var existingOrder = await _orderRepo.GetOrderByIdAsync(orderId);

        if (existingOrder == null)
        {
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { "Обращение не найдено" },
            };
        }

        if (existingOrder.ClientId != clientId)
        {
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { "Нет доступа к этому обращению" },
            };
        }

        if (existingOrder is not NewOrder)
        {
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { "Редактировать можно только новый заказ" },
            };
        }

        try
        {
            existingOrder.UpdateDescription(description);
        }
        catch (ArgumentException ex)
        {
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { ex.Message },
            };
        }

        await _orderRepo.UpdateOrderStatusAsync(existingOrder);
        return new OperationResults { Succeeded = true };
    }

    private string GetOrderType(string typeName)
    {
        return typeName switch
        {
            nameof(NewOrder) => "Новый",
            nameof(OrderInProgress) => "В процессе",
            nameof(CompletedOrder) => "Завершен",
            nameof(CancelledOrder) => "Отменен",
            _ => "Неизвестный"
        };
    }

    public async Task<IEnumerable<GetClientOrdersDto>> GetAllOrdersAsync()
    {
        var orders = await _orderRepo.GetOrdersAsync();
        var MasterOrders = new List<GetClientOrdersDto>();

        foreach (var order in orders)
        {
            var product = await _productRepo.GetProductByIdAsync(order.ProductId);
            var category = await _categoriesRepo.GetCategoryByIdAsync(product.CategoryId);

            var clientOrder = new GetClientOrdersDto
            {
                Id = order.Id,
                ProductId = order.ProductId,
                MasterId = order.MasterId,
                ClientId = order.ClientId,
                CategoryName = category.Name.Value,
                SerialNumber = product.SerialNumber.Value,
                ReleaseYear = product.RealeseYear.ToString(),
                Brand = product.BrandName.Value,
                Model = product.ModelName.Value,
                Description = order.DescriptionOrder.Value,
                StartDate = order.StartDate,
                EndDate = order.EndDate,
                Price = order.Price.Amount,
                OrderType = GetOrderType(order.GetType().Name)
            };

            if (order.MasterId.HasValue)
            {
                var master = await _orderRepo.GetMasterByIdAsync(order.MasterId.Value);
                clientOrder.MasterName = master.GetFullName();
            }

            MasterOrders.Add(clientOrder);
        }

        return MasterOrders;
    }

    public async Task<IEnumerable<GetClientOrdersDto>> GetAvailableOrdersAsync()
    {
        var orders = await _orderRepo.GetAvailableOrdersAsync();
        var availableOrders = new List<GetClientOrdersDto>();

        foreach (var order in orders)
        {
            var product = await _productRepo.GetProductByIdAsync(order.ProductId);
            var category = await _categoriesRepo.GetCategoryByIdAsync(product.CategoryId);

            var orderDto = new GetClientOrdersDto
            {
                Id = order.Id,
                ProductId = order.ProductId,
                MasterId = order.MasterId,
                ClientId = order.ClientId,
                CategoryName = category.Name.Value,
                SerialNumber = product.SerialNumber.Value,
                ReleaseYear = product.RealeseYear.ToString(),
                Brand = product.BrandName.Value,
                Model = product.ModelName.Value,
                Description = order.DescriptionOrder.Value,
                StartDate = order.StartDate,
                EndDate = order.EndDate,
                Price = order.Price.Amount,
                OrderType = GetOrderType(order.GetType().Name)
            };

            availableOrders.Add(orderDto);
        }

        return availableOrders;
    }

    public async Task<IEnumerable<GetClientOrdersDto>> GetMasterOrdersAsync(Guid masterId)
    {
        var orders = await _orderRepo.GetMasterOrdersAsync(masterId);
        var masterOrders = new List<GetClientOrdersDto>();

        foreach (var order in orders)
        {
            var product = await _productRepo.GetProductByIdAsync(order.ProductId);
            var category = await _categoriesRepo.GetCategoryByIdAsync(product.CategoryId);

            var orderDto = new GetClientOrdersDto
            {
                Id = order.Id,
                ProductId = order.ProductId,
                MasterId = order.MasterId,
                ClientId = order.ClientId,
                CategoryName = category.Name.Value,
                SerialNumber = product.SerialNumber.Value,
                ReleaseYear = product.RealeseYear.ToString(),
                Brand = product.BrandName.Value,
                Model = product.ModelName.Value,
                Description = order.DescriptionOrder.Value,
                StartDate = order.StartDate,
                EndDate = order.EndDate,
                Price = order.Price.Amount,
                OrderType = GetOrderType(order.GetType().Name)
            };

            var master = await _orderRepo.GetMasterByIdAsync(masterId);
            orderDto.MasterName = master?.GetFullName();

            masterOrders.Add(orderDto);
        }

        return masterOrders;
    }

    public async Task<IEnumerable<GetClientOrdersDto>> GetMasterCompletedOrdersAsync(Guid masterId)
    {
        var orders = await _orderRepo.GetMasterCompletedOrdersAsync(masterId);
        var completedOrders = new List<GetClientOrdersDto>();

        foreach (var order in orders)
        {
            var product = await _productRepo.GetProductByIdAsync(order.ProductId);
            var category = await _categoriesRepo.GetCategoryByIdAsync(product.CategoryId);

            var orderDto = new GetClientOrdersDto
            {
                Id = order.Id,
                ProductId = order.ProductId,
                MasterId = order.MasterId,
                ClientId = order.ClientId,
                CategoryName = category.Name.Value,
                SerialNumber = product.SerialNumber.Value,
                ReleaseYear = product.RealeseYear.ToString(),
                Brand = product.BrandName.Value,
                Model = product.ModelName.Value,
                Description = order.DescriptionOrder.Value,
                StartDate = order.StartDate,
                EndDate = order.EndDate,
                Price = order.Price.Amount,
                OrderType = GetOrderType(order.GetType().Name)
            };

            var master = await _orderRepo.GetMasterByIdAsync(masterId);
            orderDto.MasterName = master?.GetFullName();

            completedOrders.Add(orderDto);
        }

        return completedOrders;
    }

    public async Task<OperationResults> CompleteOrderAsync(Guid orderId, Guid masterId)
    {
        var existingOrder = await _orderRepo.GetOrderByIdAsync(orderId);

        if (existingOrder == null)
        {
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { "Заказ не найден" },
            };
        }

        if (existingOrder.MasterId != masterId)
        {
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { "Нет доступа к этому заказу" },
            };
        }

        if (existingOrder is not OrderInProgress orderInProgress)
        {
            return new OperationResults
            {
                Succeeded = false,
                Errors = new List<string> { "Завершить можно только заказ в процессе" },
            };
        }

        var completed = orderInProgress.Complete(DateTime.UtcNow);
        await _orderRepo.UpdateOrderStatusAsync(completed);

        return new OperationResults { Succeeded = true };
    }
}

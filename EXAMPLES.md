# Примеры кода для регистрации клиента в чистой архитектуре

## 📋 Содержание

1. [Слой Application - ClientRegistrationService](#1-слой-application---clientregistrationservice)
2. [Слой Infrastructure - IdentityService](#2-слой-infrastructure---identityservice)
3. [Слой Infrastructure - ClientRepository](#3-слой-infrastructure---clientrepository)
4. [Слой WebAPI - Контроллер](#4-слой-webapi---контроллер)
5. [Настройка DI в Program.cs](#5-настройка-di-в-programcs)

---

## 1. Слой Application - ClientRegistrationService

**Где:**
`src/MasterCraftRepairs.Application/Services/ClientRegistrationService.cs`

**Зачем:** Это мозги всей регистрации. Здесь вся бизнес-логика:

- Проверка паролей
- Создание доменного Client из DTO
- Координация между Identity и Repository
- Обработка ошибок

**Пример кода:**

```csharp
using MasterCraftRepairs.Application.Common.Interfaces;
using MasterCraftRepairs.Application.Common.Results;
using MasterCraftRepairs.Application.DTOs;
using MasterCraftRepairs.Domain.Entities;

namespace MasterCraftRepairs.Application.Services;

public class ClientRegistrationService : IClientRegistrationService
{
    private readonly IIdentityService _identityService;
    private readonly IClientRepository _clientRepository;

    // Внедряем зависимости через конструктор (Dependency Injection)
    public ClientRegistrationService(
        IIdentityService identityService,
        IClientRepository clientRepository)
    {
        _identityService = identityService;
        _clientRepository = clientRepository;
    }

    public async Task<OperationResult> RegisterClientAsync(RegisterClientRequestDto request)
    {
        // ШАГ 1: Валидация паролей (бизнес-правило)
        if (request.Password != request.ConfirmPassword)
        {
            return new OperationResult
            {
                Succeeded = false,
                Errors = new List<string> { "Пароли не совпадают" }
            };
        }

        // ШАГ 2: Парсим дату рождения из строки
        if (!DateOnly.TryParse(request.Birthday, out var birthday))
        {
            return new OperationResult
            {
                Succeeded = false,
                Errors = new List<string> { "Неверный формат даты рождения" }
            };
        }

        // ШАГ 3: Создаем доменного Client (это НЕ Entity Framework сущность, это чистая доменная модель)
        // Конструктор Client сам создаст все ValueObjects (FullName, PhoneNumber и т.д.)
        // Если что-то не так - выбросит исключение (например, неверный формат телефона)
        Client client;
        try
        {
            client = new Client(
                firstName: request.FirstName,
                lastName: request.LastName,
                phone: request.Phone,
                passport: request.Passport,
                address: request.Address,
                birthday: birthday
            );
        }
        catch (ArgumentException ex)
        {
            // Если доменная валидация не прошла (например, неверный формат телефона)
            return new OperationResult
            {
                Succeeded = false,
                Errors = new List<string> { ex.Message }
            };
        }

        // ШАГ 4: Создаем пользователя в Identity (это создаст запись в AspNetUsers)
        // ВАЖНО: Email приходит из DTO (request.Email), а НЕ из доменного Client!
        // Email нужен для Identity (аутентификация), но не является частью доменной модели
        var identityResult = await _identityService.CreateClientAsync(client, request.Email, request.Password);

        if (!identityResult.Succeeded)
        {
            // Если Identity не смог создать (например, email уже занят)
            return identityResult;
        }

        // ШАГ 5: Сохраняем клиента в нашу таблицу Clients
        // Важно: делаем это ПОСЛЕ успешного создания в Identity
        // Если что-то пойдет не так - у нас будет пользователь в Identity, но не в Clients
        // (это можно потом обработать через транзакцию или компенсирующие действия)
        try
        {
            await _clientRepository.AddClientAsync(client);
        }
        catch (Exception ex)
        {
            // Если не удалось сохранить в БД
            // В идеале тут должна быть транзакция или компенсирующее действие
            return new OperationResult
            {
                Succeeded = false,
                Errors = new List<string> { $"Ошибка при сохранении клиента: {ex.Message}" }
            };
        }

        // ВСЁ ОК!
        return new OperationResult
        {
            Succeeded = true
        };
    }
}
```

**Важно:**

- Этот сервис **НЕ знает** про Entity Framework, про `UserManager`, про базу
  данных
- Он работает только с интерфейсами (`IIdentityService`, `IClientRepository`)
- Вся грязная работа с БД и Identity спрятана в Infrastructure

---

## 2. Слой Infrastructure - IdentityService

**Где:** `src/MasterCraftRepairs.Infrastructure/Repositories/IdentityService.cs`

**Зачем:** Обертка над `UserManager<ApplicationUser>`. Прячет всю Identity-херню
от Application слоя.

**⚠️ ВАЖНО:** Нужно обновить интерфейс `IIdentityService` в
`src/MasterCraftRepairs.Application/Common/Interfaces/IIdentityService.cs`:

```csharp
public interface IIdentityService
{
    Task<OperationResult> CreateClientAsync(Client client, string email, string password);
    //                                                      ^^^^^^^^ добавить email!
}
```

**Почему email отдельно?** Потому что email нужен для Identity (аутентификация),
но НЕ является частью доменной модели `Client`. Это разделение ответственности в
чистой архитектуре.

**Пример кода:**

```csharp
using MasterCraftRepairs.Application.Common.Interfaces;
using MasterCraftRepairs.Application.Common.Results;
using MasterCraftRepairs.Domain.Entities;
using MasterCraftRepairs.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;

namespace MasterCraftRepairs.Infrastructure.Repositories;

public class IdentityService : IIdentityService
{
    private readonly UserManager<ApplicationUser> _userManager;

    // Внедряем UserManager через конструктор
    public IdentityService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<OperationResult> CreateClientAsync(Client client, string email, string password)
    {
        // ШАГ 1: Создаем ApplicationUser для Identity
        // ВАЖНО: Email приходит отдельным параметром, потому что он НЕ часть доменной модели Client!
        // Email нужен только для Identity (для входа в систему), но не для бизнес-логики клиента
        // ApplicationUser - это сущность для Identity (наследуется от IdentityUser)
        var appUser = new ApplicationUser
        {
            Id = client.Id.ToString(), // Identity использует string для Id, а у тебя Guid
            UserName = email, // Используем email как username для входа
            Email = email, // Email для Identity
            EmailConfirmed = false, // Потом можно добавить подтверждение email
            // Можно добавить дополнительные поля, если нужно
        };

        // ШАГ 2: Создаем пользователя в Identity через UserManager
        // Это создаст запись в таблице AspNetUsers
        var identityResult = await _userManager.CreateAsync(appUser, password);

        // ШАГ 3: Конвертируем IdentityResult в наш OperationResult
        if (identityResult.Succeeded)
        {
            return new OperationResult
            {
                Succeeded = true
            };
        }
        else
        {
            // Identity возвращает ошибки в своем формате, конвертируем их
            return new OperationResult
            {
                Succeeded = false,
                Errors = identityResult.Errors.Select(e => e.Description).ToList()
            };
        }
    }
}
```

**Важно:**

- Здесь мы работаем с `UserManager<ApplicationUser>` - это часть ASP.NET
  Identity
- `ApplicationUser` - это сущность для Identity, она НЕ доменная модель
- **Email приходит отдельным параметром**, потому что он НЕ часть доменной
  модели `Client`
- Email нужен только для Identity (аутентификация), но не для бизнес-логики
  клиента

**Проблема с Id:**

- У тебя `Client.Id` это `Guid`
- У `IdentityUser.Id` это `string`
- Решения:
  1. Использовать `client.Id.ToString()` как `appUser.Id` (как в примере) -
     тогда Id будет одинаковый
  2. Или добавить в `ApplicationUser` поле `ClientId` типа `Guid?` и хранить там
     связь (если хочешь разделить Id)

**Разделение ответственности:**

- `Client` (доменная модель) - содержит бизнес-данные: имя, телефон, паспорт,
  адрес, день рождения
- `ApplicationUser` (Identity) - содержит данные для аутентификации: email,
  пароль, username
- Они связаны через `Id` (или через отдельное поле `ClientId`)

---

## 3. Слой Infrastructure - ClientRepository

**Где:**
`src/MasterCraftRepairs.Infrastructure/Repositories/ClientRepository.cs`
(создать новый файл)

**Зачем:** Сохранение доменного `Client` в БД через Entity Framework.

**Пример кода:**

```csharp
using MasterCraftRepairs.Application.Common.Interfaces;
using MasterCraftRepairs.Domain.Entities;
using MasterCraftRepairs.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MasterCraftRepairs.Infrastructure.Repositories;

public class ClientRepository : IClientRepository
{
    private readonly ApplicationDbContext _context;

    // Внедряем DbContext через конструктор
    public ClientRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddClientAsync(Client client)
    {
        // Просто добавляем клиента в DbSet и сохраняем
        // Entity Framework сам разберется с маппингом value objects в таблицу
        _context.Clients.Add(client);
        await _context.SaveChangesAsync();
    }
}
```

**Важно:**

- Здесь мы работаем с `ApplicationDbContext` - это Entity Framework
- `_context.Clients` - это `DbSet<Client>`, который маппится на таблицу
  `Clients` в БД
- Entity Framework сам разберется с маппингом value objects (FullName,
  PhoneNumber и т.д.) в колонки таблицы
- Это Infrastructure слой, поэтому здесь можно использовать EF

---

## 4. Слой WebAPI - Контроллер

**Где:**
`src/MasterCraftRepairs.WebAPI/Controllers/Authorization/ClientController.cs`

**Зачем:** Точка входа для HTTP запросов. Контроллер должен быть ТОНКИМ - только
принимает запрос, вызывает сервис, возвращает ответ.

**Пример кода:**

```csharp
using MasterCraftRepairs.Application.Common.Results;
using MasterCraftRepairs.Application.DTOs;
using MasterCraftRepairs.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace MasterCraftRepairs.WebAPI.Controllers.Authorization;

[ApiController]
[Route("api/[controller]")]
public class ClientController : ControllerBase
{
    private readonly IClientRegistrationService _registrationService;

    // Внедряем сервис через конструктор
    public ClientController(IClientRegistrationService registrationService)
    {
        _registrationService = registrationService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterClientRequestDto request)
    {
        // Проверка модели (валидация на уровне ASP.NET)
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Вызываем сервис регистрации (Application слой)
        var result = await _registrationService.RegisterClientAsync(request);

        // Возвращаем результат
        if (result.Succeeded)
        {
            return Ok(new { message = "Клиент успешно зарегистрирован" });
        }
        else
        {
            return BadRequest(new { errors = result.Errors });
        }
    }
}
```

**Важно:**

- Контроллер **НЕ должен** содержать бизнес-логику
- Он только принимает HTTP запрос, вызывает сервис, возвращает HTTP ответ
- Вся логика в `ClientRegistrationService`

---

## 5. Настройка DI в Program.cs

**Где:** `src/MasterCraftRepairs.WebAPI/Program.cs`

**Зачем:** Регистрируем все сервисы в DI контейнере, чтобы ASP.NET Core сам
создавал их и внедрял зависимости.

**Что нужно добавить в Program.cs:**

```csharp
using MasterCraftRepairs.Application.Common.Interfaces;
using MasterCraftRepairs.Application.Services;
using MasterCraftRepairs.Infrastructure.Data;
using MasterCraftRepairs.Infrastructure.Identity;
using MasterCraftRepairs.Infrastructure.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ... существующий код ...

// Регистрируем Application слой сервисы
builder.Services.AddScoped<IClientRegistrationService, ClientRegistrationService>();

// Регистрируем Infrastructure слой сервисы
builder.Services.AddScoped<IIdentityService, IdentityService>();
builder.Services.AddScoped<IClientRepository, ClientRepository>();

// ... остальной код ...
```

**Объяснение:**

- `AddScoped` - создает один экземпляр сервиса на один HTTP запрос
- `IClientRegistrationService` → `ClientRegistrationService` - когда кто-то
  просит интерфейс, даем реализацию
- ASP.NET Core сам создаст все зависимости и внедрит их через конструкторы

---

## 🔄 Поток выполнения при регистрации

1. **Фронт** → POST `/api/Client/register` с JSON (RegisterClientRequestDto)
2. **ClientController.Register()** → вызывает
   `_registrationService.RegisterClientAsync()`
3. **ClientRegistrationService** →
   - Проверяет пароли
   - Создает доменного `Client`
   - Вызывает `_identityService.CreateClientAsync()` → создает в Identity
   - Вызывает `_clientRepository.AddClientAsync()` → сохраняет в БД
4. **IdentityService** → использует `UserManager` для создания в AspNetUsers
5. **ClientRepository** → использует `DbContext` для сохранения в Clients
6. **Результат** возвращается обратно через все слои до контроллера

---

## ⚠️ Важные моменты

1. **Транзакции:** Сейчас если Identity создастся, а Client не сохранится -
   будет рассинхрон. Можно добавить транзакцию или компенсирующие действия.

2. **Id клиента:** У тебя `Client.Id` это `Guid`, а `IdentityUser.Id` это
   `string`. Нужно решить как их связывать.

3. **Валидация:** Доменная валидация (в value objects) + валидация на уровне
   Application + валидация на уровне контроллера.

4. **Обработка ошибок:** Сейчас просто возвращаем ошибки. Можно добавить
   глобальный exception handler.

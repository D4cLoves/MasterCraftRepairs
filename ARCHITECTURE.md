# Структура проекта MasterCraftRepairs

## Clean Architecture - Структура проектов

### Проекты в Solution:

1. **MasterCraftRepairs.Domain** - Доменный слой (Class Library)
   - Entities/ - Сущности домена
   - Repositories/ - Интерфейсы репозиториев
   - Common/ - Общие интерфейсы

2. **MasterCraftRepairs.Application** - Слой приложения (Class Library)
   - DTOs/ - Data Transfer Objects
   - Services/ - Интерфейсы сервисов
   - Mappings/ - Маппинг (AutoMapper)
   - Common/Interfaces/ - Общие интерфейсы приложения

3. **MasterCraftRepairs.Infrastructure** - Инфраструктурный слой (Class Library)
   - Data/ - DbContext, миграции
   - Repositories/ - Реализации репозиториев
   - Identity/ - Настройки Identity

4. **MasterCraftRepairs.WebAPI** - Слой представления (Web API)
   - Controllers/ - API контроллеры
   - Middleware/ - Пользовательские middleware

## Зависимости между проектами:

- **Domain** ← нет зависимостей (чистый домен)
- **Application** ← зависит от Domain
- **Infrastructure** ← зависит от Domain, Application
- **WebAPI** ← зависит от Application, Infrastructure

## Структура базы данных:

- **Clients** (id, PassportNumber, FullName, Address, Phone, DateOfBirth)
- **Categories** (id, Name)
- **Products** (id, CategoryId, SerialNumber, Price, YearOfManufacture, Brand, ModelName)
- **Orders** (id, ProductId, MasterId, ClientId, StartDate, EndDate, Cost)
- **Identity Users** (для мастеров и админов)


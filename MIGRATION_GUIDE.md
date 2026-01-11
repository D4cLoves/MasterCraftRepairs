# Руководство по работе с миграциями Entity Framework

## 📋 Что такое миграция?

Миграция - это файл, который описывает изменения в структуре базы данных
(создание таблиц, добавление колонок и т.д.). Entity Framework автоматически
создает SQL команды на основе изменений в твоих моделях.

---

## 🚀 Как создать новую миграцию

### Шаг 1: Открой терминал в корне проекта

Перейди в папку с решением (где находится `MasterCraftRepairs.sln`).

### Шаг 2: Выполни команду создания миграции

```bash
dotnet ef migrations add НазваниеМиграции --project src/MasterCraftRepairs.Infrastructure --startup-project src/MasterCraftRepairs.WebAPI
```

**Пример:**

```bash
dotnet ef migrations add UpdateClientTable --project src/MasterCraftRepairs.Infrastructure --startup-project src/MasterCraftRepairs.WebAPI
```

**Что происходит:**

- `dotnet ef migrations add` - команда создания миграции
- `НазваниеМиграции` - имя миграции (можешь назвать как хочешь, например:
  `AddClientRegistration`, `UpdateDatabase`, и т.д.)
- `--project` - указывает проект, где находится `DbContext` (Infrastructure)
- `--startup-project` - указывает проект, где находится `appsettings.json` с
  connection string (WebAPI)

**Результат:**

- Создастся новый файл миграции в папке
  `src/MasterCraftRepairs.Infrastructure/Entities/`
- Файл будет называться примерно так: `20250105180000_НазваниеМиграции.cs`

---

## ✅ Как применить миграцию к базе данных

### Вариант 1: Через команду (рекомендуется)

```bash
dotnet ef database update --project src/MasterCraftRepairs.Infrastructure --startup-project src/MasterCraftRepairs.WebAPI
```

**Что происходит:**

- Entity Framework применяет все непримененные миграции к БД
- Выполняет SQL команды из миграций
- Обновляет таблицу `__EFMigrationsHistory` (там хранится история миграций)

### Вариант 2: Через код (автоматически при запуске)

Можешь добавить в `Program.cs` автоматическое применение миграций:

```csharp
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate(); // Применяет все непримененные миграции
}
```

**⚠️ Внимание:** Это применяет миграции автоматически при каждом запуске. Хорошо
для разработки, но не для продакшена!

---

## 📝 Полный пример работы с миграциями

### 1. Создал новую сущность или изменил существующую

Например, добавил новое поле в `Client` или создал новую таблицу.

### 2. Создай миграцию

```bash
dotnet ef migrations add AddNewFieldToClient --project src/MasterCraftRepairs.Infrastructure --startup-project src/MasterCraftRepairs.WebAPI
```

### 3. Проверь созданный файл миграции

Открой файл
`src/MasterCraftRepairs.Infrastructure/Entities/20250105XXXXXX_AddNewFieldToClient.cs`
и проверь, что там правильные изменения.

### 4. Примени миграцию к БД

```bash
dotnet ef database update --project src/MasterCraftRepairs.Infrastructure --startup-project src/MasterCraftRepairs.WebAPI
```

### 5. Готово! ✅

База данных обновлена.

---

## 🔄 Полезные команды

### Посмотреть список всех миграций

```bash
dotnet ef migrations list --project src/MasterCraftRepairs.Infrastructure --startup-project src/MasterCraftRepairs.WebAPI
```

### Откатить последнюю миграцию (удалить из БД, но файл останется)

```bash
dotnet ef database update ПредыдущаяМиграция --project src/MasterCraftRepairs.Infrastructure --startup-project src/MasterCraftRepairs.WebAPI
```

Чтобы узнать имя предыдущей миграции, используй `migrations list`.

### Удалить последнюю миграцию (удалить файл, если еще не применил к БД)

```bash
dotnet ef migrations remove --project src/MasterCraftRepairs.Infrastructure --startup-project src/MasterCraftRepairs.WebAPI
```

**⚠️ Внимание:** Это удалит только файл миграции. Если миграция уже применена к
БД, сначала откати её через `database update`.

---

## 🐛 Частые проблемы

### Ошибка: "No DbContext was found"

**Решение:** Убедись, что указал правильные пути:

- `--project` должен указывать на Infrastructure проект
- `--startup-project` должен указывать на WebAPI проект

### Ошибка: "Unable to create an object of type 'ApplicationDbContext'"

**Решение:** Убедись, что в `appsettings.json` правильный connection string и
база данных существует.

### Ошибка при применении миграции

**Решение:**

1. Проверь connection string
2. Убедись, что SQL Server запущен
3. Проверь права доступа к БД
4. Посмотри детали ошибки в консоли

---

## 📍 Где находятся миграции?

В твоем проекте миграции находятся в:

```
src/MasterCraftRepairs.Infrastructure/Entities/
```

Обычно они находятся в папке `Migrations/`, но у тебя они в `Entities/` - это
нормально, если так настроено.

---

## 💡 Советы

1. **Именуй миграции понятно:** `AddClientTable`, `AddEmailToUser`,
   `UpdateOrderStatus` - так легче понять, что делает миграция

2. **Проверяй миграцию перед применением:** Открой файл миграции и убедись, что
   там правильные SQL команды

3. **Делай бэкап БД перед применением миграций в продакшене:** На всякий случай

4. **Не редактируй примененные миграции:** Если нужно что-то изменить, создай
   новую миграцию

---

## 🎯 Быстрая шпаргалка

```bash
# Создать миграцию
dotnet ef migrations add ИмяМиграции --project src/MasterCraftRepairs.Infrastructure --startup-project src/MasterCraftRepairs.WebAPI

# Применить миграцию
dotnet ef database update --project src/MasterCraftRepairs.Infrastructure --startup-project src/MasterCraftRepairs.WebAPI

# Список миграций
dotnet ef migrations list --project src/MasterCraftRepairs.Infrastructure --startup-project src/MasterCraftRepairs.WebAPI

# Удалить последнюю миграцию (если не применена)
dotnet ef migrations remove --project src/MasterCraftRepairs.Infrastructure --startup-project src/MasterCraftRepairs.WebAPI
```

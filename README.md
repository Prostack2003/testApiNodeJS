# KBZU API

REST API для трекинга приёмов пищи и расчёта КБЖУ. Учебный проект, демонстрирующий полный цикл backend-разработки: от проектирования БД до слоистой архитектуры на Express.js.

## 🚀 Технологии

- **Framework:** Express.js
- **Runtime:** Node.js
- **Database:** PostgreSQL
- **Architecture:** Layered Architecture (Config → DB → Service → Controller → Router)
- **Error Handling:** Централизованный error-handling middleware
- **Environment:** dotenv

## 📋 Возможности

- ✅ Полный CRUD для приёмов пищи (`meal_items`)
- ✅ Частичное обновление через PATCH (динамический SQL)
- ✅ Валидация входных данных (400 Bad Request)
- ✅ Проверка существования связанных сущностей (404 Not Found)
- ✅ Динамические SQL-запросы (фильтрация по дате, динамический UPDATE)
- ✅ Единая обработка ошибок через error-handling middleware
- ✅ Разделение бизнес-логики и HTTP-слоя
- ✅ Конфигурация через переменные окружения (.env)

## 🛠 Установка

### Требования

- Node.js 18+
- PostgreSQL 14+
- npm или yarn

### Шаги

1. **Клонируй репозиторий**
   ```bash
   git clone https://github.com/YOUR_USERNAME/kbju-api.git
   cd kbju-api

2. **Установи зависимости**
   ```bash  
   npm install

3. **Настрой окружение**
   ```bash
    cp .env.example .env

4. **Запусти сервер**
   ```bash
    npm start


## 🛠 **Структура папок**

    kbju-api/
      ├── src/
      │   ├── config/              # Конфигурация (port, DB credentials)
      │   │   └── index.ts
      │   ├── db/                  # Подключение к PostgreSQL
      │   │   └── pool.ts
      │   ├── services/            # Бизнес-логика (без знания про HTTP)
      │   │   └── meals.service.ts
      │   ├── controllers/         # HTTP-адаптеры (валидация, вызов сервисов)
      │   │   └── meals.controller.ts
      │   ├── routes/              # Маршрутизация (Express Router)
      │   │   └── meals.router.ts
      │   ├── middleware/           # Express middleware
      │   │   └── errorHandler.ts
      │   ├── app.ts               # Настройка Express app (middleware, роуты)
      │   └── server.js            # Точка входа (app.listen)
      ├── .env                     # Переменные окружения (не коммитится!)
      ├── .env.example             # Шаблон переменных (коммитится)
      ├── .gitignore               # Игнорируемые файлы
      ├── package.json             # Зависимости и скрипты
      ├── schema.sql               # Схема БД (DDL)
      └── README.md                # Документация

📡 API Endpoints

   1. GET /api/meals (Получить список приёмов пищи пользователя)
```
   Query Parameters:
   
   1) user_id (обязательный): ID пользователя
   
   2) date (опциональный): фильтрация по дате (YYYY-MM-DD)
```
   2. POST /api/meals (Создать новый приём пищи)
```
   JSON BODY
   
   {
     "user_id": 6,
     "product_id": 8,
     "weight_grams": 150,
     "date_eat": "2026-08-17"
   }
```

   3. PATCH /api/meals/:id (Частично обновить приём пищи.)
      

  ``` 
  Path Parameters:
   1) id: ID приёма пищи
   
   ```
```
   JSON BODY
   
   {
     "weight_grams": 250,
     "date_eat": "2026-08-22"
   }
```

   4. DELETE /api/meals/:id (Удалить приём пищи)
```
   Path Parameters:
   1) id: ID приёма пищи
```

📄 Лицензия
Учебный проект. Без лицензии.

👤 Автор
Владимир — студент, изучающий backend-разработку.

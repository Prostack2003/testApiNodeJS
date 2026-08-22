# KBZU API

REST API для трекинга приёмов пищи и расчёта КБЖУ. Учебный проект, демонстрирующий полный цикл backend-разработки: от проектирования БД до слоистой архитектуры и тестирования.

## 🚀 Технологии

- **Runtime:** Node.js (native `http` module)
- **Database:** PostgreSQL
- **Architecture:** Layered Architecture (Config → DB → Service → Controller → Router)
- **Testing:** Jest + supertest (in progress)
- **Environment:** dotenv

## 📋 Возможности

- ✅ CRUD операции для приёмов пищи (`meal_items`)
- ✅ Валидация входных данных (400 Bad Request)
- ✅ Проверка существования связанных сущностей (404 Not Found)
- ✅ Динамические SQL-запросы (фильтрация по дате, частичное обновление)
- ✅ Единая обработка ошибок (async/await + try/catch)
- ✅ Разделение бизнес-логики и HTTP-слоя
- ✅ Конфигурация через переменные окружения

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

    src/
    ├── config/          # Конфигурация (port, DB credentials)
    │   └── index.js
    ├── db/              # Подключение к PostgreSQL
    │   └── pool.js
    ├── services/        # Бизнес-логика (без знания про HTTP)
    │   └── meals.service.js
    ├── controllers/     # HTTP-адаптеры (валидация, маппинг ошибок)
    │   └── meals.controller.js
    ├── routes/          # Маршрутизация (URL + Method → Controller)
    │   └── meals.router.js
    └── server.js        # Точка входа (createServer + listen)

📄 Лицензия
Учебный проект. Без лицензии.

👤 Автор
Владимир — студент, изучающий backend-разработку.

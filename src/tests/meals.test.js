const { describe, expect, test, beforeAll, beforeEach, afterAll } = require('@jest/globals');
const request = require('supertest');
const app = require('../server');
const pool = require('../db/pool');

// Тесты на сервер
describe('Старт сервера', () => {
    test('должен вернуть код 200 - успешная обработка запроса', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);

        console.log('Тест запущен! База:', require('/src/config/index').db.database);
    });
});


// Тесты на сетевые запросы (controllers)

describe('GET Сетевой запрос /api/meals', () => {
    beforeAll(async () => {
        // Гарантируем, что тестовые данные существуют
        await pool.query('INSERT INTO users (id, name, email, password, weight, height, age, gender, activity_level) VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT DO NOTHING', ['Test User', 'test@test.com', 'testpass123', '60', '164', '23', 'M', '3']);
        await pool.query('INSERT INTO products (id, name, calories_per_100g, proteins_per_100g, fats_per_100g, carbs_per_100g) VALUES (1, $1, $2, $3, $4, $5) ON CONFLICT DO NOTHING', ['Product A', 100, 30, 40, 60]);
        await pool.query('INSERT INTO meal_items (user_id, product_id, weight_grams, date_eat) VALUES (1, 1, 200, $1)', ['2026-08-17']);
    });

    beforeEach(async () => {
        // Очищаем meal_items перед каждым тестом
        await pool.query('TRUNCATE meal_items RESTART IDENTITY CASCADE');
        // Вставляем свежую запись
        await pool.query('INSERT INTO meal_items (user_id, product_id, weight_grams, date_eat) VALUES (1, 1, 200, $1)', ['2026-08-17']);
    });

    afterAll(async () => {
        await pool.end();
    });

    test('должен вернуть 200 и массив для валидного user_id', async () => {
        const res = await request(app).get('/api/meals?user_id=1');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('product_name');
        expect(res.body[0]).toHaveProperty('weight_grams');
    });

    test('должен вернуть 400 без user_id', async () => {
        const res = await request(app).get('/api/meals');
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('user_id обязателен');
    });

    test('должен фильтровать по дате', async () => {
        const res = await request(app).get('/api/meals?user_id=1&date=2026-08-17');
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].date_eat).toBe('2026-08-17');
    });

    test('должен вернуть пустой массив для несуществующего user_id', async () => {
        const res = await request(app).get('/api/meals?user_id=999999');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });
});


// Тесты на бизнес-логику (services)

const mealsService = require('../services/meals.service');
const {query} = require("../db/pool");

describe('Логика Meals Service - createMeal', () => {

    // 1. Проверка валидации (не требует БД)
    test('должна быть ошибка, потому что weightGrams <= 0 по валидации', async () => {
        await expect(mealsService.createMeal({
            userId: 1,
            productId: 1,
            weightGrams: -50,
            dateEat: '2026-08-22'
        })).rejects.toThrow('VALIDATION_ERROR');
    });

    test('должна быть ошибка, потому что weightGrams = 0 и валидация не пропустит JSON', async () => {
        await expect(mealsService.createMeal({
            userId: 1,
            productId: 1,
            weightGrams: 0,
            dateEat: '2026-08-22'
        })).rejects.toThrow('VALIDATION_ERROR');
    });


    test('должна быть ошибка, потому что weightGrams отсутствует и валидация не пропустит такой JSON', async () => {
        await expect(mealsService.createMeal({
            userId: 1,
            productId: 1,
            dateEat: '2026-08-22'
        })).rejects.toThrow('VALIDATION_ERROR');
    });

});

describe('Логика Meals Service - getMeals', () => {

    // 1. Проверка записей в тестовой БД
    test('должен проверить, что запись приема пищи у пользователя номер 7 существует и там есть конкретные значения',
        async () => {

            const meals = await mealsService.getMeals(7);

            // 1. Проверяем, что мы вообще что-то получили
            expect(meals.length).toBeGreaterThan(0);

            // 2. Берем первую запись
            const meal = meals[0];

            // 3. Проверяем конкретные значения по существующей записи
            expect(meal.product_name).toContain('Яйцо'); // Продукт и его название из записи
            expect(meal.weight_grams).toBe(243); //  Граммовка продукта из записи
            expect(meal.date_eat).toBe('2026-08-16'); // Дата приема пищи пользователя
            expect(meal.calories).toBeCloseTo(376.7, 1); // Калории продукта из записи
        });

});
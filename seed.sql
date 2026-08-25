-- Тестовые пользователи (пароль у всех: "test123")
INSERT INTO users (name, email, password, weight, height, age, gender, activity_level)
VALUES
    ('Тестовый Пользователь 1', 'test1@example.com', '$2b$10$хэш_пароля', 70.5, 175, 25, 'M', '1'),
    ('Тестовый Пользователь 2', 'test2@example.com', '$2b$10$хэш_пароля', 65.0, 165, 30, 'F', '2');

-- Тестовые продукты
INSERT INTO products (name, calories_per_100g, proteins_per_100g, fats_per_100g, carbs_per_100g)
VALUES
    ('Банан', 89, 1.1, 0.3, 22.8),
    ('Яйцо куриное', 155, 12.6, 11.5, 0.7),
    ('Творог 5%', 121, 17.2, 5.0, 1.8);

-- Тестовые приёмы пищи
INSERT INTO meal_items (user_id, product_id, weight_grams, date_eat)
VALUES
    (1, 2, 243, '2026-08-16'),
    (1, 1, 120, '2026-08-17');
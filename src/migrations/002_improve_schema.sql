-- 1. Изменение типов weight
ALTER TABLE users ALTER COLUMN weight TYPE numeric(5,2);
ALTER TABLE weight_history ALTER COLUMN weight TYPE numeric(5,2);

-- 2. Индексы
CREATE INDEX idx_meal_items_user_date ON meal_items(user_id, date_eat);
CREATE INDEX idx_weight_history_user_id ON weight_history(user_id);

-- 3. product_id → nullable
ALTER TABLE meal_items ALTER COLUMN product_id DROP NOT NULL;

-- 4. Внешний ключ для products (SET NULL)
ALTER TABLE meal_items
    DROP CONSTRAINT meal_items_product_id_fkey;

ALTER TABLE meal_items
    ADD CONSTRAINT meal_items_product_id_fkey
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;

-- 5. Внешний ключ для weight_history (CASCADE)
ALTER TABLE weight_history
    DROP CONSTRAINT weight_history_user_id_fkey;

ALTER TABLE weight_history
    ADD CONSTRAINT weight_history_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- 6. CHECK ограничения
ALTER TABLE meal_items ADD CONSTRAINT chk_weight_grams CHECK (weight_grams > 0);

ALTER TABLE users ADD CONSTRAINT chk_weight CHECK (weight > 0);
ALTER TABLE users ADD CONSTRAINT chk_height CHECK (height > 0);
ALTER TABLE users ADD CONSTRAINT chk_age CHECK (age > 0 AND age < 150);
ALTER TABLE users ADD CONSTRAINT chk_gender CHECK (gender IN ('M', 'F'));
ALTER TABLE users ADD CONSTRAINT chk_activity CHECK (activity_level BETWEEN 1 AND 5);

ALTER TABLE products ADD CONSTRAINT chk_calories CHECK (calories_per_100g >= 0);
ALTER TABLE products ADD CONSTRAINT chk_proteins CHECK (proteins_per_100g >= 0);
ALTER TABLE products ADD CONSTRAINT chk_fats CHECK (fats_per_100g >= 0);
ALTER TABLE products ADD CONSTRAINT chk_carbs CHECK (carbs_per_100g >= 0);
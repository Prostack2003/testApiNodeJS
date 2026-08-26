interface MealRow {
    id: number;
    user_id: number;
    product_id: number;
    weight_grams: string;  // BIGINT от pg = строка!
    date_eat: string;
}

interface MealWithDetailsRow {
    id: number;
    product_name: string;
    weight_grams: string;  // BIGINT от pg
    date_eat: string;
    calories: string;      // NUMERIC от pg
}

export { MealRow, MealWithDetailsRow };
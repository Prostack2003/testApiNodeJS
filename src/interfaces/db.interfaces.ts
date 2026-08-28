// Meal Interfaces after query from DB

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

// User interfaces after query from DB


type Gender = 'M' | 'F'

interface UserRow {
    id: number;
    name: string;
    email: string;
    weight: string;
    height: string;
    age: string;
    gender: Gender;
    activityLevel: string;
}

export { UserRow };
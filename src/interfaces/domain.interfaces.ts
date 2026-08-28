// Meals Interfaces
interface CreateMealParams {
    userId: number;
    productId: number;
    weightGrams: number;
    dateEat?: string;
}

interface UpdateMealParams {
    weightGrams?: number;
    dateEat?: string;
}

interface MealItem {
    id: number;
    userId: number;
    productId: number;
    weightGrams: number;
    dateEat: string;
}

interface MealWithDetails {
    id: number;
    productName: string;
    weightGrams: number;
    dateEat: string;
    calories: number;
}


export { MealItem, MealWithDetails, CreateMealParams, UpdateMealParams };

// User Interfaces
interface User {
    id: number;
    name: string;
    email: string;
    weight: number;
    height: number;
    age: number;
    gender: 'M' | 'F';
    activityLevel: number;
}

export { User };
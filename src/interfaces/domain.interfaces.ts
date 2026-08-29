// Meals Interfaces for domain part

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

// User Interfaces for domain part

interface User {
    id: number;
    name: string;
    email: string;
    weight: number;
    height: number;
    age: number;
    gender: 'M' | 'F';
    activityLevel: number;
    tdee: number;
}

interface CreateUserParams {
    name: string;
    email: string;
    password: string;
    weight: number;
    height: number;
    age: number;
    gender: 'M' | 'F';
    activityLevel: number;
}

interface UpdateUserParams {
    name?: string;
    weight?: number;
    height?: number;
    age?: number;
    activityLevel?: number;
}

type DeleteUserInfo = Pick<User, 'id' | 'name'>;

export { User, UpdateUserParams, CreateUserParams, DeleteUserInfo };
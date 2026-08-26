interface CreateMealRequest {
    user_id: number; // после Zod-преобразования
    product_id: number;
    weight_grams: number;
    date_eat?: string;
}

interface UpdateMealRequest {
    weight_grams?: number;
    date_eat?: string;
}

interface GetMealQuery {
    user_id: string; // из req.query — всегда строка
    date?: string;
}

export { CreateMealRequest, UpdateMealRequest, GetMealQuery };
import { z } from 'zod';

const GetMealsQuerySchema = z.object({
    user_id: z.string().transform(Number),
    date: z.string().optional(),
});

const CreateMealBodySchema = z.object({
    user_id: z.number(),
    product_id: z.number(),
    weight_grams: z.number(),
    date_eat: z.string().optional(),
});

const UpdateMealBodySchema = z.object({
    weight_grams: z.number().optional(),
    date_eat: z.string().optional(),
});

const MealParamsBodySchema = z.object({
    id: z.string().transform(Number),
})


export { GetMealsQuerySchema, CreateMealBodySchema, UpdateMealBodySchema, MealParamsBodySchema }
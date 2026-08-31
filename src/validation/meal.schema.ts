import { z } from 'zod';

const GetMealsQuerySchema = z.object({
    date: z.string().optional(),
});

const CreateMealBodySchema = z.object({
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
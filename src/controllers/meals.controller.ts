import { Request, Response, NextFunction } from "express";
import mealsService from '../services/meals.service'
import { z } from "zod";
import {CreateMealParams} from "../interfaces/domain.interfaces";

async function getMeals(req: Request, res: Response, next: NextFunction) {
    const querySchema = z.object({
        user_id: z.string().transform(Number),
        date: z.string().optional(),
    })

    const parsedQuerySchema = querySchema.safeParse(req.query)

    if (!parsedQuerySchema.success) {
        return res.status(400).json({
            error: "Некорректные параметры"
        })
    }

   try {
       const meals = await mealsService.getMeals(parsedQuerySchema.data.user_id, parsedQuerySchema.data.date);

       return res.json(meals);
   } catch (err) {
       next(err);
   }
}
async function createMeal(req: Request, res: Response, next: NextFunction) {
    const bodySchema = z.object({
        user_id: z.number(),
        product_id: z.number(),
        weight_grams: z.number(),
        date_eat: z.string().optional(),
    })

    const parsedBodySchema = bodySchema.safeParse(req.body)

    if (!parsedBodySchema.success) {
        return res.status(400).json({error: 'Обязательные поля не переданы'})
    }
        try {
            const params: CreateMealParams = {
                userId: parsedBodySchema.data.user_id,
                productId: parsedBodySchema.data.product_id,
                weightGrams: parsedBodySchema.data.weight_grams,
                dateEat: parsedBodySchema.data.date_eat,
            };
            const meal = await mealsService.createMeal(params);
            return res.status(201).json(meal);

        } catch (err) {
            next(err);
        }
}
async function updateMeal(req: Request, res: Response, next: NextFunction) {
    const bodySchema = z.object({
        weight_grams: z.number().optional(),
        date_eat: z.string().optional(),
    });

    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: 'Некорректные данные' });
    }

    if (parsed.data.weight_grams == null && parsed.data.date_eat == null) {
        return res.status(400).json({ error: 'Нечего обновлять!' });
    }

    const mealId = parseInt(req.params.id as string, 10);

    if (isNaN(mealId)) {
        return res.status(400).json({error: 'id должен быть числом!'})
    }
        try {
            const updated = await mealsService.updateMeal(mealId, {
                weightGrams: parsed.data.weight_grams,
                dateEat: parsed.data.date_eat,
            });

            return res.status(200).json(updated);

        } catch (err) {
            next(err);
        }
}
async function deleteMeal(req: Request, res: Response, next: NextFunction) {
    const mealId = parseInt(req.params.id as string, 10);
    if (isNaN(mealId)) {
        return res.status(400).json({error: 'id должен быть числом!'})
    }
    try {
        const isDelete = await mealsService.deleteMeal(mealId);

        if (isDelete) {
            return res.status(204).end()
        } else {
            return res.status(404).json({error: 'Запись не найдена'})
        }
    } catch (err) {
        next(err);
    }
}

export default {getMeals, createMeal, updateMeal, deleteMeal};
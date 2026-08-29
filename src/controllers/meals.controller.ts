import {NextFunction, Request, Response} from "express";
import mealsService from '../services/meals.service'
import {CreateMealParams} from "../interfaces/domain.interfaces";

async function getMeals(req: Request, res: Response, next: NextFunction) {
   try {
       const meals = await mealsService.getMeals(Number(req.query.user_id), req.query.date ? String(req.query.date) : undefined);

       return res.json(meals);
   } catch (err) {
       next(err);
   }
}
async function createMeal(req: Request, res: Response, next: NextFunction) {
        try {
            const params: CreateMealParams = {
                userId: req.body.user_id,
                productId: req.body.product_id,
                weightGrams: req.body.weight_grams,
                dateEat: req.body.date_eat,
            };
            const meal = await mealsService.createMeal(params);
            return res.status(201).json(meal);

        } catch (err) {
            next(err);
        }
}
async function updateMeal(req: Request, res: Response, next: NextFunction) {

    try {
        const updated = await mealsService.updateMeal(Number(req.params.id), {
            weightGrams: req.body.weight_grams,
            dateEat: req.body.date_eat,
        });
        return res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
}
async function deleteMeal(req: Request, res: Response, next: NextFunction) {
    try {
        await mealsService.deleteMeal(Number(req.params.id));
        return res.status(204).end();
    } catch (err) {
        next(err);
    }
}

export default {getMeals, createMeal, updateMeal, deleteMeal};
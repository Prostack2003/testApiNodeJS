import {NextFunction, Request, Response} from "express";
import mealsService from '../services/meals.service'
import {CreateMealParams} from "../interfaces/domain.interfaces";

async function getMeals(req: Request, res: Response, next: NextFunction) {
   try {
       const meals = await mealsService.getMeals(Number(req.user?.id), req.query.date ? String(req.query.date) : undefined);

       return res.json(meals);
   } catch (err) {
       next(err);
   }
}
async function createMeal(req: Request, res: Response, next: NextFunction) {
        try {
            const params: CreateMealParams = {
                userId: Number(req.user?.id),
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
        let userTokenId = undefined;
        if (req.user) {
            userTokenId = req.user.id
        }
        const updated = await mealsService.updateMeal(Number(req.params.id), Number(userTokenId), {
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
        let userTokenId = undefined;
        if (req.user) {
            userTokenId = req.user.id
        }
        await mealsService.deleteMeal(Number(req.params.id), Number(userTokenId));
        return res.status(204).end();
    } catch (err) {
        next(err);
    }
}

export default {getMeals, createMeal, updateMeal, deleteMeal};
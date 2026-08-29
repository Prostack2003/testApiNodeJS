import express from 'express';
import mealsController from '../controllers/meals.controller';
import validate from "../middleware/validate";
import {
    CreateMealBodySchema,
    GetMealsQuerySchema,
    MealParamsBodySchema,
    UpdateMealBodySchema
} from "../validation/meal.schema";

const mealsRouter = express.Router();

mealsRouter.get(
    "/",
    validate(GetMealsQuerySchema, 'query'),
    mealsController.getMeals
);

mealsRouter.post(
    "/",
    validate(CreateMealBodySchema,'body'),
    mealsController.createMeal
);

mealsRouter.patch(
    "/:id",
    validate(MealParamsBodySchema, 'params'),
    validate(UpdateMealBodySchema, 'body'),
    mealsController.updateMeal
);

mealsRouter.delete(
    "/:id",
    validate(MealParamsBodySchema, 'params'),
    mealsController.deleteMeal
);

export default mealsRouter;
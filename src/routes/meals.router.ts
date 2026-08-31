import express from 'express';
import mealsController from '../controllers/meals.controller';
import validate from "../middleware/validate";
import {
    CreateMealBodySchema,
    GetMealsQuerySchema,
    MealParamsBodySchema,
    UpdateMealBodySchema
} from "../validation/meal.schema";
import authenticate from "../middleware/authenticate";

const mealsRouter = express.Router();

mealsRouter.get(
    "/",
    authenticate,
    validate(GetMealsQuerySchema, 'query'),
    mealsController.getMeals
);

mealsRouter.post(
    "/",
    authenticate,
    validate(CreateMealBodySchema,'body'),
    mealsController.createMeal
);

mealsRouter.patch(
    "/:id",
    authenticate,
    validate(MealParamsBodySchema, 'params'),
    validate(UpdateMealBodySchema, 'body'),
    mealsController.updateMeal
);

mealsRouter.delete(
    "/:id",
    authenticate,
    validate(MealParamsBodySchema, 'params'),
    mealsController.deleteMeal
);

export default mealsRouter;
import express from 'express';
import mealsController from '../controllers/meals.controller';

const mealsRouter = express.Router();

mealsRouter.get("/", mealsController.getMeals);
mealsRouter.post("/", mealsController.createMeal);
mealsRouter.patch("/:id", mealsController.updateMeal);
mealsRouter.delete("/:id", mealsController.deleteMeal);

export default mealsRouter;
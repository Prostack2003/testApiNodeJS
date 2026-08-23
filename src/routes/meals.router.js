const express = require("express");
const mealsRouter = express.Router();
const mealsController = require("../controllers/meals.controller");

mealsRouter.get("/", mealsController.getMeals);
mealsRouter.post("/", mealsController.createMeal);
mealsRouter.patch("/:id", mealsController.updateMeal);
mealsRouter.delete("/:id", mealsController.deleteMeal);

module.exports = mealsRouter;
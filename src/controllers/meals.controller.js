const mealsService = require('../services/meals.service');

async function getMeals(req, res, next) {
    const userId = req.query.user_id;
    const date = req.query.date;

   try {
       if (!userId) {
           return res.status(400).json({ error: 'user_id обязателен' });
       }

       const meals = await mealsService.getMeals(userId, date);

       return res.json(meals);
   } catch (err) {
       next(err);
   }
}
async function createMeal(req, res, next) {
    const data = req.body;
        try {
            if (data.user_id == null || data.product_id == null || data.weight_grams == null) {
                return res.status(400).json({error: 'Обязательные поля не переданы'})
            }

            const meal = await mealsService.createMeal({
                userId: data.user_id,
                productId: data.product_id,
                weightGrams: data.weight_grams,
                dateEat: data.date_eat,
            });
            return res.status(201).json(meal);

        } catch (err) {
            next(err);
        }
}
async function updateMeal(req, res, next) {
    const mealId = parseInt(req.params.id, 10);
    if (isNaN(mealId)) {
        return res.status(400).json({error: 'id должен быть числом!'})
    }
    const data = req.body;
        try {
            if (!data || (data.weight_grams == null && data.date_eat == null)) {
                return res.status(400).json({error: 'Нечего обновлять!'})
            }

            const updated = await mealsService.updateMeal(mealId, {
                weightGrams: data.weight_grams,
                dateEat: data.date_eat,
            });

            return res.status(200).json(updated);

        } catch (err) {
            next(err);
        }
}
async function deleteMeal(req, res, next) {
    const mealId = parseInt(req.params.id, 10);
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

module.exports = { getMeals, createMeal, updateMeal, deleteMeal };
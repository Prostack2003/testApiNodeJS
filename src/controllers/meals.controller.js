const mealsService = require('../services/meals.service');

async function getMeals(req, res) {
    const userId = req.query.user_id;
    const date = req.query.date;

   try {
       if (!userId) {
           return res.status(400).json({ error: 'user_id обязателен' });
       }

       const meals = await mealsService.getMeals(userId, date);

       return res.json(meals);
   } catch (error) {
       return res.status(500).json({ error: error.message });
   }
}
async function createMeal(req, res) {
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
            if (err instanceof SyntaxError) {
                // res.statusCode = 400;
                // return res.end(JSON.stringify({ error: 'Невалидный JSON' }));
                return res.status(400).json({error: 'Невалидный JSON'});
            }
            if (err.message === 'USER_NOT_FOUND' || err.message === 'PRODUCT_NOT_FOUND') {
                return res.status(404).json({error: err.message === 'USER_NOT_FOUND' ? 'Пользователь не найден' : 'Продукт не найден'})
            }
            if (err.message === 'VALIDATION_ERROR') {
                return res.status(400).json({error: 'weight_grams должен быть > 0'});
            }
            return res.status(500).json({error: 'Internal Server Error'});

        }
}
async function updateMeal(req, res) {
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

        } catch (error) {
            if (error instanceof SyntaxError) {
                return res.status(400).json({error: 'Невалидный JSON'});
            }
            if (error.message === 'VALIDATION_ERROR') {
                return res.status(400).json({error: 'weight_grams должен быть > 0'})
            }
            if (error.message === 'NOTHING_TO_UPDATE') {
                return res.status(400).json({error: 'Нечего обновлять'})
            }
            if (error.message === 'MEAL_NOT_FOUND') {
                return res.status(404).json({error: 'Запись о приеме пищи не найдена!'})
            }
            return res.status(500).json({error: 'Internal Server Error'});

        }
}
async function deleteMeal(req, res) {
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
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'});
    }
}

module.exports = { getMeals, createMeal, updateMeal, deleteMeal };
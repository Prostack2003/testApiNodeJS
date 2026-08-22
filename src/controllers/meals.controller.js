const mealsService = require('../services/meals.service');

async function getMeals(req, res, url) {
    const userId = url.searchParams.get('user_id');
    const date = url.searchParams.get('date');

   try {
       if (!userId) {
           res.statusCode = 400;
           res.setHeader('Content-Type', 'application/json');
           return res.end(JSON.stringify({error: 'user_id обязателен'}));
       }

       const meals = await mealsService.getMeals(userId, date);

       res.statusCode = 200;
       res.setHeader('Content-Type', 'application/json');
       return res.end(JSON.stringify(meals));
   } catch (error) {
       res.statusCode = 500;
       res.setHeader('Content-Type', 'application/json');
       return res.end(JSON.stringify({ error: error.message }));
   }
}
async function createMeal(req, res) {
    let body = ''

    req.on('data', (chunk) => {
        body += chunk;
    })

    req.on('end', async () => {
        try {
            const data = JSON.parse(body);

            if (data.user_id == null || data.product_id == null || data.weight_grams == null) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: 'Обязательные поля не переданы' }));
            }

            const meal = await mealsService.createMeal({
                userId: data.user_id,
                productId: data.product_id,
                weightGrams: data.weight_grams,
                dateEat: data.date_eat,
            });


            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');

            return res.end(JSON.stringify(meal));
        } catch (err) {
            if (err instanceof SyntaxError) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: 'Невалидный JSON' }));
            }
            if (err.message === 'USER_NOT_FOUND' || err.message === 'PRODUCT_NOT_FOUND') {
                res.statusCode = 404;
                return res.end(JSON.stringify({ error: err.message === 'USER_NOT_FOUND' ? 'Пользователь не найден' : 'Продукт не найден' }));
            }
            if (err.message === 'VALIDATION_ERROR') {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: 'weight_grams должен быть > 0' }));
            }
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');

            return res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    })
}
async function updateMeal(req, res, id) {
    const mealId = parseInt(id);

    if (isNaN(mealId)) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({error: 'id должен быть числом'}))
    }

    let body = '';

    req.on('data', (chunk) => {
        body += chunk;
    })

    req.on('end', async () => {
        try {
            const data = JSON.parse(body);

            if (!data || (data.weight_grams == null && data.date_eat == null)) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: 'Нечего обновлять' }));
            }

            const updated = await mealsService.updateMeal(mealId, {
                weightGrams: data.weight_grams,
                dateEat: data.date_eat,
            });

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(updated));

        } catch (error) {
            if (error instanceof SyntaxError) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: 'Невалидный JSON' }));
            }
            if (error.message === 'VALIDATION_ERROR') {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: 'weight_grams должен быть > 0' }));
            }
            if (error.message === 'NOTHING_TO_UPDATE') {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: 'Нечего обновлять' }));
            }
            if (error.message === 'MEAL_NOT_FOUND') {
                res.statusCode = 404;
                return res.end(JSON.stringify({ error: 'Запись не найдена' }));
            }
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    })
}
async function deleteMeal(req, res, id) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({error: 'id должен быть числом'}));
    }

    try {
        const isDelete = await mealsService.deleteMeal(userId);

        if (isDelete) {
            res.statusCode = 204;
            return res.end('');
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: 'Запись не найдена' }));
        }
    } catch (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

module.exports = { getMeals, createMeal, updateMeal, deleteMeal };
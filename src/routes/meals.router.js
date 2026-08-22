const mealsController = require("../controllers/meals.controller");

async function mealsRouter(req, res, url) {
    if (url.pathname === '/api/meals' && req.method === 'GET') await mealsController.getMeals(req, res, url);
    else if (url.pathname === '/api/meals' && req.method === 'POST') await mealsController.createMeal(req, res);
    else if (url.pathname.startsWith('/api/meals/') && req.method === 'PATCH') {
        const id = url.pathname.split('/')[3];
        await mealsController.updateMeal(req, res, id);
    }
    else if (url.pathname.startsWith('/api/meals/') && req.method === 'DELETE') {
        const id = url.pathname.split('/')[3];
        await mealsController.deleteMeal(req, res, id);
    }
    else {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({error: '405 NOT FOUND'}));
    }
}

module.exports = mealsRouter;
const pool = require('../db/pool');

async function getMeals(userId, date) {
    let productUserDataQuery =
        `
            SELECT
                mi.id,
                p.name AS product_name,
                mi.weight_grams,
                mi.date_eat::text AS date_eat,
                ROUND(p.calories_per_100g * mi.weight_grams / 100, 1) AS calories
            FROM meal_items AS mi
                     INNER JOIN products AS p ON mi.product_id = p.id
            WHERE mi.user_id = $1
        `;

    const params = [userId];

    if (date) {
        productUserDataQuery +=
            `
                AND mi.date_eat = $2
                `;
        params.push(date);
    }

    const result = await pool.query(productUserDataQuery, params);

    return result.rows.map(row => ({
        ...row,
        weight_grams: Number(row.weight_grams),
        calories: Number(row.calories)
    }));
}

async function createMeal({userId, productId, weightGrams, dateEat}) {

    if (!weightGrams || weightGrams <= 0) {
        throw new Error('VALIDATION_ERROR');
    }

    const searchUserQuery = `SELECT name FROM users WHERE id = $1`
    const searchUserResult = await pool.query(searchUserQuery, [userId]);
    if (searchUserResult.rows.length === 0) {
        throw new Error('USER_NOT_FOUND');
    }

    const searchProductQuery = `SELECT name FROM products WHERE id = $1`
    const searchProductResult = await pool.query(searchProductQuery, [productId]);
    if (searchProductResult.rows.length === 0) {
        throw new Error('PRODUCT_NOT_FOUND');
    }


    const mealItemsNewDataQuery =
        `
            INSERT INTO meal_items (user_id, product_id, weight_grams, date_eat)
            VALUES ($1, $2, $3, COALESCE($4, CURRENT_DATE))
            RETURNING id, user_id, product_id, weight_grams, date_eat::text AS date_eat

        `;

    const mealItemsNewData = await pool.query(
        mealItemsNewDataQuery,
        [userId, productId, weightGrams, dateEat]
    );

    return mealItemsNewData.rows[0];

}

async function updateMeal(id, updates) {
    const fieldsQuery = [];
    const paramsQuery = [];

    if (updates.weightGrams != null) {
        fieldsQuery.push(`weight_grams = $${paramsQuery.length + 1}`)
        paramsQuery.push(updates.weightGrams)
    }
    if (updates.dateEat != null) {
        fieldsQuery.push(`date_eat = $${paramsQuery.length + 1}`)
        paramsQuery.push(updates.dateEat)
    }

    if (updates.weightGrams != null && updates.weightGrams <= 0) {
        throw new Error('VALIDATION_ERROR');
    }

    if (fieldsQuery.length === 0) {
        throw new Error('NOTHING_TO_UPDATE')
    }

    paramsQuery.push(id);
    const idPlaceholder = `$${paramsQuery.length}`;

    const queryUpdate = `
        UPDATE meal_items 
        SET ${fieldsQuery.join(', ')} 
        WHERE id = ${idPlaceholder} 
        RETURNING id, user_id, product_id, weight_grams, date_eat::text AS date_eat
    `;

    const result = await pool.query(queryUpdate, paramsQuery);
    if (result.rows.length === 0) {
        throw new Error('MEAL_NOT_FOUND');
    }
    return result.rows[0];


}

async function deleteMeal(id) {
        const deleteQuery =
            `DELETE
             FROM meal_items
             WHERE id = $1 RETURNING id`;

        const deleteResult = await pool.query(deleteQuery, [id]);
        return deleteResult.rows.length !== 0;
}

module.exports = { getMeals, createMeal, updateMeal, deleteMeal };
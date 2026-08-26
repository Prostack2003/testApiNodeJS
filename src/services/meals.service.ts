import pool from "../db/pool";
import {CreateMealParams, MealItem, MealWithDetails, UpdateMealParams} from "../interfaces/domain.interfaces";
import {MealRow, MealWithDetailsRow} from "../interfaces/db.interfaces";

async function getMeals(userId: number, date?: string): Promise<MealWithDetails[]> {
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

    const params: Array<string | number> = [userId];

    if (date) {
        productUserDataQuery +=
            `
                AND mi.date_eat = $2
                `;
        params.push(date);
    }

    const result = await pool.query<MealWithDetailsRow>(productUserDataQuery, params);

    return result.rows.map(row => ({
        id: row.id,
        productName: row.product_name,
        weightGrams: Number(row.weight_grams),
        dateEat: row.date_eat,
        calories: Number(row.calories),
    }));
}
async function createMeal(params : CreateMealParams ): Promise<MealItem> {

    if (!params.weightGrams || params.weightGrams <= 0) {
        throw new Error('VALIDATION_ERROR');
    }

    const searchUserQuery = `SELECT name FROM users WHERE id = $1`
    const searchUserResult = await pool.query<{ name: string }>(searchUserQuery, [params.userId]);
    if (searchUserResult.rows.length === 0) {
        throw new Error('USER_NOT_FOUND');
    }

    const searchProductQuery = `SELECT name FROM products WHERE id = $1`
    const searchProductResult = await pool.query<{ name: string }>(searchProductQuery, [params.productId]);
    if (searchProductResult.rows.length === 0) {
        throw new Error('PRODUCT_NOT_FOUND');
    }


    const mealItemsNewDataQuery =
        `
            INSERT INTO meal_items (user_id, product_id, weight_grams, date_eat)
            VALUES ($1, $2, $3, COALESCE($4, CURRENT_DATE))
            RETURNING id, user_id, product_id, weight_grams, date_eat::text AS date_eat

        `;

    const mealItemsNewData = await pool.query<MealRow>(
        mealItemsNewDataQuery,
        [params.userId, params.productId, params.weightGrams, params.dateEat]
    );

    const row = mealItemsNewData.rows[0];
    return {
        id: row.id,
        userId: row.user_id,
        productId: row.product_id,
        weightGrams: Number(row.weight_grams),
        dateEat: row.date_eat,
    };

}
async function updateMeal(id: number, updates: UpdateMealParams): Promise<MealItem> {
    const fieldsQuery: string[] = [];
    const paramsQuery: Array<string | number> = [];

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

    const result = await pool.query<MealRow>(queryUpdate, paramsQuery);
    if (result.rows.length === 0) {
        throw new Error('MEAL_NOT_FOUND');
    }

    const row = result.rows[0];
    return {
        id: row.id,
        userId: row.user_id,
        productId: row.product_id,
        weightGrams: Number(row.weight_grams),
        dateEat: row.date_eat,
    };

}
async function deleteMeal(id: number): Promise<boolean> {
        const deleteQuery =
            `DELETE
             FROM meal_items
             WHERE id = $1 RETURNING id`;

        const deleteResult = await pool.query<{id: number}>(deleteQuery, [id]);
        return deleteResult.rows.length !== 0;
}

export default {getMeals, createMeal, updateMeal, deleteMeal};
import pool from "../db/pool.ts";
import {DeleteUserInfo, UpdateUserParams, User} from "../interfaces/domain.interfaces";
import {ACTIVITY_MULTIPLIERS} from "../constants/activity.ts";
import { UserRow } from "../interfaces/db.interfaces.ts";
import { AppError } from "../errors/AppError.ts";

async function getUserById (userId: number) {
    const getUserQuery = `
        SELECT 
            id, 
            name, 
            email, 
            age::INT as age, 
            weight::FLOAT as weight, 
            height::INT as height, 
            gender, 
            activity_level::FLOAT as "activityLevel"  
        FROM users 
        WHERE id = $1
        `
    const getResult = await pool.query<User>(getUserQuery, [userId]);

    if (getResult.rows.length === 0) {
        throw new AppError('USER_NOT_FOUND', 404, 'Пользователь не найден');
    }

    const dbUser = getResult.rows[0];

    return {
        ...dbUser,
        tdee: await calculateTDEE(dbUser)
    };
}

async function calculateTDEE (user: Omit<User, 'tdee'>): Promise<number> {
    let BMR = 0;
    if (user.gender === "M") {
        BMR = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5;
    } else if (user.gender === "F") {
        BMR = 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;
    }

    const multiplier = ACTIVITY_MULTIPLIERS[user.activityLevel]

    const result = BMR * multiplier;

    return Math.round(result * 10) / 10;
}

async function updateUserData(id: number, updates: UpdateUserParams): Promise<User> {
    const fieldsQuery: string[] = [];
    const paramsQuery: Array<string | number> = [];

    if (updates.name != null) {
        fieldsQuery.push(`name = $${paramsQuery.length + 1}`);
        paramsQuery.push(updates.name);
    }

    if (updates.age != null) {
        fieldsQuery.push(`age = $${paramsQuery.length + 1}`);
        paramsQuery.push(updates.age);
    }

    if (updates.weight != null) {
        fieldsQuery.push(`weight = $${paramsQuery.length + 1}`)
        paramsQuery.push(updates.weight)
    }
    if (updates.height != null) {
        fieldsQuery.push(`height = $${paramsQuery.length + 1}`)
        paramsQuery.push(updates.height)
    }

    if (updates.activityLevel != null) {
        fieldsQuery.push(`activity_level = $${paramsQuery.length + 1}`);
        paramsQuery.push(updates.activityLevel);
    }

    if (fieldsQuery.length === 0) {
        throw new AppError('NOTHING_TO_UPDATE', 400, 'Нечего обновлять')
    }

    paramsQuery.push(id);
    const idPlaceholder = `$${paramsQuery.length}`;

    const queryUpdate = `
        UPDATE users 
        SET ${fieldsQuery.join(', ')} 
        WHERE id = ${idPlaceholder} 
        RETURNING 
            id, 
            name,
            email,
            weight::FLOAT as weight,
            height::FLOAT as height,
            age::INT as age,  
            gender,
            activity_level::FLOAT as "activityLevel"
    `;

    const result = await pool.query<UserRow>(queryUpdate, paramsQuery);
    if (result.rows.length === 0) {
        throw new AppError('USER_NOT_FOUND', 404, 'Пользователь не найден');
    }

    const row = result.rows[0];
    const rowWithoutTDEE = {
        id: row.id,
        name: row.name,
        email: row.email,
        weight: Number(row.weight),
        height: Number(row.height),
        age: Number(row.age),
        gender: row.gender,
        activityLevel: Number(row.activityLevel),
    }

    return {
        id: row.id,
        name: row.name,
        email: row.email,
        weight: Number(row.weight),
        height: Number(row.height),
        age: Number(row.age),
        gender: row.gender,
        activityLevel: Number(row.activityLevel),
        tdee: await calculateTDEE(rowWithoutTDEE)
    };

}

async function deleteUserData(userId: number): Promise<DeleteUserInfo> {
    const deleteQuery = `
        DELETE 
        FROM users
        WHERE id = $1
        RETURNING id, name
    `

    const deleteResult = await pool.query <DeleteUserInfo>(deleteQuery, [userId]);

    if (deleteResult.rows.length === 0) {
        throw new AppError('USER_NOT_FOUND', 404, 'Пользователь не найден');
    }

    return deleteResult.rows[0];
}

export { getUserById, calculateTDEE, updateUserData, deleteUserData };
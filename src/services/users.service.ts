import pool from "../db/pool";
import {CreateUserParams, DeleteUserInfo, UpdateUserParams, User} from "../interfaces/domain.interfaces";
import {ACTIVITY_MULTIPLIERS} from "../constants/activity";
import {UserRow} from "../interfaces/db.interfaces";
import {AppError} from "../errors/AppError";
import bcrypt from "bcrypt";

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

async function getUserById (userId: number, tokenId: number) {
    if (userId !== tokenId) {
        throw new AppError('FORBIDDEN', 403, 'Доступ запрещен')
    }

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

async function createNewUser(params: CreateUserParams): Promise<User> {
    const saltRound = 10
    const hashPassword = await bcrypt.hash(params.password, saltRound);
    const insertQuery = `
        INSERT INTO users (name, password, email, weight, height, age, gender, activity_level)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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

    const result = await pool.query<UserRow>(insertQuery, [
        params.name,
        hashPassword,
        params.email,
        params.weight,
        params.height,
        params.age,
        params.gender,
        params.activityLevel,
    ]);

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
    };

    return {
        ...rowWithoutTDEE,
        tdee: await calculateTDEE(rowWithoutTDEE),
    };
}

async function updateUserData(id: number, tokenId: number, updates: UpdateUserParams): Promise<User> {
    const fieldsQuery: string[] = [];
    const paramsQuery: Array<string | number> = [];

    if (id !== tokenId) {
        throw new AppError('FORBIDDEN', 403, 'Доступ запрещен')
    }

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

async function deleteUserData(userId: number, tokenId: number): Promise<DeleteUserInfo> {

    if (userId !== tokenId) {
        throw new AppError('FORBIDDEN', 403, 'Доступ запрещен')
    }

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

async function getUserProfile(userId: number) {
    const result = await pool.query(`
        SELECT name, email, age, weight, height, gender, activity_level
        FROM users
        WHERE id = $1
    `, [userId]);

    if (!result.rows[0]) {
        throw new AppError('USER_NOT_FOUND', 404, 'Пользователь не найден');
    }

    const row = result.rows[0];
    return {
        ...row,
        weight: Number(row.weight),
        height: Number(row.height),
        age: Number(row.age),
        activity_level: Number(row.activity_level),
    };
}

async function changeUserPassword(userId: number, oldPassword: string, newPassword: string): Promise<void> {
    // 1. SELECT password FROM users WHERE id = $1
    const query =
        `
        SELECT password
        FROM users
        WHERE id = $1
        `

    const result = await pool.query(query, [userId]);
    // 2. Проверить, что пользователь существует

    if (!result.rows[0]) {
        throw new AppError('USER_NOT_FOUND', 404, 'Пользователь не найден');
    }

    // 3. bcrypt.compare(oldPassword, currentHash)
    const currentHash = result.rows[0].password;
    const isPass = await bcrypt.compare(oldPassword, currentHash)
    // 4. Если не совпадает — throw AppError

    if (!isPass) {
        throw new AppError('INVALID_PASSWORD', 401, 'Неверный текущий пароль');
    }
    // 5. bcrypt.hash(newPassword, 10)
    const saltRound = 10
    const hashPassword = await bcrypt.hash(newPassword, saltRound);
    // 6. UPDATE users SET password = $1 WHERE id = $2
    const queryUpdate =
        `
        UPDATE users 
        SET password = $1 
        WHERE id = $2
        `
    await pool.query(queryUpdate, [hashPassword, userId]);
    // 7. DELETE FROM refresh_tokens WHERE user_id = $1
    const queryDelete =
        `
        DELETE 
        FROM refresh_tokens 
        WHERE user_id = $1
        `
    await pool.query(queryDelete, [userId]);
}

export {
    calculateTDEE,
    getUserById,
    createNewUser,
    updateUserData,
    deleteUserData,
    getUserProfile,
    changeUserPassword,
};
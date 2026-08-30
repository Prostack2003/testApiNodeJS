import pool from "../db/pool";
import {AppError} from "../errors/AppError.ts";
import bcrypt from "bcrypt";

async function authUser (email: string, password: string) {
    const authSearchQuery =
        `
        SELECT 
            id,
            email, 
            password 
        FROM users 
        WHERE 
            email=$1
        `
    const result = await pool.query(authSearchQuery, [email]);

    if (!result.rows.length) {
        throw new AppError('INVALID_CREDENTIALS', 401,'Неверный email или пароль' );
    }

    const user = result.rows[0]
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new AppError('INVALID_CREDENTIALS', 401,'Неверный email или пароль' );
    }

    return {id: user.id, email: user.email};
}

export { authUser }
import pool from "../db/pool";
import {AppError} from "../errors/AppError.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StringValue } from 'ms';
import config from "../config";
import * as crypto from "node:crypto";
import refreshTokenService from "./refreshToken.service";

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

    const accessToken = jwt.sign({id: user.id, email: user.email}, config.jwt.secret, {expiresIn: config.jwt.expiresIn as StringValue});
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + 7);

    await refreshTokenService.saveRefreshToken(user.id, refreshToken, expiresIn);

    return {
        user: {
            id: user.id,
            email: user.email,
        },
        accessToken,
        refreshToken,
    }
}

async function refreshUserTokens(oldRefreshToken: string) {
    const oldToken = await refreshTokenService.findRefreshToken(oldRefreshToken);
    if (!oldToken) {
        throw new AppError('INVALID_REFRESH_TOKEN', 401, 'Невалидный refresh token')
    }

    const queryFindUser =
        `
        SELECT email 
        FROM users
        WHERE id = $1
        `
    const result = await pool.query(queryFindUser, [oldToken.user_id]);

    if (!result.rows.length) {
        throw new AppError('USER_NOT_FOUND', 404, 'Пользователь не найден')
    }

    await refreshTokenService.deleteRefreshToken(oldRefreshToken);

    const accessToken = jwt.sign(
        {
            id: oldToken.user_id,
            email: result.rows[0].email
        },
        config.jwt.secret,
        {
            expiresIn: config.jwt.expiresIn as StringValue
        });

    const refreshToken = crypto.randomBytes(64).toString('hex');
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + 7);

    await refreshTokenService.saveRefreshToken(oldToken.user_id, refreshToken, expiresIn);
    return {
        user:
            {
                id: oldToken.user_id,
                email: result.rows[0].email,
            },
        accessToken,
        refreshToken,
    }

}

async function logoutUserService(refreshToken: string) {
    return await refreshTokenService.deleteRefreshToken(refreshToken);
}

export { authUser, refreshUserTokens, logoutUserService }
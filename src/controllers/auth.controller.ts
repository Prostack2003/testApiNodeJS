import {Request, Response, NextFunction} from "express";
import {authUser, refreshUserTokens, logoutUserService} from "../services/auth.service";
import {AppError} from "../errors/AppError.ts";
import emailService from "../services/email.service.ts";
import passwordResetService from "../services/passwordReset.service.ts";
import pool from "../db/pool.ts";
import bcrypt from "bcrypt";

async function loginUser(req: Request, res: Response, next: NextFunction) {
    try {
        const {email, password} = req.body;
        const userData = await authUser(email, password);

        res.cookie('refreshToken', userData.refreshToken, {
            httpOnly: true,
            secure: false, // false - http, true -https
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 дней
        });


        return res.status(200).json({
            user: userData.user,
            accessToken: userData.accessToken,
        });

    } catch (err) {
        next(err);
    }

}

async function refreshUser(req: Request, res: Response, next: NextFunction) {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            throw new AppError("NOT_AUTHORIZED", 401, 'Not authorized');
        }

        const userData = await refreshUserTokens(refreshToken);

        res.cookie('refreshToken', userData.refreshToken, {
            httpOnly: true,
            secure: false, // false - http, true -https
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 дней
        });

        return res.status(200).json({
            user: userData.user,
            accessToken: userData.accessToken,
        });

    } catch (err) {
        next(err);
    }
}

async function logoutUser(req: Request, res: Response, next: NextFunction) {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
           return res.status(204).end();
        }

        await logoutUserService(refreshToken)
        res.clearCookie('refreshToken');
        return res.status(204).end()
    } catch(err) {
        next(err);
    }
}

async function forgotPassword (req: Request, res: Response, next: NextFunction) {
    try {
        const email = req.body.email;

        const querySearchUser =
            `
            SELECT id, email 
            FROM users 
            WHERE email = $1
            `;

        const result = await pool.query(querySearchUser, [email]);
        const user = result.rows[0] || null;
        if (user) {
            await passwordResetService.deleteUserTokens(user.id)
            const token = await passwordResetService.createResetToken(user.id)
            await emailService.sendPasswordResetEmail(email, token);
        }

        if (!email) {
            throw new AppError("EMAIL_REQUIRED", 400, "Email обязателен");
        }

        res.status(200).json({
            message: 'Если пользователь с таким email существует, письмо отправлено'
        });

    } catch (err) {
        next(err);
    }
}

async function resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.body.token;
        const newPassword = req.body.password;

        if (!token || !newPassword) {
            return res.status(400).json({
                message: 'Невалидный или истёкший токен'
            });
        }

        const resetToken = await passwordResetService.findValidResetToken(token);

        if (!resetToken) {
            return res.status(400).json({
                message: 'Невалидный или истёкший токен'
            });
        }

        const hashPasswordReset = await bcrypt.hash(newPassword, 10)

        const queryUpdatePass =
            `
        UPDATE users
        SET password = $1
        WHERE id = $2
        `


        await pool.query(queryUpdatePass, [hashPasswordReset,resetToken.user_id]);

        await pool.query('DELETE FROM refresh_tokens WHERE user_id = $1', [resetToken.user_id]);

        await passwordResetService.markTokenAsUsed(token);

        return res.status(200).json({
            message: 'Сброс пароля выполнен',
        })

    } catch (err) {
        next(err);
    }
}

export default { loginUser, refreshUser, logoutUser, forgotPassword, resetPassword };
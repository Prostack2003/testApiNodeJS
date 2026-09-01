import {Request, Response, NextFunction} from "express";
import {authUser, refreshUserTokens, logoutUserService} from "../services/auth.service";
import {AppError} from "../errors/AppError.ts";

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

export default { loginUser, refreshUser, logoutUser };
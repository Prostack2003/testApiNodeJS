import { Request, Response, NextFunction } from "express";
import config from "../config/index";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";

function authenticate(req: Request, res: Response, next: NextFunction) {
    // 1. Читаем заголовок
    const headerAuth = req.headers.authorization;

    // 2. Если заголовка нет — сразу 401
    if (!headerAuth) {
        return next(new AppError('UNAUTHORIZED', 401, 'Токен не передан'));
    }

    // 3. Проверяем формат "Bearer <token>"
    if (!headerAuth.startsWith('Bearer ')) {
        return next(new AppError('UNAUTHORIZED', 401, 'Неверный формат токена'));
    }

    // 4. Извлекаем токен, отрезая префикс "Bearer "
    const token = headerAuth.slice('Bearer '.length).trim();

    // 5. Верифицируем токен (синхронно, ошибки ловим через try/catch)
    try {
        const decoded = jwt.verify(token, config.jwt.secret);

        // 6. Проверяем, что это объект (а не строка)
        if (typeof decoded === 'string') {
            return next(new AppError('UNAUTHORIZED', 401, 'Неверный формат токена'));
        }

        // 7. Кладём данные пользователя в req.user
        req.user = {
            id: decoded.id,
            email: decoded.email,
        };

        // 8. Пропускаем запрос дальше к контроллеру
        next();
    } catch (err) {
        // Токен истёк или подпись неверная
        return next(new AppError('UNAUTHORIZED', 401, 'Неверный или просроченный токен'));
    }
}

export default authenticate;
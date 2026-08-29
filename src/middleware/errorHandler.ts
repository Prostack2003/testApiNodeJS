import { Request, Response, NextFunction } from 'express'
import { AppError } from "../errors/AppError";

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.userMessage });
    }

    // Неизвестная ошибка
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
}

export default errorHandler;



import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';

function validate(schema: ZodType, source: 'params' | 'body' | 'query') {
    return (req: Request, res: Response, next: NextFunction) => {
        // 1. Получить данные: req[source]
        const data = req[source];
        // 2. Валидировать: schema.safeParse(data)
        const parsedData = schema.safeParse(data)
        // 3. Если ошибка → вернуть 400
        if (!parsedData.success) {
            return res.status(400).json(
                {
                    error: 'Неправильный запрос или некорректные данные на сервер',
                }
            )
        }
        // 4. Если успех → вызвать next()
        next()
    };
}

export default validate;
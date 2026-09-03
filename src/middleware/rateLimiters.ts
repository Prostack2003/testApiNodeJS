import {ipKeyGenerator, rateLimit} from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import clientRedis from '../db/redis'; // проверь путь к твоему redis.ts

// Вспомогательная функция для создания стора, чтобы не дублировать код
const createStore = () => new RedisStore({
    sendCommand: (...args: string[]) => clientRedis.sendCommand(args),
});

// Фабричная функция лимитер
const createLimiter = (prefix: string, limit: number, message: string) => rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    store: createStore(),
    keyGenerator: async (req) => {
        const ipKey = await ipKeyGenerator(req.ip);
        return `${prefix}:${ipKey}`;
    },
    message: { error: message },
});

const loginLimiter = createLimiter('login', 5, 'Слишком много попыток входа');
const forgotPasswordLimiter = createLimiter('forgot-password', 3, 'Слишком много попыток забыть пароль');
const resetPasswordLimiter = createLimiter('reset-password', 5, 'Слишком много попыток сбросить пароль');
const refreshLimiter = createLimiter('refresh', 30, 'Слишком много попыток запроса токена');

export { loginLimiter, forgotPasswordLimiter, resetPasswordLimiter, refreshLimiter};
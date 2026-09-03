import { createClient } from 'redis';
import config from "../config/index";

const clientRedis = createClient({
    url: `redis://${config.redis.host}:${config.redis.port}`,
});

clientRedis.on('connect', () => {
    console.log('✅ Redis connected');
});

clientRedis.on('error', (err) => {
    console.error('❌ Redis error:', err);
});

export const redisReady = clientRedis.connect();

export default clientRedis;
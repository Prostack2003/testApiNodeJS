import { z } from "zod";
import ConfigInterface from "./ConfigInterface";

import 'dotenv/config';

function getRequiredEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} is required`);
    }
    return value;
}

const envSchema = z.object({
    PORT: z.string().default('3000').transform(Number),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_HOST: z.string(),
    DB_PORT: z.string().default('5432').transform(Number),
    DB_DATABASE: z.string(),
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string().regex(/^\d+\s?(s|m|h|d|w|y)$/)
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error('❌ Invalid environment variables:', parsedEnv.error.issues);
    process.exit(1);
}


const config: ConfigInterface = {
    port: parsedEnv.data.PORT,
    db: {
        user: parsedEnv.data.DB_USER,
        password: parsedEnv.data.DB_PASSWORD,
        host: parsedEnv.data.DB_HOST,
        port: parsedEnv.data.DB_PORT,
        database: parsedEnv.data.DB_DATABASE,
    },
    redis: {
        host: getRequiredEnv('REDIS_HOST'),
        port: parseInt(getRequiredEnv('REDIS_PORT')),
    },
    jwt: {
        secret: parsedEnv.data.JWT_SECRET,
        expiresIn: parsedEnv.data.JWT_EXPIRES_IN,
    },
    smtp: {
        host: getRequiredEnv('SMTP_HOST'),
        port: parseInt(getRequiredEnv('SMTP_PORT')),
        user: getRequiredEnv('SMTP_USER'),
        pass: getRequiredEnv('SMTP_PASS'),
        from: getRequiredEnv('SMTP_FROM'),
    },
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5500',
};

export default config;

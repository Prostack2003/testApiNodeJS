import { z } from "zod";
import ConfigInterface from "./ConfigInterface";

import 'dotenv/config';

const envSchema = z.object({
    PORT: z.string().default('3000').transform(Number),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_HOST: z.string(),
    DB_PORT: z.string().default('5432').transform(Number),
    DB_DATABASE: z.string(),
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
};

export default config;

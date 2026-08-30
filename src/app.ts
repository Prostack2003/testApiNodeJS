import express from 'express';
import { Request, Response } from 'express';
import config from './config/index';
import mealsRouter from './routes/meals.router';
import errorHandler from './middleware/errorHandler';
import cors from 'cors';
import usersRouter from "./routes/users.router";
import authRouter from "./routes/auth.router.ts";

// CORS for connect with Frontend
const app = express();
app.use(cors({
    origin: 'http://localhost:5500'
}));

// Parse JSON with HTTP Requests

app.use(express.json());

// Start URL - http:localhost:3000
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

// URL with /api/meals
app.use('/api/meals', mealsRouter);

// URL with /api/auth
app.use('/api/auth', authRouter);

// URL with /api/users
app.use('/api/users', usersRouter);

// NoRouterHandler and ErrorHandler and Listening Server
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Not Found' });
});
app.use(errorHandler)
app.listen(config.port, () => {
    console.log(`New API with Express.JS listening on port ${config.port}`);
});

export default app;

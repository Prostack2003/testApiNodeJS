import express from 'express';
import { Request, Response } from 'express';
import config from './config/index';
import mealsRouter from './routes/meals.router';
import errorHandler from './middleware/errorHandler';


const app = express();
app.use(express.json());
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});
app.use('/api/meals', mealsRouter);
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Not Found' });
});
app.use(errorHandler)
app.listen(config.port, () => {
    console.log(`New API with Express.JS listening on port ${config.port}`);
});


export default app;

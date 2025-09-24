import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { config } from './utils/env.js';
import processRouter from './routes/process.route.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req: Request, res: Response) => {
	res.json({ status: 'ok', name: 'LexiMind Backend' });
});

app.use('/api', processRouter);

// Basic error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
	console.error('Unhandled error:', err);
	res.status(500).json({ error: 'Internal Server Error' });
});

const port = config.port;
app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`);
});

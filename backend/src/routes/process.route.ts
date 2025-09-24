import { Router } from 'express';
import { processHandler } from '../controllers/process.controller.js';

const router = Router();

router.post('/process', processHandler);

export default router;

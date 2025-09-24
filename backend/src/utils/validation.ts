import { z } from 'zod';

export const processSchema = z.object({
	input: z.string().min(1, 'input is required'),
	mode: z.enum(['auto', 'text', 'code']).optional().default('auto'),
	detail: z.enum(['short', 'medium', 'detailed']).optional().default('medium'),
	language: z.enum(['en', 'fa']).optional().default('en'),
});

export type ProcessRequest = z.infer<typeof processSchema>;

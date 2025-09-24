import { Request, Response } from 'express';
import { detectInputType } from '../utils/detect.js';
import { processSchema } from '../utils/validation.js';
import { buildCodeExplainPrompt, buildTextSummaryPrompt } from '../services/prompt.js';
import { chatComplete } from '../services/openrouter.js';

export async function processHandler(req: Request, res: Response) {
	const parse = processSchema.safeParse(req.body);
	if (!parse.success) {
		return res.status(400).json({ error: 'Invalid request', details: parse.error.flatten() });
	}
	const { input, mode, detail } = parse.data;

	const resolvedMode = mode === 'auto' ? detectInputType(input) : (mode as 'text' | 'code');

	const prompt = resolvedMode === 'code'
		? buildCodeExplainPrompt(input, detail)
		: buildTextSummaryPrompt(input, detail);

	const { text } = await chatComplete({
		messages: [
			{ role: 'system', content: 'You are helpful, concise, and accurate.' },
			{ role: 'user', content: prompt },
		],
		maxTokens: detail === 'short' ? 400 : detail === 'medium' ? 800 : 1200,
	});

	return res.json({
		mode: resolvedMode,
		detail,
		result: text,
	});
}

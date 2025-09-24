import axios from 'axios';
import { config } from '../utils/env.js';

export type ChatMessage = {
	role: 'system' | 'user' | 'assistant';
	content: string;
};

export type ChatCompletionResult = {
	text: string;
	model?: string;
	usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
	raw?: any;
};

export async function chatComplete(params: {
	messages: ChatMessage[];
	model?: string;
	maxTokens?: number;
	temperature?: number;
}): Promise<ChatCompletionResult> {
	const { messages, model = config.openrouter.model, maxTokens = 800, temperature = 0.2 } = params;

	const headers: Record<string, string> = {
		Authorization: `Bearer ${config.openrouter.apiKey}`,
		'Content-Type': 'application/json',
	};
	if (config.openrouter.referer) headers['HTTP-Referer'] = config.openrouter.referer;
	if (config.openrouter.title) headers['X-Title'] = config.openrouter.title;

	const url = `${config.openrouter.baseUrl}/chat/completions`;
	const body = {
		model,
		messages,
		max_tokens: maxTokens,
		temperature,
	};

	const resp = await axios.post(url, body, { headers });
	const data = resp.data;
	const choice = data?.choices?.[0];
	const text: string = choice?.message?.content ?? '';
	return {
		text,
		model: data?.model,
		usage: data?.usage,
		raw: data,
	};
}

import 'dotenv/config';

function getEnv(name: string, fallback?: string): string {
	const value = process.env[name];
	if (value === undefined || value === '') {
		if (fallback !== undefined) return fallback;
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value;
}

export const config = {
	port: Number(process.env.PORT ?? '5050'),
	openrouter: {
		apiKey: getEnv('OPENROUTER_API_KEY'),
		baseUrl: process.env.OPENROUTER_BASE_URL ?? 'https://openrouter.ai/api/v1',
		model: process.env.OPENROUTER_MODEL ?? 'openrouter/auto',
		referer: process.env.HTTP_REFERER,
		title: process.env.X_TITLE ?? 'LexiMind',
	},
} as const;

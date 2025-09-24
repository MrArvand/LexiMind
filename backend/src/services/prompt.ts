export type DetailLevel = 'short' | 'medium' | 'detailed';

export function buildTextSummaryPrompt(input: string, detail: DetailLevel): string {
	const guidance = detail === 'short'
		? 'Provide a 3-5 bullet ultra-concise summary.'
		: detail === 'medium'
		? 'Provide a concise summary in 5-8 bullets with a short paragraph.'
		: 'Provide a detailed summary: key points, assumptions, caveats, and actionable insights.';
	return [
		"You are an expert technical writer.",
		"Summarize the following text clearly for a busy developer.",
		guidance,
		"Use markdown bullets and short sentences. Avoid fluff.",
		"Text:",
		input,
	].join('\n\n');
}

export function buildCodeExplainPrompt(code: string, detail: DetailLevel): string {
	const guidance = detail === 'short'
		? 'Explain in 3-5 bullets what the code does.'
		: detail === 'medium'
		? 'Explain step-by-step, outline inputs/outputs, and complexity if relevant.'
		: 'Explain deeply: architecture, data flow, edge cases, potential bugs, and improvements.';
	return [
		"You are a senior software engineer.",
		"Explain this code to a mid-level developer in plain language.",
		guidance,
		"Format the output in markdown with sections (Overview, Steps, Notes).",
		"Code:",
		'```',
		code.trim(),
		'```',
	].join('\n');
}

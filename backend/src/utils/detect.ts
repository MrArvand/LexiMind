export type InputType = 'code' | 'text';

const codeIndicators = [
	/\b(function|const|let|var|class|import|export|def|async|await|public|private|static)\b/i,
	/[{}();<>]/,
	/=>|::|:\s*\w+/,
	/```[a-z]*[\s\S]*```/i,
	/^\s*#include\b|^\s*using\s+namespace\b/m,
	/^\s*<\/?\w+[^>]*>/m, // HTML/XML
];

export function detectInputType(input: string): InputType {
	const trimmed = input.trim();
	if (trimmed.startsWith('```') && trimmed.endsWith('```')) return 'code';
	const matches = codeIndicators.some((re) => re.test(trimmed));
	return matches ? 'code' : 'text';
}

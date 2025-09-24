import { useMemo, useMemo as _u, useState } from 'react';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

const md = new MarkdownIt({
	highlight: (str, lang) => {
		if (lang && hljs.getLanguage(lang)) {
			try {
				return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`;
			} catch {}
		}
		return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
	},
	linkify: true,
	breaks: true,
});

type Detail = 'short' | 'medium' | 'detailed';

type Mode = 'auto' | 'text' | 'code';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5050';

export default function App() {
	const [input, setInput] = useState('');
	const [mode, setMode] = useState<Mode>('auto');
	const [detail, setDetail] = useState<Detail>('medium');
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	const disabled = useMemo(() => loading || input.trim().length === 0, [loading, input]);

	async function submit() {
		setError(null);
		setResult('');
		setLoading(true);
		try {
			const resp = await fetch(`${API_BASE}/api/process`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ input, mode, detail }),
			});
			const data = await resp.json();
			if (!resp.ok) throw new Error(data?.error || 'Request failed');
			setResult(data.result || '');
		} catch (e: any) {
			setError(e.message || 'Unexpected error');
		} finally {
			setLoading(false);
		}
	}

	async function copyOutput() {
		try {
			await navigator.clipboard.writeText(result);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {}
	}

	return (
		<div className="min-h-screen max-w-6xl mx-auto p-4 md:p-6 space-y-4">
			<header className="flex items-center justify-between">
				<h1 className="text-2xl md:text-3xl font-semibold tracking-tight">LexiMind</h1>
				<div className="text-xs md:text-sm opacity-70">Backend: {API_BASE}</div>
			</header>

			{/* Output panel at top */}
			<section className={`rounded-lg border shadow-sm bg-white/50 backdrop-blur-sm p-4 md:p-6 dark:bg-black/30`}> 
				<div className="flex items-center justify-between gap-3 border-b pb-3 mb-3">
					<div className="text-sm md:text-base font-medium">Output</div>
					<div className="flex items-center gap-2">
						<button onClick={copyOutput} disabled={!result} className="px-2 py-1 text-sm rounded-md border">
							{copied ? 'Copied' : 'Copy'}
						</button>
					</div>
				</div>
				<div className={`prose prose-slate max-w-none min-h-[48vh] dark:prose-invert`}
					dangerouslySetInnerHTML={{ __html: error ? `<div class='text-red-500'>${error}</div>` : md.render(result || 'Output will appear here...') }}
				/>
			</section>

			{/* Controls + Input */}
			<section className="rounded-lg border shadow-sm p-4 md:p-6 space-y-4 bg-white/50 backdrop-blur-sm dark:bg-black/30">
				<div className="flex flex-wrap gap-3 items-center">
					<label className="text-sm">Mode</label>
					<select value={mode} onChange={(e) => setMode(e.target.value as Mode)} className="px-2 py-1 rounded-md border">
						<option value="auto">Auto</option>
						<option value="text">Text</option>
						<option value="code">Code</option>
					</select>

					<label className="text-sm">Detail</label>
					<select value={detail} onChange={(e) => setDetail(e.target.value as Detail)} className="px-2 py-1 rounded-md border">
						<option value="short">Short</option>
						<option value="medium">Medium</option>
						<option value="detailed">Detailed</option>
					</select>

					<button onClick={submit} disabled={disabled} className="px-4 py-2 rounded-md bg-indigo-600 text-white disabled:opacity-50">
						{loading ? 'Processing...' : 'Generate'}
					</button>
				</div>

				<textarea
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Paste text or code here..."
					className="w-full min-h-[28vh] md:min-h-[32vh] p-3 rounded-md border"
				/>
			</section>
		</div>
	);
}

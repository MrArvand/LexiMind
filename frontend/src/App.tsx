import { useMemo, useState } from 'react';

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

	return (
		<div className="min-h-screen p-6 max-w-5xl mx-auto">
			<header className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-semibold">LexiMind</h1>
				<div className="text-sm text-slate-500">Backend: {API_BASE}</div>
			</header>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<section className="lg:col-span-2 space-y-3">
					<textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Paste text or code here..."
						className="w-full h-64 p-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
					/>

					<div className="flex flex-wrap gap-3 items-center">
						<label className="text-sm">Mode</label>
						<select value={mode} onChange={(e) => setMode(e.target.value as Mode)} className="px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent">
							<option value="auto">Auto</option>
							<option value="text">Text</option>
							<option value="code">Code</option>
						</select>

						<label className="text-sm">Detail</label>
						<select value={detail} onChange={(e) => setDetail(e.target.value as Detail)} className="px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent">
							<option value="short">Short</option>
							<option value="medium">Medium</option>
							<option value="detailed">Detailed</option>
						</select>

						<button
							onClick={submit}
							disabled={disabled}
							className="px-4 py-2 rounded-md bg-indigo-600 text-white disabled:opacity-50"
						>
							{loading ? 'Processing...' : 'Generate'}
						</button>
					</div>
				</section>

				<section className="lg:col-span-1">
					<div className="h-64 border border-slate-300 dark:border-slate-700 rounded-md p-3 overflow-auto whitespace-pre-wrap text-sm">
						{error ? (
							<div className="text-red-500">{error}</div>
						) : result ? (
							<div>{result}</div>
						) : (
							<div className="text-slate-500">Output will appear here...</div>
						)}
					</div>
				</section>
			</div>
		</div>
	);
}

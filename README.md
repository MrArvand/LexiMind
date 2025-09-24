# LexiMind

An AI summarizer and code explainer. Paste text or code and get concise, context-aware summaries or explanations powered by OpenRouter LLMs.

## Stack
- Frontend: React + Tailwind (planned)
- Backend: Node.js (Express + TypeScript)
- LLM API: OpenRouter (`https://openrouter.ai`)

## Monorepo Structure
```
leximind/
 ├─ backend/      # Express + TypeScript server
 └─ frontend/     # React app (to be scaffolded)
```

## Backend: Quick Start
1. Create `.env` inside `backend/`:
```
OPENROUTER_API_KEY=your_key_here
PORT=5050
```

2. Install and run:
```
cd backend
npm install
npm run dev
```

3. Test endpoints:
- Health: `GET http://localhost:5050/health`
- Process: `POST http://localhost:5050/api/process`
  Body example:
  ```json
  { "input": "Paste text or code...", "mode": "auto", "detail": "medium" }
  ```

## Roadmap (MVP)
- Text summarizer (short/medium/detailed)
- Code explainer (auto-detect code vs text)
- Export: copy/download/share link
- Frontend UI with dark/light mode

## Development
- Node 18+
- TypeScript 5+

## License
MIT

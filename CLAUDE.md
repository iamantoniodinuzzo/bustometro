## Git workflow

Custom aliases: `git start <type> <name>`, `git c`, `git finish [-y]`, `git sync`.

In pipelines/automation always use `git finish -y` (skips all interactive prompts: merge confirm, push, branch delete). Never pipe `echo Y`.

## Source code

All application code lives in **`src/`**. Entry point: `src/main.jsx`. Entire app logic and UI: `src/App.jsx`.

Backend-lite: Vercel Edge Functions in **`api/`** (currently: `api/stats.js` — social proof stats via Upstash Redis). Env vars: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`. For local backend testing use `vercel dev` (not `vite dev`).

Static assets served as-is from `public/`.

## Architecture

See [`ai_docs/ARCHITECTURE.md`](ai_docs/ARCHITECTURE.md) for folder structure, component map, dependency graph, and state reference.

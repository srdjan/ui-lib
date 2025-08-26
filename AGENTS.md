# Repository Guidelines

## Project Structure & Modules
- `src/`: Core library exports (`index.ts`) and implementation in `src/lib/*`.
- `src/lib/*.ts`: Modules; colocated tests as `*.test.ts`.
- `examples/`: Runnable TSX demos (`*.tsx`), `index.html`, `main.ts`.
- `docs/`: Authoring and API docs (`AUTHORING.md`, `UNIFIED-API.md`).
- `server.ts`: Dev SSR server used by examples.
- `deno.json`/`tsconfig.json`: Tasks, JSX runtime, and strict TS config.

## Build, Test, and Development
- `deno task start`: Type-check then run dev server → `http://localhost:8080`.
- `deno task serve`: Start server only (requires `--allow-net --allow-read --allow-env`).
- `deno task check`: Type-check `examples/*.tsx` and `src/**/*.ts`.
- `deno task test`: Run all tests (Deno test runner).
- `deno task coverage`: Write `coverage/` and `coverage.lcov` (LCOV format).
- `deno task fmt` / `deno task fmt:check`: Format / verify formatting.
- `deno task lint`: Lint with Deno’s linter.
- `deno task docs`: Generate API docs for `src/index.ts`.

## Coding Style & Naming
- TypeScript strict mode; rely on `deno fmt` and `deno lint` (2‑space indent, default Deno style).
- Components: kebab-case names (e.g., `defineComponent("theme-toggle", …)`).
- Files: library `.ts`, demos `.tsx`, tests `*.test.ts` next to sources.
- Philosophy: DOM is the state. Prefer class/data attributes over JS state; keep helpers pure and side‑effect free.

## Testing Guidelines
- Framework: Deno built-in `deno test`.
- Location/pattern: `src/lib/**.test.ts` next to modules.
- Run a single file: `deno test src/lib/ssr.test.ts`.
- Coverage: `deno task coverage` → `coverage.lcov` for CI tooling.

## Commit & Pull Request Guidelines
- History shows short, imperative summaries (e.g., "linter fixes", version tags like `v0.4.0`, occasional `WIP`).
- Prefer: concise subject, present tense; optional scope (e.g., `router: improve matching`).
- PRs must: describe changes, link issues, include tests/docs updates, and pass `deno task check fmt:check lint test`.

## Security & Config Tips
- Server reads env `PORT` (default 8080) and needs `--allow-net --allow-read --allow-env`.
- Avoid adding client runtime deps; keep examples self-contained under `examples/`.

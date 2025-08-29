# Repository Guidelines

This guide helps contributors navigate the codebase, run it locally, and submit high‑quality changes. Keep changes focused and align with the patterns below.

## Project Structure & Module Organization
- `src/`: Core library exports (`index.ts`) and implementation under `src/lib/*`.
- `src/lib/*.ts`: Modules; colocated tests as `*.test.ts`.
- `examples/`: Runnable TSX demos (`*.tsx`), `index.html`, `main.ts`.
- `docs/`: Authoring and API docs (`AUTHORING.md`, `UNIFIED-API.md`).
- `server.ts`: Dev SSR server used by examples.
- `deno.json` / `tsconfig.json`: Tasks, JSX runtime, strict TS config.

## Build, Test, and Development Commands
- `deno task start`: Type‑checks then runs the dev server → `http://localhost:8080`.
- `deno task serve`: Start server only (requires `--allow-net --allow-read --allow-env`).
- `deno task check`: Type‑check `examples/*.tsx` and `src/**/*.ts`.
- `deno task test`: Run all tests.
- `deno task coverage`: Write `coverage/` and `coverage.lcov` (LCOV format).
- `deno task fmt` / `deno task fmt:check`: Format / verify formatting.
- `deno task lint`: Lint with Deno’s linter.
- `deno task docs`: Generate API docs for `src/index.ts`.

## Coding Style & Naming Conventions
- **Language**: TypeScript in strict mode. Prefer pure, side‑effect‑free helpers.
- **Indent/format**: 2‑space indent; rely on `deno fmt` and `deno lint`.
- **Components**: kebab‑case names (e.g., `defineComponent("theme-toggle", …)`).
- **Files**: library `.ts`, demos `.tsx`, tests `*.test.ts` next to sources.
- **Philosophy**: The DOM is the state; prefer class/data attributes over JS state.

## Testing Guidelines
- **Framework**: Deno built‑in `deno test`.
- **Location**: `src/lib/**.test.ts` colocated with modules.
- **Single file**: `deno test src/lib/ssr.test.ts`.
- **Coverage**: `deno task coverage` produces `coverage/` and `coverage.lcov` for CI.

## Commit & Pull Request Guidelines
- **Commits**: Short, imperative subjects (e.g., "linter fixes", `router: improve matching`); version tags like `v0.4.0` when applicable.
- **PRs**: Describe changes, link issues, include tests/docs updates, and pass: `deno task check fmt:check lint test`.

## Security & Configuration Tips
- Server reads `PORT` (default `8080`) and requires `--allow-net --allow-read --allow-env`.
- Avoid adding client runtime dependencies; keep examples self‑contained under `examples/`.


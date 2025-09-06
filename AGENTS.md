# Repository Guidelines

## Project Structure & Module Organization
- Source: `lib/` holds core implementation. Co-locate tests as `*.test.ts` beside sources (e.g., `lib/ssr.test.ts`).
- Public API: `index.ts` re-exports stable types and functions only.
- Docs: `docs/` for authoring and API references (`docs/AUTHORING.md`, `docs/UNIFIED-API.md`).
- Config: `deno.json` (tasks, JSX runtime), `tsconfig.json` (strict TypeScript).
- Philosophy: small, pure helpers; DOM is the state.

## Build, Test, and Development Commands
- `deno task check`: Type-check `index.ts` and `lib/**/*.ts`.
- `deno task test`: Run the full test suite. Example: `deno test lib/ssr.test.ts`.
- `deno task coverage`: Write `coverage/` and `coverage.lcov` (LCOV for CI).
- `deno task fmt` / `deno task fmt:check`: Format / verify formatting.
- `deno task lint`: Lint with Deno’s linter.
- `deno task docs`: Generate API docs for `index.ts`.

## Coding Style & Naming Conventions
- Language: strict TypeScript; prefer pure, side-effect-free helpers.
- Indentation: 2 spaces; rely on `deno fmt` and `deno lint`.
- Components: kebab-case, e.g., `defineComponent("theme-toggle", ...)`.
- Files: library code is `.ts`; tests end with `.test.ts` next to sources.
- State: use class/data attributes; avoid global mutable state.

## Testing Guidelines
- Framework: Deno built-in `deno test` (no extra runner).
- Location & naming: `lib/**/*.test.ts` beside implementations.
- Run: `deno task test` or target a file via `deno test path/to/file.test.ts`.
- Coverage: `deno task coverage` produces LCOV artifacts for CI.

## Commit & Pull Request Guidelines
- Commits: short, imperative subjects (e.g., "linter fixes", `router: improve matching`). Tag releases like `v0.4.0`.
- PRs: include a clear description, link issues, and update tests/docs as needed.
- Required before merge: `deno task check fmt:check lint test` must pass.

## Security & Configuration Tips
- No runtime network/env requirements; avoid adding runtime dependencies.
- If permissions are needed, scope narrowly and document in `deno.json`.

## Architecture Overview
- Model: Functional Web Components; small, composable helpers in `lib/`.
- Rendering: DOM-first; SSR emits HTML; client enhances progressively.
- Data flow: attributes/`data-*` map to props; events via delegated listeners.


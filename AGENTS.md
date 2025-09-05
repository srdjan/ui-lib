# Repository Guidelines

## Project Structure & Module Organization

- `index.ts`: Public API surface; re-export stable types/functions.
- `lib/`: Core implementation. Co-locate tests next to sources as `*.test.ts`.
- `docs/`: Authoring and API docs (`docs/AUTHORING.md`, `docs/UNIFIED-API.md`).
- Config: `deno.json` (tasks, JSX runtime), `tsconfig.json` (strict TypeScript).
- Philosophy: Small, pure helpers; the DOM is the state.

## Build, Test, and Development Commands

- `deno task check`: Type-check `index.ts` and `lib/**/*.ts`.
- `deno task test`: Run all tests. Example: `deno test lib/ssr.test.ts`.
- `deno task coverage`: Write `coverage/` and `coverage.lcov` (LCOV).
- `deno task fmt` / `deno task fmt:check`: Format / verify formatting.
- `deno task lint`: Lint with Deno’s linter.
- `deno task docs`: Generate API docs for `index.ts`.

## Coding Style & Naming Conventions

- Language: TypeScript (strict). Prefer pure, side‑effect‑free helpers.
- Indentation: 2 spaces; rely on `deno fmt` and `deno lint`.
- Components: kebab-case, e.g., `defineComponent("theme-toggle", …)`.
- Files: Library code is `.ts`; tests live next to sources as `*.test.ts`.
- State: Use class/data attributes; avoid global mutable state.

## Testing Guidelines

- Framework: Deno built‑in `deno test`.
- Naming/location: `lib/**/*.test.ts` beside implementations.
- Run: `deno task test` or `deno test path/to/file.test.ts`.
- Coverage: `deno task coverage` produces LCOV for CI.

## Commit & Pull Request Guidelines

- Commits: Short, imperative subjects (e.g., "linter fixes",
  `router: improve matching`). Tag releases like `v0.4.0`.
- PRs: Provide clear description, link issues, and update tests/docs as needed.
- Required before merge: `deno task check fmt:check lint test` must pass.

## Security & Configuration Tips

- No runtime network/env requirements; avoid adding runtime dependencies.
- If tooling needs permissions, scope narrowly and document in `deno.json`.

## Architecture Overview

- Model: Functional Web Components; small, composable helpers in `lib/`.
- Rendering: DOM‑first; SSR emits HTML; client enhances progressively.
- Data flow: Attributes/`data-*` map to props; events via delegated listeners.

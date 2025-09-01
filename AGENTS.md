# Repository Guidelines

## Project Structure & Module Organization

- `index.ts`: Public API entry point; re-exports stable APIs.
- `lib/`: Core implementation. Colocate tests as `*.test.ts` beside sources.
- `docs/`: Authoring and API docs (`docs/AUTHORING.md`, `docs/UNIFIED-API.md`).
- Config: `deno.json` (tasks, JSX runtime), `tsconfig.json` (strict TypeScript).

## Build, Test, and Development Commands

- `deno task check`: Type-check `index.ts` and `lib/**/*.ts`.
- `deno task test`: Run all tests. Example: `deno test lib/ssr.test.ts`.
- `deno task coverage`: Write `coverage/` and `coverage.lcov` (LCOV).
- `deno task fmt` / `deno task fmt:check`: Format / verify formatting.
- `deno task lint`: Lint with Deno’s linter.
- `deno task docs`: Generate API docs for `index.ts`.

## Coding Style & Naming Conventions

- Language: TypeScript (strict). Prefer small, pure, side‑effect‑free helpers.
- Indentation: 2 spaces; rely on `deno fmt` and `deno lint`.
- Components: kebab-case, e.g., `defineComponent("theme-toggle", …)`.
- Files: Library code is `.ts`; tests live next to sources as `*.test.ts`.
- Philosophy: The DOM is the state; prefer class/data attributes over JS state.

## Testing Guidelines

- Framework: Deno built-in `deno test`.
- Naming/location: `lib/**/*.test.ts` beside implementation files.
- Run: `deno task test` or `deno test path/to/file.test.ts`.
- Coverage: `deno task coverage` produces LCOV for CI.

## Commit & Pull Request Guidelines

- Commits: Short, imperative subjects (e.g., "linter fixes",
  `router: improve matching`). Tag releases like `v0.4.0`.
- PRs: Provide clear description, link issues, update tests/docs as needed.
- Must pass: `deno task check fmt:check lint test` before merge.

## Security & Configuration Tips

- No runtime network/env requirements. Avoid adding runtime dependencies.
- If tooling requires permissions, scope narrowly and document in `deno.json`.

## Architecture Overview

- Model: Functional Web Components with small, composable helpers in `lib/`.
- Rendering: DOM‑first; SSR emits HTML (see `lib/ssr.test.ts`); client enhances
  progressively.
- Data flow: Attributes/`data-*` map to props; events via delegated listeners.
- State: Avoid global mutable state; reflect via class/data attributes.

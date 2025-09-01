# Repository Guidelines

## Project Structure & Module Organization

- `index.ts`: Public API entry point (re‑exports stable APIs).
- `lib/`: Core implementation; colocate tests as `*.test.ts` beside sources.
- `docs/`: Authoring and API docs (`docs/AUTHORING.md`, `docs/UNIFIED-API.md`).
- Config: `deno.json` (tasks, JSX runtime) and `tsconfig.json` (strict TS).

## Build, Test, and Development Commands

- `deno task check`: Type‑checks `index.ts` and `lib/**/*.ts`.
- `deno task test`: Runs all tests. Example: `deno test lib/ssr.test.ts`.
- `deno task coverage`: Writes `coverage/` and `coverage.lcov` (LCOV format).
- `deno task fmt` / `deno task fmt:check`: Format / verify formatting.
- `deno task lint`: Lints with Deno’s linter.
- `deno task docs`: Generates API docs for `index.ts`.

## Coding Style & Naming Conventions

- Language: TypeScript (strict). Prefer small, pure, side‑effect‑free helpers.
- Indentation & tools: 2‑space indent; rely on `deno fmt` and `deno lint`.
- Components: kebab‑case (e.g., `defineComponent("theme-toggle", …)`).
- Files: library code is `.ts`; tests live next to sources as `*.test.ts`.
- Philosophy: The DOM is the state; prefer class/data attributes over JS state.

## Testing Guidelines

- Framework: Deno built‑in `deno test`.
- Location & naming: `lib/**/*.test.ts` near implementation files.
- Coverage: `deno task coverage` generates LCOV consumed by CI.

## Commit & Pull Request Guidelines

- Commits: Short, imperative subjects (e.g., "linter fixes",
  `router: improve matching`). Tag releases like `v0.4.0`.
- PRs: Provide clear description, link issues, update tests/docs as needed.
- Must pass: `deno task check fmt:check lint test` before merge.

## Security & Configuration Tips

- No runtime network/env requirements. Avoid adding runtime dependencies.
- If Deno permissions are required for tooling, scope narrowly and document in
  `deno.json`.

## Architecture Overview

- Model: Functional Web Components with small, composable helpers in `lib/`.
- Rendering: DOM‑first; SSR emits HTML (see `lib/ssr.test.ts`); client enhances
  progressively.
- Data flow: Attributes/`data-*` map to props; events via delegated listeners.
- State: Avoid global mutable state; reflect via class/data attributes.

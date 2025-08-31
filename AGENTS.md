# Repository Guidelines

## Project Structure & Module Organization

- `index.ts`: Public API entry point.
- `lib/`: Core implementation; colocate tests as `*.test.ts` next to sources.
- `docs/`: Authoring and API docs (see `docs/AUTHORING.md`,
  `docs/UNIFIED-API.md`).
- `deno.json` / `tsconfig.json`: Tasks, JSX runtime, and strict TS config.

## Build, Test, and Development Commands

- `deno task check`: Type-checks `index.ts` and `lib/**/*.ts`.
- `deno task test`: Runs all tests.
- `deno task coverage`: Writes `coverage/` and `coverage.lcov` (LCOV format).
- `deno task fmt` / `deno task fmt:check`: Format / verify formatting.
- `deno task lint`: Lints with Deno’s linter.
- `deno task docs`: Generates API docs for `index.ts`.

## Coding Style & Naming Conventions

- Language: TypeScript in strict mode; prefer pure, side‑effect‑free helpers.
- Formatting: 2‑space indent; rely on `deno fmt` and `deno lint`.
- Components: kebab‑case names (e.g., `defineComponent("theme-toggle", …)`).
- Files: library files are `.ts`; tests live beside sources as `*.test.ts`.
- Philosophy: The DOM is the state; prefer class/data attributes over JS state.

## Testing Guidelines

- Framework: Deno built‑in `deno test`.
- Location: Place tests in `lib/**/*.test.ts`.
- Single file: `deno test lib/ssr.test.ts`.
- Coverage: Run `deno task coverage`; CI consumes `coverage.lcov`.

## Commit & Pull Request Guidelines

- Commits: Short, imperative subjects (e.g., "linter fixes",
  `router: improve matching`). Tag releases like `v0.4.0` when applicable.
- PRs: Provide a clear description, link issues, and update tests/docs as
  needed. Must pass: `deno task check fmt:check lint test`.

## Security & Configuration Tips

- No runtime network/env requirements. Avoid adding runtime dependencies.
- If tooling requires Deno permissions, keep them scoped and document in
  `deno.json`.

## Architecture Overview

- Core model: functional Web Components with small, pure helpers in `lib/`.
- Public surface: `index.ts` re‑exports stable APIs; keep internals within
  `lib/`.
- Rendering: DOM‑first; SSR emits HTML (see `lib/ssr.test.ts`); client
  progressively enhances.
- Data flow: HTML attributes/`data-*` map to props; events via delegated
  listeners.
- State: Avoid global mutable state; prefer class/data attributes to reflect UI.
- Extensibility: Add small, composable modules in `lib/`; no runtime deps; keep
  functions pure.

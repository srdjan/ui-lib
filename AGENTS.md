# Repository Guidelines

This guide explains how to work on funcwc, run checks locally, and submit high‑quality changes. Keep PRs focused and align with the patterns below.

## Project Structure & Module Organization
- `index.ts`: Public API entry point.
- `lib/`: Core implementation modules; tests colocated as `*.test.ts`.
- `docs/`: Authoring and API docs (see `docs/AUTHORING.md`, `docs/UNIFIED-API.md`).
- `deno.json` / `tsconfig.json`: Tasks, JSX runtime, and strict TS config.

## Build, Test, and Development Commands
- `deno task check`: Type‑checks `index.ts` and `lib/**/*.ts`.
- `deno task test`: Run all tests.
- `deno task coverage`: Write `coverage/` and `coverage.lcov` (LCOV format).
- `deno task fmt` / `deno task fmt:check`: Format / verify formatting.
- `deno task lint`: Lint with Deno’s linter.
- `deno task docs`: Generate API docs for `index.ts`.

## Coding Style & Naming Conventions
- **Language**: TypeScript in strict mode; prefer pure, side‑effect‑free helpers.
- **Indent/format**: 2‑space indent; rely on `deno fmt` and `deno lint`.
- **Components**: kebab‑case names (e.g., `defineComponent("theme-toggle", …)`).
- **Files**: library `.ts`; tests `*.test.ts` live next to sources.
- **Philosophy**: The DOM is the state; use class/data attributes over JS state.

## Testing Guidelines
- **Framework**: Deno built‑in `deno test`.
- **Location**: Colocated tests in `lib/**.test.ts`.
- **Single file**: `deno test lib/ssr.test.ts`.
- **Coverage**: Run `deno task coverage` to populate `coverage/` and `coverage.lcov` for CI.

## Commit & Pull Request Guidelines
- **Commits**: Short, imperative subjects (e.g., "linter fixes", `router: improve matching`); tag releases like `v0.4.0` when applicable.
- **PRs**: Include a clear description, link issues, and update tests/docs as needed. Must pass: `deno task check fmt:check lint test`.

## Security & Configuration Tips
- Library has no runtime network/env requirements. Avoid adding runtime deps.
- If code requires Deno permissions for tooling, keep them scoped and documented in `deno.json`.

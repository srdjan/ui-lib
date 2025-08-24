% Repository Guidelines

## Project Structure & Module Organization

- `src/`: Library entry and modules
  - `src/index.ts`: Public exports (components, signals, result).
  - `src/lib/*`: Core implementation (pipeline API, signals, JSX runtime shim,
    types).
- `examples/`: Runnable TS/TSX examples and static assets (`index.html`,
  `favicon.ico`).
- `docs/`: Reference docs (e.g., `PIPELINE_API.md`).
- Root tooling: `deno.json` (tasks, compiler options), `tsconfig.json`,
  `dev-server.ts`.

## Build, Test, and Development Commands

- `deno task check`: Type-checks `examples/*.tsx` and `src/**/*.ts`.
- `deno task serve`: Starts the local SSR dev server (default
  `http://localhost:8080`).
- `deno task start`: Runs type-checks, then serves examples.
- Useful:
  - `PORT=9000 deno task serve` to override port.
  - `deno fmt` / `deno lint` to format and lint.

## Coding Style & Naming Conventions

- TypeScript strict mode; target `ES2020`.
- SSR-only: use `html` tagged templates (no client JS, no JSX).
- Prefer functional, immutable updates; pure action functions in the pipeline
  API.
- Indentation: 2 spaces; keep chains readable and small helpers focused.
- Naming:
  - Components: kebab-case custom elements, often prefixed `f-` (e.g.,
    `f-counter-pipeline`).
  - Files: `kebab-case` for components, `.ts` for library, `.tsx` for
    views/examples.
- Run `deno fmt` before pushing; fix lint warnings (`deno lint`).

## Testing Guidelines

- No formal tests yet. When adding tests, use `Deno.test`:
  - Co-locate as `*.test.ts` next to sources or under `tests/`.
  - Focus on action purity, Result helpers, and prop parsing.
- Commands:
  - `deno test --allow-none` for pure tests.
  - Add permissions only when needed (e.g., `--allow-read`).

## Commit & Pull Request Guidelines

- Commits: concise, imperative subject; optional scope.
  - Examples: `feat(pipeline): add .styles helper`,
    `fix: correct result.flatMap types`.
- PRs: include a clear summary, linked issues, and screenshots/GIFs for example
  changes.
  - Ensure `deno task check`, `deno fmt`, and `deno lint` pass.
  - Document API changes in `docs/` and update examples when relevant.

## Security & Configuration Tips

- Dev server needs `--allow-net --allow-read --allow-env`; avoid broader flags.
- `PORT` controls server port.
- Avoid introducing runtime deps; library aims to be zero-dependency.

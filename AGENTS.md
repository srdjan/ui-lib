# Repository Guidelines

ui-lib delivers SSR-friendly UI primitives for Deno projects. Use this guide to
stay aligned with the existing structure and workflow.

## Project Structure & Module Organization

- `index.ts` and `mod*.ts` aggregate exports for consumers; keep tree-shaking in
  mind.
- `lib/` houses core modules with colocated specs (`*.test.ts`,
  `*.integration.test.ts`) and component subfolders.
- `components-simple.tsx` and `mod-simple.ts` expose
  alternate authoring styles; update them together when APIs shift.
- `examples/todo-app/` demonstrates full-stack usage with a Deno server; mirror
  feature changes here.
- `docs/` offers public guides; `assets/` and `bench/ssr.bench.ts` store design
  tokens and performance scripts.
- `lib/api-recipes.ts` wraps `generateClientApi` with HTMX helpers; stage new
  API improvements here first.

## Build, Test, and Development Commands

- `deno task check` – Type-checks `index.ts`, `lib/**/*.ts`, and example code.
- `deno task test` – Runs the full Deno test suite (unit, integration, JSX
  runtime).
- `deno task fmt` / `deno task fmt:check` – Formats or verifies formatting
  across the repo.
- `deno task lint` – Applies Deno’s lint rules; run before opening a PR.
- `deno task coverage` – Generates `coverage/` and `coverage.lcov` for
  reporting.
- `deno task serve` (or `start`) – Boots the Todo demo with the required
  permissions.
- `deno task bundle:state` – Bundles `scripts/state-entry.ts` into
  `dist/ui-lib-state.js` for client-side state helpers.

## Coding Style & Naming Conventions

Stick to strict TypeScript; keep imports relative. Use two-space indentation and
kebab-case filenames (`api-helpers.ts`). Favor pure functions, avoid ambient
globals, and centralize shared state in `lib/state-manager.ts`. Document exports
with JSDoc or concise examples. Run `deno fmt` and `deno lint` before
committing.

## Testing Guidelines

Write tests alongside implementations with the `*.test.ts` suffix; integration
or reactive suites use `*.integration.test.ts` as in
`lib/declarative-bindings.integration.test.ts`. Prefer table-driven cases and
snapshot-free assertions. Keep `deno task coverage` above 90% lines and add
regression tests for fixes. Use `deno test --filter` while iterating, and ensure
`deno task test` passes before pushing.

## Commit & Pull Request Guidelines

Existing history favors short, descriptive summaries (`using lib api correctly`,
`todo example code reorg`). Continue using imperative, ≤60-character titles and
omit trailing punctuation. Avoid `WIP` in final commits; squash if necessary.
Pull requests should include:

- Contextual description with links to docs or issues.
- Checklist of local commands run (check, test, fmt, lint, coverage when
  relevant).
- Screenshots or snippets for visual or API changes. Tag reviewers familiar with
  affected modules and call out breaking changes in bold at the top of the
  description.

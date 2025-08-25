# Changelog

All notable changes to this project will be documented in this file.

The format roughly follows Keep a Changelog, and this project aims for
semantic-ish versioning.

## [0.2.0] - 2025-08-25

### Added

- Custom JSX runtime (`h`, `Fragment`) for TSX authoring in components.
- `component()` pipeline supports `.props()`, `.api()`, `.parts()`, `.styles()`,
  `.view()` with TSX.
- Docs site using Deno JSX precompile (separate from component runtime):
  `deno task docs`.
- Authoring guide: `docs/AUTHORING.md`.
- Example components in `examples/examples.tsx`.
- Core DOM helpers: `toggleClass`, `toggleClasses`; utilities:
  `conditionalClass`, `spreadAttrs`, `dataAttrs`, `escape`.

### Changed

- Migrated examples from string templates to TSX with the custom `h` runtime.
- Tightened types across the component pipeline and runtime.

### Removed

- Legacy stateful pipeline (`.state()/.actions()`), related tests and services.
- Example-specific helpers from library: moved to `examples/dom-actions.ts` to
  keep core lean.

### Notes

- Library emits only core, reusable primitives; app-specific helpers remain in
  examples.
- All tests pass; `deno lint` clean. Use `deno task fmt:check` to verify
  formatting.

[0.1.0]: https://github.com/<your-org>/funcwc/releases/tag/v0.1.0

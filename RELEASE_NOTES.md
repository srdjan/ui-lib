# funcwc v0.1.0 — TSX authoring, lean core, example helpers extracted

Release date: 2025-08-25

## Highlights

- Author components in TSX using a tiny custom JSX runtime (`h`), with SSR-first
  output.
- DOM-native state model: use classes, data attributes, and text; event handlers
  accept core action objects or inline strings.
- Example-only helpers extracted to `examples/dom-actions.ts` to keep the core
  small and reusable.
- Separate docs site using Deno's JSX precompile (`deno task docs`).

## Breaking Changes

- Removed legacy `.state()` / `.actions()` pipeline and related SSR
  services/tests.
- Core `ComponentAction` now includes only `toggleClass` and `toggleClasses`.
- Example-specific helpers (e.g., `updateParentCounter`, `activateTab`, etc.)
  are no longer exported from the library.

## Migration

1. Replace `html` templates with TSX and import `h` from `src/index.ts`.
2. Use core actions for toggling: `toggleClass`, `toggleClasses`.
3. For app-specific behaviors: use small inline handler strings or copy helpers
   from `examples/dom-actions.ts`.
4. Server interactions: use `.api({...})` and spread HTMX attributes from
   generated `serverActions` in TSX.
5. Styles: prefer `.styles(css)` per component.

See `docs/MIGRATION.md` for examples.

## Developer Experience

- `deno task start` — type-check + dev server
- `deno task test` — run tests (32 passing)
- `deno task lint` — lint (clean)
- `deno task fmt:check` — formatting check
- `deno task docs` — docs server (precompiled JSX demo)

## Links

- Changelog: CHANGELOG.md
- Authoring: docs/AUTHORING.md
- Migration: docs/MIGRATION.md

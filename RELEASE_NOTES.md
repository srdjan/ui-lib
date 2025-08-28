# funcwc v0.5.0 — Function-Style Props and CSS-Only Styles

Release date: 2025-08-26

## Highlights

- Function-style props: props inferred from render parameters and defaults via
  helper calls (`string()`, `number()`, `boolean()`, etc.).
- CSS-only styles: author CSS property blocks; class names are auto-generated
  from keys.
- Unified API defaults: JSON-in/HTML-out standard with `hx-ext="json-enc"`,
  `hx-encoding="json"`, default `Accept: text/html` and `X-Requested-With`
  headers, and `hx-swap="outerHTML"` for non-GET.
- Request headers utility: `runWithRequestHeaders` and `currentRequestHeaders`
  for per-request (e.g., CSRF) header injection.
- Examples/docs: Counter, Todo, Tabs, Like Card, and Cart Item use the unified
  API with JSON requests; demo page simplified to showcase current patterns
  only.

## Internal changes

- Render parameter parser: replaced `Function` types, added object-literal
  defaults parsing and balanced brace handling.
- JSX runtime: added type guard for `dangerouslySetInnerHTML` and removed `any`
  usages.
- Types: added `UnwrapHelpers<T>` and `PropsOf<T>` utilities; exported from
  `src/index.ts`.
- TS config: ensured custom JSX factory (`jsx: "react"`, `jsxFactory: "h"`).

## Bug fixes

- Addressed lint and type issues in helper modules and examples.

## Migration notes

- Prefer function-style props with helper defaults for new components.
- Prefer CSS-only styles; traditional formats remain supported where needed.
- Standardize HTMX interactions on JSON requests and HTML responses; consume
  `await req.json()` in handlers and return `text/html`.

---

# funcwc v0.4.0 — Production-Ready: Enhanced Developer Experience & Performance

Release date: 2025-08-25

## Highlights

- **🔐 Open Source Ready**: Added MIT license and proper .gitignore for
  distribution
- **🧪 Comprehensive Testing**: 64 unit tests covering all core modules with
  edge cases
- **🐛 Enhanced Error Messages**: Detailed debugging info with context and
  suggestions
- **⚡ Performance Optimized**: Replaced expensive CSS transitions with specific
  properties
- **📖 Fixed Documentation**: Working `deno task docs` command generates API
  documentation
- **🔧 Standards Compliant**: Fixed boolean attribute parsing to follow HTML
  specifications

## New Features

- **Enhanced API Generator**: Function name collision detection with helpful
  warnings
- **Better Component Diagnostics**: Missing component errors now show available
  alternatives
- **Improved Server Logging**: Request context, detailed error messages, and
  stack traces
- **Comprehensive Test Coverage**: Router, API generator, and component state
  modules fully tested

## Bug Fixes

- Fixed boolean attribute parsing to properly handle empty strings per HTML
  standards
- Fixed API generator function naming conflicts (e.g., `POST /api/todos` now
  correctly generates `create()`)
- Fixed broken documentation generation task in deno.json
- Resolved CSS performance issues with `transition: all` declarations

## Developer Experience

- **Enhanced Error Context**: Component and prop names, received values, parsing
  details
- **Better Debugging**: Server errors include HTTP method, path, and stack
  traces
- **Test Coverage**: `deno task test` — 64 tests passing across 10 test files
- **API Documentation**: `deno task docs` — generates comprehensive API
  reference
- **Standards Compliance**: HTML boolean attributes work correctly (disabled,
  checked, etc.)

## Performance Improvements

- Replaced `transition: all` with specific `border-color, box-shadow`
  transitions
- Reduced CSS computation overhead for theme toggle animations
- More efficient property-specific transitions improve rendering performance

## Technical Improvements

- Added comprehensive unit tests for router.ts (12 tests)
- Added comprehensive unit tests for api-generator.ts (5 tests)
- Added comprehensive unit tests for component-state.ts (14 tests)
- Enhanced prop parsing error messages with component and value context
- Added API function collision detection with actionable warnings
- Improved missing component messages with available component suggestions

---

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

## Developer Experience

- `deno task start` — type-check + dev server
- `deno task test` — run tests (32 passing)
- `deno task lint` — lint (clean)
- `deno task fmt:check` — formatting check
- `deno task docs` — docs server (precompiled JSX demo)

## Links

- Changelog: CHANGELOG.md
- Authoring: docs/AUTHORING.md

# Changelog

All notable changes to ui-lib will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.8.0] - 2025-09-02

### Added

- Logging guard: console output gated by `configure({ logging, dev })`.

### Changed

- Coverage task hardened for Deno 2; LCOV generation updated in `deno.json`.
- Repository formatting/linting/typing cleanups.

### Fixed

- Example lint false-positive in `examples/layout.tsx`.

---

## [1.0.0] - 2025-08-31

### 🎉 Initial Release

#### Added

- **🎯 DOM-Native State Management**: Component state lives in CSS classes, data
  attributes, and element content
- **🚀 Function-Style Props**: Zero duplication between props definition and
  render parameters
- **🎨 CSS-Only Format**: Auto-generated class names from CSS properties - no
  selectors needed!
- **⚡ Hybrid Reactivity System**: Revolutionary three-tier component
  communication:
  - **🎨 Tier 1 - CSS Property Reactivity**: Instant visual updates via CSS
    custom properties
  - **📡 Tier 2 - Pub/Sub State Manager**: Cross-component state synchronization
    for complex app state
  - **🔔 Tier 3 - DOM Event Communication**: Component-to-component messaging
    via custom DOM events
- **🔧 defineComponent API**: Clean object-based component configuration
- **🔄 Unified API System**: Define server endpoints once, get HTMX attributes
  automatically
- **⚡ Smart Type Helpers**: `string()`, `number()`, `boolean()`, `array()`,
  `object()` with defaults
- **🎭 SSR-First Architecture**: Render components to HTML strings on the server
- **📦 Zero Runtime Dependencies**: No client-side framework required
- **🧾 JSON-in, HTML-out Pattern**: Standardized HTMX integration with JSON
  requests and HTML responses
- **🔧 TypeScript Support**: Full type inference throughout the system
- **🛠 Development Server**: Live examples with TypeScript MIME type handling

#### Examples and Demos

- **Basic Components Demo**: Function-style props and CSS-only format showcase
- **Interactive Reactivity Demo**: Complete three-tier reactivity system
  demonstration
  - Theme switching with CSS properties
  - Shopping cart with pub/sub state management
  - Notification system with DOM events
- **Comprehensive Documentation**: Complete README with examples and API
  reference

#### Developer Experience

- **Hot Reload**: Development server with watch mode
- **Type Safety**: Full TypeScript inference and validation
- **Zero Configuration**: Works out of the box with Deno
- **Modern Tooling**: Uses latest Deno features and Web APIs

### Technical Details

#### Core Architecture

- Custom JSX runtime for direct HTML string rendering (no React dependency)
- Component registry for SSR template replacement
- HTTP router with automatic API endpoint registration
- CSS class name generation and scoping system
- HTML escaping and security protections

#### Smart Type System

- Function-style props with automatic type inference
- Smart helpers for HTML attribute parsing (`string()`, `number()`, etc.)
- Full TypeScript integration with strict mode support
- Compile-time validation and IntelliSense support

#### Performance Optimizations

- Direct HTML string rendering (no virtual DOM)
- Minimal JavaScript bundle size
- CSS-only visual updates for theme changes
- Efficient pub/sub subscription cleanup
- Native browser event system utilization

#### Browser Compatibility

- Works with all modern browsers supporting ES2021
- Progressive enhancement approach
- Graceful degradation without JavaScript
- HTMX integration for seamless UX

### Development Commands

```bash
deno task serve      # Development server → http://localhost:8080
deno task start      # Type check + serve (recommended)
deno task check      # Type check all files  
deno task test       # Run tests
deno task fmt        # Format code
deno task lint       # Lint code
```

### Getting Started

```bash
# Clone and run examples
git clone <repository-url> && cd ui-lib
deno task serve  # → http://localhost:8080
```

Visit http://localhost:8080 to explore:

- Basic Components with function-style props
- Complete Hybrid Reactivity System demo
- Interactive examples of all three reactivity tiers

---

**Built with ❤️ for the modern web using Deno + TypeScript + DOM-native state
management + Revolutionary ergonomics.**

## [1.1.0] - 2025-09-01

### Added

- Global configuration via `configure()` (HTMX defaults: headers, swap, target)
- Consolidated `reactive` block on `defineComponent` (`on`, `state`, `mount`,
  `unmount`, `inject`)
- Unified event helper `on({...})` for a single `hx-on` attribute
- Action composition with `chain()`; JSX handlers simplified to
  `string | Action`
- Typed `ApiClientOptions` for generated client overrides

### Changed

- Prefer `remove()` (alias of `del`) in examples and docs for DELETE routes
- Stable per-request CSS dedup key to avoid duplicate style injection
- Auto-props now explicit via `autoProps: true` (docs/examples updated)
- Tightened docs (README, AUTHORING, UNIFIED-API) and added RFC link

### Fixed

- Navbar active item styling updates immediately on click
- Demo counter honors step sizes (1, 2, 10) via `autoProps`

### Internal

- Added tests for config, registry hygiene, styles dedup, reactive helpers, and
  API client options; suite now at 83 tests

## [1.1.1] - 2025-09-01

### Added

- Example server performance: mtime-based caching for `index.html` and cached
  partial responses for `/demo/*` routes
- Request-scoped style deduplication in example server via
  `runWithRequestHeaders()` to prevent duplicate `<style>` tags
- Tests for reactive system and helpers: `reactive.inject` lifecycle, `hx-on`
  merging, CSS reactive rules, CSS helpers, events, and debug utilities

### Changed

- Docs standardized to prefer `remove()` over `del()` across UNIFIED-API and
  AUTHORING guides
- Coverage improved: `define-component.ts` branches/lines up; overall line
  coverage from ~48.9% → ~55.2%, branch from ~69.4% → ~77.8%

### Fixed

- HTMX demo partials now include extracted `<style>` blocks to retain styles on
  swaps

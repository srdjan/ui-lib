# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

**ui-lib** is an ultra-lightweight, type-safe SSR component library with DOM-native state management and hybrid reactivity. Built with Deno and TypeScript using functional programming patterns for zero runtime overhead.

## Architecture & Core Concepts

### Component System
- Components defined via `defineComponent()` with typed configuration
- Function-style props using helpers: `string()`, `number()`, `boolean()`, `array()`, `object()`, `oneOf()`
- CSS-in-TS system generates collision-free class names
- SSR-first - components render to HTML strings server-side

### DOM-Native State Management
State lives in the DOM itself, not JavaScript memory:
- CSS classes for boolean states
- Data attributes for structured data
- Element content for display values
- CSS custom properties for theme values
- No hydration required - state is already in the HTML

### Three-Tier Reactivity
1. **CSS Property Reactivity** - Instant visual updates via CSS custom properties (no JS)
2. **Pub/Sub State Manager** - Cross-component communication via lightweight message bus
3. **DOM Event Communication** - Component-to-component messaging via custom events

### SSR Component Tag Processing
- Tokenizer-based processor (not regex) for custom component tags in HTML
- Handles self-closing and paired tags with children
- Multi-pass processing for nested components
- Attributes passed as strings, parsed by components using prop helpers

## Development Commands

```bash
# Core development
deno task check              # Type check all TypeScript files
deno task test               # Run all tests
deno test path/to/file.test.ts  # Run specific test file
deno test --filter "pattern"     # Run tests matching pattern
deno task coverage           # Run tests with coverage report
deno task fmt                # Format code
deno task fmt:check          # Check formatting without changes
deno task lint               # Lint code

# Server & examples
deno task serve              # Start example server (http://localhost:8080)
deno task start              # Type check, then start server

# Additional tools (via VS Code tasks or direct execution)
deno run --allow-read scripts/audit_css.ts    # Audit CSS usage
deno bench bench/ssr.bench.ts                 # Run performance benchmarks
deno run --allow-run --allow-read --allow-env scripts/release.ts  # Release preparation
```

## Project Structure

```
ui-lib/
├── mod.ts                      # Main public API exports
├── lib/
│   ├── define-component.ts     # Component definition system
│   ├── jsx-runtime.ts          # JSX/TSX support & h() function
│   ├── prop-helpers.ts         # Type-safe prop validation helpers
│   ├── css-in-ts.ts           # CSS-in-TS system with typed properties
│   ├── router.ts              # SSR routing with type-safe params
│   ├── reactive-helpers.ts    # Reactivity utilities & bindings
│   ├── state-manager.ts       # Pub/sub state management
│   ├── component-state.ts     # Component rendering & state
│   ├── registry.ts            # Component registry system
│   ├── ssr.ts                 # SSR utilities & HTML escaping
│   ├── styles-parser.ts       # Unified styles parsing
│   ├── reactive-system.ts     # Reactive attributes injection
│   ├── props.ts               # Props parsing system
│   ├── result.ts              # Result<T,E> type for error handling
│   └── components/            # Built-in component library
│       ├── button/            # Button components
│       ├── input/             # Form input components
│       ├── feedback/          # Alert, Badge, Progress, Toast
│       ├── data-display/      # Data visualization components
│       ├── media/             # Media handling components
│       └── overlay/           # Modal, Drawer, Popover, Tooltip
├── examples/
│   └── todo-app/              # Example todo application
│       ├── server.tsx         # Server entry point
│       ├── components.tsx     # Todo app components
│       └── api.tsx           # API routes & handlers
├── scripts/
│   ├── audit_css.ts          # CSS usage auditing tool
│   └── release.ts            # Release automation script
├── bench/
│   └── ssr.bench.ts          # SSR performance benchmarks
└── docs/                      # Documentation
    ├── architecture.md
    ├── component-api.md
    ├── getting-started.md
    └── examples.md
```

## Component Development Patterns

### Basic Component Definition
```tsx
import { defineComponent, string, number, boolean, h } from "./mod.ts";

defineComponent("my-component", {
  styles: {
    padding: "1rem",
    backgroundColor: "white"
  },
  render: (props: { title: string; count: number; active: boolean }) => (
    <div class="my-component">
      <h2>{props.title}</h2>
      <span>Count: {props.count}</span>
      {props.active && <span>Active!</span>}
    </div>
  )
});
```

### Component with Prop Helpers
```tsx
defineComponent("counter", {
  props: (attrs) => ({
    count: parseInt(attrs.count || "0"),
    step: parseInt(attrs.step || "1"),
    active: "active" in attrs
  }),
  render: (props) => (
    <div class={props.active ? "active" : ""}>
      Count: {props.count}
    </div>
  )
});
```

### Component with Reactivity
```tsx
defineComponent("reactive-component", {
  reactive: {
    css: { "--theme": "data-theme" },          // CSS property binding
    state: { "cart-count": "data-count" },     // Pub/sub state
    on: { "user:login": "handleLogin" }        // Event listeners
  },
  render: () => <div>...</div>
});
```

### Component with API Integration
```tsx
defineComponent("todo-item", {
  props: (attrs) => ({
    id: attrs.id,
    text: attrs.text,
    done: "done" in attrs
  }),
  api: {
    toggle: ["PATCH", "/api/todos/:id/toggle", handler],
    remove: ["DELETE", "/api/todos/:id", handler]
  },
  render: (props, api) => (
    <div>
      <span>{props.text}</span>
      <button {...api.toggle(props.id)}>Toggle</button>
      <button {...api.remove(props.id)}>×</button>
    </div>
  )
});
```

## Code Style & Conventions

### Functional Programming
- No classes or inheritance - use pure functions and composition
- Prefer immutable data with `readonly` for public APIs
- Model domain with algebraic data types (discriminated unions)
- Use `Result<T,E>` for error handling in core logic (no throws)
- Practice encapsulation at module boundaries

### TypeScript
- Strict mode with all safety flags enabled
- Type-first development - make illegal states unrepresentable
- Use type aliases over interfaces except for generics
- Leverage discriminated unions for exhaustive pattern matching

### File Organization
- Component files use `.tsx` extension
- Test files use `.test.ts` or `.test.tsx` suffix
- Keep related functionality in same module
- Export only necessary public APIs via `mod.ts`

### Testing
- Unit tests for pure functions and helpers
- Component tests for rendering with various props
- Integration tests for component interactions
- Benchmark tests for performance monitoring
- Use Deno's built-in test runner and assertions

## Performance Guidelines

- SSR rendering target: ~0.5ms per component
- Zero client-side framework runtime
- Optional client enhancements < 10KB
- Use streaming responses for large pages
- Three-level caching: JSX, Component, HTTP
- Leverage DOM-native state to avoid hydration

## Common Patterns

### Using Built-in Components
```tsx
import { Button, Card, Alert } from "./lib/components/index.ts";
```

### Composing Styles
```tsx
import { css, composeStyles } from "./lib/css-in-ts.ts";

const baseStyles = css({ padding: "1rem" });
const themeStyles = css({ backgroundColor: "white" });
const combined = composeStyles(baseStyles, themeStyles);
```

### Setting Up Routes
```tsx
import { Router } from "./lib/router.ts";

const router = new Router();
router.get("/api/users", getUsersHandler);
router.post("/api/users", createUserHandler);
```

### Response Helpers
```tsx
import { html, json, text, error } from "./lib/response.ts";

// Return HTML response
return html("<h1>Hello</h1>");

// Return JSON response
return json({ status: "ok" });
```

## Debugging Tips

- Use `deno task check` to catch type errors early
- Inspect DOM directly in DevTools - state is visible in attributes/classes
- Enable debug output with `DEBUG=true` environment variable
- Use `--filter` flag with tests to run specific tests
- Check generated CSS class names for style debugging

## Important Notes

- State management philosophy: State belongs in the DOM, not JavaScript memory
- Progressive enhancement over hydration
- Server-first design, not client-first with SSR bolted on
- All user input must be escaped for XSS protection
- Components should be pure functions when possible
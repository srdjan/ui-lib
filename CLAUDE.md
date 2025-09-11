# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is **ui-lib**: an ultra-lightweight, type-safe SSR component library with DOM-native state management and hybrid reactivity. It uses Deno, TypeScript, and a functional programming approach with zero runtime overhead.

## Key Architecture Concepts

### Component System
- Components defined via `defineComponent()` with name, styles, render function, and optional reactivity
- **Function-style props** using prop helpers (`string()`, `number()`, `boolean()`, `array()`, `object()`, `oneOf()`)
- CSS-in-TS system generates collision-free class names from typed CSS properties
- SSR-first design - components render to HTML strings server-side

### DOM-Native State Management
- **State lives in the DOM**, not JavaScript memory - stored in:
  - CSS classes for boolean states
  - Data attributes for structured data
  - Element content for display values
  - CSS custom properties for theme values
- No hydration needed - state is already in the HTML

### Three-Tier Reactivity System
1. **CSS Property Reactivity** - Instant visual updates via CSS custom properties (no JS needed)
2. **Pub/Sub State Manager** - Cross-component communication via lightweight message bus
3. **DOM Event Communication** - Component-to-component messaging via custom events

### SSR Component Tag Processing
The showcase server can render custom component tags directly from HTML:
- Uses tokenizer (not regex) to find and parse component tags
- Handles self-closing (`<my-comp />`) and paired tags with children
- Multi-pass processing for nested components
- Attributes passed as strings, parsed by components using prop helpers

## Common Development Commands

```bash
# Type checking
deno task check

# Run all tests
deno task test

# Run a specific test file
deno test path/to/file.test.ts

# Run tests matching a pattern
deno test --filter "component name"

# Run tests with coverage
deno task coverage

# Format code
deno task fmt

# Lint code
deno task lint

# Start showcase server (examples)
deno task serve
# or
deno task start  # runs check first, then serve

# Audit CSS usage
deno task audit:css

# Run benchmarks
deno task bench

# Build documentation
deno task docs

# Release preparation (full validation)
deno task release:prep
```

## Project Structure

```
ui-lib/
├── mod.ts                 # Main public API exports
├── lib/                   # Core library code
│   ├── define-component.ts    # Component definition system
│   ├── jsx-runtime.ts         # JSX/TSX support
│   ├── prop-helpers.ts        # Type-safe prop helpers
│   ├── css-in-ts.ts           # CSS-in-TS system
│   ├── router.ts              # SSR routing
│   ├── reactive-helpers.ts    # Reactivity utilities
│   ├── state-manager.ts       # Pub/sub state system
│   └── components/            # 50+ built-in components
├── examples/
│   └── showcase/          # Live component showcase
│       ├── server.ts          # Showcase server entry
│       ├── router.ts          # API endpoints
│       └── components/        # Showcase-specific components
└── docs/                  # Documentation
```

## Development Patterns

### Creating Components

Always use `defineComponent()` with function-style props for type safety:

```tsx
import { defineComponent, string, number, boolean, h } from "./mod.ts";

const MyComponent = defineComponent({
  name: "my-component",
  styles: {
    padding: "1rem",
    backgroundColor: "white"
  },
  render: (
    title = string("Default Title"),
    count = number(0),
    active = boolean(false)
  ) => (
    <div class="my-component">
      <h2>{title}</h2>
      <span>Count: {count}</span>
      {active && <span>Active!</span>}
    </div>
  )
});
```

### Adding Reactivity

Components can specify reactive behaviors:

```tsx
defineComponent({
  name: "reactive-component",
  reactive: {
    css: { "--theme": "data-theme" },          // CSS property binding
    state: { "cart-count": "data-count" },     // Pub/sub state
    on: { "user:login": "handleLogin" }        // Event listeners
  },
  render: () => <div>...</div>
});
```

### Testing Components

Write tests using Deno's built-in test runner:

```tsx
import { assertEquals } from "https://deno.land/std/assert/mod.ts";
import { renderToString } from "./lib/render.ts";

Deno.test("Component renders correctly", () => {
  const result = renderToString(<MyComponent title="Test" />);
  assertEquals(result.includes("Test"), true);
});
```

## Important Conventions

### Code Style
- **Functional programming**: No classes, no inheritance, pure functions preferred
- **Immutable data**: Use `readonly` for public APIs
- **Type-first**: Model with types, make illegal states unrepresentable
- **Top-down**: Define high-level logic first, then implementation details

### File Organization
- Component files use `.tsx` extension
- Test files use `.test.ts` or `.test.tsx` suffix
- Keep related functionality in the same module
- Export only necessary public APIs

### Error Handling
- Use `Result<T,E>` types in core logic (no throws)
- Validate props at component boundaries
- Escape all user input for XSS protection

### Performance
- Components render in ~0.5ms server-side
- Use streaming responses for large pages
- Leverage three-level caching (JSX, Component, HTTP)
- Keep optional client enhancements under 10KB

## Showcase Server

The showcase server demonstrates all components and patterns:

- Entry: `examples/showcase/server.ts`
- Router: `examples/showcase/router.ts` (handles API endpoints)
- Custom components in `examples/showcase/components/`
- Serves on `http://localhost:8080` when running `deno task serve`

The showcase uses a tokenizer-based SSR component tag processor that can render custom component tags directly from HTML templates.

## Testing Strategy

1. **Unit tests**: Test pure render functions and helpers
2. **Component tests**: Test component rendering with various props
3. **Integration tests**: Test component interactions and reactivity
4. **Benchmark tests**: Monitor rendering performance

Run tests frequently during development. The test suite is fast and comprehensive.

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

## Debugging Tips

- Use `deno task check` to catch type errors early
- Inspect DOM directly in DevTools (state is visible)
- Check generated CSS class names with `deno task audit:css`
- Use `--filter` flag with tests to run specific tests
- Enable debug output with `DEBUG=true` environment variable
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**funcwc** is a lightweight, functional programming library for building **SSR-first components** with TypeScript/Deno. It renders components to HTML strings on the server using a custom JSX runtime, with client-side interactivity powered by HTMX. The library features an ultra-succinct Pipeline API with immutable state, pure functions, and intelligent type inference, following Light Functional Programming principles.

## Development Commands

### Primary Commands

```bash
# Type check all files
deno task check

# Serve examples on http://localhost:8080 with TypeScript MIME type handling
deno task serve  

# Full development workflow: check types then serve
deno task start
```

### Testing and Quality

```bash
# Run tests
deno task test

# Format code
deno task fmt

# Check formatting without changes
deno task fmt:check

# Lint code  
deno task lint

# Generate test coverage
deno task coverage

# Generate documentation
deno task docs
```

### Manual Commands

```bash
# Type check specific files
deno check examples/*.tsx src/**/*.ts

# Run development server with TypeScript MIME type handling
deno run --allow-net --allow-read --allow-env server.ts
```

## Core Architecture

### Library Structure

The codebase follows a functional, modular architecture built around SSR-compatible web components:

1. **defineComponent API** (`src/lib/define-component.ts`) - Clean, object-based configuration for component creation
2. **Pipeline API** (`src/lib/component-pipeline.ts`) - Ultra-succinct chainable API for component creation (legacy, maintained for backward compatibility)
3. **Component Registry** (`src/lib/registry.ts`) - Global registry for SSR component definitions
4. **JSX Runtime** (`src/lib/jsx-runtime.ts`) - Custom JSX runtime that renders directly to HTML strings
5. **SSR Engine** (`src/lib/component-state.ts`) - Server-side rendering system with `renderComponent()` function
6. **Unified API System** (`src/lib/api-generator.ts`) - Auto-generates HTMX client functions from server route definitions

### Key Architecture Patterns

**Functional Programming Principles:**

- No classes in business logic (except for internal DOM element wrapper)
- Immutable state with `Readonly<T>` everywhere
- Pure functions for state updates and rendering
- Result types for error handling (`Result<T,E>`)
- DOM as the single source of truth for component state

**Component Definition Approaches:**

1. **defineComponent API (New & Recommended)** - Clean, object-based configuration:

```tsx
defineComponent("my-counter", {
  props: {
    step: "number?",
    initialCount: { type: "number", default: 0 },
  },
  classes: { button: "counter-btn", label: "counter-label" },
  styles: ".counter-btn { background: blue; }",
  render: ({ step, initialCount }, api, classes) => (
    <button class={classes!.button}>Count: {initialCount}</button>
  ),
});
```

2. **Pipeline API** - Chainable, fluent API (maintained for backward compatibility):

```tsx
component("my-counter")
  .props({ step: "number?" })
  .classes({ button: "counter-btn", label: "counter-label" })
  .view((props, api, classes) => (
    <button class={classes!.button}>Count</button>
  ));
```

### File Organization

```
src/
├── index.ts                    # Main exports
├── lib/
│   ├── define-component.ts     # Primary defineComponent API
│   ├── component-pipeline.ts   # Legacy Pipeline API implementation  
│   ├── component-state.ts      # SSR rendering engine
│   ├── api-generator.ts        # Unified API system (HTMX generation)
│   ├── jsx-runtime.ts          # JSX runtime integration
│   ├── dom-helpers.ts          # Type-safe DOM manipulation helpers
│   ├── props.ts                # Props parsing and validation
│   ├── router.ts               # HTTP router for API endpoints
│   ├── result.ts               # Result<T,E> type and utilities
│   └── ssr.ts                  # SSR utilities and HTML escaping
examples/
├── example.tsx                 # Main example components
├── dom-actions.ts              # App-level DOM helper functions
├── main.ts                     # Example imports
└── index.html                  # Demo page
```

## TypeScript Configuration

### Compiler Settings

- **Target**: ES2020 with DOM support
- **Module**: ES2020 with Bundler resolution
- **JSX**: Uses custom JSX runtime with `h` function (`"jsx": "react"`, `"jsxFactory": "h"`)
- **Strict Mode**: Full TypeScript strictness enabled
- `noUncheckedIndexedAccess: true` for array safety

### JSX Setup

All JSX files must include:

```tsx
/** @jsx h */
import { h } from "../src/index.ts";
```

## Key Development Patterns

### Enhanced Props System

The new `defineComponent` API supports multiple prop definition styles:

**Basic String Syntax:**
```tsx
props: { 
  name: "string", 
  age: "number?", 
  active: "boolean?" 
}
```

**Enhanced Syntax with Defaults:**
```tsx
props: {
  name: "string",
  age: { type: "number", default: 18 },
  active: { type: "boolean", default: true }
}
```

**Custom Props Transformer:**
```tsx
props: (attrs: Record<string, string>) => {
  return {
    count: parseInt(attrs.count || "0"),
    label: attrs.label || "Default Label"
  };
}
```

### Unified API System

Define server endpoints once - HTMX attributes generated automatically:

```tsx
api: {
  'POST /api/items': async (req) => {
    const data = await req.formData();
    return new Response(renderComponent("item", { id: newId, ...data }));
  },
  'DELETE /api/items/:id': async (req, params) => {
    return new Response(null, { status: 204 });
  }
}

// Usage in render function:
render: ({ id }, api) => (
  <div>
    <button {...(api?.create?.() || {})}>Add Item</button>
    <button {...(api?.delete?.(id) || {})}>Delete</button>
  </div>
)
```

**Route-to-Function Mapping:**
- `POST /api/items` → `api.create()`
- `DELETE /api/items/:id` → `api.delete(id)`
- `PATCH /api/todos/:id/toggle` → `api.toggle(id)`

### DOM-Native State Management

Instead of JavaScript state objects, funcwc uses the DOM:

- **CSS Classes** → UI states (`active`, `open`, `loading`)
- **Data Attributes** → Component data (`data-count="5"`)
- **Element Content** → Display values (counter numbers, text)
- **Form Values** → Input states (checkboxes, text inputs)

### Styling

- Component-scoped CSS via `.styles(css)` in defineComponent config
- Uses Shadow DOM for style encapsulation
- CSS classes are scoped to the component automatically

### Testing Strategy

Uses Deno's built-in testing:

```bash
deno test                    # Run tests
deno test --coverage        # With coverage
```

## Error Handling Philosophy

The library follows functional error handling patterns:

- Use `Result<T,E>` types from `src/lib/result.ts`
- Core utilities: `ok()`, `err()`, `map()`, `flatMap()`, `mapError()`
- Avoid throwing exceptions in business logic
- Handle errors as values throughout the pipeline

## Integration Notes

### SSR Architecture

- Components render to HTML strings on the server via custom JSX runtime
- Global registry stores component definitions for server-side rendering
- String-based template replacement converts component tags to rendered HTML
- Client-side interactivity handled by HTMX attributes

### Pure SSR Approach

- No Custom Elements or Shadow DOM - components are pure server-side templates
- Components registered in global registry for string rendering
- Zero client-side framework dependencies
- Event handling via inline DOM manipulation or HTMX server actions

### Deno Runtime

- Designed for Deno's TypeScript-first environment
- Development server handles TypeScript modules with proper MIME types
- Uses custom JSX runtime with direct string rendering
- No build step required for development

### Browser Compatibility

- Works in any browser that supports ES5+ (very broad compatibility)
- No Custom Elements or Shadow DOM required
- Uses standard HTML with optional HTMX for interactivity

## Development Workflow

1. **Component Creation**: Use `defineComponent` API for new components in `.tsx` files with `/** @jsx h */` pragma
2. **Type Safety**: Let TypeScript infer types from component configuration
3. **Zero Configuration**: Deno automatically handles TypeScript transpilation and custom JSX runtime
4. **Testing**: Access components at `http://localhost:8080` after `deno task start`
5. **Event Handling**: Use DOM helpers or inline strings for direct DOM manipulation
6. **Styling**: Include styles in `styles` property for scoped CSS

### SSR Integration

- Components render to HTML strings via custom JSX runtime
- JSX pragma `/** @jsx h */` enables zero-config JSX processing
- Custom `h` function converts JSX elements directly to HTML strings
- Server-side template replacement converts `<component-name>` tags to rendered HTML
- No build step required - Deno handles all transpilation

## Common Patterns

### DOM Helpers

**Core helpers shipped by the library:**

```tsx
toggleClass("active"); // Toggle single class
toggleClasses(["open", "visible"]); // Toggle multiple classes
conditionalClass(isOpen, "open", "closed"); // Conditional CSS classes
```

**Example-only helpers** (in `examples/dom-actions.ts`):
- `updateParentCounter()` - Counter increment/decrement
- `resetCounter()` - Reset counter to initial value
- `toggleParentClass()` - Toggle class on parent element
- `syncCheckboxToClass()` - Checkbox state → CSS class
- `activateTab()` - Tab activation

### Prop Validation

Smart prop parsing handles type conversion automatically:

```tsx
props: { max: "number?", disabled: "boolean?" }
// Usage: <my-component max="100" disabled></my-component>
```

### Component State Design

Keep state in DOM attributes and classes:

```tsx
<div class="counter open" data-count="5" data-max="100">
  <span class="display">5</span>
</div>
```
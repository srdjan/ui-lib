# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**funcwc** is a revolutionary, ultra-lightweight library for building **SSR-first components** with TypeScript/Deno. It features **function-style props** (zero duplication), **CSS-only format** (auto-generated class names), and the **Unified API System** (HTMX attributes auto-generated from server routes). Components render to HTML strings using a custom JSX runtime, with the DOM as the single source of truth for state management.

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

1. **defineComponent API (Recommended)** - Modern approach with **function-style props** and **CSS-only format**:

```tsx
import { defineComponent, h, number, string } from "../src/index.ts";

defineComponent("my-counter", {
  styles: {
    // ✨ CSS-only format - class names auto-generated!
    button: `{ padding: 0.5rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }`,
    display: `{ font-size: 1.5rem; font-weight: bold; margin: 0 0.5rem; }`,
  },
  render: ({
    // ✨ Function-style props - no duplication!
    step = number(1),
    initialCount = number(0),
  }, api, classes) => (
    <div>
      <button class={classes!.button}>-{step}</button>
      <span class={classes!.display}>{initialCount}</span>
      <button class={classes!.button}>+{step}</button>
    </div>
  ),
});
```

2. **Legacy Props System** - Traditional approach (still supported):

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

### File Organization

```
src/
├── index.ts                    # Main exports
├── lib/
│   ├── define-component.ts     # Primary defineComponent API with function-style props
│   ├── component-pipeline.ts   # Legacy Pipeline API (maintained for compatibility)
│   ├── component-state.ts      # SSR rendering engine with renderComponent()
│   ├── api-generator.ts        # Unified API system (auto-generates HTMX from routes)
│   ├── api-helpers.ts          # HTTP method helpers (post, get, patch, del)
│   ├── jsx-runtime.ts          # Custom JSX runtime for HTML string rendering
│   ├── props.ts                # Smart type helpers and props parsing
│   ├── router.ts               # HTTP router for API endpoints
│   └── registry.ts             # Global component registry for SSR
examples/
├── example.tsx                 # Showcase of all modern features (function-style props, CSS-only format, Unified API)
├── dom-actions.ts              # App-level DOM helper functions (updateParentCounter, etc.)
├── server.ts                   # Development server with SSR and API routing
└── index.html                  # Demo page displaying all components
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

### Revolutionary Component Ergonomics

**1. Function-Style Props (Zero Duplication!):**

```tsx
import { array, boolean, defineComponent, h, number, object, string } from "../src/index.ts";

defineComponent("modern-card", {
  render: ({
    // ✨ Props auto-generated from function signature - no duplication!
    title = string("Card Title"),         // Required string with default
    count = number(0),                    // Required number with default  
    enabled = boolean(true),              // Required boolean with default
    items = array([]),                    // Required array with default
    config = object({ theme: "light" }), // Required object with default
  }, api, classes) => (
    <div class={classes!.container}>
      <h3>{title}</h3>
      <p>Count: {count}, Enabled: {enabled ? "Yes" : "No"}</p>
    </div>
  ),
});
```

**2. CSS-Only Format (Auto-Generated Classes!):**

```tsx
styles: {
  // ✨ Just CSS properties - class names auto-generated!
  container: `{ border: 1px solid #ddd; padding: 1rem; border-radius: 6px; }`,     // → .container
  buttonPrimary: `{ background: #007bff; color: white; padding: 0.5rem 1rem; }`,  // → .button-primary
  textLarge: `{ font-size: 1.5rem; font-weight: bold; }`                          // → .text-large
}
```

**3. Legacy Props System (Still Supported):**

```tsx
// Basic string syntax
props: { 
  name: "string", 
  age: "number?", 
  active: "boolean?" 
}

// Enhanced syntax with defaults  
props: {
  name: "string",
  age: { type: "number", default: 18 },
  active: { type: "boolean", default: true }
}

// Custom transformer function
props: (attrs: Record<string, string>) => ({
  count: parseInt(attrs.count || "0"),
  label: attrs.label || "Default Label"
})
```

### Unified API System

Define server endpoints once - HTMX attributes generated automatically:

```tsx
import { defineComponent, del, h, post, renderComponent, string } from "../src/index.ts";

defineComponent("todo-item", {
  api: {
    // ✨ Define server handlers - client functions auto-generated!
    create: post("/api/items", async (req) => {
      const data = await req.formData();
      return new Response(renderComponent("item", { id: newId, ...data }));
    }),
    remove: del("/api/items/:id", async (req, params) => {
      return new Response(null, { status: 204 });
    }),
  },
  render: ({
    id = string("1"),
  }, api, classes) => (
    <div>
      <button {...api.create()}>Add Item</button>   {/* Auto-generated HTMX */}
      <button {...api.remove(id)}>Delete</button>   {/* Auto-generated HTMX */}
    </div>
  ),
});
```

**API Helper Functions:**
- `post(path, handler)` → `api.create()` or custom key
- `get(path, handler)` → `api.get(id)` or custom key
- `patch(path, handler)` → `api.update(id)` or custom key
- `del(path, handler)` → `api.remove(id)` or custom key

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
// Class manipulation
toggleClass("active");                    // Toggle single class
toggleClasses(["open", "visible"]);      // Toggle multiple classes  
conditionalClass(isOpen, "open", "closed"); // Conditional CSS classes

// Template utilities
spreadAttrs({ "hx-get": "/api/data" });     // Spread HTMX attributes
dataAttrs({ userId: 123, role: "admin" }); // Generate data-* attributes

// Smart type helpers (for function-style props)
string(defaultValue?)   // "hello" → "hello", undefined → defaultValue
number(defaultValue?)   // "42" → 42, "invalid" → throws, undefined → defaultValue  
boolean(defaultValue?)  // presence-based: attribute exists = true
array(defaultValue?)    // '["a","b"]' → ["a","b"], undefined → defaultValue
object(defaultValue?)   // '{"x":1}' → {x:1}, undefined → defaultValue
```

**Example-only helpers** (in `examples/dom-actions.ts`):
- `updateParentCounter()` - Counter increment/decrement
- `resetCounter()` - Reset counter to initial value
- `toggleParentClass()` - Toggle class on parent element
- `syncCheckboxToClass()` - Checkbox state → CSS class
- `activateTab()` - Tab activation

### Modern Component Examples

**Function-Style Props + CSS-Only Format:**

```tsx
import { boolean, defineComponent, h, number, string } from "../src/index.ts";
import { resetCounter, updateParentCounter } from "../examples/dom-actions.ts";

defineComponent("smart-counter", {
  styles: {
    // ✨ CSS-only format - class names auto-generated!
    container: `{ display: inline-flex; gap: 0.5rem; padding: 1rem; border: 2px solid #007bff; border-radius: 6px; }`,
    button: `{ padding: 0.5rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }`,
    display: `{ font-size: 1.5rem; min-width: 3rem; text-align: center; font-weight: bold; color: #007bff; }`,
  },
  render: ({
    // ✨ Function-style props - zero duplication!
    initialCount = number(0),
    step = number(1),
  }, api, classes) => (
    <div class={classes!.container} data-count={initialCount}>
      <button
        class={classes!.button}
        onclick={updateParentCounter(
          `.${classes!.container}`,
          `.${classes!.display}`,
          -step,
        )}
      >
        -{step}
      </button>
      <span class={classes!.display}>{initialCount}</span>
      <button
        class={classes!.button}
        onclick={updateParentCounter(
          `.${classes!.container}`,
          `.${classes!.display}`,
          step,
        )}
      >
        +{step}
      </button>
    </div>
  ),
});

// Usage: <smart-counter initial-count="10" step="5"></smart-counter>
```

### Best Practices

**Modern Approach (Recommended):**

1. ✅ Use **function-style props** for zero duplication
2. ✅ Use **CSS-only format** for auto-generated class names
3. ✅ Use **smart type helpers** (`string()`, `number()`, `boolean()`)
4. ✅ Keep state in DOM (classes, attributes, content)
5. ✅ Use **Unified API System** for HTMX integration

**Component State in DOM:**

```tsx
// State stored in DOM attributes and classes
<div class="counter active" data-count="5" data-max="100">
  <span class="display">5</span>     {/* Display value in content */}
</div>

// CSS classes represent UI state
.counter.active { border-color: #007bff; }
.counter.disabled { opacity: 0.5; pointer-events: none; }
```

**Evolution Summary:** funcwc has evolved through three major ergonomic improvements:

1. **🔧 defineComponent API**: Clean object-based configuration
2. **🎨 CSS-Only Format**: Auto-generated class names from CSS properties
3. **✨ Function-Style Props**: Zero duplication between props and render parameters

The result is **the most ergonomic component library ever built** - minimal syntax, maximum power, zero runtime overhead.
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Repository Overview

**ui-lib** is an ultra-lightweight, type-safe SSR component library with
DOM-native state management and hybrid reactivity. Built with Deno and
TypeScript using functional programming patterns for zero runtime overhead.

**Core Philosophy**: State belongs in the DOM (classes, data-* attributes, CSS
variables), not JavaScript memory. Components are pure server-side JSX
functions. Progressive enhancement over hydration.

## Architecture & Core Concepts

### Component System

- Components defined via `defineComponent()` with typed configuration
- Function-style props using helpers: `string()`, `number()`, `boolean()`,
  `array()`, `object()`, `oneOf()`
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

1. **CSS Property Reactivity** - Instant visual updates via CSS custom
   properties (no JS)
2. **Pub/Sub State Manager** - Cross-component communication via lightweight
   message bus
3. **DOM Event Communication** - Component-to-component messaging via custom
   events

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
deno task coverage           # Run tests with coverage report (excludes jsx-runtime/define-component)
deno task fmt                # Format code
deno task fmt:check          # Check formatting without changes
deno task lint               # Lint code

# Server & examples
deno task serve              # Start TODO app (server-custom.tsx) on localhost:8080
deno task serve:todo         # Same as serve (explicit)
deno task serve:shopping     # Start shopping cart example
deno task dev:todo           # Development mode with watch (TODO app)
deno task dev:shopping       # Development mode with watch (shopping cart)
deno task start              # Type check, then start TODO server
deno task bundle:state       # Bundle state manager for browser (dist/ui-lib-state.js)

# Quality checks & tools
deno run --allow-read scripts/audit_css.ts    # Audit CSS usage across components
deno bench bench/ssr.bench.ts                 # Run SSR performance benchmarks
deno run --allow-run --allow-read --allow-env scripts/release.ts  # Release preparation
deno task ci:examples-guard  # Ensure examples use JSX patterns correctly
```

**Note**: The `--unstable-kv` flag is required for examples using Deno KV
storage.

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
│       └── README.md         # Example documentation
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
import { boolean, defineComponent, h, number, string } from "./mod.ts";

defineComponent("my-component", {
  styles: {
    padding: "1rem",
    backgroundColor: "white",
  },
  render: (props: { title: string; count: number; active: boolean }) => (
    <div class="my-component">
      <h2>{props.title}</h2>
      <span>Count: {props.count}</span>
      {props.active && <span>Active!</span>}
    </div>
  ),
});
```

### Component with Prop Helpers

```tsx
defineComponent("counter", {
  props: (attrs) => ({
    count: parseInt(attrs.count || "0"),
    step: parseInt(attrs.step || "1"),
    active: "active" in attrs,
  }),
  render: (props) => (
    <div class={props.active ? "active" : ""}>
      Count: {props.count}
    </div>
  ),
});
```

### Component with Reactivity

```tsx
defineComponent("reactive-component", {
  reactive: {
    css: { "--theme": "data-theme" }, // CSS property binding
    state: { "cart-count": "data-count" }, // Pub/sub state
    on: { "user:login": "handleLogin" }, // Event listeners
  },
  render: () => <div>...</div>,
});
```

### Component with API Integration (Composition-Only Pattern)

```tsx
import { defineComponent, del, post } from "./mod.ts";

defineComponent("todo-item", {
  api: {
    toggle: post("/api/todos/:id/toggle", todoAPI.toggleTodo),
    deleteTodo: del("/api/todos/:id", todoAPI.deleteTodo),
  },
  render: ({ todo }, api) => (
    <item
      id={`todo-${todo.id}`}
      completed={todo.completed}
      priority={todo.priority}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        {...api!.toggle(todo.id)}
      />
      <span>{todo.text}</span>
      <button type="button" {...api!.deleteTodo(todo.id)}>
        Delete
      </button>
    </item>
  ),
});
```

**Key Points:**
- ✅ **Zero custom CSS** - Library's `<item>` component provides all styling
- ✅ **Ergonomic spread syntax** - Use `{...api!.action(id)}` directly in JSX
- ✅ **Children support** - Library components accept custom children
- ✅ **Pre-styled components** - Item, Card, Stack, Badge, Button from ui-lib

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
import { Alert, Button, Card } from "./lib/components/index.ts";
```

### Composing Styles

```tsx
import { composeStyles, css } from "./lib/css-in-ts.ts";

const baseStyles = css({ padding: "1rem" });
const themeStyles = css({ backgroundColor: "white" });
const combined = composeStyles(baseStyles, themeStyles);
```

### Setting Up Routes

```tsx
import { createRouter, Router } from "./lib/router.ts";

// Class-based API (backward compatible)
const router = new Router();
router.get("/api/users", getUsersHandler);
router.post("/api/users", createUserHandler);

// Functional API (recommended)
const functionalRouter = createRouter();
functionalRouter.register("GET", "/api/users", getUsersHandler);
functionalRouter.register("POST", "/api/users", createUserHandler);
```

### Response Helpers

```tsx
import { error, html, json, text } from "./lib/response.ts";

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

## Entry Points

ui-lib provides two entry points for different use cases:

| Entry Point     | Use Case                                   | Key Features                                                     |
| --------------- | ------------------------------------------ | ---------------------------------------------------------------- |
| `mod.ts`        | **Recommended**: Composition-only pattern  | Pre-styled components, no custom CSS, enforced UI consistency    |
| `mod-simple.ts` | Direct JSX functions with minimal ceremony | JSX runtime, lightweight state helpers, curated component subset |

**Choosing the right entry point**:

- **mod.ts** (recommended): For applications using composition-only pattern.
  Apps compose pre-styled library components; no custom styles allowed.
- **mod-simple.ts**: For rapid prototyping or minimal applications.

Both entry points share the same core: index.ts exports the base functionality.

## Component API

Components are defined using a minimal configuration:

```typescript
defineComponent("my-component", {
  reactive?: ReactiveConfig,
  styles?: StylesInput,
  api?: ApiMap,
  render: (attrs: Record<string, string>, api?, classes?) => string
});
```

**Key features:**

- Props parsing handled explicitly in render functions using `parseProps()`
- External router registration via `registerComponentApi()`
- Unified styles support with auto-generated class names
- Simplified configuration surface (4 options)

**Example with prop parsing:**

```typescript
defineComponent("user-card", {
  render: (attrs: Record<string, string>) => {
    const props = parseProps(attrs, (a) => ({
      name: a.name || "Anonymous",
      age: parseInt(a.age || "0"),
      active: "active" in a,
    }));

    return `<div class="${
      props.active ? "active" : ""
    }">${props.name} (${props.age})</div>`;
  },
});
```

## Important Notes

- **State management philosophy**: State belongs in the DOM, not JavaScript
  memory
- **Progressive enhancement over hydration**: No client-side hydration needed
- **Server-first design**: Not client-first with SSR bolted on
- **Composition-only pattern**: Applications compose pre-styled library components,
  no custom CSS allowed in app code
- **Ergonomic API spread**: Use `{...api!.action(id)}` directly in JSX, not helper functions
- **Library components accept children**: Wrap native elements with library components
  for styling
- **All user input must be escaped**: XSS protection via lib/escape.ts
- **Components should be pure functions**: No side effects in render
- **The main public API is exported from `index.ts`**: All mod files import from
  here
- **HTMX MUST BE COMPLETELY HIDDEN - FUNDAMENTAL FEATURE**: This is a CRITICAL,
  NON-NEGOTIABLE requirement. Applications MUST NEVER expose raw `hx-*` attributes
  in component code. ALL HTMX interactions MUST use API helpers (`get`, `post`,
  `del`, etc.) with spread operator pattern: `{...api!.methodName()}`. Any visible
  `hx-*` attributes in application JSX is a CRITICAL BUG that violates ui-lib's
  core design principle. No exceptions.
- **JSX-only in application code**: Use `render(<Component />)` for HTML, not
  `renderComponent`
- **Light FP principles**: See AGENTS.md for detailed coding standards (Result
  types, ports pattern, no classes)

## Light Functional Programming Guidelines

This codebase follows Light FP principles (see AGENTS.md for complete guide):

### Core Patterns

1. **Types over interfaces** for data; interfaces ONLY for ports (capabilities)
2. **Result<T,E> for errors** - no throwing in core logic
3. **Ports pattern** - dependency injection via function parameters
4. **Immutability** - `readonly` in public APIs, local mutation OK inside
   functions
5. **Pure core, effects at edges** - keep I/O at application boundaries

### Quick Reference

```typescript
// ✅ Data as types with readonly
export type User = {
  readonly id: string;
  readonly name: string;
};

// ✅ Capabilities as interfaces
export interface UserRepository {
  readonly save: (user: User) => Promise<Result<User, DbError>>;
}

// ✅ Error handling with Result
export const createUser =
  (repo: UserRepository) =>
  async (data: CreateUserData): Promise<Result<User, CreateUserError>> => {
    // Pure validation
    const validation = validateUser(data);
    if (!validation.ok) return validation;

    // Effect at boundary
    return await repo.save(validation.value);
  };
```

## Examples

### TODO App (`examples/todo-app/`)

Two architectural approaches:

- **server-custom.tsx** (default): Custom components demonstrating best
  practices
- **server-library.tsx**: Using pre-built library components (94% code
  reduction)

Both share the same API layer with functional error handling and Result types.

### Shopping Cart (`examples/shopping-cart/`)

Demonstrates e-commerce patterns with cart state management.

## Common Development Workflows

### Creating a New Component

1. **Library Component** (in `lib/components/`):
   ```typescript
   // lib/components/my-component/MyComponent.tsx
   import { css, defineComponent } from "../../internal.ts";

   defineComponent("my-component", {
     styles: css({
       padding: "1rem",
       backgroundColor: "var(--surface-bg)",
     }),
     render: ({ variant = "default" }) => (
       <div class={`my-component--${variant}`}>...</div>
     ),
   });
   ```

2. **Application Component** (composition-only):
   ```typescript
   // Compose library components only
   import { defineComponent, h } from "ui-lib/mod.ts";
   import { Button, Card } from "ui-lib/components";

   defineComponent("user-card", {
     render: ({ name, role }) => (
       <card variant="elevated">
         <h2>{name}</h2>
         <button variant="primary">Edit</button>
       </card>
     ),
   });
   ```

### Adding API Endpoints to Components

```typescript
defineComponent("todo-item", {
  api: {
    toggle: post("/api/todos/:id/toggle", todoAPI.toggleTodo),
    deleteTodo: del("/api/todos/:id", todoAPI.deleteTodo),
  },
  render: ({ todo }, api) => (
    <item
      id={`todo-${todo.id}`}
      completed={todo.completed}
      priority={todo.priority}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        {...api!.toggle(todo.id)}
      />
      <span>{todo.text}</span>
      <button type="button" {...api!.deleteTodo(todo.id)}>
        Delete
      </button>
    </item>
  ),
});
```

Register API routes: `registerComponentApi(router, componentName)`

### Running Tests

```bash
# All tests
deno task test

# Specific file
deno test lib/jsx-runtime.test.ts

# Filter by name
deno test --filter "should render"

# Watch mode
deno test --watch

# With coverage
deno task coverage
```

### Debugging SSR Issues

1. **Component not rendering**: Check component is registered before use
2. **Props not parsing**: Use prop helpers (`string()`, `number()`, `boolean()`)
3. **Styles not applying**: Verify CSS-in-TS syntax and class name generation
4. **XSS concerns**: User input is auto-escaped; use `dangerouslySetInnerHTML`
   only when needed

### Performance Monitoring

```bash
# Benchmark SSR performance
deno bench bench/ssr.bench.ts

# Target: ~0.5ms per component render
```

## Troubleshooting

### Common Issues

| Issue                      | Solution                                                         |
| -------------------------- | ---------------------------------------------------------------- |
| `Component not found: xyz` | Register component with `defineComponent` before rendering       |
| Props not typed correctly  | Wrap attributes with `parseProps()` or use prop helpers          |
| HTMX not working           | Ensure `onAction` helper is used, not raw `hx-*` attributes      |
| Styles not scoped          | Use CSS-in-TS system; check class name generation                |
| Type errors in JSX         | Verify JSX pragma in tsconfig: `jsx: "react"`, `jsxFactory: "h"` |
| Deno KV errors             | Add `--unstable-kv` flag when running server                     |

### Getting Help

- **Documentation**: See `docs/` folder for architecture, component API,
  examples
- **Examples**: Study `examples/todo-app/` for complete patterns
- **AGENTS.md**: Detailed Light FP coding guidelines

## File Organization & Naming Conventions

### File Extensions

- `.ts` - TypeScript source files (utilities, types, non-component logic)
- `.tsx` - TSX files with JSX (components, server files)
- `.test.ts` or `.test.tsx` - Unit tests
- `.integration.test.ts` - Integration tests

### Key Files

- `index.ts` - Main public API; imported by all mod files
- `mod.ts` - Composition-only entry point (recommended for apps)
- `mod-simple.ts` - Simple/lightweight entry point
- `lib/internal.ts` - Full API for library component development
- `lib/jsx-runtime.ts` - JSX/TSX runtime with `h()` function

### Module Organization

```
lib/
├── core/                    # Core systems
│   ├── jsx-runtime.ts       # JSX rendering
│   ├── define-component.ts  # Component definition
│   ├── registry.ts          # Component registry
│   └── ssr.ts              # SSR utilities
├── styling/
│   ├── css-in-ts.ts        # CSS-in-TS system
│   ├── modern-css.ts       # Modern CSS features
│   └── styles-parser.ts    # Style parsing
├── state/
│   ├── state-manager.ts    # Pub/sub state
│   ├── reactive-helpers.ts # Reactivity utilities
│   └── component-state.ts  # Component state
└── components/             # Built-in components
    ├── button/            # Each component in own folder
    ├── input/
    └── index.ts           # Component exports
```

### Important Conventions

1. **Test files**: Co-located with implementation (e.g., `css-in-ts.ts` +
   `css-in-ts.test.ts`)
2. **Component names**: kebab-case (e.g., `todo-item`, `user-card`)
3. **File names**: kebab-case (e.g., `define-component.ts`, `jsx-runtime.ts`)
4. **Export patterns**: Named exports preferred over default exports
5. **Imports**: Use explicit type imports:
   `import type { User } from "./types.ts"`

## Critical Implementation Details

### JSX Configuration

The codebase uses custom JSX runtime:

```json
{
  "jsx": "react",
  "jsxFactory": "h",
  "jsxFragmentFactory": "Fragment"
}
```

**Important**: JSX elements call `h()` from `lib/jsx-runtime.ts`, not React.

### Component Registration Flow

1. `defineComponent()` creates component configuration
2. Component registered in global registry
3. `render()` or `renderComponent()` looks up component and executes
4. SSR processor can handle custom tags in HTML strings

### Props vs Attributes

- **Attributes**: Raw string key-value pairs from HTML/JSX
- **Props**: Parsed, typed values using `parseProps()` or prop helpers
- Always parse attributes in your render function

### HTMX Integration

- HTMX attributes generated by `onAction`, `itemAction` helpers
- Never write `hx-*` attributes directly in application code
- API bindings connect handlers automatically

### Result Type Pattern

```typescript
import type { Result } from "./lib/result.ts";
import { err, ok } from "./lib/result.ts";

// Every fallible operation returns Result<T, E>
const result: Result<User, ValidationError> = validateUser(data);
if (!result.ok) {
  return err(result.error); // Explicit error handling
}
// result.value is User here
```

### Don't Confuse the Entry Points

- `mod.ts` - Apps can ONLY compose library components (no custom styles)
- `lib/internal.ts` - Library developers have full CSS-in-TS access
- Application code should never import from `lib/internal.ts`

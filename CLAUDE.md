# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

**funcwc** is a revolutionary, ultra-lightweight library for building
**SSR-first components** with TypeScript/Deno. It features **function-style
props** (zero duplication), **CSS-only format** (auto-generated class names),
the **Unified API System** (HTMX attributes auto-generated from server routes),
and the **Hybrid Reactivity System** (three-tier client-side component
communication). Components render to HTML strings using a custom JSX runtime,
with the DOM as the single source of truth for state management.

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

# Run development server with TypeScript MIME type handling (from examples/ directory)
cd examples && deno run --allow-net --allow-read --allow-env server.ts

# Single test file
deno test src/lib/specific-file.test.ts

# Test with watch mode
deno test --watch

# Generate docs for API reference
deno doc src/index.ts --html --name="funcwc" --output=./docs/
```

## Core Architecture

### Library Structure

The codebase follows a functional, modular architecture built around
SSR-compatible web components:

1. **defineComponent API** (`src/lib/define-component.ts`) - Clean, object-based
   configuration for component creation (now includes optional reactive wiring)
2. **Component Registry** (`src/lib/registry.ts`) - Global registry for SSR
   component definitions
3. **JSX Runtime** (`src/lib/jsx-runtime.ts`) - Custom JSX runtime that renders
   directly to HTML strings
4. **SSR Engine** (`src/lib/component-state.ts`) - Server-side rendering system
   with `renderComponent()` function
5. **Unified API System** (`src/lib/api-generator.ts`) - Auto-generates HTMX
   client functions from server route definitions

### Key Architecture Patterns

**Functional Programming Principles:**

- No classes in business logic (except for internal DOM element wrapper)
- Immutable state with `Readonly<T>` everywhere
- Pure functions for state updates and rendering
- Result types for error handling (`Result<T,E>`)
- DOM as the single source of truth for component state

**Component Definition Approaches:**

1. **defineComponent API (Recommended)** - Modern approach with **function-style
   props** and **CSS-only format**:

```tsx
import { defineComponent, h, number, string } from "../src/index.ts";

defineComponent("my-counter", {
  styles: {
    // ✨ CSS-only format - class names auto-generated!
    button:
      `{ padding: 0.5rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }`,
    display: `{ font-size: 1.5rem; font-weight: bold; margin: 0 0.5rem; }`,
  },
  render: (
    {
      // ✨ Function-style props - no duplication!
      step = number(1),
      initialCount = number(0),
    },
    api,
    classes,
  ) => (
    <div>
      <button class={classes!.button}>-{step}</button>
      <span class={classes!.display}>{initialCount}</span>
      <button class={classes!.button}>+{step}</button>
    </div>
  ),
});
```

<!-- Traditional props system removed to keep guidance focused on function-style props. -->

### File Organization

```
src/
├── index.ts                    # Main exports - all public API
├── lib/
│   ├── define-component.ts     # Primary defineComponent API with function-style props + reactive options
│   ├── component-state.ts      # SSR rendering engine with renderComponent()
│   ├── jsx-runtime.ts          # Custom JSX runtime with direct string rendering (no React)
│   ├── api-generator.ts        # Unified API system (auto-generates HTMX from routes)
│   ├── api-helpers.ts          # HTTP method helpers (post, get, patch, del, create, remove)
│   ├── prop-helpers.ts         # Smart type helpers (string, number, boolean, array, object)
│   ├── styles-parser.ts        # CSS-only format parser and class name generation
│   ├── reactive-helpers.ts     # Hybrid Reactivity System (3-tier: CSS, Pub/Sub, DOM Events)
│   ├── state-manager.ts        # Pub/Sub state manager infrastructure
│   ├── dom-helpers.ts          # DOM manipulation utilities (toggleClass, conditionalClass, etc.)
│   ├── router.ts               # HTTP router for API endpoints
│   ├── registry.ts             # Global component registry for SSR
│   ├── ssr.ts                  # Server-side rendering utilities
│   ├── result.ts               # Functional error handling (Result<T,E>)
│   └── types.ts                # Core TypeScript types and utilities
examples/
├── main.ts                     # Entry point that imports all example components
├── server.ts                   # Development server with SSR, API routing, and state manager injection
├── index.html                  # Demo page displaying all components
├── example.tsx                 # Primary showcase (function-style props, CSS-only format, Unified API)
├── fundamentals/               # Basic component patterns
├── interactive/                # DOM manipulation and API integration examples
├── advanced/                   # Reactive system and state management examples
└── apps/                       # Complete application examples (todo app, dashboard)
```

## TypeScript Configuration

### Compiler Settings (deno.json)

- **Strict Mode**: Full TypeScript strictness enabled (`"strict": true`)
- **Libraries**: ES2021, DOM, and Deno runtime APIs
  (`"lib": ["ES2021", "DOM", "deno.ns"]`)
- **JSX**: Uses custom JSX runtime with `h` function (`"jsx": "react"`,
  `"jsxFactory": "h"`)
- **Import Maps**: JSX runtime mapped to `"jsx": "./src/lib/jsx-runtime.ts"`
- **No Build Required**: Deno handles TypeScript transpilation automatically

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
import {
  array,
  boolean,
  defineComponent,
  h,
  number,
  object,
  string,
} from "../src/index.ts";

defineComponent("modern-card", {
  render: (
    {
      // ✨ Props auto-generated from function signature - no duplication!
      title = string("Card Title"), // Required string with default
      count = number(0), // Required number with default
      enabled = boolean(true), // Required boolean with default
      items = array([]), // Required array with default
      config = object({ theme: "light" }), // Required object with default
    },
    api,
    classes,
  ) => (
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

<!-- Removed historical props system section to keep focus on the unified, modern API. -->

### Unified API System

Define server endpoints once - HTMX attributes generated automatically:

```tsx
import {
  defineComponent,
  del,
  h,
  post,
  renderComponent,
  string,
} from "../src/index.ts";

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
  render: (
    {
      id = string("1"),
    },
    api,
    classes,
  ) => (
    <div>
      <button {...api.create()}>Add Item</button> {/* Auto-generated HTMX */}
      <button {...api.remove(id)}>Delete</button> {/* Auto-generated HTMX */}
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

Uses Deno's built-in testing framework with comprehensive test coverage:

```bash
deno test                         # Run all tests
deno test --watch                 # Run tests in watch mode
deno test --coverage=coverage     # Generate coverage report
deno coverage coverage --lcov     # Generate LCOV coverage report
deno test src/lib/result.test.ts  # Run specific test file
```

**Test Structure:**

- Unit tests for all core utilities (`result.ts`, `props.ts`, `dom-helpers.ts`)
- Integration tests for component rendering (`jsx-runtime.test.ts`,
  `define-component.test.ts`)
- Server-side rendering tests (`component-state.test.ts`, `ssr.test.ts`)
- API generation tests (`api-generator.test.ts`)
- Router functionality tests (`router.test.ts`)

## Error Handling Philosophy

The library follows functional error handling patterns:

- Use `Result<T,E>` types from `src/lib/result.ts`
- Core utilities: `ok()`, `err()`, `map()`, `flatMap()`, `mapError()`
- Avoid throwing exceptions in business logic
- Handle errors as values throughout the flow

## Architecture Deep Dive

### SSR-First Architecture

- **Custom JSX Runtime**: Direct string rendering without React or virtual DOM
- **Component Registry**: Global registry (`src/lib/registry.ts`) stores
  component definitions for SSR
- **Template Replacement**: Server parses HTML and replaces custom tags with
  rendered components
- **Zero Client Dependencies**: No JavaScript framework required on the client
- **HTMX Integration**: Server actions generate HTMX attributes for dynamic
  updates

### Functional Programming Patterns

- **No Classes**: Entire library built with functions and types only
- **Immutable Data**: All public APIs use `Readonly<T>` and pure functions
- **Result Types**: Error handling via `Result<T,E>` pattern instead of
  exceptions
- **DOM as State**: No JavaScript state objects - DOM elements hold all state
- **Type Safety**: Full TypeScript inference throughout the system

### Component Lifecycle

1. **Registration**: `defineComponent()` registers component in global registry
2. **Route Registration**: API handlers automatically register with router
3. **SSR Rendering**: `renderComponent()` renders to HTML strings server-side
4. **State Injection**: State manager script injected into HTML for client-side
   reactivity
5. **HTMX Attributes**: Generated client functions create HTMX attributes for
   server communication

### Development Server Architecture

The development server (`examples/server.ts`) provides:

- **Component SSR**: Renders custom HTML tags to component HTML
- **API Routing**: Routes API calls to component handlers
- **Static Files**: Serves TypeScript modules with correct MIME types
- **State Manager**: Auto-injects pub/sub state manager for reactive features
- **CSRF Protection**: Generates and validates CSRF tokens per request

## Development Workflow

1. **Component Creation**: Use `defineComponent` API for new components in
   `.tsx` files with `/** @jsx h */` pragma
2. **Type Safety**: Let TypeScript infer types from component configuration
3. **Zero Configuration**: Deno automatically handles TypeScript transpilation
   and custom JSX runtime
4. **Testing**: Access components at `http://localhost:8080` after
   `deno task start`
5. **Event Handling**: Use DOM helpers or inline strings for direct DOM
   manipulation
6. **Styling**: Include styles in `styles` property for scoped CSS

### SSR Integration

- Components render to HTML strings via custom JSX runtime
- JSX pragma `/** @jsx h */` enables zero-config JSX processing
- Custom `h` function converts JSX elements directly to HTML strings
- Server-side template replacement converts `<component-name>` tags to rendered
  HTML
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
    container:
      `{ display: inline-flex; gap: 0.5rem; padding: 1rem; border: 2px solid #007bff; border-radius: 6px; }`,
    button:
      `{ padding: 0.5rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }`,
    display:
      `{ font-size: 1.5rem; min-width: 3rem; text-align: center; font-weight: bold; color: #007bff; }`,
  },
  render: (
    {
      // ✨ Function-style props - zero duplication!
      initialCount = number(0),
      step = number(1),
    },
    api,
    classes,
  ) => (
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

**Evolution Summary:** funcwc has evolved through three major ergonomic
improvements:

1. **🔧 defineComponent API**: Clean object-based configuration
2. **🎨 CSS-Only Format**: Auto-generated class names from CSS properties
3. **✨ Function-Style Props**: Zero duplication between props and render
   parameters

The result is **the most ergonomic component library ever built** - minimal
syntax, maximum power, zero runtime overhead.

## Hybrid Reactivity System

funcwc features a revolutionary **three-tier hybrid reactivity system** that
enables component communication while maintaining the DOM-native philosophy.
Each tier is optimized for different use cases:

### Tier 1: CSS Property Reactivity (Visual State)

**Use Case**: Theme switching, visual coordination, styling state\
**Mechanism**: CSS custom properties as reactive state\
**Performance**: Instant updates via CSS engine, zero JavaScript overhead

```tsx
// Theme controller updates CSS properties
defineComponent("theme-toggle", {
  render: () => (
    <button hx-on={`click: ${setCSSProperty("theme", "dark")}`}>
      Switch to Dark Theme
    </button>
  ),
});

// Components automatically react via CSS
defineComponent("themed-card", {
  styles: {
    card: `{
      background: var(--theme-bg, white);
      color: var(--theme-text, #333);
      transition: all 0.3s ease;
    }`,
  },
});
```

### Tier 2: Pub/Sub State Manager (Business Logic State)

**Use Case**: Shopping carts, user data, complex application state\
**Mechanism**: JavaScript state manager with topic-based subscriptions\
**Performance**: Efficient subscription model with automatic cleanup

```tsx
// Publisher component
defineComponent("cart-manager", {
  render: ({ items }) => (
    <div
      hx-on={`htmx:load: ${
        publishState("cart", {
          count: items.length,
          total: calculateTotal(items),
        })
      }`}
    >
      {/* cart content */}
    </div>
  ),
});

// Subscriber component
defineComponent("cart-badge", {
  stateSubscriptions: {
    cart: `
      this.querySelector('.count').textContent = data.count;
      this.classList.toggle('has-items', data.count > 0);
    `,
  },
  render: () => (
    <div class="badge">
      Cart: <span class="count">0</span>
    </div>
  ),
});
```

### Tier 3: DOM Events (Component Communication)

**Use Case**: Modal systems, notifications, component-to-component messaging\
**Mechanism**: Custom DOM events with structured payloads\
**Performance**: Native browser event system with event bubbling

```tsx
// Event dispatcher
defineComponent("modal-trigger", {
  render: ({ modalId, title, content }) => (
    <button
      hx-on={`click: ${
        dispatchEvent("open-modal", { modalId, title, content })
      }`}
    >
      Open Modal
    </button>
  ),
});

// Event listener
defineComponent("modal", {
  eventListeners: {
    "open-modal": `
      if (event.detail.modalId === this.dataset.modalId) {
        this.style.display = 'flex';
        this.querySelector('.title').textContent = event.detail.title;
      }
    `,
  },
  render: ({ id }) => (
    <div class="modal" data-modal-id={id}>
      <h3 class="title">Modal Title</h3>
    </div>
  ),
});
```

### Reactive Helper Functions

The reactivity system includes comprehensive helper functions:

**CSS Property Helpers:**

- `setCSSProperty(property, value, scope?)` - Set CSS custom property
- `getCSSProperty(property, scope?)` - Get CSS custom property value
- `toggleCSSProperty(property, value1, value2, scope?)` - Toggle between values
- `createThemeToggle(lightTheme, darkTheme)` - Pre-built theme switching

**State Manager Helpers:**

- `publishState(topic, data)` - Publish state to subscribers
- `subscribeToState(topic, handler)` - Subscribe to state updates
- `getState(topic)` - Get current state for topic
- `createCartAction(action, itemData)` - Pre-built cart operations

**DOM Event Helpers:**

- `dispatchEvent(eventName, data?, target?)` - Dispatch custom events
- `listensFor(eventName, handler)` - Generate event listener attributes
- `createNotification(message, type, duration?)` - Pre-built notifications

### Enhanced Component Definition

Use `defineComponent()` with reactive options for automatic reactive features:

```tsx
defineComponent("smart-component", {
  // CSS reactions to property changes
  cssReactions: {
    "theme-mode": "border-color: var(--theme-border);",
  },

  // Automatic state subscriptions
  stateSubscriptions: {
    "user": "this.querySelector('.username').textContent = data.name;",
  },

  // Automatic event listeners
  eventListeners: {
    "user-login": "this.classList.add('logged-in');",
  },

  // Lifecycle hooks
  onMount: "console.log('Component mounted');",
  onUnmount: "console.log('Component unmounted');",

  render: (props) => <div>Smart reactive component</div>,
});
```

### Host Page Setup

Include the state manager and CSS variables in your HTML:

```html
<head>
  <script src="https://unpkg.com/htmx.org@2.0.6"></script>
  <script src="https://unpkg.com/htmx.org/dist/ext/json-enc.js"></script>

  <!-- CSS theme variables -->
  <style>
    :root {
      --theme-mode: light;
      --theme-bg: white;
      --theme-text: #333;
    }
  </style>
</head>

<body hx-ext="json-enc" hx-encoding="json">
  <!-- State manager script -->
  <script>
    window.funcwcState = {/* state manager implementation */};
  </script>

  <!-- Your components -->
</body>
```

### Reactivity Decision Matrix

Choose the right reactivity approach for your use case:

| Feature               | CSS Properties | Pub/Sub State     | DOM Events      |
| --------------------- | -------------- | ----------------- | --------------- |
| **Best For**          | Visual changes | Complex state     | UI interactions |
| **Performance**       | Excellent      | Good              | Good            |
| **State Persistence** | Automatic      | Persistent        | Ephemeral       |
| **Setup Complexity**  | Zero           | Minimal           | Zero            |
| **Rich Data Types**   | Strings only   | Full support      | Full support    |
| **New Components**    | Auto-inherit   | Get current state | Miss events     |

### Examples and Patterns

Comprehensive examples are available in the `examples/` directory:

- `theme-system.tsx` - CSS property reactivity examples
- `cart-system.tsx` - Pub/sub state manager examples
- `modal-system.tsx` - DOM event communication examples
- `reactive-dashboard.tsx` - All three systems working together
- `reactive-index.html` - Complete demo page with full setup

### Performance Benefits

The hybrid reactivity system delivers exceptional performance:

- **CSS Properties**: Zero JavaScript execution for visual updates
- **State Manager**: Efficient subscription cleanup prevents memory leaks
- **DOM Events**: Leverages native browser event optimization
- **Bundle Size**: Minimal overhead (~2KB total for all reactive features)

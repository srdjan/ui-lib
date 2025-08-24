# Functional Web Components (DOM-Native)

A lightweight, server-side rendering (SSR) library for building web components with a DOM-native approach. This library is designed for Deno and TypeScript, emphasizing performance, simplicity, and a functional style.

The core philosophy is **"the DOM is the state."** Instead of maintaining state in JavaScript objects, component state is stored directly in DOM attributes, CSS classes, and element content. This makes components highly performant, easy to understand, and naturally compatible with server-driven updates from libraries like HTMX.

## Features

- 💡 **DOM-Native State**: No client-side state objects. Just pure DOM manipulation.
- 🚀 **SSR-First**: Components are rendered on the server, sending only HTML to the client.
- 🪶 **Zero Client-Side Dependencies**: Interactivity is achieved with tiny, inline vanilla JavaScript event handlers.
- 🤝 **HTMX-Friendly**: Easily define server interactions with a `serverActions` API that generates HTMX attributes.
- 🔧 **Functional & Declarative**: A simple pipeline API for defining components in a functional style.
- 🦕 **Deno Native**: Built for Deno, with tasks for testing, linting, and formatting.

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd funcwc

# Run the dev server and examples
deno task start
```

This will start a server at `http://localhost:8080` serving the examples from the `examples/` directory.

## How It Works

Components are defined with a simple pipeline API. The state is managed directly in the DOM, and interactivity is added using helper functions that generate inline JavaScript.

### Basic Example: A Theme Toggle

This component toggles a class on itself when clicked. The entire state is just the presence or absence of the `dark` class.

```typescript
import { component, html, toggleClasses } from './src/index.ts';

component("f-theme-toggle-dom")
  .view(() => html`
    <button 
      class="theme-btn light" 
      onclick="${toggleClasses(['light', 'dark'])}"
      title="Toggle theme"
    >
      <span class="light-icon">☀️</span>
      <span class="dark-icon">🌙</span>
    </button>
  `);
```

### Example with Props and DOM State

This counter component stores its value in a `data-count` attribute and in the text content of a `<span>`. The `updateParentCounter` helper generates the inline JavaScript to modify this state directly in the DOM.

```typescript
import { component, html, updateParentCounter } from './src/index.ts';

component("f-counter-dom")
  .props({ initialCount: "number?", step: "number?" })
  .view((props) => {
    const { initialCount = 0, step = 1 } = props;
    return html`
      <div class="counter" data-count="${count}">
        <button onclick="${updateParentCounter('.counter', '.count-display', -step)}">-</button>
        <span class="count-display">${count}</span>
        <button onclick="${updateParentCounter('.counter', '.count-display', step)}">+</button>
      </div>
    `;
  });
```

## Core APIs

### `component(name: string)`

Starts the definition of a new component.

### `.props({[key: string]: "string" | "number" | "boolean" | ...})`

Defines the properties (attributes) the component accepts. Supports optional types with `?` (e.g., `"string?"`).

### `.serverActions({[key: string]: Function})`

Defines functions that return objects representing HTMX attributes. This is the bridge to server-side interactions.

```typescript
.serverActions({
  delete: (id) => ({
    "hx-delete": `/api/todos/${id}`,
    "hx-target": "closest .todo",
    "hx-swap": "delete"
  })
})
```

### `.view((props, serverActions) => string)`

Defines the component's render function. It should return an HTML string. The `html` tagged template is provided for safe and easy HTML construction.

### DOM Helpers

The `src/lib/dom-helpers.ts` module provides a suite of functions that generate JavaScript code strings to be used in inline event handlers (`onclick`, `onchange`, etc.).

- `toggleClass(className)`
- `updateCounter(selector, delta)`
- `spreadAttrs(attrsObject)`
- `conditionalClass(condition, trueClass, falseClass)`
- ...and more.

## Development

Key tasks are defined in `deno.json`:

- `deno task start`: Type-checks and starts the dev server.
- `deno task test`: Runs the test suite.
- `deno task fmt`: Formats the code.
- `deno task lint`: Lints the code.
- `deno task coverage`: Generates a test coverage report.
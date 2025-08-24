# Functional Web Components (DOM-Native)

A lightweight, server-side rendering (SSR) library for building web components with a DOM-native approach. Built for Deno + TypeScript, focused on performance, simplicity, and a functional style.

The core philosophy is "the DOM is the state." Component state lives in DOM attributes, CSS classes, and element content. This keeps components fast, easy to reason about, and naturally compatible with server-driven updates (e.g., HTMX).

## Features

- DOM-native state: No client-side state objects to sync.
- SSR-first: Render on the server and send HTML only.
- Zero runtime deps for components: Custom JSX runtime, no client bundle.
- HTMX-friendly: Define `serverActions` that emit HTMX attributes.
- Functional API: Small, composable pipeline with `.props()`, `.view()`, `.styles()`.

## Quick Start

```bash
# Clone and enter
git clone <repository-url>
cd funcwc

# Run SSR dev server for examples (custom JSX runtime)
deno task serve

# Or run docs site (uses Deno JSX precompile, separate config)
deno task docs
```

- Examples SSR: http://localhost:8080
- Docs site: http://localhost:8000 (or `PORT=... deno task docs`)

## How It Works

- Components are authored in TSX and compiled via a custom JSX runtime (`h`).
- Inline event handlers accept arrays of action objects and are serialized to tiny JS strings.
- `serverActions` return HTMX attribute objects that you can spread directly in TSX.
- Styles are declared via `.styles(css)` and injected server-side.

### Basic Example: Theme Toggle (TSX)

```tsx
import { component, h, toggleClasses } from './src/index.ts';

component('f-theme-toggle-dom')
  .styles(`
    .theme-btn { padding: 0.5rem 1rem; border: 1px solid; border-radius: 6px; cursor: pointer; }
    .theme-btn.light { background: #fff; color: #333; border-color: #ccc; }
    .theme-btn.dark { background: #333; color: #fff; border-color: #666; }
    .theme-btn.dark .light-icon, .theme-btn.light .dark-icon { display: none; }
    .theme-btn.dark .dark-icon, .theme-btn.light .light-icon { display: inline; }
  `)
  .view(() => (
    <button
      class="theme-btn light"
      onclick={[toggleClasses(['light', 'dark'])]}
      title="Toggle theme"
    >
      <span class="light-icon">☀️ Light</span>
      <span class="dark-icon" style="display: none;">🌙 Dark</span>
    </button>
  ));
```

### Example with Props and DOM State (TSX)

```tsx
import { component, h, updateParentCounter, resetCounter } from './src/index.ts';

component('f-counter-dom')
  .props({ initialCount: 'number?', step: 'number?' })
  .styles(`
    .counter { display: inline-flex; gap: 0.5rem; align-items: center; padding: 1rem; border: 2px solid #007bff; border-radius: 8px; }
    .counter button { padding: 0.5rem; border: 1px solid #007bff; background: #007bff; color: white; border-radius: 4px; cursor: pointer; }
    .count-display { font-size: 1.5rem; min-width: 3rem; text-align: center; }
  `)
  .view((props) => {
    const count = (props as any).initialCount || 0;
    const step = (props as any).step || 1;
    return (
      <div class="counter" data-count={count}>
        <button onclick={[updateParentCounter('.counter', '.count-display', -step)]}>-{step}</button>
        <span class="count-display">{count}</span>
        <button onclick={[updateParentCounter('.counter', '.count-display', step)]}>+{step}</button>
        <button onclick={[resetCounter('.count-display', count, '.counter')]}>Reset</button>
      </div>
    );
  });
```

### Server Actions + HTMX (TSX)

```tsx
import { component, h, conditionalClass, syncCheckboxToClass } from './src/index.ts';

component('f-todo-item-dom')
  .props({ id: 'string', text: 'string', done: 'boolean?' })
  .serverActions({
    toggle: (id) => ({ 'hx-patch': `/api/todos/${id}/toggle` }),
    delete: (id) => ({ 'hx-delete': `/api/todos/${id}` }),
  })
  .view((props, serverActions) => {
    const id = (props as any).id;
    const text = (props as any).text;
    const isDone = Boolean((props as any).done);
    return (
      <div class={`todo ${conditionalClass(isDone, 'done')}`} data-id={id}>
        <input type="checkbox" checked={isDone} onchange={[syncCheckboxToClass('done')]} {...(serverActions?.toggle?.(id) || {})} />
        <span class="todo-text">{text}</span>
        <button class="delete-btn" {...(serverActions?.delete?.(id) || {})}>×</button>
      </div>
    );
  });
```

## Core APIs

### `component(name: string)`
Starts a new component definition.

### `.props(spec)`
Define attribute parsing with string hints: `'string' | 'number' | 'boolean'` and optional variants with `?`.

### `.serverActions(map)`
Define functions that return HTMX attribute objects. In TSX, spread them directly: `<button {...serverActions.remove(id)}>`.

### `.styles(css: string)`
Attach component-scoped CSS to render with the component on SSR.

### `.view((props, serverActions?, parts?) => string)`
Render function returning a string (via TSX + custom `h`). Event handlers accept `ComponentAction[]`.

## DOM Helpers (events return actions)

- `toggleClass(className)`
- `toggleClasses(classNames: string[])`
- `updateParentCounter(parentSel, displaySel, delta)`
- `resetCounter(displaySel, initialValue, containerSel?)`
- `activateTab(container, btnSel, contentSel, activeClass)`
- `toggleParentClass(className)`
- `syncCheckboxToClass(className)`
- `conditionalClass(condition, trueClass, falseClass?)`

## Development

- `deno task serve`: Runs the SSR examples/dev server (custom JSX runtime).
- `deno task docs`: Runs docs site with Deno JSX precompile (separate config).
- `deno task fmt` / `deno task lint`: Format and lint.

## Documentation

- Authoring guide: docs/AUTHORING.md
- Migration guide (from legacy .state()/.actions()): docs/MIGRATION.md
- Docs site (precompiled JSX): `deno task docs` → http://localhost:8000

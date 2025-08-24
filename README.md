# Functional Web Components

A lightweight, functional programming library for building web components with
TypeScript/Deno. Features an ultra-succinct Pipeline API with immutable state,
pure functions, and intelligent type inference.

## Features

- 🧩 **SSR-Only, No Browser Code**: Renders HTML on the server; ships markup
  only.
- 🧪 **String Templates**: Safe tagged templates with escaping and `raw()` when
  needed.
- 🔧 **Functional Style**: Pure computations and immutable patterns.
- ⚡ **TypeScript First**: Strict types with simple, predictable APIs.
- 📦 **Zero Dependencies**: Lightweight and self-contained.
- 🚀 **Deno Native**: Works with `deno.json` tasks and lockfile.

Note: The JSX-based Pipeline API described below is being redesigned. For the
first release, prefer the string template API for rendering.

## Quick Start

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd funcwc

# Run examples (serves on http://localhost:8080)
deno task start
```

### Basic Example (SSR string template)

```ts
import { html } from "./src/index.ts";

type State = { count: number };
type Props = { step?: number };

export function CounterView(state: State, props: Props): string {
  const step = props.step ?? 1;
  return html`
    <div class="counter">
      <button type="button" disabled>-</button>
      <span>${state.count}</span>
      <button type="button" disabled>+</button>
      <button type="button" disabled>Reset</button>
      <small style="margin-left:8px;color:#777;">Step: ${step}</small>
    </div>
  `;
}
```

The dev server injects the rendered HTML into `examples/index.html` and removes
client scripts, so the browser only receives static markup.

Commands: `deno task serve`, `deno task test`, `deno task fmt`,
`deno task lint`, `deno task coverage`.

## Next Release TODOs

- Hydration option: minimal client bootstrap for interactivity.
- More ergonomic templating (component helpers or a tiny DSL).
- Optional JSX/TSX layer reintroduced on the server only.
- Simple cache for SSR output to speed reloads.
- Streamed/async template support for data fetching.
- CI and coverage gates; more examples and docs.

## API Overview (SSR Templates)

Use the `html` tagged template from `src/index.ts` to build safe HTML strings.
Values are escaped by default; wrap trusted snippets with `raw()`.

```ts
import { html, raw } from "./src/index.ts";

const markup = html`
  <div class="card">
    <h3>${"Title"}</h3>
    ${raw("<p><b>Server-rendered</b> only.</p>")}
  </div>
`;
```

## Appendix: Legacy/Experimental (JSX Pipeline API)

The sections below document the older JSX-based Pipeline API. It is not used in
the current SSR-only release and will be redesigned. For details, see
`docs/PIPELINE_API.md`.

### `component(name: string)`

Creates a new component builder.

### `.state(initialState: Record<string, any>)`

Defines initial state with automatic type inference.

### `.props(propSpec: Record<string, string>)`

Smart prop parsing with type hints:

- `"string"` / `"string?"` - Required/optional string
- `"number"` / `"number?"` - Required/optional number (auto-parsed)
- `"boolean"` / `"boolean?"` - Required/optional boolean

### `.actions(actionMap: Record<string, Function>)`

State update functions. Each receives `(state, ...args)` and returns partial
state update.

### `.view(renderFn: (state, props, actions) => Node)`

Render function with auto-generated action creators.

### `.styles(css: string)` (Optional)

Component-scoped CSS styles.

## Examples (Legacy/Experimental)

The examples below use the older JSX-based pipeline API and are kept for
reference only. They are not part of the current SSR-only release.

### Todo List

```tsx
component("f-todo-list")
  .state({
    tasks: [] as Array<{ id: string; text: string; done: boolean }>,
    newTaskText: "",
  })
  .actions({
    addTask: (state, text: string) => ({
      tasks: [...state.tasks, { id: Date.now().toString(), text, done: false }],
      newTaskText: "",
    }),
    toggleTask: (state, id: string) => ({
      tasks: state.tasks.map((task: any) =>
        task.id === id ? { ...task, done: !task.done } : task
      ),
    }),
    updateText: (state, text: string) => ({ newTaskText: text }),
  })
  .view((state, props, { addTask, toggleTask, updateText }) => (
    <div class="todo-list">
      <input
        type="text"
        value={state.newTaskText}
        onInput={(e) => updateText((e.target as HTMLInputElement).value)}
      />
      <button onClick={() => addTask(state.newTaskText)}>Add</button>
      {state.tasks.map((task: any) => (
        <div data-key={task.id}>
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => toggleTask(task.id)}
          />
          <span>{task.text}</span>
        </div>
      ))}
    </div>
  ));
```

### Advanced Counter with Auto-increment

```tsx
component("f-counter-advanced")
  .state({ count: 0, autoIncrement: false })
  .props({ step: "number?", max: "number?" })
  .actions({
    inc: (state, step = 1) => ({
      count: Math.min(state.count + step, 100),
    }),
    dec: (state, step = 1) => ({
      count: Math.max(state.count - step, 0),
    }),
    toggleAuto: (state) => ({ autoIncrement: !state.autoIncrement }),
    reset: () => ({ count: 0, autoIncrement: false }),
  })
  .styles(`
    .counter { display: flex; gap: 1rem; padding: 1rem; }
    .auto-active { border-color: #28a745; }
  `)
  .view((state, props, { inc, dec, toggleAuto, reset }) => (
    <div class={`counter ${state.autoIncrement ? "auto-active" : ""}`}>
      <button
        onClick={() =>
          dec(props.step)}
      >
        -
      </button>
      <span>{state.count}</span>
      <button onClick={() => inc(props.step)}>+</button>
      <button onClick={toggleAuto}>
        {state.autoIncrement ? "Stop Auto" : "Start Auto"}
      </button>
      <button onClick={reset}>Reset</button>
    </div>
  ));
```

## Architecture

### Core Principles

1. **Immutable State** - All state updates return new objects
2. **Pure Functions** - No side effects in business logic
3. **Action-Based Updates** - Predictable state changes
4. **Type Safety** - Full TypeScript support
5. **Functional Composition** - Composable, reusable patterns

### File Structure

```
src/
├── lib/
│   ├── component-pipeline.ts    # Pipeline API implementation
│   ├── defineComponent.signals.ts  # Core component system
│   ├── signals.ts              # Reactive primitives
│   ├── types.ts                # Core type definitions
│   └── result.ts               # Result type utilities
├── index.ts                    # Main exports
examples/
├── counter-pipeline.tsx        # Basic and advanced counter examples
├── todo-pipeline.tsx          # Complex todo list example
├── main.ts                    # Example imports
└── index.html                 # Demo page
```

## Development

### Running Examples

```bash
# Quick start - check types and serve examples
deno task start

# Individual tasks
deno task check   # Type check all TypeScript files
deno task serve   # Serve examples directory on http://localhost:8080
```

The examples render at `http://localhost:8080` with server-side HTML only. The
server injects SSR output into `examples/index.html` and removes client scripts.

### Type Checking

```bash
deno task check  # Check all TypeScript files
# or manually:
deno check examples/*.tsx src/**/*.ts
```

### Project Structure

- `src/` - Library source code
- `examples/` - Example components and demo page
- `docs/` - Additional documentation

## Design Philosophy

This library follows **Light Functional Programming** principles:

1. **Model with types first** - Make illegal states unrepresentable
2. **Keep the core pure** - Push side effects to edges
3. **Treat errors as values** - Use `Result<T,E>` types
4. **Composition over inheritance** - No classes in business logic
5. **Local mutation OK** - Performance optimizations inside pure functions

## Advanced Usage

### Styling Components

```tsx
component("styled-button")
  .state({ pressed: false })
  .props({ variant: "string?" })
  .actions({
    press: () => ({ pressed: true }),
    release: () => ({ pressed: false }),
  })
  .styles(`
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn.primary { background: #007acc; color: white; }
    .btn.secondary { background: #6c757d; color: white; }
    .btn.pressed { transform: scale(0.98); }
  `)
  .view((state, props, { press, release }) => (
    <button
      class={`btn ${props.variant || "primary"} ${
        state.pressed ? "pressed" : ""
      }`}
      onMouseDown={press}
      onMouseUp={release}
      onMouseLeave={release}
    >
      Click me
    </button>
  ));
```

### Complex State Management

```tsx
component("data-table")
  .state({
    data: [] as Array<Record<string, any>>,
    sortColumn: null as string | null,
    sortDirection: "asc" as "asc" | "desc",
    filter: "",
    selectedRows: [] as string[],
  })
  .props({
    columns: "string", // JSON string of column definitions
    endpoint: "string?",
  })
  .actions({
    loadData: (state, data: Array<Record<string, any>>) => ({ data }),
    sort: (state, column: string) => ({
      sortColumn: column,
      sortDirection:
        state.sortColumn === column && state.sortDirection === "asc"
          ? "desc"
          : "asc",
    }),
    setFilter: (state, filter: string) => ({ filter }),
    toggleRow: (state, id: string) => ({
      selectedRows: state.selectedRows.includes(id)
        ? state.selectedRows.filter((rowId) => rowId !== id)
        : [...state.selectedRows, id],
    }),
    clearSelection: () => ({ selectedRows: [] }),
  })
  .view((state, props, actions) => {
    const columns = JSON.parse(props.columns || "[]");
    const filteredData = state.data.filter((row: any) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(state.filter.toLowerCase())
      )
    );

    return (
      <div class="data-table">
        <input
          type="text"
          placeholder="Filter..."
          value={state.filter}
          onInput={(e) =>
            actions.setFilter((e.target as HTMLInputElement).value)}
        />
        <table>
          <thead>
            <tr>
              {columns.map((col: any) => (
                <th
                  data-key={col.key}
                  onClick={() => actions.sort(col.key)}
                >
                  {col.title}
                  {state.sortColumn === col.key && (
                    <span>{state.sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row: any) => (
              <tr
                data-key={row.id}
                class={state.selectedRows.includes(row.id) ? "selected" : ""}
                onClick={() => actions.toggleRow(row.id)}
              >
                {columns.map((col: any) => (
                  <td data-key={col.key}>{row[col.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  });
```

## Best Practices

### State Design

- Keep state flat when possible
- Use arrays for lists, objects for entities
- Prefer primitive types over complex nested structures
- Use TypeScript interfaces for complex data shapes

### Action Design

- Make actions pure functions
- Return partial state updates, not full state
- Use descriptive action names
- Keep actions focused on single responsibilities

### Component Composition

```tsx
// Good: Small, focused components
component("user-avatar")
  .state({ loaded: false })
  .props({ src: "string", size: "number?" })
  .view((state, props) => (
    <img
      src={props.src}
      width={props.size || 32}
      height={props.size || 32}
      class="avatar"
    />
  ));

component("user-card")
  .state({ expanded: false })
  .props({ user: "string" }) // JSON string
  .actions({
    toggle: (state) => ({ expanded: !state.expanded }),
  })
  .view((state, props, { toggle }) => {
    const user = JSON.parse(props.user);
    return (
      <div class="user-card">
        <user-avatar src={user.avatar} size="48"></user-avatar>
        <div class="info">
          <h3>{user.name}</h3>
          <button onClick={toggle}>
            {state.expanded ? "Less" : "More"}
          </button>
          {state.expanded && <p>{user.bio}</p>}
        </div>
      </div>
    );
  });
```

## Troubleshooting (Legacy/Experimental)

### Common Issues

**JSX Type Errors (Legacy)**

```tsx
// ❌ Wrong: Missing JSX pragma
import { component } from "./src/index.ts";

// ✅ Correct: Include JSX pragma
/** @jsxImportSource https://esm.sh/mono-jsx */
import { component } from "./src/index.ts";
```

**Action Not Updating State**

```tsx
// ❌ Wrong: Mutating state directly
actions({
  addItem: (state, item) => {
    state.items.push(item); // Mutates original state
    return state;
  },
});

// ✅ Correct: Return new state
actions({
  addItem: (state, item) => ({
    items: [...state.items, item], // Creates new array
  }),
});
```

**Props Not Parsing**

```tsx
// ❌ Wrong: Incorrect type hint
.props({ count: "number" }) // Required number

// ✅ Correct: Optional number
.props({ count: "number?" }) // Optional number with auto-parsing
```

### Performance Tips

1. **Minimize State Updates**: Batch related changes into single actions
2. **Use Memoization**: For expensive computations in view functions
3. **Optimize Renders**: Avoid creating new objects/functions in render
4. **Component Granularity**: Break large components into smaller ones

### Debugging

```tsx
component("debug-counter")
  .state({ count: 0, debug: true })
  .actions({
    inc: (state) => {
      const newState = { count: state.count + 1 };
      if (state.debug) console.log("State update:", newState);
      return newState;
    },
  })
  .view((state, props, { inc }) => (
    <div>
      <span>{state.count}</span>
      <button onClick={inc}>+</button>
      {state.debug && <pre>{JSON.stringify(state, null, 2)}</pre>}
    </div>
  ));
```

## Browser Support

- Server-rendered HTML only (no client JS shipped)
- Works in any modern browser that renders standard HTML/CSS

## Migration Guide

### From React Components

1. Replace `useState` with `.state()`
2. Replace `useEffect` with `.effects()` (when available)
3. Convert event handlers to actions
4. Replace props interface with `.props()` type hints

### From Other Web Component Libraries

1. Replace class-based components with functional Pipeline API
2. Convert component state to `.state()` object
3. Replace methods with `.actions()` functions
4. Use `.props()` with type hints instead of manual attribute parsing
5. Leverage automatic JSX-to-DOM conversion

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all examples work
5. Submit a pull request

### Development Setup

```bash
git clone <repository-url>
cd funcwc
deno task serve  # Start SSR dev server (http://localhost:8080)
```

## License

[Add your license here]

---

**Built for modern web development:**

The Pipeline API delivers the perfect balance of simplicity and power, enabling
you to build complex, stateful web components with minimal code while
maintaining full type safety and functional programming principles.

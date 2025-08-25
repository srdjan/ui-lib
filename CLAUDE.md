# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

**funcwc** is a lightweight, functional programming library for building
**SSR-compatible web components** with TypeScript/Deno. It creates Custom
Elements that use custom JSX runtime for server-side rendering while maintaining
client-side reactivity. The library features an ultra-succinct Pipeline API with
immutable state, pure functions, and intelligent type inference, following Light
Functional Programming principles.

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

### Manual Commands

```bash
# Type check specific files
deno check examples/*.tsx src/**/*.ts

# Run development server with TypeScript MIME type handling
deno run --allow-net --allow-read --allow-env server.ts
```

## Core Architecture

### Library Structure

The codebase follows a functional, modular architecture built around
SSR-compatible web components:

1. **Pipeline API** (`src/lib/component-pipeline.ts`) - Ultra-succinct chainable
   API for component creation
2. **Core Component System** (`src/lib/defineComponent.signals.ts`) - Custom
   Elements with signals-based reactivity
3. **JSX Runtime** (`src/lib/jsx-runtime.ts`) - Custom JSX runtime for SSR
   compatibility
4. **Reactive Primitives** (`src/lib/signals.ts`) - Signal-based state
   management system

### Key Architecture Patterns

**Functional Programming Principles:**

- No classes in business logic (except for the internal DOM element wrapper)
- Immutable state with `Readonly<T>` everywhere
- Pure functions for state updates and rendering
- Action-based state updates using `Action` type with type/payload structure
- Result types for error handling (`Result<T,E>`)

**Component Definition Approaches:**

1. **Pipeline API (Recommended)** - Chainable, high-level API:

```tsx
component("my-counter")
  .state({ count: 0 })
  .props({ step: "number?" })
  .actions({
    inc: (state, step = 1) => ({ count: state.count + step }),
  })
  .view((state, props, { inc }) => (
    <button onClick={() => inc(props.step)}>{state.count}</button>
  ));
```

2. **Core API** - Lower-level, more explicit:

```tsx
defineComponent("my-counter", {
  init: () => ({ count: 0 }),
  update: (state, action) => { /* reducer logic */ },
  view: (state, props) => /* JSX */,
  props: { step: { parse: Number } }
})
```

### File Organization

```
src/
├── index.ts                    # Main exports
├── lib/
│   ├── component-pipeline.ts   # Pipeline API implementation
│   ├── defineComponent.signals.ts # Core component system with signals
│   ├── signals.ts              # Reactive primitives (createSignal, createEffect, createMemo)
│   ├── types.ts                # Core type definitions
│   ├── result.ts               # Result<T,E> type and utilities
│   ├── jsx-runtime.ts          # JSX runtime integration
│   └── immutability.ts         # Immutability utilities
examples/
├── counter-pipeline.tsx        # Pipeline API example
├── main.ts                     # Example imports
└── index.html                  # Demo page
```

## TypeScript Configuration

### Compiler Settings

- **Target**: ES2020 with DOM support
- **Module**: ES2020 with Bundler resolution
- **JSX**: Uses custom JSX runtime with `h` function
- **Strict Mode**: Full TypeScript strictness enabled
- `noUncheckedIndexedAccess: true` for array safety

### JSX Setup

All JSX files must include:

```tsx
/** @jsx h */
import { h } from "../src/index.ts";
```

## Key Development Patterns

### Component State Management

- State is always immutable (`Readonly<S>`)
- Updates return partial state objects that get merged
- Actions follow `{type: string, payload?: unknown}` pattern
- Use the Pipeline API's action creators for type safety

### Props System

The Pipeline API provides intelligent prop parsing:

- `"string"` / `"string?"` - Required/optional string
- `"number"` / `"number?"` - Required/optional number with auto-parsing
- `"boolean"` / `"boolean?"` - Required/optional boolean
- Optional props use `?` suffix

### Styling

- Component-scoped CSS via `.styles(css)` method
- Uses Shadow DOM for style encapsulation
- CSS classes are scoped to the component automatically

### Testing Strategy

This project uses Deno's built-in testing:

```bash
deno test                    # Run tests (when implemented)
deno test --coverage        # With coverage
```

## Error Handling Philosophy

The library follows functional error handling patterns:

- Use `Result<T,E>` types from `src/lib/result.ts`
- Core utilities: `ok()`, `err()`, `map()`, `flatMap()`, `mapError()`
- Avoid throwing exceptions in business logic
- Handle errors as values throughout the pipeline

## Integration Notes

### SSR Compatibility

- Components use custom JSX runtime for server-side rendering
- JSX elements render to real DOM nodes, not virtual DOM
- Custom Elements automatically register on first import
- Shadow DOM used for style encapsulation and component isolation

### Web Components

- Built on standard Custom Elements v1 and Shadow DOM v1
- Components register automatically via `customElements.define()`
- Full interoperability with any web framework or vanilla HTML
- Event handling bridges JSX events to action dispatching

### Deno Runtime

- Designed for Deno's TypeScript-first environment
- Development server handles TypeScript modules with proper MIME types
- Uses custom JSX runtime with direct string rendering
- No build step required for development

### Browser Compatibility

- Requires modern browsers with ES2020+ support
- Uses Custom Elements v1 and Shadow DOM v1
- Custom JSX runtime that renders directly to HTML strings

## Development Workflow

1. **Component Creation**: Use Pipeline API for new components in `.tsx` files
   with `/** @jsx h */` pragma
2. **Type Safety**: Let TypeScript infer types from Pipeline method calls
3. **Zero Configuration**: Deno automatically handles TypeScript transpilation
   and custom JSX runtime
4. **Testing**: Access components at `http://localhost:8080` after
   `deno task start`
5. **State Updates**: Always return partial state objects from actions
6. **Event Handling**: Use action creators provided to view function
7. **Styling**: Include styles in `.styles()` method for scoped CSS

### SSR Integration

- Components use custom JSX runtime that renders directly to HTML strings
- JSX pragma `/** @jsx h */` enables zero-config JSX processing
- Custom `h` function converts JSX elements directly to HTML strings for SSR
- Event handlers automatically support action dispatching
- No build step required - Deno handles all transpilation

## Common Patterns

### Action Creators

The Pipeline API auto-generates action creators:

```tsx
.actions({
  increment: (state, amount = 1) => ({ count: state.count + amount })
})
.view((state, props, { increment }) => 
  <button onClick={() => increment(5)}>+5</button>
)
```

### Prop Validation

Smart prop parsing handles type conversion automatically:

```tsx
.props({ max: "number?", disabled: "boolean?" })
// Usage: <my-component max="100" disabled></my-component>
```

### State Shape Design

Keep state flat and use TypeScript for complex shapes:

```tsx
.state({
  items: [] as Array<{id: string, text: string, done: boolean}>,
  filter: "all" as "all" | "active" | "completed"
})
```

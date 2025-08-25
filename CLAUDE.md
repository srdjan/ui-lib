# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

**funcwc** is a lightweight, functional programming library for building
**SSR-first components** with TypeScript/Deno. It renders components to HTML strings
on the server using a custom JSX runtime, with client-side interactivity powered by HTMX.
The library features an ultra-succinct Pipeline API with immutable state, pure functions,
and intelligent type inference, following Light Functional Programming principles.

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
2. **Component Registry** (`src/lib/registry.ts`) - Global registry for SSR
   component definitions
3. **JSX Runtime** (`src/lib/jsx-runtime.ts`) - Custom JSX runtime that renders
   directly to HTML strings
4. **SSR Engine** (`src/lib/component-state.ts`) - Server-side rendering system

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
  .props({ step: "number?" })
  .classes({ button: "counter-btn", label: "counter-label" })
  .view((props, api, classes) => (
    <button class={classes!.button}>Count</button>
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

### SSR Architecture

- Components render to HTML strings on the server via custom JSX runtime
- Global registry stores component definitions for server-side rendering
- String-based template replacement converts component tags to rendered HTML
- Client-side interactivity handled by HTMX attributes

### Pure SSR Approach

- No Custom Elements or Shadow DOM - components are pure server-side templates
- Components registered in global registry (`__FWC_SSR__`) for string rendering
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

- Components render to HTML strings via custom JSX runtime
- JSX pragma `/** @jsx h */` enables zero-config JSX processing
- Custom `h` function converts JSX elements directly to HTML strings
- Server-side template replacement converts `<component-name>` tags to rendered HTML
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

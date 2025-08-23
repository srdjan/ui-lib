# Pipeline API Documentation

The Pipeline API provides an ultra-succinct, chainable interface for creating functional web components with dramatically reduced boilerplate code.

## Overview

The Pipeline API reduces component definition from 70+ lines to just 8-15 lines while maintaining all the functional programming principles and type safety of the original API.

### Comparison

**Original API (70+ lines):**
```tsx
export type CounterState = { readonly count: number };
export type CounterProps = { readonly step?: number };
export type CounterAction = /* ... complex union type ... */;

const init = (props: Readonly<CounterProps>): Readonly<CounterState> => ({ count: 0 });
const update = (state: Readonly<CounterState>, action: Readonly<CounterAction>): Readonly<CounterState> => {
  switch (action.type) {
    case "INC": return { count: state.count + (action.payload?.step ?? 1) };
    case "DEC": return { count: state.count - (action.payload?.step ?? 1) };
    default: return state;
  }
};
const View = (state: Readonly<CounterState>, props: Readonly<CounterProps & ComponentContext>): Node => (
  <div class="counter">
    <button onClick={() => ({ type: "DEC", payload: { step: props.step ?? 1 } })}>-</button>
    <span>{state.count}</span>
    <button onClick={() => ({ type: "INC", payload: { step: props.step ?? 1 } })}>+</button>
  </div>
) as unknown as Node;

defineComponent<CounterState, CounterProps, CounterAction>("f-counter", {
  init, update, view: View,
  props: { step: { attribute: "step", parse: (v) => v == null ? undefined : Number(v) } }
});
```

**Pipeline API (8 lines):**
```tsx
component("f-counter-pipeline")
  .state({ count: 0 })
  .props({ step: "number?" })
  .actions({
    inc: (state, step = 1) => ({ count: state.count + step }),
    dec: (state, step = 1) => ({ count: state.count - step })
  })
  .view((state, props, { inc, dec }) => (
    <div class="counter">
      <button onClick={() => dec(props.step)}>-</button>
      <span>{state.count}</span>
      <button onClick={() => inc(props.step)}>+</button>
    </div>
  ));
```

## API Reference

### `component(name: string)`

Creates a new component builder with the specified custom element name.

```tsx
import { component } from "../src/index.ts";

component("my-component")
  // ... chain methods
```

### `.state(initialState: Record<string, any>)`

Defines the initial state of the component. The state shape is automatically inferred.

```tsx
component("my-component")
  .state({ count: 0, loading: false, items: [] })
```

### `.props(propSpec: Record<string, string>)`

Defines component properties with smart type parsing. Supported type hints:

- `"string"` - Required string
- `"string?"` - Optional string  
- `"number"` - Required number with auto-parsing
- `"number?"` - Optional number with auto-parsing
- `"boolean"` - Required boolean
- `"boolean?"` - Optional boolean

```tsx
component("my-component")
  .props({ 
    title: "string",
    count: "number?",
    disabled: "boolean?"
  })
```

### `.actions(actionMap: Record<string, Function>)`

Defines state update functions. Each function receives the current state as the first parameter, followed by any action arguments, and returns a partial state update.

```tsx
component("my-component")
  .actions({
    increment: (state, step = 1) => ({ count: state.count + step }),
    setLoading: (state, loading: boolean) => ({ loading }),
    addItem: (state, item: string) => ({ items: [...state.items, item] })
  })
```

### `.view(renderFn: (state, props, actions) => Node)`

Defines the component's render function. The function receives:
- `state` - Current component state
- `props` - Component properties (including parsed attributes)
- `actions` - Object with action creator functions

```tsx
component("my-component")
  .view((state, props, { increment, setLoading }) => (
    <div>
      <span>{state.count}</span>
      <button onClick={() => increment(props.step)}>+</button>
      <button onClick={() => setLoading(!state.loading)}>Toggle Loading</button>
    </div>
  ))
```

### `.styles(css: string)` (Optional)

Adds CSS styles to the component.

```tsx
component("my-component")
  .styles(`
    .container { display: flex; gap: 1rem; }
    button { padding: 0.5rem; }
  `)
```

### `.effects(effectMap: Record<string, Function>)` (Optional)

Defines side effects (currently placeholder - requires deeper lifecycle integration).

```tsx
component("my-component")
  .effects({
    autoSave: (state, props, actions) => {
      // Effect logic here
    }
  })
```

## Examples

### Basic Counter

```tsx
component("f-counter-basic")
  .state({ count: 0 })
  .actions({
    inc: state => ({ count: state.count + 1 }),
    dec: state => ({ count: state.count - 1 })
  })
  .view((state, _, { inc, dec }) => (
    <div>
      <button onClick={dec}>-</button>
      <span>{state.count}</span>
      <button onClick={inc}>+</button>
    </div>
  ));
```

### Counter with Props and Styles

```tsx
component("f-counter-styled")
  .state({ count: 0 })
  .props({ step: "number?", max: "number?" })
  .actions({
    inc: (state, step = 1) => ({ 
      count: Math.min(state.count + step, 100) 
    }),
    dec: (state, step = 1) => ({ 
      count: Math.max(state.count - step, 0) 
    }),
    reset: () => ({ count: 0 })
  })
  .styles(`
    .counter {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      padding: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      padding: 0.5rem;
      border: 1px solid #666;
      background: #f0f0f0;
      cursor: pointer;
    }
  `)
  .view((state, props, { inc, dec, reset }) => (
    <div class="counter">
      <button onClick={() => dec(props.step)}>-</button>
      <span>{state.count}</span>
      <button onClick={() => inc(props.step)}>+</button>
      <button onClick={reset}>Reset</button>
    </div>
  ));
```

### Todo List

```tsx
component("f-todo-list")
  .state({ 
    tasks: [] as Array<{ id: string; text: string; done: boolean }>,
    newTaskText: ""
  })
  .actions({
    addTask: (state, text: string) => {
      if (!text.trim()) return {};
      return {
        tasks: [...state.tasks, {
          id: Date.now().toString(),
          text: text.trim(),
          done: false
        }],
        newTaskText: ""
      };
    },
    toggleTask: (state, id: string) => ({
      tasks: state.tasks.map((task: any) => 
        task.id === id ? { ...task, done: !task.done } : task
      )
    }),
    updateNewTaskText: (state, text: string) => ({ newTaskText: text })
  })
  .view((state, props, { addTask, toggleTask, updateNewTaskText }) => (
    <div class="todo-list">
      <div class="input-section">
        <input
          type="text"
          value={state.newTaskText}
          onInput={(e) => updateNewTaskText((e.target as HTMLInputElement).value)}
          placeholder="Add a task..."
        />
        <button onClick={() => addTask(state.newTaskText)}>Add</button>
      </div>
      <div class="tasks">
        {state.tasks.map((task: any) => (
          <div data-key={task.id} class={`task ${task.done ? 'done' : ''}`}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(task.id)}
            />
            <span>{task.text}</span>
          </div>
        ))}
      </div>
    </div>
  ));
```

## Key Features

1. **Automatic Type Inference** - No need to define separate type interfaces
2. **Smart Prop Parsing** - Automatic conversion based on type hints
3. **Action Creator Generation** - Actions become callable functions in the view
4. **Chainable API** - Fluent interface for better readability
5. **Auto-Registration** - Component is registered when `.view()` is called
6. **Minimal Boilerplate** - 80-85% reduction in code compared to original API
7. **Full Compatibility** - Works with existing mono-jsx JSX runtime and functional principles

## Migration Guide

To migrate from the original API to the Pipeline API:

1. Replace type definitions with `.state()` call
2. Replace prop specifications with `.props()` using type hints
3. Convert action types and update function to `.actions()` object
4. Simplify view function to use action creators
5. Remove manual `defineComponent` call

The Pipeline API maintains all the functional programming principles while dramatically simplifying the developer experience.

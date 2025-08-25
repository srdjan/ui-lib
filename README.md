# funcwc - DOM-Native SSR Components

**Ultra-lightweight, type-safe SSR components with the DOM as your state
container.**

Built for Deno + TypeScript with an SSR-first approach using HTMX, funcwc takes a following approach to state management: **the DOM
_is_ the state**. No JavaScript state objects, no synchronization overhead, just
pure DOM manipulation with a delightful developer experience.

## ✨ Key Features

- **🎯 DOM-Native State**: Component state lives in CSS classes, data
  attributes, and element content
- **⚡ Type-Safe**: Full TypeScript inference with zero casting required
- **🚀 SSR-First**: Render on server, send optimized HTML
- **🔄 HTMX Ready**: Built-in server actions for dynamic updates
- **📦 Zero Runtime**: No client-side framework dependencies
- **🎨 Functional API**: Chainable pipeline design

## 🚀 Quick Start

```bash
# Clone and run examples
git clone <repository-url> && cd funcwc
deno task serve  # → http://localhost:8080
```

## 🎯 Philosophy: DOM as State

Instead of managing JavaScript state objects, funcwc uses the DOM itself:

- **CSS Classes** → UI states (`active`, `open`, `loading`)
- **Data Attributes** → Component data (`data-count="5"`)
- **Element Content** → Display values (counter numbers, text)
- **Form Values** → Input states (checkboxes, text inputs)

This eliminates state synchronization bugs and makes debugging trivial—just
inspect the DOM!

## 🎬 See It In Action

Run `deno task serve` and visit http://localhost:8080 to see all examples
working:

- **🎨 Theme Toggle**: CSS class switching
- **🔢 Counter**: Data attributes + element content
- **✅ Todo Items**: Checkbox state + HTMX server sync
- **📁 Accordion**: Pure CSS transitions
- **📑 Tabs**: Multi-element state coordination

## 📋 Complete Examples

### 🎨 Theme Toggle - Pure DOM State

```tsx
import { defineComponent, toggleClasses, h } from "./src/index.ts";

defineComponent("theme-toggle", {
  classes: {
    button: "theme-btn",
    lightIcon: "light-icon", 
    darkIcon: "dark-icon"
  },
  styles: `
    .theme-btn { 
      padding: 0.5rem 1rem; 
      border: 2px solid; 
      border-radius: 6px; 
      cursor: pointer;
      font-weight: 500;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .theme-btn.light { background: #fff; color: #333; border-color: #ddd; }
    .theme-btn.light:hover { border-color: #007bff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .theme-btn.dark { background: #2d3748; color: #f7fafc; border-color: #4a5568; }
    .theme-btn.dark:hover { border-color: #63b3ed; box-shadow: 0 2px 4px rgba(0,0,0,0.3); }
    .theme-btn.dark .light-icon, .theme-btn.light .dark-icon { display: none !important; }
    .theme-btn.dark .dark-icon, .theme-btn.light .light-icon { display: inline; }
  `,
  render: (props, api, classes) => (
    <button
      class={`${classes!.button} light`}
      onclick={toggleClasses(["light", "dark"])} // ✨ Direct DOM manipulation!
    >
      <span class={classes!.lightIcon}>☀️ Light</span>
      <span class={classes!.darkIcon}>🌙 Dark</span>
    </button>
  )
});
```

**Key Benefits:**

- ✅ No JavaScript state objects
- ✅ CSS handles the visual transitions
- ✅ State visible in DOM inspector
- ✅ Type-safe event handlers

### 🔢 Counter - Enhanced Props with Defaults

```tsx
import { defineComponent, h } from "./src/index.ts";
import { resetCounter, updateParentCounter } from "./examples/dom-actions.ts";

defineComponent("smart-counter", {
  props: { 
    initialCount: { type: "number", default: 0 },  // ✨ Default values!
    step: { type: "number", default: 1 },
    label: "string?"
  },
  classes: {
    container: "counter",
    button: "counter-btn", 
    display: "count-display",
    label: "counter-label"
  },
  styles: `
    .counter { display: inline-flex; gap: 0.5rem; padding: 1rem; border: 2px solid #007bff; align-items: center; }
    .counter-btn { padding: 0.5rem; background: #007bff; color: white; border: none; border-radius: 4px; }
    .count-display { font-size: 1.5rem; min-width: 3rem; text-align: center; font-weight: bold; }
    .counter-label { margin-right: 0.5rem; font-weight: 500; }
  `,
  render: ({ initialCount, step, label }, api, classes) => (
    <div class={classes!.container} data-count={initialCount}>
      {label && <span class={classes!.label}>{label}:</span>}
      <button
        class={classes!.button}
        onclick={updateParentCounter(`.${classes!.container}`, `.${classes!.display}`, -step)}
      >
        -{step}
      </button>
      <span class={classes!.display}>{initialCount}</span>
      <button
        class={classes!.button}
        onclick={updateParentCounter(`.${classes!.container}`, `.${classes!.display}`, step)}
      >
        +{step}
      </button>
      <button 
        class={classes!.button}
        onclick={resetCounter(`.${classes!.display}`, initialCount, `.${classes!.container}`)}
      >
        Reset
      </button>
    </div>
  )
});
```

**DOM State in Action:**

- Counter value stored in `data-count` attribute
- Display synced with element `.textContent`
- No JavaScript variables to manage!

### ✅ Todo Item - HTMX Server Integration

```tsx
import { defineComponent, conditionalClass, renderComponent, h } from "./src/index.ts";
import { syncCheckboxToClass } from "./examples/dom-actions.ts";

defineComponent("todo-item", {
  props: { 
    id: "string", 
    text: "string", 
    done: { type: "boolean", default: false }
  },
  api: {
    // ✨ Define server endpoints - HTMX attributes auto-generated!
    "PATCH /api/todos/:id/toggle": async (req, params) => {
      const form = await req.formData();
      const isDone = form.get("done") === "true";
      return new Response(
        renderComponent("todo-item", {
          id: params.id,
          text: "Updated task!",
          done: !isDone,
        })
      );
    },
    "DELETE /api/todos/:id": (_req, _params) => {
      return new Response(null, { status: 204 });
    },
  },
  classes: {
    item: "todo",
    checkbox: "todo-checkbox",
    text: "todo-text",
    deleteBtn: "delete-btn"
  },
  styles: `
    .todo { 
      display: flex; align-items: center; gap: 0.5rem; 
      padding: 0.75rem; border: 1px solid #ddd; 
      border-radius: 4px; margin-bottom: 0.5rem; 
      background: white; transition: background-color 0.2s;
    }
    .todo.done { background: #f8f9fa; opacity: 0.8; }
    .todo-text { flex: 1; font-size: 1rem; }
    .todo.done .todo-text { text-decoration: line-through; color: #6c757d; }
    .delete-btn { 
      background: #dc3545; color: white; border: none; 
      border-radius: 50%; width: 24px; height: 24px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
    }
  `,
  render: ({ id, text, done }, api, classes) => {
    const itemClass = `${classes!.item} ${done ? "done" : ""}`;
    
    return (
      <div class={itemClass} data-id={id}>
        <input
          type="checkbox"
          class={classes!.checkbox}
          checked={done}
          onChange={syncCheckboxToClass("done")}
          {...(api?.toggle?.(id) || {})} // ✨ Auto-generated HTMX attributes!
        />
        <span class={classes!.text}>{text}</span>
        <button 
          type="button" 
          class={classes!.deleteBtn}
          {...(api?.delete?.(id) || {})}
        >
          ×
        </button>
      </div>
    );
  }
});
```

**Hybrid State Management:**

- ✅ **Local UI state**: Checkbox syncs to CSS class instantly
- ✅ **Server persistence**: HTMX handles data updates
- ✅ **No state conflicts**: DOM is the single source of truth

## 🔧 defineComponent API Reference

### `defineComponent(name: string, config: ComponentConfig)`

Define a component with clean, object-based configuration. Component names should be kebab-case.

```tsx
defineComponent("my-component", {
  // Component configuration
});
```

### Enhanced Props System

Multiple syntax options for maximum flexibility:

```tsx
// Basic string syntax
props: { 
  title: "string",           // Required string
  count: "number?",          // Optional number
  active: "boolean?"         // Optional boolean
}

// Enhanced syntax with defaults
props: {
  title: "string",
  count: { type: "number", default: 0 },
  active: { type: "boolean", default: true }
}

// Explicit required/optional syntax
props: {
  title: { type: "string", required: true },
  count: { type: "number", required: false }
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

### Component-Scoped CSS

```tsx
styles: `
  .my-button { background: blue; color: white; }
  .my-button:hover { background: darkblue; }
`
```

### Class Mapping

```tsx
classes: {
  button: "btn-primary",
  container: "main-container"
}

// Usage: <button class={classes.button}>Click me</button>
```

### Render Function

Returns JSX that compiles to optimized HTML strings:

```tsx
render: (props, api, classes) => (
  <div class={classes?.container}>
    <button {...(api?.action?.(props.id) || {})}>Click me</button>
  </div>
)
```

**Parameters:**
- `props`: Fully typed props object
- `api`: Auto-generated HTMX client functions (optional)
- `classes`: Class name mappings (optional)

## 🎮 DOM Helpers

**Core helpers shipped by the library:**

### Class Manipulation

```tsx
toggleClass("active"); // Toggle single class
toggleClasses(["open", "visible"]); // Toggle multiple classes
```

### Template Utilities

```tsx
conditionalClass(isOpen, "open", "closed"); // Conditional CSS classes
spreadAttrs({ "hx-get": "/api/data" }); // Spread HTMX attributes
dataAttrs({ userId: 123, role: "admin" }); // Generate data-* attributes
```

### Example-only helpers (in `examples/dom-actions.ts`)

Small, copyable helpers that return inline handler strings for common UI
patterns:

```tsx
updateParentCounter(".container", ".display", 5); // Increment by 5
resetCounter(".display", 0, ".container"); // Reset to initial value
toggleParentClass("expanded"); // Toggle class on parent element
syncCheckboxToClass("completed"); // Checkbox state → CSS class
activateTab(".tabs", ".tab-btn", ".content", "active"); // Tab activation
```

These are app-level conveniences and intentionally live outside the library to
keep the core clean and framework-agnostic.

## 🛠 Development Commands

```bash
deno task serve      # Development server → http://localhost:8080
deno task start      # Type check + serve (recommended)
deno task check      # Type check all files
deno task test       # Run tests
deno task fmt        # Format code
deno task lint       # Lint code
```

## 🎯 Why funcwc?

### Traditional React/Vue Problems:

```tsx
// ❌ Complex state management
const [count, setCount] = useState(0);
const [isOpen, setIsOpen] = useState(false);
const [loading, setLoading] = useState(false);

// ❌ State synchronization bugs
// ❌ Prop drilling
// ❌ Large bundle sizes
// ❌ Hydration mismatches
```

### funcwc Solution:

```tsx
// ✅ DOM is the state - no synchronization needed!
defineComponent("my-widget", {
  classes: { container: "widget", button: "toggle-btn", counter: "counter" },
  render: (props, api, classes) => (
    <div class={`${classes!.container} closed`} data-count="0">
      <button class={classes!.button} onclick={toggleClass("open")}>Toggle</button>
      <span class={classes!.counter}>0</span>
    </div>
  )
});

// ✅ Zero runtime JavaScript
// ✅ Perfect SSR  
// ✅ No hydration issues
// ✅ Instant debugging (inspect DOM)
```

## 🚀 Performance Benefits

- **🏃‍♂️ Faster**: No client-side state management overhead
- **📦 Smaller**: Zero runtime dependencies, minimal JavaScript
- **🔧 Simpler**: DOM inspector shows all state
- **⚡ Instant**: Direct DOM manipulation, no virtual DOM
- **🎯 Reliable**: No state synchronization bugs

---

**Built with ❤️ for the modern web. Deno + TypeScript + DOM-native state
management.**

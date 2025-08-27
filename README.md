# funcwc - DOM-Native SSR Components

**Ultra-lightweight, type-safe SSR components with the DOM as your state container.**

Built for Deno + TypeScript with an SSR-first approach using HTMX, funcwc takes a revolutionary approach to state management: **the DOM _is_ the state**. No JavaScript state objects, no synchronization overhead, just pure DOM manipulation with a delightful developer experience.

## 🎉 NEW: Revolutionary Ergonomics

### ✨ Function-Style Props (Zero Duplication!)

Define props directly in render function parameters - no more duplication between props definition and function parameters!

```tsx
// ✅ NEW: Function-style props - zero duplication!
defineComponent("smart-counter", {
  render: ({ 
    initialCount = number(0),    // Auto-parsed from HTML attributes
    step = number(1),           // Default values built-in
    label = string("Counter")   // Type-safe with smart helpers
  }) => (
    <div data-count={initialCount}>
      {label}: {initialCount}
      <button onclick="/* DOM action */">+{step}</button>
    </div>
  )
});
```

### 🎨 CSS-Only Format (Auto-Generated Classes!)

Just write CSS properties - class names auto-generated! No selectors, no duplication, pure magic!

```tsx
defineComponent("beautiful-card", {
  styles: {
    // ✨ Just CSS properties - class names auto-generated!
    card: `{ border: 2px solid #ddd; border-radius: 8px; padding: 1.5rem; }`,
    title: `{ font-size: 1.25rem; font-weight: bold; color: #333; }`,
    buttonPrimary: `{ background: #007bff; color: white; padding: 0.5rem 1rem; }`
    // Auto-generates: .card, .title, .button-primary
  },
  render: (props, api, classes) => (
    <div class={classes!.card}>
      <h3 class={classes!.title}>Amazing!</h3>
      <button class={classes!.buttonPrimary}>Click me</button>
    </div>
  )
});
```

## ✨ Key Features

- **🎯 DOM-Native State**: Component state lives in CSS classes, data attributes, and element content
- **🚀 Function-Style Props**: Zero duplication between props and render parameters
- **🎨 CSS-Only Format**: Auto-generated class names from CSS properties  
- **⚡ Type-Safe**: Full TypeScript inference with smart type helpers
- **🔄 HTMX Ready**: Built-in server actions for dynamic updates
- **📦 Zero Runtime**: No client-side framework dependencies
- **🎭 SSR-First**: Render on server, send optimized HTML
- **🧾 JSON Requests, HTML Responses**: Standardized JSON-encoded htmx requests; server returns HTML snippets for swapping

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

This eliminates state synchronization bugs and makes debugging trivial—just inspect the DOM!

## 🎬 See It In Action

Run `deno task serve` and visit http://localhost:8080 to see all examples working:

- **🎉 Function-Style Props**: Zero duplication demonstration
- **🎨 Theme Toggle**: CSS class switching
- **🔢 Counter**: Function-style props + CSS-only format
- **✅ Todo Items**: HTMX integration + auto-generated classes
- **📁 Accordion**: Pure CSS transitions + function-style props
- **📑 Tabs**: Multi-element state coordination
- **❤️ Like Card**: HTMX payloads (hx-vals) with server inspection

### Global HTMX setup (JSON requests)

Add the json-enc extension and configure JSON encoding at the page level. Responses remain HTML and are swapped by htmx.

```html
<head>
  <script src="https://unpkg.com/htmx.org@2.0.6"></script>
  <script src="https://unpkg.com/htmx.org/dist/ext/json-enc.js"></script>
</head>
<body hx-ext="json-enc" hx-encoding="json">
  <!-- your markup -->
</body>
```

## 📋 Complete Examples

### 🎉 Function-Style Props - The Future is Here!

```tsx
import { defineComponent, h, string, number, boolean } from "./src/index.ts";

// ✨ NO props definition needed - extracted from render function!
defineComponent("smart-card", {
  styles: {
    // 🎨 CSS-only format - class names auto-generated!
    card: `{ border: 2px solid #e9ecef; border-radius: 8px; padding: 1.5rem; background: white; }`,
    title: `{ font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem; }`,
    highlight: `{ border-color: #007bff; background: #f8f9ff; }`
  },
  render: ({ 
    title = string("Amazing Card"),  // Smart type helpers with defaults
    count = number(42),             // Auto-parsed from HTML attributes  
    highlighted = boolean(false)    // Type-safe boolean handling
  }, api, classes) => (
    <div class={`${classes!.card} ${highlighted ? classes!.highlight : ""}`}>
      <h3 class={classes!.title}>{title}</h3>
      <p>Count: {count}</p>
      <p>Highlighted: {highlighted ? "Yes" : "No"}</p>
    </div>
  )
});

// Usage in HTML:
// <smart-card title="Hello World" count="100" highlighted></smart-card>
```

**Revolutionary Benefits:**
- ✅ **Zero Duplication**: Props defined once in function signature
- ✅ **Auto-Generated Classes**: `.card`, `.title`, `.highlight` from CSS keys
- ✅ **Smart Type Helpers**: `string()`, `number()`, `boolean()` with defaults
- ✅ **Great TypeScript DX**: For strict typing inside render, add an inline cast to each default and annotate the parameter type:

  ```tsx
  render: ({
    title = string("Hello") as unknown as string,
    count = number(0) as unknown as number,
    enabled = boolean(false) as unknown as boolean,
  }: { title: string; count: number; enabled: boolean }) => /* ... */
  ```

### 🔢 Counter - CSS-Only Format Demo

```tsx
import { defineComponent, h, number } from "./src/index.ts";
import { updateParentCounter, resetCounter } from "./examples/dom-actions.ts";

defineComponent("counter", {
  styles: {
    // ✨ CSS-only format - no selectors needed!
    container: `{ display: inline-flex; gap: 0.5rem; padding: 1rem; border: 2px solid #007bff; border-radius: 6px; align-items: center; background: white; }`,
    counterButton: `{ padding: 0.5rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; min-width: 2rem; font-weight: bold; }`,
    counterButtonHover: `{ background: #0056b3; }`, // → .counter-button-hover
    display: `{ font-size: 1.5rem; min-width: 3rem; text-align: center; font-weight: bold; color: #007bff; }`
  },
  render: ({
    initialCount = number(0),
    step = number(1)
  }, api, classes) => (
    <div class={classes!.container} data-count={initialCount}>
      <button
        class={classes!.counterButton}
        onclick={updateParentCounter(`.${classes!.container}`, `.${classes!.display}`, -step)}
      >
        -{step}
      </button>
      <span class={classes!.display}>{initialCount}</span>
      <button
        class={classes!.counterButton}
        onclick={updateParentCounter(`.${classes!.container}`, `.${classes!.display}`, step)}
      >
        +{step}
      </button>
      <button
        class={classes!.counterButton}
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

### ✅ Todo Item - HTMX + Function-Style Props

```tsx
import { defineComponent, h, string, boolean } from "./src/index.ts";
import { patch, del } from "./src/index.ts";
import { syncCheckboxToClass } from "./examples/dom-actions.ts";

defineComponent("todo-item", {
  api: {
    toggle: patch("/api/todos/:id/toggle", async (req, params) => {
      const form = await req.formData();
      const isDone = form.get("done") === "true";
      return new Response(
        renderComponent("todo-item", {
          id: params.id,
          text: "Task updated!",
          done: !isDone,
        })
      );
    }),
    remove: del("/api/todos/:id", () => new Response(null, { status: 200 }))
  },
  styles: {
    // ✨ CSS-only format for todo items!
    item: `{ display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 0.5rem; background: white; transition: background-color 0.2s; }`,
    itemDone: `{ background: #f8f9fa; opacity: 0.8; }`,
    checkbox: `{ margin-right: 0.5rem; }`,
    text: `{ flex: 1; font-size: 1rem; }`,
    textDone: `{ text-decoration: line-through; color: #6c757d; }`,
    deleteBtn: `{ background: #dc3545; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; line-height: 1; }`
  },
  render: ({
    id = string("1"),
    text = string("Todo item"),
    done = boolean(false)
  }, api, classes) => {
    const itemClass = `${classes!.item} ${done ? classes!.itemDone : ""}`;
    const textClass = `${classes!.text} ${done ? classes!.textDone : ""}`;
    
    return (
      <div class={itemClass} data-id={id}>
        <input
          type="checkbox"
          class={classes!.checkbox}
          checked={done}
          onChange={syncCheckboxToClass(classes!.itemDone)}
          {...api.toggle(id)}
        />
        <span class={textClass}>{text}</span>
        <button type="button" class={classes!.deleteBtn} {...api.remove(id)}>×</button>
      </div>
    );
  }
});
```

### 🔧 JSON in, HTML out (standard)

We standardize on JSON requests and HTML responses. The Unified API helpers:
- add `hx-ext="json-enc"` and `hx-encoding="json"`
- set `hx-headers` with `Accept: text/html` and `X-Requested-With: XMLHttpRequest`
- accept a payload object that becomes the JSON body (via `hx-vals`)

Client (payload as object):

```tsx
<button {...api.toggleLike(id, { liked: !liked, note: "from-card" })}>Toggle</button>
```

Server (parse JSON; return HTML with content-type):

```tsx
export const toggleLike = patch("/api/items/:id/like", async (req, params) => {
  const body = await req.json() as { liked?: boolean; note?: string };
  return new Response(
    renderComponent("like-card", {
      id: params.id,
      title: body.note ? `Note: ${body.note}` : "Item updated!",
      liked: !!body.liked,
    }),
    { headers: { "content-type": "text/html; charset=utf-8" } },
  );
});
```

Per-request headers (e.g., CSRF) are merged in server-side; you can also pass overrides per call:

```tsx
<button {...api.toggleLike(id, { liked: true }, { headers: { "X-CSRF-Token": token }, target: "closest .card" })}>
  Like
</button>
```

**Hybrid State Management:**
- ✅ **Local UI state**: Checkbox syncs to CSS class instantly
- ✅ **Server persistence**: HTMX handles data updates  
- ✅ **Function-style props**: Zero duplication
- ✅ **Auto-generated classes**: From CSS-only format

## 🔧 defineComponent API Reference

### Function-Style Props (NEW!)

The most ergonomic way to define props - zero duplication between props and render parameters:

```tsx
defineComponent("my-component", {
  // ✨ No props definition needed!
  render: ({ 
    title = string("Default Title"),      // Required string with default
    count = number(0),                   // Required number with default  
    enabled = boolean(true),             // Required boolean with default
    items = array([]),                   // Required array with default
    config = object({ theme: "light" }) // Required object with default
  }) => (
    <div>Component content using {title}, {count}, etc.</div>
  )
});

// Smart type helpers:
string(defaultValue?)   // Auto-parses string attributes
number(defaultValue?)   // Auto-parses to numbers  
boolean(defaultValue?)  // Presence-based (attribute exists = true)
array(defaultValue?)    // Parses JSON strings to arrays
object(defaultValue?)   // Parses JSON strings to objects
```

### CSS-Only Format (NEW!)

Just write CSS properties - class names auto-generated:

```tsx
styles: {
  // ✨ New CSS-only format
  container: `{ display: flex; gap: 1rem; }`,           // → .container
  buttonPrimary: `{ background: blue; color: white; }`, // → .button-primary  
  textLarge: `{ font-size: 1.5rem; font-weight: bold; }` // → .text-large
}

// Also supports traditional format:
styles: {
  button: `.my-btn { background: blue; }`,  // Traditional selector format
  hover: `.my-btn:hover { background: darkblue; }` 
}
```

### Legacy Props System

Still supported for complex cases:

```tsx
// Transformer function approach
props: (attrs) => ({
  id: attrs.id,
  count: parseInt(attrs.count || "0"),
  active: "active" in attrs
})

// Enhanced object syntax  
props: {
  title: "string",                          // Required string
  count: { type: "number", default: 0 },   // Optional with default
  active: { type: "boolean", default: true }
}
```

### Unified API System

Define server endpoints once - HTMX attributes generated automatically:

```tsx
api: {
  toggle: patch("/api/todos/:id/toggle", async (req, params) => {
    // Handler implementation
    return new Response(updatedHTML);
  }),
  remove: del("/api/todos/:id", () => new Response(null, { status: 200 }))
}

// Usage in render function:
render: ({ id }, api, classes) => (
  <div>
    <button {...api.toggle(id)}>Toggle</button>  // → hx-patch="/api/todos/123/toggle"
    <button {...api.remove(id)}>Delete</button>  // → hx-delete="/api/todos/123"  
  </div>
)
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
- `props`: Fully typed props object (auto-inferred from function-style props)
- `api`: Auto-generated HTMX client functions (optional)
- `classes`: Class name mappings (optional, auto-generated from CSS-only format)

## 🎮 DOM Helpers

**Core helpers shipped by the library:**

### Class Manipulation

```tsx
toggleClass("active");                    // Toggle single class
toggleClasses(["open", "visible"]);      // Toggle multiple classes
```

### Template Utilities

```tsx
conditionalClass(isOpen, "open", "closed"); // Conditional CSS classes
spreadAttrs({ "hx-get": "/api/data" });     // Spread HTMX attributes
dataAttrs({ userId: 123, role: "admin" }); // Generate data-* attributes
```

### Smart Type Helpers (NEW!)

```tsx
// Available for function-style props:
string(defaultValue?)   // "hello" → "hello", undefined → defaultValue
number(defaultValue?)   // "42" → 42, "invalid" → throws, undefined → defaultValue  
boolean(defaultValue?)  // presence-based: attribute exists = true
array(defaultValue?)    // '["a","b"]' → ["a","b"], undefined → defaultValue
object(defaultValue?)   // '{"x":1}' → {x:1}, undefined → defaultValue
```

### Example-only Helpers

Small, copyable helpers in `examples/dom-actions.ts` for common UI patterns:

```tsx
updateParentCounter(".container", ".display", 5); // Increment by 5
resetCounter(".display", 0, ".container");        // Reset to initial value
toggleParentClass("expanded");                     // Toggle class on parent
syncCheckboxToClass("completed");                 // Checkbox state → CSS class
activateTab(".tabs", ".tab-btn", ".content", "active"); // Tab activation
```

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

// ❌ Props + parameter duplication
interface Props {
  title: string;
  count: number;
  active: boolean;
}
const MyComponent = ({ title, count, active }: Props) => {
  // Duplication: Props interface + function parameters
}

// ❌ State synchronization bugs
// ❌ Prop drilling  
// ❌ Large bundle sizes
// ❌ Hydration mismatches
```

### funcwc Solution:

```tsx
// ✅ DOM is the state - no synchronization needed!
defineComponent("my-widget", {
  styles: {
    // ✨ CSS-only format - no duplication!
    container: `{ display: flex; gap: 1rem; }`,
    button: `{ background: blue; color: white; }`
  },
  render: ({
    // ✨ Function-style props - no duplication!
    title = string("My Widget"),
    count = number(0),
    active = boolean(false)
  }, api, classes) => (
    <div class={`${classes!.container} ${active ? "active" : ""}`} data-count={count}>
      <span>{title}: {count}</span>
      <button class={classes!.button} onclick={toggleClass("active")}>Toggle</button>
    </div>
  )
});

// ✅ Zero runtime JavaScript
// ✅ Perfect SSR  
// ✅ No hydration issues
// ✅ Instant debugging (inspect DOM)
// ✅ No duplication anywhere!
```

## 🚀 Performance Benefits

- **🏃‍♂️ Faster**: No client-side state management overhead
- **📦 Smaller**: Zero runtime dependencies, minimal JavaScript
- **🔧 Simpler**: DOM inspector shows all state
- **⚡ Instant**: Direct DOM manipulation, no virtual DOM
- **🎯 Reliable**: No state synchronization bugs
- **✨ Ergonomic**: Function-style props + CSS-only format = maximum productivity

## 🎨 Evolution Summary

funcwc has evolved through three major ergonomic improvements:

1. **🔧 defineComponent API**: Clean object-based configuration (vs complex pipeline)
2. **🎨 CSS-Only Format**: Auto-generated class names from CSS properties  
3. **✨ Function-Style Props**: Zero duplication between props and render parameters

The result? **The most ergonomic component library ever built** - minimal syntax, maximum power, zero runtime overhead.

---

**Built with ❤️ for the modern web. Deno + TypeScript + DOM-native state management + Revolutionary ergonomics.**

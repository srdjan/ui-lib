# funcwc - DOM-Native SSR Components

[![Deno](https://img.shields.io/badge/deno-2.0+-black?logo=deno&logoColor=white)](https://deno.land/)
[![TypeScript](https://img.shields.io/badge/typescript-5.0+-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**Ultra-lightweight, type-safe SSR components with DOM-native state management
and hybrid reactivity.**

Built for Deno + TypeScript with an SSR-first approach using HTMX, funcwc takes
a revolutionary approach to state management: **the DOM _is_ the state**. No
JavaScript state objects, no synchronization overhead, just pure DOM
manipulation with the most ergonomic developer experience ever created.

## 📚 Documentation

- Developer Guide (idiomatic usage): docs/dev-guide.md
- Authoring Components: docs/AUTHORING.md
- Unified API (HTMX integration): docs/UNIFIED-API.md

## 🌟 What Makes funcwc Special?

- **🎯 DOM-Native Philosophy**: Your component state lives where it belongs - in
  the DOM
- **⚡ Hybrid Reactivity**: Three-tier system covering every reactivity need
- **✨ Zero Duplication**: Function-style props eliminate boilerplate entirely
- **🎨 Auto-Generated Classes**: Just write CSS properties, get scoped class
  names
- **📦 Zero Runtime**: No client-side framework dependencies
- **🚀 Maximum Ergonomics**: The most productive component library ever built

State manager: For cross‑component state, inject the built‑in pub/sub script
into your pages. Use `injectStateManager()` (exported from `src/index.ts`) to
embed the script and expose `window.funcwcState`. In development, the examples
dev server auto‑injects the state manager and bridges `window.StateManager` →
`window.funcwcState` for compatibility.

## Ergonomics

### ✨ Function-Style Props (Zero Duplication!)

Define props directly in render function parameters - no more duplication
between props definition and function parameters!

```tsx
// ✅ Function-style props - zero duplication!
defineComponent("smart-counter", {
  render: ({
    initialCount = number(0), // Auto-parsed from HTML attributes
    step = number(1), // Default values built-in
    label = string("Counter"), // Type-safe with smart helpers
  }) => (
    <div data-count={initialCount}>
      {label}: {initialCount}
      <button onclick="/* DOM action */">+{step}</button>
    </div>
  ),
});
```

### 🎨 CSS-Only Format (Auto-Generated Classes!)

Just write CSS properties - class names auto-generated! No selectors, no
duplication, pure magic!

```tsx
defineComponent("beautiful-card", {
  styles: {
    // ✨ Just CSS properties - class names auto-generated!
    card: `{ border: 2px solid #ddd; border-radius: 8px; padding: 1.5rem; }`,
    title: `{ font-size: 1.25rem; font-weight: bold; color: #333; }`,
    buttonPrimary:
      `{ background: #007bff; color: white; padding: 0.5rem 1rem; }`,
    // Auto-generates: .card, .title, .button-primary
  },
  render: (props, api, classes) => (
    <div class={classes!.card}>
      <h3 class={classes!.title}>Amazing!</h3>
      <button class={classes!.buttonPrimary}>Click me</button>
    </div>
  ),
});
```

## ✨ Key Features

- **🎯 DOM-Native State**: Component state lives in CSS classes, data
  attributes, and element content
- **⚡ Hybrid Reactivity**: Revolutionary three-tier system (CSS Properties,
  Pub/Sub State, DOM Events)
- **🚀 Function-Style Props**: Zero duplication between props and render
  parameters
- **🎨 CSS-Only Format**: Auto-generated class names from CSS properties
- **⚡ Type-Safe**: Full TypeScript inference with smart type helpers
- **🔄 HTMX Ready**: Built-in server actions for dynamic updates
- **📦 Zero Runtime**: No client-side framework dependencies
- **🎭 SSR-First**: Render on server, send optimized HTML
- **🧾 JSON Requests, HTML Responses**: Standardized JSON-encoded htmx requests;
  server returns HTML snippets for swapping

## ⚡ Hybrid Reactivity System

funcwc features a revolutionary **three-tier hybrid reactivity system** that
enables powerful component communication while maintaining the DOM-native
philosophy. Each tier is optimized for different use cases and performance
characteristics:

### 🎨 Tier 1: CSS Property Reactivity

**Use Case**: Visual state coordination, theming, styling changes\
**Mechanism**: CSS custom properties as reactive state\
**Performance**: Instant updates via CSS engine, zero JavaScript overhead

```tsx
// Theme controller updates CSS properties
<button onclick="document.documentElement.style.setProperty('--theme-mode', 'dark')">
  Switch to Dark Theme
</button>;

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

### 📡 Tier 2: Pub/Sub State Manager

**Use Case**: Complex application state, shopping carts, user data\
**Mechanism**: JavaScript state manager with topic-based subscriptions\
**Performance**: Efficient subscription model with automatic cleanup

```tsx
// Publisher - shopping cart updates
window.funcwc.publishState("cart", {
  count: items.length,
  total: calculateTotal(items),
});

// Subscriber - cart badge automatically updates
window.funcwc.subscribeToState("cart", function (cartData) {
  badge.querySelector(".count").textContent = cartData.count;
  badge.querySelector(".total").textContent = "$" + cartData.total.toFixed(2);
});
```

### 🔔 Tier 3: DOM Event Communication

**Use Case**: Component-to-component messaging, modals, notifications\
**Mechanism**: Custom DOM events with structured payloads\
**Performance**: Native browser event system with event bubbling

```tsx
// Event dispatcher - notification trigger
<button onclick="
  document.dispatchEvent(new CustomEvent('funcwc:show-notification', {
    bubbles: true,
    detail: { type: 'success', message: 'Operation completed!' }
  }))
">
  Show Notification
</button>;

// Event listener - notification display
document.addEventListener("funcwc:show-notification", (event) => {
  showNotification(event.detail.type, event.detail.message);
});
```

**Why Three Tiers?**

- **CSS Properties**: Best for visual coordination (themes, colors, sizing)
- **Pub/Sub State**: Best for business logic state (cart, user data, app state)
- **DOM Events**: Best for UI interactions (modals, notifications, component
  messages)

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

- **🎉 Basic Components**: Function-style props + CSS-only format demonstration
- **⚡ Hybrid Reactivity**: Complete three-tier reactivity system showcase:
  - **🎨 CSS Properties**: Instant theme switching with zero JavaScript overhead
  - **📡 Pub/Sub State**: Shopping cart with cross-component state
    synchronization
  - **🔔 DOM Events**: Notification system with component-to-component messaging

### Global HTMX setup (JSON requests)

Add the json-enc extension and configure JSON encoding at the page level.
Responses remain HTML and are swapped by htmx.

```html
<head>
  <script src="https://unpkg.com/htmx.org@2.0.6"></script>
  <script src="https://unpkg.com/htmx.org/dist/ext/json-enc.js"></script>
</head>
<body hx-ext="json-enc" hx-encoding="json">
  <!-- your markup -->
</body>
```

## 🧩 Demo Architecture

- Server: `examples/server.ts` serves the demo with `Deno.serve`, imports
  `examples/main.ts` to register all components and API routes, and renders
  `examples/index.html` by replacing custom tags with server-rendered HTML via
  `renderComponent`.
- Routing: Component `api` handlers register with an internal router; requests
  hit those handlers first and return HTML snippets.
- HTMX: `examples/index.html` loads HTMX and `json-enc`; the `<body>` has
  `hx-ext="json-enc"` and `hx-encoding="json"` so requests send JSON.
- Headers: Generated HTMX attributes include `Accept: text/html; charset=utf-8`
  and `X-Requested-With: XMLHttpRequest`. The server injects an `X-CSRF-Token`
  per request using `runWithRequestHeaders`.
- Swap/target: Non-GET actions default to `hx-swap="outerHTML"` and target the
  closest component container (via `data-component`), configurable per call via
  the generated client helpers.
- Scoping: Components automatically inject `data-component="<name>"` on the root
  element to enable sensible defaults and safe selectors.
- Files: Components live in `examples/*.tsx` and are imported by
  `examples/main.ts`.

Request flow

1. Browser triggers HTMX action (JSON body) → 2) Server handler processes and
   renders HTML with `renderComponent` → 3) Response returns `text/html` → 4)
   HTMX swaps HTML into the page.

## 📋 Complete Examples

### Function-Style Props

```tsx
import { boolean, defineComponent, h, number, string } from "./src/index.ts";

// ✨ NO props definition needed - extracted from render function!
defineComponent("smart-card", {
  styles: {
    // 🎨 CSS-only format - class names auto-generated!
    card:
      `{ border: 2px solid #e9ecef; border-radius: 8px; padding: 1.5rem; background: white; }`,
    title: `{ font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem; }`,
    highlight: `{ border-color: #007bff; background: #f8f9ff; }`,
  },
  render: (
    {
      title = string("Amazing Card"), // Smart type helpers with defaults
      count = number(42), // Auto-parsed from HTML attributes
      highlighted = boolean(false), // Type-safe boolean handling
    },
    api,
    classes,
  ) => (
    <div class={`${classes!.card} ${highlighted ? classes!.highlight : ""}`}>
      <h3 class={classes!.title}>{title}</h3>
      <p>Count: {count}</p>
      <p>Highlighted: {highlighted ? "Yes" : "No"}</p>
    </div>
  ),
});

// Usage in HTML:
// <smart-card title="Hello World" count="100" highlighted></smart-card>
```

Benefits

- ✅ **Zero Duplication**: Props defined once in function signature
- ✅ **Auto-Generated Classes**: `.card`, `.title`, `.highlight` from CSS keys
- ✅ **Smart Type Helpers**: `string()`, `number()`, `boolean()` with defaults
- ✅ **Great TypeScript DX**: For strict typing inside render, add an inline
  cast to each default and annotate the parameter type:

  ```tsx
  render: ({
    title = string("Hello") as unknown as string,
    count = number(0) as unknown as number,
    enabled = boolean(false) as unknown as boolean,
  }: { title: string; count: number; enabled: boolean }) => /* ... */
  ```

### 🔢 Counter - API Updates (JSON in, HTML out)

```tsx
import {
  defineComponent,
  h,
  number,
  patch,
  renderComponent,
} from "./src/index.ts";

defineComponent("counter", {
  styles: {
    // ✨ CSS-only format - no selectors needed!
    container:
      `{ display: inline-flex; gap: 0.5rem; padding: 1rem; border: 2px solid #007bff; border-radius: 6px; align-items: center; background: white; }`,
    counterButton:
      `{ padding: 0.5rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; min-width: 2rem; font-weight: bold; }`,
    counterButtonHover: `{ background: #0056b3; }`, // → .counter-button-hover
    display:
      `{ font-size: 1.5rem; min-width: 3rem; text-align: center; font-weight: bold; color: #007bff; }`,
  },
  render: ({ initialCount = number(0), step = number(1) }, api, classes) => (
    <div class={classes!.container} data-count={initialCount}>
      <button
        class={classes!.counterButton}
        {...api.adjust({ current: initialCount, delta: -step, step }, {
          target: `closest .${classes!.container}`,
        })}
      >
        -{step}
      </button>
      <span class={classes!.display}>{initialCount}</span>
      <button
        class={classes!.counterButton}
        {...api.adjust({ current: initialCount, delta: step, step }, {
          target: `closest .${classes!.container}`,
        })}
      >
        +{step}
      </button>
      <button
        class={classes!.counterButton}
        {...api.adjust({ value: 0, step }, {
          target: `closest .${classes!.container}`,
        })}
      >
        Reset
      </button>
    </div>
  ),
});
```

### 🛒 Cart Item — Server Actions (JSON in, HTML out)

```tsx
import {
  defineComponent,
  del,
  h,
  number,
  patch,
  post,
  renderComponent,
  string,
} from "./src/index.ts";

defineComponent("cart-item", {
  api: {
    updateQuantity: patch(
      "/api/cart/:productId/quantity",
      async (req, params) => {
        const body = await req.json() as { quantity?: number };
        const newQuantity = Number(body.quantity ?? 0);
        // Update cart in database/session …
        return new Response(
          renderComponent("cart-item", {
            productId: params.productId,
            name: "Product", // ← load from DB
            quantity: newQuantity,
            price: 19.99, // ← load from DB
          }),
          { headers: { "content-type": "text/html; charset=utf-8" } },
        );
      },
    ),
    remove: del(
      "/api/cart/:productId",
      async () => new Response("", { status: 200 }),
    ),
    favorite: post(
      "/api/cart/:productId/favorite",
      async (req, params) =>
        new Response(
          renderComponent("cart-item", {
            productId: params.productId,
            name: "Product",
            quantity: 1,
            price: 19.99,
          }),
          { headers: { "content-type": "text/html; charset=utf-8" } },
        ),
    ),
  },
  render: (
    {
      productId = string("1"),
      name = string("Product"),
      quantity = number(1),
      price = number(0),
    },
    api,
  ) => (
    <div class="cart-item" data-product-id={productId}>
      <h3>{name}</h3>
      <div class="quantity-controls">
        <input
          type="number"
          name="quantity"
          value={quantity}
          hx-trigger="change"
          {...api.updateQuantity(productId, {}, {
            target: "closest .cart-item",
          })}
        />
      </div>
      <div class="price">${price}</div>
      <div class="actions">
        <button {...api.favorite(productId)}>❤️ Favorite</button>
        <button {...api.remove(productId)}>🗑️ Remove</button>
      </div>
    </div>
  ),
});
```

### 📑 Tabs — API-loaded Content

```tsx
import { defineComponent, escape, get, h, string } from "./src/index.ts";

defineComponent("tabs", {
  api: {
    load: get("/api/tabs/:tab", (_req, params) => {
      const safe = escape(params.tab ?? "Home");
      const html =
        `<div><h3>${safe} Content</h3><p>This is the content for the ${safe} tab.</p></div>`;
      return new Response(html, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }),
  },
  styles: {/* … */},
  render: (
    { tabs = string("Home,About,Settings"), activeTab = string("Home") },
    api,
    classes,
  ) => {
    const tabList = tabs.split(",").map((t) => t.trim());
    const active = activeTab || tabList[0];
    return (
      <div class={classes!.container}>
        <div class={classes!.nav}>
          {tabList.map((tab) => (
            <button
              class={`${classes!.button} ${
                tab === active ? classes!.buttonActive : ""
              }`}
              hx-on={`click: const C=this.closest('.${
                classes!.container
              }');if(!C)return;C.querySelectorAll('.${
                classes!.button
              }').forEach(b=>b.classList.remove('${
                classes!.buttonActive
              }'));this.classList.add('${classes!.buttonActive}')`}
              {...api.load(tab, {
                target: `closest .${classes!.content}`,
                swap: "innerHTML",
              })}
            >
              {tab}
            </button>
          ))}
        </div>
        <div class={classes!.content}>
          <h3>{active} Content</h3>
          <p>This is the content for the {active} tab.</p>
        </div>
      </div>
    );
  },
});
```

**DOM State in Action:**

- Counter value stored in `data-count` attribute
- Display synced with element `.textContent`
- No JavaScript variables to manage!

### ✅ Todo Item - HTMX + Function-Style Props (JSON in, HTML out)

```tsx
import {
  boolean,
  defineComponent,
  del,
  h,
  patch,
  renderComponent,
  string,
} from "./src/index.ts";

defineComponent("todo-item", {
  api: {
    toggle: patch("/api/todos/:id/toggle", async (req, params) => {
      const body = await req.json() as { done?: boolean };
      const isDone = !!body.done;
      return new Response(
        renderComponent("todo-item", {
          id: params.id,
          text: "Task updated!",
          done: !isDone,
        }),
        { headers: { "content-type": "text/html; charset=utf-8" } },
      );
    }),
    remove: del("/api/todos/:id", () => new Response(null, { status: 200 })),
  },
  styles: {
    // ✨ CSS-only format for todo items!
    item:
      `{ display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 0.5rem; background: white; transition: background-color 0.2s; }`,
    itemDone: `{ background: #f8f9fa; opacity: 0.8; }`,
    checkbox: `{ margin-right: 0.5rem; }`,
    text: `{ flex: 1; font-size: 1rem; }`,
    textDone: `{ text-decoration: line-through; color: #6c757d; }`,
    deleteBtn:
      `{ background: #dc3545; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; line-height: 1; }`,
  },
  render: (
    { id = string("1"), text = string("Todo item"), done = boolean(false) },
    api,
    classes,
  ) => {
    const itemClass = `${classes!.item} ${done ? classes!.itemDone : ""}`;
    const textClass = `${classes!.text} ${done ? classes!.textDone : ""}`;

    return (
      <div class={itemClass} data-id={id}>
        <input
          type="checkbox"
          class={classes!.checkbox}
          checked={done}
          {...api.toggle(id, { done: !done })}
        />
        <span class={textClass}>{text}</span>
        <button type="button" class={classes!.deleteBtn} {...api.remove(id)}>
          ×
        </button>
      </div>
    );
  },
});
```

### 🔧 JSON in, HTML out (standard)

We standardize on JSON requests and HTML responses. The Unified API helpers:

- add `hx-ext="json-enc"` and `hx-encoding="json"`
- set `hx-headers` with `Accept: text/html` and
  `X-Requested-With: XMLHttpRequest`
- accept a payload object that becomes the JSON body (via `hx-vals`)

Client (payload as object):

```tsx
<button {...api.toggleLike(id, { liked: !liked, note: "from-card" })}>
  Toggle
</button>;
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

Per-request headers (e.g., CSRF) are merged in server-side; you can also pass
overrides per call:

```tsx
<button
  {...api.toggleLike(id, { liked: true }, {
    headers: { "X-CSRF-Token": token },
    target: "closest .card",
  })}
>
  Like
</button>;
```

**Hybrid State Management:**

- ✅ **Local UI state**: Checkbox syncs to CSS class instantly
- ✅ **Server persistence**: HTMX handles data updates
- ✅ **Function-style props**: Zero duplication
- ✅ **Auto-generated classes**: From CSS-only format

## 🔧 defineComponent API Reference

### Function-Style Props

The most ergonomic way to define props - zero duplication between props and
render parameters:

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

### CSS-Only Format

Just write CSS properties - class names auto-generated:

```tsx
styles: {
  // ✨ New CSS-only format
  container: `{ display: flex; gap: 1rem; }`,           // → .container
  buttonPrimary: `{ background: blue; color: white; }`, // → .button-primary  
  textLarge: `{ font-size: 1.5rem; font-weight: bold; }` // → .text-large
}

// CSS-only format is the default and recommended approach.
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
render: ((props, api, classes) => (
  <div class={classes?.container}>
    <button {...(api?.action?.(props.id) || {})}>Click me</button>
  </div>
));
```

**Parameters:**

- `props`: Fully typed props object (auto-inferred from function-style props)
- `api`: Auto-generated HTMX client functions (optional)
- `classes`: Class name mappings (optional, auto-generated from CSS-only format)

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

### Smart Type Helpers

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
resetCounter(".display", 0, ".container"); // Reset to initial value
toggleParentClass("expanded"); // Toggle class on parent
syncCheckboxToClass("completed"); // Checkbox state → CSS class
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

## 🚀 Performance Benefits

- **🏃‍♂️ Faster**: No client-side state management overhead
- **📦 Smaller**: Zero runtime dependencies, minimal JavaScript
- **🔧 Simpler**: DOM inspector shows all state
- **⚡ Instant**: Direct DOM manipulation, no virtual DOM
- **🎯 Reliable**: No state synchronization bugs
- **✨ Ergonomic**: Function-style props + CSS-only format = maximum
  productivity

## Summary

- **🔧 defineComponent API**: Clean object-based configuration.
- **🎨 CSS-Only Format**: Auto-generated class names from CSS property blocks.
- **✨ Function-Style Props**: Props inferred from render parameters and
  defaults.

These pieces combine for an ergonomic, zero-runtime SSR component model with
HTMX JSON requests and HTML responses.

---

**Built with ❤️ for the modern web. Deno + TypeScript + DOM-native state
management + Revolutionary ergonomics.**

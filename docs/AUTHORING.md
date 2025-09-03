# Component Authoring with TSX (Custom JSX Runtime)

This project uses a custom JSX runtime for components so you can author views in
TSX while keeping zero client-side dependencies and SSR-first output.

## Authoring Overview

ui-lib focuses on a clean authoring model that eliminates duplication:

1. **🔧 defineComponent API**: Clean object-based configuration
2. **🎨 CSS-Only Format**: Auto-generated class names from CSS properties
3. **✨ Function-Style Props**: Zero duplication between props and render
   parameters

### Unified Component API

- Use `defineComponent()` for all components.
- Prefer function‑style props declared directly in the `render` parameter using
  `string()`, `number()`, `boolean()`, etc. This keeps props, defaults and types
  in one place and lets the library auto‑generate the parser.
- Advanced cases may still provide a `props` transformer, but function‑style is
  the recommended default.

### ✨ Function-Style Props (Zero Duplication!)

The most ergonomic way to define props - no more duplication between props
definition and render function parameters:

```tsx
import { boolean, defineComponent, h, number, string } from "../src/index.ts";

// ✨ NO props definition needed - extracted from render function!
defineComponent("smart-card", {
  styles: {
    // 🎨 CSS-only format - class names auto-generated!
    card:
      `{ border: 2px solid #e9ecef; border-radius: 8px; padding: 1.5rem; background: white; }`,
    title: `{ font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem; }`,
    highlight: `{ border-color: #007bff !important; background: #f8f9ff; }`,
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

#### Typing function‑style props in TypeScript

The helper calls like `string()`, `number()`, and `boolean()` deliberately
return PropHelper objects so the library can auto‑generate a typed props
transformer by inspecting your render function defaults. TypeScript, however,
does not know that these will be converted into primitive values at runtime.

Option A — inline casts (simple): Add a cast on each default and annotate the
parameter type:

```tsx
defineComponent("typed-card", {
  styles: { container: `{ padding: 1rem; }` },
  render: (
    {
      title = string("Hello") as unknown as string,
      count = number(0) as unknown as number,
      enabled = boolean(false) as unknown as boolean,
    }: { title: string; count: number; enabled: boolean },
    _api,
    classes,
  ) => (
    <div class={classes!.container}>
      <h3>{title}</h3>
      <p>Count: {count}</p>
      <p>Enabled: {enabled ? "Yes" : "No"}</p>
    </div>
  ),
});
```

Option B — UnwrapHelpers + defaults object (recommended): Use a single defaults
object and the `UnwrapHelpers<T>` utility type exported by the library. Cleaner,
no per‑field casts, still auto‑generates the schema.

```tsx
import { boolean, number, string } from "../src/index.ts";
import type { UnwrapHelpers } from "../src/index.ts";

defineComponent("typed-card", {
  styles: { container: `{ padding: 1rem; }` },
  render: (
    props: UnwrapHelpers<
      {
        title: ReturnType<typeof string>;
        count: ReturnType<typeof number>;
        enabled: ReturnType<typeof boolean>;
      }
    > = (
      {
        title: string("Hello"),
        count: number(0),
        enabled: boolean(false),
      } as unknown as UnwrapHelpers<{
        title: ReturnType<typeof string>;
        count: ReturnType<typeof number>;
        enabled: ReturnType<typeof boolean>;
      }>
    ),
    _api,
    classes,
  ) => (
    <div class={classes!.container}>
      <h3>{props.title}</h3>
      <p>Count: {props.count}</p>
      <p>Enabled: {props.enabled ? "Yes" : "No"}</p>
    </div>
  ),
});
```

Why this works:

- The defaults remain helper calls, so the library can parse them and build the
  prop schema (validation, defaults, type info).
- With UnwrapHelpers, TypeScript sees primitives inside render, without
  per‑field casts.
- Defaults are the single source of truth and stay close to the render.

### 🎨 CSS-Only Format (Auto-Generated Classes!)

Just write CSS properties - class names auto-generated! No selectors, no
duplication:

```tsx
defineComponent("beautiful-button", {
  styles: {
    // ✨ Object-form supported (preferred)
    button: {
      padding: "0.5rem 1rem",
      background: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    buttonHover: { background: "#0056b3" }, // → .button-hover
    buttonActive: { transform: "translateY(1px)" }, // → .button-active
  },
  render: (
    { text = string("Click me"), disabled = boolean(false) },
    _api,
    c,
  ) => (
    <button
      class={`${c!.button} hover:${c!.buttonHover} active:${c!.buttonActive}`}
      disabled={disabled}
    >
      {text}
    </button>
  ),
});
```

## Key Ideas

- **The DOM is the state**: Use classes, attributes, and text for UI state
- **Function-style props**: Props defined directly in render function signature
- **CSS-only format**: Auto-generated class names from CSS properties
- **Smart type helpers**: `string()`, `number()`, `boolean()`, `array()`,
  `object()`
- **Event handlers**: Return inline handler strings for direct DOM manipulation
- **Server interactions**: Defined via `api` that automatically generates HTMX
  attributes. For non‑GET requests, defaults include `hx-swap="outerHTML"` and
  `hx-target="closest [data-component]"`.
- **Automatic scoping**: The root element always includes
  `data-component="<name>"`. This enables the default target, simplifies
  selectors, and keeps behaviors scoped to a component instance.
- **Styles guidance**: Prefer unified `styles` objects (auto class generation).
  `classes` remains optional and merges last for overrides, but is generally not
  needed.

### Tokens & Utilities

- Tokens-first: Prefer Open Props tokens in `styles`:
  - Surfaces: `var(--surface-1)`, borders: `var(--surface-3)`, shadows:
    `var(--shadow-2)`.
  - Typography: `var(--text-1)` for main text, `var(--text-muted)` for
    secondary.
  - Spacing/radius: `var(--size-*)`, `var(--radius-*)`, borders:
    `var(--border-size-*)`.
  - Brand: use `var(--brand)` and `var(--brand-contrast)` (see
    `examples/assets/tokens.css`).
- Utilities-over-custom: Compose layout/spacing with small, readable classes:

```html
<div class="u-grid u-grid-auto-fit-250 u-gap-4 u-my-4">
  <div class="u-card u-p-3">
    <strong class="u-text-brand">Title</strong>
    <p class="u-mt-2 u-text-0 u-text-muted">Description text</p>
  </div>
</div>
```

- Buttons: Use Open Props UI buttons plus a small accent helper:

```html
<button class="btn btn-brand" type="button">Primary</button>
<button class="btn btn-success" type="button">Success</button>
```

- Example `styles` using tokens instead of hex:

```ts
styles: {
  card: `{ background: var(--surface-1); border: 1px solid var(--surface-3); border-radius: var(--radius-2); box-shadow: var(--shadow-2); }`,
  title: `{ color: var(--text-1); font-weight: var(--font-weight-7); }`,
  muted: `{ color: var(--text-muted); }`,
}
```

Dark mode:

- By default, Open Props `normalize` adapts surfaces/text to system preference.
- If you need an explicit toggle, add/remove the `dark` class on `<html>`; see
  `examples/assets/tokens.css` for overrides.

### Event Handlers

- JSX `onClick`, `onChange`, etc. are lower‑cased in output (e.g., `onclick`).
- Handlers accept either a code string or a `ComponentAction` (e.g., from
  `toggleClass()`), which renders to inline JS.
- Quotes in handler code are safely escaped as `&quot;` to produce valid HTML;
  the browser decodes these when parsing.

### Styles Input Options

| Format             | Example                                                            | Class Name Generation             | Use When                                         |
| ------------------ | ------------------------------------------------------------------ | --------------------------------- | ------------------------------------------------ |
| Object (preferred) | `styles: { button: { padding: '0.5rem', borderRadius: '6px' } }`   | Key → kebab: `button` → `.button` | Most cases; typeable, lintable, easy to refactor |
| Brace string       | ``styles: { button: `{ padding: 0.5rem; border-radius: 6px; }` }`` | Key → kebab: `button` → `.button` | Quick copy/paste of CSS declarations             |
| Selector string    | ``styles: { custom: `.card > .title { font-weight: 700; }` }``     | First selector’s class            | Complex selectors, combinators, pseudo-classes   |

- Deduplication: Component CSS is injected once per component type per response.
- Overrides: If you pass `classes`, it merges last and can replace generated
  class names.

Selector best practices

- Prefer single-class rules in object form for most component styling.
- Use selector strings for:
  - Combinators (e.g., `.btn .icon`, `.card > .title`)
  - Pseudo-classes/elements (e.g., `.btn:hover`, `.field:focus`,
    `.input::placeholder`)
  - Advanced scoping where a generated single class is insufficient
- Keep media queries in strings for now; object-form styles serialize flat rule
  bodies.
- **JSON-in, HTML-out**: All htmx requests are JSON-encoded; server returns HTML
  for swapping

## Prerequisites

- Root `deno.json` sets `"jsx": "react"` and `"jsxFactory": "h"`
- Import `h` from `src/index.ts` in any TSX file

### Global htmx JSON setup

Include the json-enc extension and configure JSON encoding at the document
level. Responses remain HTML.

```html
<head>
  <script src="https://unpkg.com/htmx.org@2.0.6"></script>
  <script src="https://unpkg.com/htmx.org/dist/ext/json-enc.js"></script>
</head>
<body hx-ext="json-enc" hx-encoding="json">
  <!-- app -->
</body>
```

```tsx
// examples/foo.tsx
import { defineComponent, h } from "../src/index.ts";
```

## Component Structure Options

### 🚀 Modern Approach: Function-Style Props + CSS-Only

```tsx
import { boolean, defineComponent, h, number, string } from "../src/index.ts";

defineComponent("modern-card", {
  styles: {
    // ✨ CSS-only format - no selectors needed!
    container:
      `{ border: 1px solid #ddd; padding: 1rem; border-radius: 6px; background: white; }`,
    title:
      `{ font-size: 1.2rem; font-weight: bold; margin-bottom: 0.5rem; color: #333; }`,
    counter: `{ color: #666; font-size: 0.9rem; }`,
  },
  render: (
    {
      // ✨ Props auto-generated from function signature!
      title = string("Card Title"),
      count = number(0),
      highlighted = boolean(false),
    },
    api,
    classes,
  ) => (
    <div class={`${classes!.container} ${highlighted ? "highlight" : ""}`}>
      <h3 class={classes!.title}>{title}</h3>
      <span class={classes!.counter}>Count: {count}</span>
    </div>
  ),
});
```

### ⚛️ Reactive Block (Consolidated)

Configure events, state subscriptions, and lifecycle hooks in a single
`reactive` block. Setting `inject: false` (default) avoids auto-injection when
not needed.

```tsx
import { defineComponent, h, string } from "../src/index.ts";

// Badge that reflects cart state published via window.funcwcState
defineComponent("cart-badge", {
  styles: {
    badge:
      `{ display: inline-flex; gap: .5rem; padding: .5rem .75rem; border-radius: 9999px; background: #0ea5e9; color: white; font-weight: 600; }`,
    count:
      `{ background: white; color: #0ea5e9; border-radius: 9999px; min-width: 1.25rem; text-align: center; padding: 0 .4rem; }`,
  },
  reactive: {
    state: {
      cart: `
      const countEl = this.querySelector('.count');
      const totalEl = this.querySelector('.total');
      if (!countEl || !totalEl) return;
      const n = (value && value.count) || 0;
      const t = (value && value.total) || 0;
      countEl.textContent = String(n);
      totalEl.textContent = '$' + Number(t).toFixed(2);
    `,
    },
    mount: `
    // Initialize from current state when mounted
    const s = window.funcwcState?.getState('cart') || { count: 0, total: 0 };
    const countEl = this.querySelector('.count');
    const totalEl = this.querySelector('.total');
    if (countEl) countEl.textContent = String(s.count);
    if (totalEl) totalEl.textContent = '$' + Number(s.total).toFixed(2);
    `,
    inject: false,
  },
  render: ({ label = string("Cart") }) => (
    <div class="badge">
      <span>{label}</span>
      <span class="count">0</span>
      <span class="total">$0.00</span>
    </div>
  ),
});
```

Notes:

- `reactive.state` wires subscriptions on load via an aggregated `hx-on`.
- `reactive.mount` runs once on `htmx:load`; `reactive.unmount` uses a minimal
  MutationObserver for cleanup.
- `reactive.on` accepts an events map and is consolidated into a single `hx-on`.

## Smart Type Helpers

Available for function-style props:

```tsx
// Smart type helpers with automatic HTML attribute parsing:
string(defaultValue?)   // "hello" → "hello", undefined → defaultValue
number(defaultValue?)   // "42" → 42, "invalid" → throws, undefined → defaultValue  
boolean(defaultValue?)  // presence-based: attribute exists = true
array(defaultValue?)    // '["a","b"]' → ["a","b"], undefined → defaultValue
object(defaultValue?)   // '{"x":1}' → {x:1}, undefined → defaultValue

// Examples:
title = string("Default Title")        // Required string with fallback
count = number()                       // Required number, no fallback  
enabled = boolean(true)                // Optional boolean, defaults to true
items = array([])                      // Required array with empty fallback
config = object({ theme: "light" })    // Required object with fallback
```

## Styling Options

### 🎨 CSS-Only Format (Recommended)

```tsx
styles: {
  // ✨ Just CSS properties - class names auto-generated!
  container: `{ display: flex; gap: 1rem; align-items: center; }`,     // → .container
  buttonPrimary: `{ background: #007bff; color: white; padding: 0.5rem 1rem; }`, // → .button-primary
  textLarge: `{ font-size: 1.5rem; font-weight: bold; }`               // → .text-large
}
```

<!-- Traditional styling examples removed to emphasize CSS-only format. -->

## DOM-Native Events

Use helpers that return action objects or inline handler strings:

```tsx
import { chain, toggleClass, toggleClasses } from "../src/index.ts";

<button onClick={toggleClass("active")}>Toggle Single</button>
<button onClick={toggleClasses(["light", "dark"])}>Toggle Multiple</button>

// Compose actions or use inline handler strings for complex logic:
<button onClick={chain(toggleClass('a'), toggleClass('b'))}>Compose</button>
// or inline:
<button onClick={`
  const p = this.closest('.container');
  if (p) {
    const counter = p.querySelector('.count');
    counter.textContent = parseInt(counter.textContent) + 1;
  }
`}>
  Increment
</button>
```

### hx-on aggregator (multiple events)

When you need to attach multiple event handlers to the root, prefer the
aggregated form to avoid JSX parsing issues with colons in attribute names. Use
the `hxOn()` helper to compose a single `hx-on` string.

```tsx
import { defineComponent, h, hxOn, listensFor } from "../src/index.ts";

defineComponent("loader-box", {
  styles: {
    box: `{ padding: 1rem; border: 1px solid #ddd; border-radius: 8px; }`,
  },
  // Listen for a custom event (ui-lib:refresh) and initialize on htmx:load
  render: () => (
    <div
      class="box"
      hx-on={hxOn({
        "htmx:load":
          `this.textContent = 'Ready @ ' + new Date().toLocaleTimeString();`,
        "ui-lib:refresh":
          `this.textContent = 'Refreshed @ ' + new Date().toLocaleTimeString();`,
      })}
    >
      Loading...
    </div>
  ),
});

// Elsewhere, you can generate a listener attribute for custom events:
// listensFor('refresh', 'console.log("refresh received")')
```

### Example-only Helpers

Small, copyable helpers in `examples/dom-actions.ts`:

```tsx
import {
  activateTab,
  resetCounter,
  syncCheckboxToClass,
  toggleParentClass,
  updateParentCounter,
} from "../examples/dom-actions.ts";

// Counter manipulation
updateParentCounter(".container", ".display", 5); // Increment by 5
resetCounter(".display", 0, ".container"); // Reset to initial

// Class manipulation
toggleParentClass("expanded"); // Toggle on parent
syncCheckboxToClass("completed"); // Checkbox → CSS class

// Tab activation
activateTab(".tabs", ".tab-btn", ".content", "active"); // Complex tab logic
```

These are app-specific conveniences that live outside the core library to keep
it clean and framework-agnostic.

## Unified API System (HTMX Integration)

The `api` property is ui-lib's revolutionary unified API system that eliminates
duplication between server route definitions and client-side HTMX attributes.

### Function-Style Props + HTMX Example

```tsx
import {
  boolean,
  defineComponent,
  h,
  patch,
  remove,
  string,
} from "../src/index.ts";
import { syncCheckboxToClass } from "../examples/dom-actions.ts";

defineComponent("todo-item", {
  api: {
    // Define actual server handlers - client functions are auto-generated!
    toggle: patch("/api/todos/:id/toggle", async (req, params) => {
      const form = await req.formData();
      const isDone = form.get("done") === "true";
      return new Response(
        renderComponent("todo-item", {
          id: params.id,
          text: "Updated task!",
          done: !isDone,
        }),
      );
    }),
    remove: remove("/api/todos/:id", () => new Response(null, { status: 200 })),
  },
  styles: {
    // ✨ CSS-only format for todo items!
    item:
      `{ display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 0.5rem; background: white; }`,
    itemDone: `{ background: #f8f9fa; opacity: 0.8; }`,
    checkbox: `{ margin-right: 0.5rem; }`,
    text: `{ flex: 1; font-size: 1rem; }`,
    textDone: `{ text-decoration: line-through; color: #6c757d; }`,
    deleteBtn:
      `{ background: #dc3545; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; }`,
  },
  render: (
    {
      // ✨ Function-style props - no duplication!
      id = string("1"),
      text = string("Todo item"),
      done = boolean(false),
    },
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
          onChange={syncCheckboxToClass(classes!.itemDone)}
          {...api.toggle(id)}
        />{" "}
        // ✨ Auto-generated HTMX attributes!
        <span class={textClass}>{text}</span>
        <button type="button" class={classes!.deleteBtn} {...api.remove(id)}>
          ×
        </button>
      </div>
    );
  },
});
```

### How Unified API Works

1. **Define Routes**: Write actual HTTP handlers in `api` using standard Web API
   patterns
2. **Auto-Generation**: ui-lib analyzes your routes and creates client
   functions:
   - `patch("/api/todos/:id/toggle", handler)` → `api.toggle(id)`
   - `remove("/api/todos/:id", handler)` → `api.remove(id)`
3. **HTMX Attributes**: Client functions return proper `hx-*` attributes:
   - `api.toggle(id)` →
     `{ "hx-patch": "/api/todos/123/toggle", "hx-target": "closest .item" }`
   - `api.remove(id)` →
     `{ "hx-delete": "/api/todos/123", "hx-target": "closest .item", "hx-swap": "outerHTML" }`
4. **Type Safety**: All generated functions are fully typed

### Route-to-Function Mapping

- `post("/api/items", handler)` → `api.create()`
- `get("/api/items/:id", handler)` → `api.get(id)`
- `patch("/api/items/:id/toggle", handler)` → `api.toggle(id)`
- `patch("/api/items/:id", handler)` → `api.update(id)`
- `remove("/api/items/:id", handler)` → `api.remove(id)`

This eliminates the need to manually define client-side HTMX attributes and
ensures your client and server stay in sync automatically.

## Advanced Patterns

### Counter with Function-Style Props

```tsx
import { defineComponent, h, number } from "../src/index.ts";
import { resetCounter, updateParentCounter } from "../examples/dom-actions.ts";

defineComponent("smart-counter", {
  styles: {
    container:
      `{ display: inline-flex; align-items: center; gap: 0.5rem; padding: 1rem; border: 2px solid #007bff; border-radius: 6px; background: white; }`,
    counterButton:
      `{ padding: 0.5rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; min-width: 2rem; font-weight: bold; }`,
    counterButtonHover: `{ background: #0056b3; }`,
    display:
      `{ font-size: 1.5rem; min-width: 3rem; text-align: center; font-weight: bold; color: #007bff; }`,
  },
  render: (
    {
      initialCount = number(0),
      step = number(1),
    },
    api,
    classes,
  ) => (
    <div class={classes!.container} data-count={initialCount}>
      <button
        class={classes!.counterButton}
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
        class={classes!.counterButton}
        onclick={updateParentCounter(
          `.${classes!.container}`,
          `.${classes!.display}`,
          step,
        )}
      >
        +{step}
      </button>
      <button
        class={classes!.counterButton}
        onclick={resetCounter(
          `.${classes!.display}`,
          initialCount,
          `.${classes!.container}`,
        )}
      >
        Reset
      </button>
    </div>
  ),
});
```

### Accordion with CSS Transitions

```tsx
import { boolean, defineComponent, h, string } from "../src/index.ts";
import { toggleParentClass } from "../examples/dom-actions.ts";

defineComponent("accordion", {
  styles: {
    container:
      `{ border: 1px solid #ddd; border-radius: 6px; margin-bottom: 0.5rem; overflow: hidden; }`,
    containerOpen: `{ /* styles for open state */ }`,
    header:
      `{ background: #f8f9fa; padding: 1rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-weight: 500; user-select: none; transition: background-color 0.2s; }`,
    headerHover: `{ background: #e9ecef; }`,
    icon: `{ transition: transform 0.2s; font-size: 1.2rem; }`,
    iconOpen: `{ transform: rotate(180deg); }`,
    content:
      `{ padding: 0 1rem; max-height: 0; overflow: hidden; transition: max-height 0.3s ease, padding 0.3s ease; }`,
    contentOpen: `{ max-height: 500px; padding: 1rem; }`,
  },
  render: (
    {
      title = string("Accordion Title"),
      content = string("Accordion content goes here..."),
      initiallyOpen = boolean(false),
    },
    api,
    classes,
  ) => {
    const containerClass = `${classes!.container} ${
      initiallyOpen ? classes!.containerOpen : ""
    }`;
    const iconClass = `${classes!.icon} ${
      initiallyOpen ? classes!.iconOpen : ""
    }`;
    const contentClass = `${classes!.content} ${
      initiallyOpen ? classes!.contentOpen : ""
    }`;

    return (
      <div class={containerClass}>
        <div
          class={classes!.header}
          onclick={toggleParentClass(classes!.containerOpen)}
        >
          <span>{title}</span>
          <span class={iconClass}>▼</span>
        </div>
        <div class={contentClass}>
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>
      </div>
    );
  },
});
```

## SSR Integration

- Components are registered globally by name via `defineComponent`
- Use the dev server to SSR pages and swap component tags for HTML
- Programmatic SSR is available via `renderComponent(name, props)` from
  `src/index.ts`
- Server runs from `examples/` folder: `deno task serve` → http://localhost:8080

### Reactive State Manager

To enable cross‑component pub/sub state, inject the built‑in state manager. It
exposes a single global: `window.funcwcState` with `publish`, `subscribe`, and
`getState`.

Recommended: inject via server before `</head>` using the helper:

```ts
// server.ts (pseudo‑code)
import { injectStateManager } from "../src/index.ts";

let html = await Deno.readTextFile("./index.html");
html = html.replace(
  "</head>",
  `${injectStateManager(false, { debugMode: true })}\n</head>`,
);
```

Minimal production variant:

```ts
injectStateManager(true); // smaller script, no debug utilities
```

API surface (global `window.funcwcState`):

- `publish(topic, data)`: Broadcast state to a topic.
- `subscribe(topic, (data) => void, element)`: Receive updates; auto‑cleans when
  `element` is removed.
- `getState(topic)`: Read current state for a topic.
- `getTopics()`, `getSubscriberCount(topic)`, `debug()`: Debug/inspection
  helpers.

Adapter (optional): For code expecting `window.StateManager`, alias it to
`funcwcState`:

```html
<script>
  (function () {
    function ready(fn) {
      if (document.readyState !== "loading") return fn();
      document.addEventListener("DOMContentLoaded", fn);
    }
    ready(function () {
      if (!window.funcwcState) return;
      const api = window.funcwcState;
      window.StateManager = {
        publish: api.publish.bind(api),
        subscribe: api.subscribe.bind(api),
        getState: api.getState.bind(api),
        getTopics: api.getTopics.bind(api),
      };
    });
  })();
</script>
```

## Best Practices & Conventions

### 🎨 Modern Conventions (Recommended)

1. **Use Function-Style Props**: Eliminate duplication between props and
   parameters
2. **Use CSS-Only Format**: Let ui-lib auto-generate class names
3. **Smart Type Helpers**: Use `string()`, `number()`, `boolean()` for type
   safety
4. **DOM as State**: Keep handlers minimal; let CSS represent state
5. **Prefer Inline Handlers**: Use `examples/dom-actions.ts` patterns for
   reusable logic

### General Guidelines

- Component names should be kebab-case
- Keep components focused and composable
- Use `conditionalClass()` to build dynamic class strings
- Prefer server-side rendering with HTMX for dynamic behavior
- Test components by running `deno task serve` and visiting examples

## Summary

ui-lib emphasizes a minimal, ergonomic authoring model:

1. **🔧 defineComponent API**: Clean object-based configuration
2. **🎨 CSS-Only Format**: Auto-generated class names from CSS properties
3. **✨ Function-Style Props**: Zero duplication between props and render
   parameters

### JSON requests, HTML responses

All Unified API helpers are generated with JSON defaults:

- `hx-ext="json-enc"` and `hx-encoding="json"`
- `hx-headers` with `Accept: text/html` and `X-Requested-With: XMLHttpRequest`
- Pass a payload object as the extra argument → becomes the JSON body

Server handlers consume `await req.json()` and return HTML:

```tsx
export const toggle = patch("/api/items/:id/toggle", async (req, params) => {
  const body = await req.json() as { done?: boolean };
  return new Response(
    renderComponent("todo-item", { id: params.id, done: !!body.done }),
    { headers: { "content-type": "text/html; charset=utf-8" } },
  );
});
```

Per-call overrides:

```tsx
<button
  {...api.toggle(id, { done: true }, {
    target: "closest .todo",
    swap: "innerHTML",
  })}
>
  Toggle
</button>;
```

### CSRF patterns (recommended)

For production, protect mutating requests with a CSRF token tied to the user
session.

Recommended flow:

- Generate a CSRF token on initial page render (persist it in a secure, httpOnly
  cookie).
- Inject the same token into all generated `hx-headers` via a request-scoped
  header context.
- Validate the token on every mutating handler (compare request header vs
  cookie/session).

Server (page render) — set cookie and inject per-request header used by the API
generator:

```ts
import { runWithRequestHeaders } from "../src/lib/request-headers.ts";

const token = crypto.randomUUID();
const headers = new Headers({ "content-type": "text/html; charset=utf-8" });
headers.append("Set-Cookie", `csrf=${token}; HttpOnly; SameSite=Lax; Path=/`);

const html = runWithRequestHeaders(
  { "X-CSRF-Token": token },
  () => renderFullPage(),
);

return new Response(html, { headers });
```

API generator automatically merges the current request headers into
`hx-headers`, so every generated client action carries `X-CSRF-Token` without
extra code in components.

Server (handler) — validate header against cookie:

```ts
export const toggle = patch("/api/items/:id/toggle", async (req, params) => {
  const headerToken = req.headers.get("x-csrf-token");
  const cookies = req.headers.get("cookie") ?? "";
  const cookieToken = /(?:^|;\s*)csrf=([^;]+)/.exec(cookies)?.[1];
  if (!headerToken || headerToken !== cookieToken) {
    return new Response("Forbidden", { status: 403 });
  }

  const body = await req.json() as { done?: boolean };
  return new Response(
    renderComponent("todo-item", { id: params.id, done: !!body.done }),
    { headers: { "content-type": "text/html; charset=utf-8" } },
  );
});
```

Notes:

- Use `SameSite=Lax` or `Strict` and `Secure` in production (HTTPS).
- If you already have a session mechanism, store the CSRF token server-side
  instead of a cookie comparison.
- Because ui-lib standardizes JSON requests, you can avoid form-based CSRF
  complexities.

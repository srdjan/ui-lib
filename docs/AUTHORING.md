# Component Authoring with TSX (Custom JSX Runtime)

This project uses a custom JSX runtime for components so you can author views in TSX while keeping zero client-side dependencies and SSR-first output.

## 🎉 NEW: Revolutionary Ergonomics

funcwc has evolved through three major ergonomic improvements that eliminate all duplication:

1. **🔧 defineComponent API**: Clean object-based configuration (vs complex pipeline)
2. **🎨 CSS-Only Format**: Auto-generated class names from CSS properties  
3. **✨ Function-Style Props**: Zero duplication between props and render parameters

### ✨ Function-Style Props (Zero Duplication!)

The most ergonomic way to define props - no more duplication between props definition and render function parameters:

```tsx
import { defineComponent, h, string, number, boolean } from "../src/index.ts";

// ✨ NO props definition needed - extracted from render function!
defineComponent("smart-card", {
  styles: {
    // 🎨 CSS-only format - class names auto-generated!
    card: `{ border: 2px solid #e9ecef; border-radius: 8px; padding: 1.5rem; background: white; }`,
    title: `{ font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem; }`,
    highlight: `{ border-color: #007bff !important; background: #f8f9ff; }`
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

#### Typing function‑style props in TypeScript

The helper calls like `string()`, `number()`, and `boolean()` deliberately return PropHelper objects so the library can auto‑generate a typed props transformer by inspecting your render function defaults. TypeScript, however, does not know that these will be converted into primitive values at runtime. To keep both worlds happy (auto‑generation + strong types inside your render), add an inline cast on each default and annotate the destructured parameter type:

```tsx
defineComponent("typed-card", {
  styles: { container: `{ padding: 1rem; }` },
  render: ({
    title = string("Hello") as unknown as string,
    count = number(0) as unknown as number,
    enabled = boolean(false) as unknown as boolean,
  }: { title: string; count: number; enabled: boolean }, _api, classes) => (
    <div class={classes!.container}>
      <h3>{title}</h3>
      <p>Count: {count}</p>
      <p>Enabled: {enabled ? "Yes" : "No"}</p>
    </div>
  ),
});
```

Why this works:
- The defaults remain helper calls, so the library can parse them and build the prop schema (validation, defaults, type info).
- The `as unknown as T` cast teaches TypeScript that your local variables are primitives, so JSX usage stays fully typed.
- You only write the types once, in the parameter annotation — no duplication.


### 🎨 CSS-Only Format (Auto-Generated Classes!)

Just write CSS properties - class names auto-generated! No selectors, no duplication:

```tsx
defineComponent("beautiful-button", {
  styles: {
    // ✨ Just CSS properties - class names auto-generated!
    button: `{ padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }`,
    buttonHover: `{ background: #0056b3; }`,        // → .button-hover
    buttonActive: `{ transform: translateY(1px); }` // → .button-active
    // Auto-generates: .button, .button-hover, .button-active
  },
  render: ({ 
    text = string("Click me"),
    disabled = boolean(false)
  }, api, classes) => (
    <button 
      class={classes!.button} 
      disabled={disabled}
      onclick="/* DOM action */"
    >
      {text}
    </button>
  )
});
```

## Key Ideas

- **The DOM is the state**: Use classes, attributes, and text for UI state
- **Function-style props**: Props defined directly in render function signature
- **CSS-only format**: Auto-generated class names from CSS properties
- **Smart type helpers**: `string()`, `number()`, `boolean()`, `array()`, `object()`
- **Event handlers**: Return inline handler strings for direct DOM manipulation
- **Server interactions**: Defined via `api` that automatically generates HTMX attributes

## Prerequisites

- Root `deno.json` sets `"jsx": "react"` and `"jsxFactory": "h"`
- Import `h` from `src/index.ts` in any TSX file

```tsx
// examples/foo.tsx
import { defineComponent, h } from "../src/index.ts";
```

## Component Structure Options

### 🚀 Modern Approach: Function-Style Props + CSS-Only

```tsx
import { defineComponent, h, string, number, boolean } from "../src/index.ts";

defineComponent("modern-card", {
  styles: {
    // ✨ CSS-only format - no selectors needed!
    container: `{ border: 1px solid #ddd; padding: 1rem; border-radius: 6px; background: white; }`,
    title: `{ font-size: 1.2rem; font-weight: bold; margin-bottom: 0.5rem; color: #333; }`,
    counter: `{ color: #666; font-size: 0.9rem; }`
  },
  render: ({ 
    // ✨ Props auto-generated from function signature!
    title = string("Card Title"),
    count = number(0),
    highlighted = boolean(false)
  }, api, classes) => (
    <div class={`${classes!.container} ${highlighted ? "highlight" : ""}`}>
      <h3 class={classes!.title}>{title}</h3>
      <span class={classes!.counter}>Count: {count}</span>
    </div>
  )
});
```

### 🔄 Legacy Approach: Traditional Props + Classes

Still supported for complex cases:

```tsx
defineComponent("legacy-card", {
  props: {
    title: "string",
    count: { type: "number", default: 0 },
    highlighted: { type: "boolean", default: false }
  },
  classes: {
    container: "card-box",
    title: "card-title", 
    counter: "card-count"
  },
  styles: `
    .card-box { border: 1px solid #ddd; padding: 1rem; border-radius: 6px; }
    .card-title { font-size: 1.2rem; font-weight: bold; margin-bottom: 0.5rem; }
    .card-count { color: #666; }
  `,
  render: ({ title, count, highlighted }, api, classes) => (
    <div class={`${classes!.container} ${highlighted ? "highlight" : ""}`}>
      <h3 class={classes!.title}>{title}</h3>
      <span class={classes!.counter}>Count: {count}</span>
    </div>
  )
});
```

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

### 🔄 Traditional Format

```tsx
// Full CSS selectors (for complex cases needing pseudo-selectors, etc.)
styles: {
  button: `.my-btn { background: blue; }`,
  hover: `.my-btn:hover { background: darkblue; }`,
  focus: `.my-btn:focus { outline: 2px solid blue; }`
}

// Or traditional string styles:
styles: `
  .my-button { background: blue; color: white; }
  .my-button:hover { background: darkblue; }
`
```

## DOM-Native Events

Use helpers that return action objects or inline handler strings:

```tsx
import { toggleClass, toggleClasses } from "../src/index.ts";

<button onClick={toggleClass("active")}>Toggle Single</button>
<button onClick={toggleClasses(["light", "dark"])}>Toggle Multiple</button>

// Inline handler strings for complex logic:
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

### Example-only Helpers

Small, copyable helpers in `examples/dom-actions.ts`:

```tsx
import { 
  updateParentCounter, 
  resetCounter, 
  toggleParentClass, 
  syncCheckboxToClass,
  activateTab 
} from "../examples/dom-actions.ts";

// Counter manipulation
updateParentCounter(".container", ".display", 5)  // Increment by 5
resetCounter(".display", 0, ".container")         // Reset to initial

// Class manipulation  
toggleParentClass("expanded")                     // Toggle on parent
syncCheckboxToClass("completed")                  // Checkbox → CSS class

// Tab activation
activateTab(".tabs", ".tab-btn", ".content", "active") // Complex tab logic
```

These are app-specific conveniences that live outside the core library to keep it clean and framework-agnostic.

## Unified API System (HTMX Integration)

The `api` property is funcwc's revolutionary unified API system that eliminates duplication between server route definitions and client-side HTMX attributes.

### Function-Style Props + HTMX Example

```tsx
import { defineComponent, h, string, boolean, patch, del } from "../src/index.ts";
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
        })
      );
    }),
    remove: del("/api/todos/:id", () => new Response(null, { status: 200 }))
  },
  styles: {
    // ✨ CSS-only format for todo items!
    item: `{ display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 0.5rem; background: white; }`,
    itemDone: `{ background: #f8f9fa; opacity: 0.8; }`,
    checkbox: `{ margin-right: 0.5rem; }`,
    text: `{ flex: 1; font-size: 1rem; }`,
    textDone: `{ text-decoration: line-through; color: #6c757d; }`,
    deleteBtn: `{ background: #dc3545; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; }`
  },
  render: ({
    // ✨ Function-style props - no duplication!
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
          {...api.toggle(id)}  // ✨ Auto-generated HTMX attributes!
        />
        <span class={textClass}>{text}</span>
        <button type="button" class={classes!.deleteBtn} {...api.remove(id)}>
          ×
        </button>
      </div>
    );
  }
});
```

### How Unified API Works

1. **Define Routes**: Write actual HTTP handlers in `api` using standard Web API patterns
2. **Auto-Generation**: funcwc analyzes your routes and creates client functions:
   - `patch("/api/todos/:id/toggle", handler)` → `api.toggle(id)`
   - `del("/api/todos/:id", handler)` → `api.remove(id)`
3. **HTMX Attributes**: Client functions return proper `hx-*` attributes:
   - `api.toggle(id)` → `{ "hx-patch": "/api/todos/123/toggle", "hx-target": "closest .item" }`
   - `api.remove(id)` → `{ "hx-delete": "/api/todos/123", "hx-target": "closest .item", "hx-swap": "outerHTML" }`
4. **Type Safety**: All generated functions are fully typed

### Route-to-Function Mapping

- `post("/api/items", handler)` → `api.create()`
- `get("/api/items/:id", handler)` → `api.get(id)`
- `patch("/api/items/:id/toggle", handler)` → `api.toggle(id)`
- `patch("/api/items/:id", handler)` → `api.update(id)`
- `del("/api/items/:id", handler)` → `api.remove(id)`

This eliminates the need to manually define client-side HTMX attributes and ensures your client and server stay in sync automatically.

## Advanced Patterns

### Counter with Function-Style Props

```tsx
import { defineComponent, h, number } from "../src/index.ts";
import { updateParentCounter, resetCounter } from "../examples/dom-actions.ts";

defineComponent("smart-counter", {
  styles: {
    container: `{ display: inline-flex; align-items: center; gap: 0.5rem; padding: 1rem; border: 2px solid #007bff; border-radius: 6px; background: white; }`,
    counterButton: `{ padding: 0.5rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; min-width: 2rem; font-weight: bold; }`,
    counterButtonHover: `{ background: #0056b3; }`,
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

### Accordion with CSS Transitions

```tsx
import { defineComponent, h, string, boolean } from "../src/index.ts";
import { toggleParentClass } from "../examples/dom-actions.ts";

defineComponent("accordion", {
  styles: {
    container: `{ border: 1px solid #ddd; border-radius: 6px; margin-bottom: 0.5rem; overflow: hidden; }`,
    containerOpen: `{ /* styles for open state */ }`,
    header: `{ background: #f8f9fa; padding: 1rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-weight: 500; user-select: none; transition: background-color 0.2s; }`,
    headerHover: `{ background: #e9ecef; }`,
    icon: `{ transition: transform 0.2s; font-size: 1.2rem; }`,
    iconOpen: `{ transform: rotate(180deg); }`,
    content: `{ padding: 0 1rem; max-height: 0; overflow: hidden; transition: max-height 0.3s ease, padding 0.3s ease; }`,
    contentOpen: `{ max-height: 500px; padding: 1rem; }`
  },
  render: ({ 
    title = string("Accordion Title"),
    content = string("Accordion content goes here..."),
    initiallyOpen = boolean(false)
  }, api, classes) => {
    const containerClass = `${classes!.container} ${initiallyOpen ? classes!.containerOpen : ""}`;
    const iconClass = `${classes!.icon} ${initiallyOpen ? classes!.iconOpen : ""}`;
    const contentClass = `${classes!.content} ${initiallyOpen ? classes!.contentOpen : ""}`;
    
    return (
      <div class={containerClass}>
        <div class={classes!.header} onclick={toggleParentClass(classes!.containerOpen)}>
          <span>{title}</span>
          <span class={iconClass}>▼</span>
        </div>
        <div class={contentClass}>
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>
      </div>
    );
  }
});
```

## SSR Integration

- Components are registered globally by name via `defineComponent`
- Use the dev server to SSR pages and swap component tags for HTML
- Programmatic SSR is available via `renderComponent(name, props)` from `src/index.ts`
- Server runs from `examples/` folder: `deno task serve` → http://localhost:8080

## Best Practices & Conventions

### 🎨 Modern Conventions (Recommended)

1. **Use Function-Style Props**: Eliminate duplication between props and parameters
2. **Use CSS-Only Format**: Let funcwc auto-generate class names
3. **Smart Type Helpers**: Use `string()`, `number()`, `boolean()` for type safety
4. **DOM as State**: Keep handlers minimal; let CSS represent state
5. **Prefer Inline Handlers**: Use `examples/dom-actions.ts` patterns for reusable logic

### 🔄 Legacy Conventions (Still Supported)

1. **Traditional Props**: Use when you need complex prop transformation logic
2. **Explicit Classes**: Use `classes` when you need specific class name control  
3. **Traditional Styles**: Use full CSS when you need complex pseudo-selectors
4. **Pipeline API**: Available but `defineComponent` is cleaner

### General Guidelines

- Component names should be kebab-case
- Keep components focused and composable
- Use `conditionalClass()` to build dynamic class strings
- Prefer server-side rendering with HTMX for dynamic behavior
- Test components by running `deno task serve` and visiting examples

## Evolution Summary

funcwc has evolved through three major improvements:

1. **🔧 defineComponent API**: Clean object-based configuration
2. **🎨 CSS-Only Format**: Auto-generated class names from CSS properties  
3. **✨ Function-Style Props**: Zero duplication between props and render parameters

The result is **the most ergonomic component authoring experience** with minimal syntax, maximum power, and zero runtime overhead.

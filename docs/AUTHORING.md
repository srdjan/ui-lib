# Component Authoring with TSX (Custom JSX Runtime)

This project uses a custom JSX runtime for components so you can author views in
TSX while keeping zero client-side dependencies and SSR-first output.

Key ideas:

- The DOM is the state: use classes, attributes, and text for UI state.
- Event handlers accept arrays of action objects and serialize to tiny inline
  JS.
- Server interactions are defined via `.api()` that automatically generates client functions returning HTMX attributes.

## Prerequisites

- Root `deno.json` sets `"jsx": "react"` and `"jsxFactory": "h"`.
- Import `h` from `src/index.ts` in any TSX file.

```ts
// examples/foo.tsx
import { defineComponent, h } from "../src/index.ts";
```

## Component Structure

```tsx
import { defineComponent, h } from "../src/index.ts";

defineComponent("example-card", {
  props: { 
    title: "string", 
    count: { type: "number", default: 0 }  // Enhanced props with defaults!
  },
  classes: {
    container: "card-box",
    title: "card-title",
    counter: "card-count"
  },
  styles: `
    .card-box { border: 1px solid #ddd; padding: 8px; border-radius: 6px; }
    .card-title { font-size: 1.2rem; font-weight: bold; margin-bottom: 0.5rem; }
    .card-count { color: #666; }
  `,
  render: ({ title, count }, api, classes) => (
    <div class={classes!.container}>
      <h3 class={classes!.title}>{title}</h3>
      <span class={classes!.counter}>{count}</span>
    </div>
  )
});
```

## DOM-Native Events

Use helpers that return action objects. Pass a single action or array to any
`on*` prop.

```tsx
import { toggleClass, toggleClasses } from "../src/index.ts";

<button onClick={[toggleClass("active"), toggleClasses(["light", "dark"])]}>
  Toggle
</button>;
```

Common helpers (see `src/lib/dom-helpers.ts`):

- `toggleClass`, `toggleClasses`
- `conditionalClass` for class string generation

Note: App-specific convenience handlers (e.g., counters, tabs) are not part of
the core library. See `examples/dom-actions.ts` for small, userland helpers that
return inline handler strings you can copy or adapt.

## Unified API System (HTMX)

The `.api()` method is funcwc's revolutionary unified API system that eliminates duplication between server route definitions and client-side HTMX attributes. Define your API endpoints once, and funcwc automatically generates type-safe client functions.

```tsx
import { defineComponent, renderComponent, h } from "../src/index.ts";

defineComponent("todo-item", {
  props: { 
    id: "string", 
    text: "string", 
    done: { type: "boolean", default: false }
  },
  api: {
    // Define actual server handlers - client functions are auto-generated!
    'PATCH /api/todos/:id/toggle': async (req, params) => {
      const form = await req.formData();
      const isDone = form.get('done') === 'true';
      return new Response(
        renderComponent("todo-item", { 
          id: params.id, 
          text: "Updated!", 
          done: !isDone 
        })
      );
    },
    'DELETE /api/todos/:id': async (req, params) => {
      // Handle deletion logic
      return new Response(null, { status: 200 });
    }
  },
  classes: {
    item: "todo",
    checkbox: "todo-checkbox", 
    text: "todo-text",
    deleteBtn: "todo-delete"
  },
  styles: `
    .todo { display: flex; align-items: center; gap: 0.5rem; }
    .todo.done { opacity: 0.7; }
    .todo-text { flex: 1; }
    .todo.done .todo-text { text-decoration: line-through; }
    .todo-delete { background: #dc3545; color: white; border: none; }
  `,
  render: ({ id, text, done }, api, classes) => (
    <div class={`${classes!.item} ${done ? "done" : ""}`} data-id={id}>
      <input
        type="checkbox"
        class={classes!.checkbox}
        checked={done}
        {...(api?.toggle?.(id) || {})}  // Auto-generated HTMX attributes!
      />
      <span class={classes!.text}>{text}</span>
      <button 
        class={classes!.deleteBtn}
        {...(api?.delete?.(id) || {})}>×</button>  // Auto-generated!
    </div>
  )
});
```

**How it works:**

1. **Define Routes**: Write actual HTTP handlers in `.api()` using standard Web API patterns
2. **Auto-Generation**: funcwc analyzes your routes and creates client functions:
   - `PATCH /api/todos/:id/toggle` → `api.toggle(id)` 
   - `DELETE /api/todos/:id` → `api.delete(id)`
3. **HTMX Attributes**: Client functions return proper `hx-*` attributes:
   - `api.toggle(id)` returns `{ "hx-patch": "/api/todos/123/toggle", "hx-target": "closest .todo" }`
   - `api.delete(id)` returns `{ "hx-delete": "/api/todos/123", "hx-target": "closest .todo", "hx-swap": "outerHTML" }`
4. **Type Safety**: All generated functions are fully typed based on your route definitions

**Route-to-Function Mapping:**
- `POST /api/items` → `api.create()`
- `GET /api/items/:id` → `api.get(id)`  
- `PATCH /api/items/:id` → `api.update(id)` or `api.toggle(id)` (based on path)
- `DELETE /api/items/:id` → `api.delete(id)`

This eliminates the need to manually define client-side HTMX attributes and ensures your client and server stay in sync automatically.

## Class Map (Optional)

Avoid hardcoding repeated class names by declaring `classes`.

```tsx
defineComponent("smart-counter", {
  props: { 
    step: { type: "number", default: 1 },
    initialCount: { type: "number", default: 0 }
  },
  classes: { container: "counter", display: "count", button: "counter-btn" },
  styles: `
    .counter { display: inline-flex; align-items: center; gap: 0.5rem; }
    .counter-btn { padding: 0.5rem; background: #007bff; color: white; border: none; }
    .count { font-size: 1.2rem; min-width: 3rem; text-align: center; }
  `,
  render: ({ step, initialCount }, api, classes) => (
    <div class={classes!.container} data-count={initialCount}>
      <button
        class={classes!.button}
        onClick={`const p=this.closest('.${
          classes!.container
        }');if(p){const c=p.querySelector('.${
          classes!.display
        }');if(c){const v=parseInt(c.textContent||0)-${step};c.textContent=v;if(p.dataset)p.dataset.count=v;}}`}
      >
        -{step}
      </button>
      <span class={classes!.display}>{initialCount}</span>
      <button
        class={classes!.button}
        onClick={`const p=this.closest('.${
          classes!.container
        }');if(p){const c=p.querySelector('.${
          classes!.display
        }');if(c){const v=parseInt(c.textContent||0)+${step};c.textContent=v;if(p.dataset)p.dataset.count=v;}}`}
      >
        +{step}
      </button>
    </div>
  )
});
```

## SSR

- Components are registered globally by name via the pipeline.
- Use the dev server to SSR pages and swap component tags for HTML.
- Programmatic SSR is available via `renderComponent(name, props)` from
  `src/index.ts`.

## Conventions

- Keep handlers minimal; let CSS represent state.
- Prefer `.styles(css)` over inline `<style>` tags in TSX.
- Use `conditionalClass()` to build class strings.

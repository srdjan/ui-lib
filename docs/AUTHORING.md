# Component Authoring with TSX (Custom JSX Runtime)

This project uses a custom JSX runtime for components so you can author views in TSX while keeping zero client-side dependencies and SSR-first output.

Key ideas:
- The DOM is the state: use classes, attributes, and text for UI state.
- Event handlers accept arrays of action objects and serialize to tiny inline JS.
- Server interactions are defined via `serverActions` that return HTMX attribute objects.

## Prerequisites
- Root `deno.json` sets `"jsx": "react"` and `"jsxFactory": "h"`.
- Import `h` from `src/index.ts` in any TSX file.

```ts
// examples/foo.tsx
import { component, h } from "../src/index.ts";
```

## Component Structure

```tsx
import { component, h } from "../src/index.ts";

component("f-example")
  .props({ title: "string", count: "number?" })
  .styles(`
    .box { border: 1px solid #ddd; padding: 8px; border-radius: 6px; }
  `)
  .view((props) => {
    const title = (props as any).title;
    const count = (props as any).count ?? 0;
    return (
      <div class="box">
        <h3>{title}</h3>
        <span>{count}</span>
      </div>
    );
  });
```

## DOM-Native Events
Use helpers that return action objects. Pass a single action or array to any `on*` prop.

```tsx
import { toggleClass, toggleClasses } from "../src/index.ts";

<button onClick={[toggleClass("active"), toggleClasses(["light","dark"]) ]}>Toggle</button>
```

Common helpers (see `src/lib/dom-helpers.ts`):
- `toggleClass`, `toggleClasses`
- `conditionalClass` for class string generation

Note: App-specific convenience handlers (e.g., counters, tabs) are not part of the core library. See `examples/dom-actions.ts` for small, userland helpers that return inline handler strings you can copy or adapt.

## Server Actions (HTMX)
Declare `serverActions` to return attribute objects, then spread in TSX.

```tsx
component("f-item")
  .props({ id: "string", done: "boolean?" })
  .serverActions({
    toggle: (id) => ({ "hx-patch": `/api/todos/${id}/toggle` }),
    remove: (id) => ({ "hx-delete": `/api/todos/${id}` }),
  })
  .view((props, serverActions) => {
    const id = (props as any).id;
    const done = Boolean((props as any).done);
    return (
      <div class={`item ${done ? "done" : ""}`} data-id={id}>
        <input type="checkbox" checked={done} {...(serverActions?.toggle?.(id) || {})} />
        <button {...(serverActions?.remove?.(id) || {})}>×</button>
      </div>
    );
  });
```

## Parts Map (Optional)
Avoid hardcoding repeated selectors by declaring `parts`.

```tsx
component("f-counter")
  .props({ step: "number?" })
  .parts({ self: ".counter", display: ".count" })
  .view((props, _server, parts) => {
    const step = (props as any).step ?? 1;
    return (
      <div class="counter" data-count={0}>
        <button onClick={`const p=this.closest('${parts!.self}');if(p){const c=p.querySelector('${parts!.display}');if(c){const v=parseInt(c.textContent||0)-${step};c.textContent=v;if(p.dataset)p.dataset.count=v;}}`}>-{step}</button>
        <span class="count">0</span>
        <button onClick={`const p=this.closest('${parts!.self}');if(p){const c=p.querySelector('${parts!.display}');if(c){const v=parseInt(c.textContent||0)+${step};c.textContent=v;if(p.dataset)p.dataset.count=v;}}`}>+{step}</button>
      </div>
    );
  });
```

## SSR
- Components are registered globally by name via the pipeline.
- Use the dev server to SSR pages and swap component tags for HTML.
- Programmatic SSR is available via `renderComponent(name, props)` from `src/index.ts`.

## Conventions
- Keep handlers minimal; let CSS represent state.
- Prefer `.styles(css)` over inline `<style>` tags in TSX.
- Use `conditionalClass()` to build class strings.

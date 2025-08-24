# Migration Guide (Legacy pipeline → DOM-native TSX)

This guide helps move components that used `.state()`/`.actions()` and string-based handlers to the new DOM-native, TSX-first pipeline.

## 1) Replace `html` templates with TSX
- Old: `html` tagged templates returning strings.
- New: TSX with our custom `h` runtime. Import `h` and return TSX directly from `.view()`.

## 2) Drop `.state()` and imperative `.actions()`
- Old pipeline kept JS state and mutated via action reducers.
- New approach stores state in the DOM (classes, data-attributes, text). Update it with DOM helpers via inline event handlers.

Example (counter):
- Old: `{ count }` in JS; `actions.inc` returned `{ count: count + 1 }`.
- New: `<div class="counter" data-count="0"><span class="count">0</span>…</div>` and buttons use a tiny inline handler string (or a userland helper) to update DOM state.

## 3) Event handlers: strings → action arrays (plus userland strings)
- Old: build handler strings manually or with helpers that returned strings.
- New: for core toggles use `ComponentAction[]` (e.g., `toggleClass`, `toggleClasses`). For app-specific logic, keep using short inline strings or local helpers (see `examples/dom-actions.ts`).

```tsx
<button onclick={[toggleClass('open')]}>Toggle</button>
```

## 4) Server interactions via `serverActions`
- Old: custom wrappers like `htmxAction`.
- New: declare `.serverActions({...})` that return HTMX attribute objects and spread them in TSX.

```tsx
.serverActions({ remove: (id) => ({ 'hx-delete': `/api/todos/${id}` }) })
// …
<button {...(serverActions?.remove?.(id) || {})}>Delete</button>
```

## 5) Styles
- Prefer `.styles(css)` to attach CSS to the component SSR output.
- Remove inline `<style>` blocks in `view` bodies.

## 6) SSR entry
- Legacy `ssr-service.ts` is removed.
- Use `renderComponent(name, props)` from `src/index.ts` or the dev server’s automatic tag replacement.

## 7) Props parsing unchanged (simplified)
- Continue using `.props({ key: 'string' | 'number' | 'boolean' | 'string?' | ... })`.
- In `.view`, cast `props` as needed for TS ergonomics.

## 8) Optional: `parts` for selectors
- If you repeat selectors in handlers, define `.parts({ ... })` and reference them in `view`.

## Before/After Snapshot

Before:
```ts
component('f-counter')
  .state({ count: 0 })
  .actions({ inc: (s) => ({ count: (s as any).count + 1 }) })
  .view((state) => `<div>${(state as any).count}</div>`);
```

After:
```tsx
component('f-counter-dom')
  .props({ step: 'number?' })
  .parts({ self: '.counter', display: '.count' })
  .styles('.counter{display:inline-flex;gap:.5rem;}')
  .view((props, _sa, parts) => {
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

That’s it. Most migrations are a mechanical swap of JS state/actions for DOM-based state plus action helpers.

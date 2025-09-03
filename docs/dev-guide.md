## Developer Guide (Idiomatic Usage)

### Core Principles

- SSR-first: render HTML strings on the server; keep render pure.
- DOM is the state: prefer classes/data-attrs over JS state.
- Strict TypeScript; small, pure helpers; no runtime deps.

### Define Components

- Use kebab-case names: `defineComponent("cart-badge", { ... })`.
- Function-style props in render:
  `render({ count = number(0), active = boolean(false) }, api, classes) => ...`.
- Keep `render` side‑effect‑free; wire behavior via lifecycle/options.

### Styles (Unified)

- Write CSS properties under `styles`; use generated `classes` in markup.
- Root gets `data-component="<name>"` automatically for safe scoping.

### Reactivity (Three Tiers)

- CSS Properties: visual state.
  - `setCSSProperty("theme-bg", "#fff")`,
    `toggleCSSProperty("theme-mode","light","dark")`.
- Pub/Sub State: business logic.
  - `publishState("cart", { count, total })`;
  - `subscribeToState("cart", "/* use 'data' */ ...")` or via
    `stateSubscriptions`.
- DOM Events: component messaging (namespaced).
  - Dispatch: `onclick={dispatchEvent("open-modal", { id })}` → emits
    `ui-lib:open-modal`.
  - Listen: `eventListeners: { "open-modal": "/* use event.detail */ ..." }`.

### Unified API + HTMX

- Define once in `api`, consume as attributes:
  - `api: { toggle: patch("/api/todos/:id/toggle", handler) }`
  - Use: `<button {...api.toggle(id)}>` (JSON-in, HTML-out).
- Adjust targeting/swapping per call: `{ target: "#list", swap: "innerHTML" }`.

### Lifecycle Hooks

- `onMount`: attach listeners/subscriptions; `onUnmount`: cleanup.
- The library injects a single `hx-on="htmx:load: …"` so hooks run after swaps.
- Avoid inline `<script>`; prefer lifecycle + helpers.

### Common Patterns

- Notifications: `onclick={createNotification("Saved!","success",2500)}`;
  display listens for `ui-lib:show-notification`.
- Badges: subscribe to `"cart"` and update `.cart-count`/`.cart-total`.
- Class toggles: `onclick={toggleClass("active")}`.

### Dev Workflow

- Type-check/tests: `deno task check`, `deno task test`, `deno task coverage`.
- Lint/format: `deno task lint`, `deno task fmt`, `deno task fmt:check`.
- Docs: `deno task docs` (API for `index.ts`).

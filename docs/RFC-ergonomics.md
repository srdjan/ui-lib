# RFC: Ergonomics & API Simplification

Status: Draft

## Summary

This RFC streamlines ui-lib’s developer experience by consolidating overlapping
APIs, making “magic” behaviors opt‑in, and tightening naming and typing. It
focuses on four pillars:

- One clear path per concern (components, props, API, reactivity, styles).
- Predictable defaults; explicit configuration for advanced behavior.
- Consistent naming and composition patterns across modules.
- Minimal surface area while preserving capability.

## Motivation

- Reactive config is scattered (`eventListeners`, `stateSubscriptions`,
  `cssReactions`, `onMount`, `onUnmount`, `autoInjectReactive`).
- Multiple props approaches (`props.ts` and `prop-helpers.ts`) create ambiguity.
- Mixed API naming (`del` vs `remove`) and loose typing for path params/options.
- Inline JS strings dominate reactivity; structured “actions” are clearer and
  safer.

## Proposed Changes

1. defineComponent

- Group reactivity under `reactive`:
  `{ on, state, css, mount, unmount, inject }`.
- Return a small component handle `{ name, classes }` while still registering
  for SSR.
- Single styles entry: `styles` accepts unified object or string; `classes` only
  overrides.
- Logging guard: `dev?: boolean`, `failOnDuplicate?: boolean` for registry
  collisions.

2. Props & Types

- Standardize on `prop-helpers` (string/number/boolean/array/object). Deprecate
  `lib/props.ts`.
- Optional builder alias:
  `defineProps({ title: string("Hi"), count: number(0) })`.
- Keep auto-props via parameter parsing behind `autoProps: true`; document
  limits.

3. API & Router

- Canonical verb names: prefer `remove` (keep `del` as alias).
- Typed path params (forward-looking): infer `/users/:id` → `(id: string)` in
  generated clients.
- Typed options: `opts?: { headers?, target?, swap? }` with sensible defaults.
- Optional route registration: `registerRoutes?: true`.

4. Reactive Helpers

- Prefer declarative `ComponentAction`s (e.g., `dispatch`, `publish`) compiled
  by `h`; keep string helpers as escape hatches.
- Unify `hxOn` + `listensFor` into
  `on({ 'htmx:load': '...', 'ui-lib:open': '...' })` with safe merges.
- Default `reactive.inject` (auto inline code) to `false`.

5. JSX Runtime & DOM Helpers

- Event handlers accept `string | Action`; arrays deprecated. Provide
  `chain(a, b)` if needed.
- Encourage `raw()`/`html()` for SSR content; align JSX docs with these
  utilities.

6. Styles & Registry

- Stable style dedup key `${component}:${hash(css)}` to avoid cross‑render
  collisions.
- Keep `getRegistry()` internal; expose `resetRegistry()` only in tests.

7. Global Configure

- `configure({ dev, logging, hx: { headers, swapDefault, targetDefault } })`
  centralizes defaults.

## Before / After Examples

Reactive config (simplified)

Before:

```ts
defineComponent("x-demo", {
  eventListeners: { "ui-lib:open": "open()" },
  stateSubscriptions: { cart: "render(data)" },
  onMount: "init()",
  autoInjectReactive: true,
  render: (p) => <div>…</div>,
});
```

After:

```ts
defineComponent("x-demo", {
  reactive: {
    on: { "ui-lib:open": "open()" },
    state: { cart: "render(data)" },
    mount: "init()",
    unmount: "cleanup()",
    inject: false,
  },
  render: (p) => <div>…</div>,
});
```

Props (single path)

```ts
// Preferred explicit props
const props = { title: string("Hi"), count: number(0) };
defineComponent("x-counter", {
  props: (attrs) => ({
    title: attrs.title ?? "Hi",
    count: Number(attrs.count ?? 0),
  }),
  render: ({ title, count }) => <div>{title} {count}</div>,
});

// Or auto-props (opt-in)
defineComponent("x-auto", {
  autoProps: true,
  render: ({ title = string("Hi"), count = number(0) }) => <div>…</div>,
});
```

API (consistent verbs & options)

```ts
api: {
  create: post("/api/todos", handler),
  remove: remove("/api/todos/:id", handler),
}
// Generated client usage
<button {...api.remove(id, { target: "closest [data-component]" })}>×</button>
```

## Migration & Rollout

Phase 0 (additive)

- Introduce `reactive` block, `configure()`, canonical `remove`, typed `opts`.
  No breaking changes.
- Keep legacy keys and `del` alias; no warnings by default.

Phase 1 (soft deprecation)

- Emit dev‑only warnings when legacy keys (`eventListeners`, etc.) or
  `lib/props.ts` are used.
- Update docs and examples to new APIs; provide codemods/snippets.

Phase 2 (defaults flip)

- Default `reactive.inject` to `false` and `autoProps` to `false`.
- Prefer `remove` in docs; keep `del` alias.

Next Major

- Remove legacy keys and `lib/props.ts`.

## Risks & Mitigations

- Behavior surprises from auto‑injection: default to off; explicit
  `reactive.inject`.
- Larger cognitive load during transition: phased rollout + deprecation
  warnings + concise migration guide.
- Typed path params may require TS upgrades: keep as forward‑compatible
  enhancement guarded by types.

## Open Questions

- Scope of new `ComponentAction`s (dispatch/publish/navigation) without
  introducing a runtime.
- Do we add a tiny runtime to support richer actions, or keep them render‑time
  only?
- Should `configure()` also expose per‑component defaults (e.g., `inject`)?

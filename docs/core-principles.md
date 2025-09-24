# Core Principles (Next-Gen Authoring Model)

This document captures the desired developer experience for the next evolution
of the library. All code shown here is **aspirational**—it guides the
implementation roadmap and highlights the feature set we want to deliver.

## Guiding Values

1. **SSR-First Rendering** – the server produces HTML; the client swaps
   fragments and runs a tiny runtime. No hydration, no re-rendering.
2. **Pure JSX Authoring** – both component renders _and_ API handlers return
   JSX. No string templates, no helper wrappers.
3. **Declarative Actions** – developers express intent via an `action` DSL
   (`action="reset(id)"`). The library expands this to concrete HTTP routes and
   HX attributes.
4. **Role-Driven DOM State** – `data-role="count"`, `data-role="theme-toggle"`,
   etc., allow the library to infer wiring, derive payloads, and scope updates.
5. **Automatic Wiring** – the runtime reads library-generated metadata
   (`data-scope`, topics, roles) and applies updates without developer code.
6. **Light FP Everywhere** – mutations live in pure helpers, errors as values,
   zero classes.

## Ideal Authoring Experience

```tsx
import {
  boolean,
  defineComponent,
  h,
  number,
  post,
  string,
} from "../mod.ts";
import { html } from "../lib/response.ts";
import { ok, type Result } from "../lib/result.ts";
import { Button } from "../lib/components/button/token-button.ts";

// Pure domain helpers -------------------------------------------------
type Counter = { readonly id: string; readonly count: number };
type CounterError = { readonly type: "invalid"; readonly message: string };
const counters = new Map<string, Counter>();
const ensure = (id: string, start: number): Counter => {
  const next = counters.get(id) ?? { id, count: start };
  if (!counters.has(id)) counters.set(id, next);
  return next;
};
const mutate = (
  id: string,
  start: number,
  fn: (c: Counter) => Result<Counter, CounterError>,
): Result<Counter, CounterError> => {
  const result = fn(ensure(id, start));
  if (result.ok) counters.set(id, result.value);
  return result;
};
const step = (c: Counter) => ok({ ...c, count: c.count + 1 });
const reset = (c: Counter) => ok({ ...c, count: 0 });

// Component ------------------------------------------------------------
export const Counter = defineComponent("counter", {
  reactive: {
    on: {
      "ui-lib:toggle-accent":
        "const root=document.documentElement;const next=root.style.getPropertyValue('--accent')?.trim()==='#16a34a'?'#4f46e5':'#16a34a';root.style.setProperty('--accent', next);",
    },
    state: {
      "counter:update":
        "const el=this.querySelector('[data-role=\\"count\\"]'); if(el){ el.textContent = String(data.count); }",
    },
    mount: "this.style.setProperty('--accent', '#4f46e5')",
    inject: true,
  },

  api: {
    increment: post("/api/counter/increment", async (req) => {
      const { args: [id] = [] } = await req.json();
      const result = mutate(String(id), 0, step);
      if (!result.ok) return html(<span data-role="count">error</span>, { status: 400 });
      return html(<span data-role="count">{result.value.count}</span>);
    }),
    reset: post("/api/counter/reset", async (req) => {
      const { args: [id] = [] } = await req.json();
      const result = mutate(String(id), 0, reset);
      if (!result.ok) return html(<span data-role="count">error</span>, { status: 400 });
      return html(<span data-role="count">{result.value.count}</span>);
    }),
  },

  render: ({
    id = string(),
    label = string("Counter"),
    start = number(0),
    disabled = boolean(false),
  }) => {
    const counter = ensure(id, start);

    return (
      <section data-scope="counter" data-topic-scope={`counter:${id}`}>
        <header>{label}</header>
        <Button
          variant="outline"
          disabled={disabled}
          action={`reset(${id})`}
          target="role:count"
        >
          Reset
        </Button>
        <span data-role="count">{String(counter.count)}</span>
        <Button
          variant="primary"
          disabled={disabled}
          action={`increment(${id})`}
          target="role:count"
        >
          +
        </Button>
        <Button
          variant="ghost"
          action="toggleTheme()"
          target="role:theme-toggle"
        >
          Toggle theme
        </Button>
      </section>
    );
  },
});
```

### Notes for Implementers

1. **Action DSL**
   - parse `action="method(args)"` → `{ method, args }`.
   - synthesize `hx-post`, `hx-vals`, defaults for `hx-target`/`hx-swap`.
   - allow optional `target="role:count"` to override target inference.

2. **JSX API Returns**
   - detect JSX responses in `post()` wrappers.
   - render them to HTML and attach `HX-Trigger` with payload derived from
     roles.
   - fallback to inline `<script>` dispatcher if request isn’t HTMX.

3. **Role Extraction**
   - walk returned JSX → collect `data-role` values.
   - convert text roles (`count`) to numbers when possible.
   - store payload → runtime publishes `counter:update` with derived JSON.

4. **Runtime Wiring**
   - SSR pipeline emits `data-wire` describing topics + roles.
   - client runtime reads `data-wire` & `data-topic-scope`, subscribes
     automatically.
   - after swap, HTMX (or fallback) triggers `counter:update` with payload.

---

## Implementation Roadmap

1. **DSL Parser & Authoring Props**
   - Implement `parseAction(expr)`.
   - Extend render pipeline to swap `action/target` props for HTMX attributes.
   - Define ergonomics for optional `target`, `swap`, indicators, etc.

2. **Render Pipeline Enhancements**
   - Wrap JSX VNodes with helpers: add `data-scope`, compute `data-wire`, apply
     action inference.
   - Ensure pipeline remains pure and composable.

3. **API Wrapper Enhancements**
   - Update `post()` (and other verbs) to accept handlers returning JSX or
     Response.
   - Integrate `wrapApiResult()` for state extraction + HX trigger.

4. **Runtime Updates**
   - Teach client runtime to read `data-wire`, ignore manual `wire()` calls.
   - Translate HX-Trigger payloads into scoped topic publishes.
   - Provide non-HTMX fallback (inline dispatcher or event bus).

5. **Developer Tooling & Docs**
   - Document reserved `data-role` names and how to combine roles.
   - Add lint/error rules for unsupported `action` expressions.
   - Provide codemods/migrations from manual HTMX usage to Action DSL.

6. **Testing & Validation**
   - Unit-test parser, state extraction, HX inference.
   - Integration tests: click events → HTMX payload → server JSX → runtime
     update.
   - Perf benchmarks comparing legacy template literal approach vs. new DSL.

---

By following this plan, the next iteration of the library will deliver a truly
**pure JSX** developer experience, hide HTMX completely, and keep all the Light
FP + DOM-native strengths that make the current system attractive.

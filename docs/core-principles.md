Here’s a **Core Design Principles document** for your SSR UI library — fully
updated with the **Action DSL**, **role-driven state extraction**, and
**automatic wiring** approach. It uses your `Counter` example as a centerpiece
to demonstrate how all principles come together.

---

# **Core Design Principles — SSR UI Library**

## 1. **SSR-First, Minimal Client**

- **Principle:** The server is the renderer. The client only updates what the
  server tells it to update.
- **Why:** Avoids hydration costs, enables instant-first-paint UX, and
  guarantees parity between server and client rendering.
- **Implementation:**

  - Render HTML on the server with `render(<Component />)`.
  - Use HTMX or plain form posts to receive HTML fragments back.
  - Client runtime just swaps fragments and re-applies wiring — never rebuilds
    state.

---

## 2. **Action DSL Instead of HTTP Paths**

- **Principle:** Developers write _intent_, not URLs.
- **Why:** Eliminates path repetition, centralizes routing in the library, keeps
  authoring consistent and expressive.
- **Implementation:**

  - Developers write `action="reset(id)"`.
  - Library compiles to `hx-post="/api/counter/reset"` +
    `hx-vals='{"args":[id]}'`.
  - Works for any verb: `increment(123)`, `remove({id:1})`, `setTheme("dark")`.

---

## 3. **Role-Driven Markup**

- **Principle:** The DOM is the source of truth. _Roles_ annotate stateful parts
  of the UI.
- **Why:** Simplifies reactivity — the library can wire everything automatically
  by scanning roles.
- **Implementation:**

  - `data-role="count"` → text updates mapped to `count` field in state payload.
  - `data-role="theme-toggle"` → event emitter to toggle CSS vars.
  - Roles drive:

    - **Serialization** → compile-time `data-wire` generation.
    - **State extraction** → derive JSON payload from server-returned fragments.
    - **Effect mapping** → update DOM/CSS on topic publish.

---

## 4. **Automatic Wiring**

- **Principle:** Developers never manually call `wire()` or `afterSwap()`.
- **Why:** Boilerplate-free, consistent behavior across components.
- **Implementation:**

  - Server pipeline scans roles and generates compact `data-wire`.
  - Runtime subscribes to standardized topics (e.g., `counter:update`).
  - HTMX triggers auto-publish payloads after swaps.
  - Client runtime applies effects without developer involvement.

---

## 5. **Plain JSX Returns from API Handlers**

- **Principle:** API handlers focus only on business logic and returned HTML.
- **Why:** Removes `.state(...)` ceremony and afterSwap publishing.
- **Implementation:**

  - Handlers return JSX fragments, not special wrapper calls.
  - Library extracts state payload from roles inside returned fragment.
  - HX-Trigger headers (or inline dispatcher for non-HTMX clients) are
    auto-attached.

---

## 6. **Scoped, Declarative Reactivity**

- **Principle:** All reactivity is **scoped to `data-scope` roots**, preventing
  global leaks.
- **Why:** Encourages component isolation, supports multiple instances safely.
- **Implementation:**

  - Each root gets `data-topic-scope` and unique ID.
  - Topics publish only to their scope.
  - Role-based effects execute in nearest scope.

---

## 7. **Type-Safe, Pure, Testable Core Logic**

- **Principle:** All state mutations are pure functions and easily testable.
- **Why:** Encourages separation of concerns and predictable behavior.
- **Implementation:**

  - `updateCounter(id, start, step)` is pure and returns `{ id, count }`.
  - Components just render the result; no in-component mutation side-effects.

---

## 8. **Minimal, Ergonomic Developer Experience**

- **Principle:** Devs should write mostly JSX and pure logic — nothing else.
- **Why:** Reduces cognitive load, improves readability, makes onboarding
  trivial.
- **Implementation:**

  - No manual HTMX attributes.
  - No manual pub/sub or custom events.
  - No `afterSwap` or wiring calls.
  - Roles + Action DSL + automatic HX-Trigger handle everything.

---

## Example: **Counter Component**

### Author’s Code (Minimal)

```tsx
export const Counter = defineComponent("counter", {
  render: ({ id = string(), label = string("Counter"), start = number(0) }) => (
    <div data-scope>
      <span>{label}</span>
      <button action={`reset(${id})`} target="role:count">Reset</button>
      <span data-role="count">{String(start)}</span>
      <button action={`increment(${id})`} target="role:count">+</button>
      <button data-role="theme-toggle">Toggle theme</button>
    </div>
  ),

  api: {
    increment: post("/api/counter/increment", async (req) => {
      const { args: [id] } = await req.json();
      const next = updateCounter(String(id), 0, step).value;
      return <span data-role="count">{next.count}</span>; // ← JSX only
    }),
    reset: post("/api/counter/reset", async (req) => {
      const { args: [id] } = await req.json();
      const next = updateCounter(String(id), 0, reset).value;
      return <span data-role="count">{next.count}</span>; // ← JSX only
    }),
  },
});

// Server render when needed
const html = render(<Counter id="main" />);
```

### What the Library Does Behind the Scenes

- Converts `action="reset(id)"` → `hx-post="/api/counter/reset"` +
  `hx-vals='{"args":[id]}'`.
- Auto-generates `data-wire` describing that `count` role should update on
  `counter:update`.
- Wraps returned JSX into a Response with:

  - **Body:** rendered `<span data-role="count">N</span>`
  - **HX-Trigger:** `{ "counter:update": { count: N } }`
- Runtime listens for `counter:update` in that scope and updates
  `[data-role=count]`.

---

## Summary Table

| Principle            | Dev Work                        | Library Work                                               |
| -------------------- | ------------------------------- | ---------------------------------------------------------- |
| SSR-first            | Write JSX → server returns HTML | Ensure SSR render pipeline & minimal client runtime        |
| Action DSL           | Write `action="reset(id)"`      | Compile to HTMX attrs, handle args                         |
| Role-driven markup   | Add `data-role` attributes      | Serialize roles to data-wire, extract state from fragments |
| Auto wiring          | Nothing                         | Generate data-wire, subscribe topics, handle afterSwap     |
| JSX in APIs          | Return JSX                      | Wrap to Response, derive state, add HX-Trigger             |
| Scoped reactivity    | Nothing                         | Attach `data-scope`, restrict bus to scope                 |
| Type-safe core logic | Pure functions                  | Just call them inside API handlers                         |

---

Would you like me to add a **visual diagram** (sequence diagram or flow chart)
showing end-to-end flow: _user clicks → HTMX request → server returns JSX →
HX-Trigger → runtime updates DOM_? It would make this principles document even
more compelling for onboarding new developers.

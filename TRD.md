## Technical Requirements Document (TRD): Functional Web Components Library

### 1) Overview and Goals
- Objective: Build a zero-dependency, plain-JavaScript library for authoring Web Components using a functional programming style.
- Core idea: Keep component logic pure and deterministic; push effects (DOM updates, I/O) to thin adapters at the boundaries (Custom Element lifecycle, scheduler).
- Deliverables: Component creation API, pure render system, immutable state management, predictable update cycle, cross-component communication mechanisms, coding standards, and testing strategy.

### 2) Scope
- In scope:
  - Custom Elements, Shadow DOM, HTML Templates
  - Pure functions for render and state transitions
  - Immutable state with predictable reducers/actions
  - Declarative rendering with a minimal diffing/patching algorithm
  - Component-to-component communication via events and optional shared store
  - Examples: forms, lists, modals
  - Unit/integration testing guidance for pure logic and Web Components behavior
- Out of scope:
  - Framework integration adapters (React/Vue/etc.)
  - Server-side rendering
  - Non-browser runtimes

### 3) Definitions
- Pure function: No side effects, deterministic output for given inputs.
- State: Immutable data object owned by a component or store.
- Reducer: Pure function (state, action) => newState.
- Action: Object with type and readonly payload describing an intent.
- Props: External inputs to a component (attributes, properties, store-derived).
- View: Pure function (state, props) => VTree (virtual DOM) or TemplateResult.
- Effects: DOM updates, time, network—performed by the library adapters only.

---

## Functional and Architectural Principles

### 4) Core Architecture Requirements
- Language/runtime: Plain ES modules, no frameworks; modern browsers (ES2019+).
- Web Components: Use Custom Elements API, open Shadow DOM, HTMLTemplateElement.
- Functional style:
  - All component business logic (init, reducers, view) must be pure.
  - Event handlers return actions or next state, never perform effects.
  - Immutability enforced in dev (deep-freeze/Proxy), immutable update patterns.
  - Higher-order functions for composition (wrapping reducers/views/selectors).
- Side effects confined to:
  - Custom Element lifecycle (connected/disconnected/attributeChanged)
  - Render scheduler (requestAnimationFrame batching)
  - DOM patcher attaching listeners and mutating the real DOM
  - Optional global store subscription plumbing
- No global singletons in core; composition and dependency injection via parameters.

### 5) Immutability Patterns (Implementation)
- State updates must always return new objects; never mutate inputs.
- Allowed techniques: spread, Object.assign, structuredClone (or shallow + selective deep copies).
- Dev-only safeguards:
  - deepFreeze(state) post-init and post-reduce to catch mutations.
  - Optional Proxy-based dev guard to warn on sets.
- Serialization-friendly state (avoid non-serializable values in reducers).
- Validation: Provide a validateState(state) hook for components (dev only, optional).

### 6) Pure Function Architecture
- Pure API shape:
  - init(props) => State
  - reducer(state, action) => State
  - view(state, props) => VTree | TemplateResult
  - deriveProps?(attributes, elementContext) => Props
  - selectors? (for global store mapping) => DerivedProps
- Event handlers:
  - view attaches named handlers that produce actions (or next state) only.
  - The library dispatches the action to the reducer; DOM updates are scheduled.
- Strict separation:
  - No DOM queries, timers, or I/O inside init/reducer/view/selectors.
  - All DOM manipulation centralized in the patcher.

### 7) Declarative UI and Rendering
- Declarative rendering:
  - A minimal virtual DOM (VTree) with: type, key, props, children.
  - Alternative mode: tagged template renderer producing TemplateResult with dynamic parts.
  - Library provides a diff/patch engine that:
    - Patches attributes and properties
    - Applies keyed reconciliation for lists
    - Manages event listener attachment/removal predictably
- Update cycle:
  - dispatch(action) => newState (pure) => schedule render (rAF) => diff/patch.
  - Batch multiple dispatches in the same tick; only one render per frame.
- Performance:
  - Keyed lists required for stable reconciliation.
  - Avoid re-creating handler closures per render where possible (library handles stable registration).
  - Optional micro-optimizations: memo(view) HOF, shouldRender(prev, next).

### 8) State Management Strategy
- Local component state:
  - Each component hosts a Store: { getState, dispatch, subscribe } created with reducer and init.
  - Store is a thin shell: enforces immutability (dev), schedules renders on updates.
- Global/shared state (optional):
  - createStore(initialState, rootReducer)
  - Components may connect via selectors: select(globalState, ownProps) => derivedProps
  - Unidirectional data flow: actions dispatched to global store; components subscribe to selectors.
- Communication:
  - CustomEvent for component-to-component messaging; composed: true, bubbles: true.
  - Events carry readonly detail payloads (immutable by convention).
  - Encapsulation preserved: internal state not exposed; external contract via attributes/properties/events.

---

## API Design

### 9) Core Library API (proposed)
- defineComponent(name, spec): registers a Custom Element.
  - spec:
    - init: (props) => State
    - reducer: (state, action) => State
    - view: (state, props) => VNode | TemplateResult
    - props?: { [propName]: PropSpec }  // attribute/property mapping and parsers
    - styles?: string | CSSStyleSheet | Array<string|CSSStyleSheet>
    - observedAttributes?: string[]     // auto-derived from props if omitted
    - deriveProps?: (attrs, ctx) => Props
    - connect?: { store, selector }     // optional global store hookup
    - shouldRender?: (prevState, nextState, prevProps, nextProps) => boolean
- h(type, props, ...children): create VNode
- html(strings, ...values): tagged template alternative for declarative templates
- createStore(initialState, reducer):
  - getState(): State
  - dispatch(action): void
  - subscribe(listener): () => unsubscribe
- combineReducers(reducers): (state, action) => State
- compose(...fns): HOF utility for composing transformations
- memo(viewFn, keyFn?): memoization helper for views or subtrees
- Dev utilities:
  - deepFreeze(value): value (frozen)
  - assertImmutable(next, prev): throws/warns in dev if mutation detected
  - freezeOnDev(state): no-op in prod

### 10) Custom Element Adapter (thin class)
- Auto-generated class extends HTMLElement:
  - connectedCallback:
    - Attach open shadow root
    - Adopt styles (adoptedStyleSheets if supported; fallback to <style>)
    - Initialize store with init(props)
    - Initial render
    - Wire global store subscription (if spec.connect provided)
  - attributeChangedCallback:
    - Parse to props; if changed, schedule render with same state
  - disconnectedCallback:
    - Unsubscribe listeners; cleanup
  - Element API:
    - dispatch(action) for external triggers (imperative bridge)
    - get value()/set value()? For form-associated custom elements (optional future)

### 11) Props and Attributes
- PropSpec:
  - attribute: string (kebab-case) or false for property-only
  - parse: (string|unknown) => any   // pure
  - reflect?: boolean                 // reflect prop back to attribute
  - default?: any                     // used by init if prop absent
- observedAttributes auto-derived from props.attribute truthy entries if not provided.
- Attribute changes produce new props objects (immutable), re-render if shouldRender passes.

### 12) Events
- Event handler bindings in VNode/Template:
  - onClick: (state, props, event) => Action | State
  - Library wraps handlers to:
    - Prevent default/stop propagation based on declarative flags (e.g., onClick.prevent)
    - Dispatch resulting action OR setState(nextState) internally
- Component emits CustomEvent for outward communication:
  - emit(name, detail, options): composed:true, bubbles:true, cancelable as needed.
  - Library provides a safe emit wrapper; user logic never calls DOM APIs directly.

---

## Data Flow and Composition

### 13) Data Flow
- Single source of truth per store (local or global).
- Actions are the only way to change state.
- Component subscribes to its own store (local) and/or selector-derived props (global).
- Render is pure function of (state, props).

### 14) Composition Patterns
- Higher-order reducers:
  - withLogging(reducer), withUndo(reducer), withPersistence(reducer, read/write adapters) — all pure shells returning new reducers; persistence adapters live at edges.
- Higher-order views:
  - withEmptyState(view), withLoading(view), withError(view)
- Container-presentational split:
  - Container wires store/props; presentational view is a pure function.

---

## Declarative Rendering Engine

### 15) VDOM/Template Requirements
- Minimal VNode shape:
  - { type: string | ComponentRef, key?: string|number, props?: object, children?: VNode[] | string }
- Patching:
  - Diff by type and key
  - Update attributes/properties (dataset, boolean props, class, style)
  - Event listeners: add/remove with stable identities
  - Text nodes: update when changed
  - Lists: keyed reconciliation, move/insert/remove minimal ops
- Performance and correctness:
  - Batch DOM mutations within a micro-task/frame
  - Avoid re-attaching identical listeners
  - Avoid full re-render when shouldRender returns false

---

## State Management Details

### 16) Reducers and Actions
- Action shape: { type: string, payload?: unknown, meta?: unknown }
- Reducers must:
  - Not mutate state or payload
  - Return prev state when no changes (enable shouldRender optimization)
  - Use immutable update helpers (provided by library or inline)
- Library helpers:
  - updateAt(path, fn)
  - setAt(path, value)
  - mapListByKey(list, key, updater)

### 17) Global Store Integration
- connect(store, selector): returns { subscribe, getDerivedProps }
- Selector must be pure and may be memoized; receives (globalState, ownProps).
- Component re-renders when derivedProps changes by shallowEqual.

---

## Coding Standards and Best Practices

### 18) Functional Coding Standards
- Pure core: No DOM APIs, Date.now(), Math.random(), fetch in init/reducer/view.
- Immutability:
  - Freeze state in dev; avoid deep mutation.
  - Prefer structural sharing; avoid structuredClone in hot paths.
- Error handling:
  - Prefer Result-like values for pure business logic if needed: { ok:true, value } | { ok:false, error }
  - No exceptions from pure functions; boundary adapters translate to console/error events as needed.
- Naming:
  - Reducers: verbNoun e.g., setQuery, addItem
  - Actions: DOMAIN/EVENT e.g., LIST/ADD_ITEM
- Accessibility (a11y):
  - Views must set roles/aria-* attributes where appropriate.
  - Focus management via declarative props; actual focus calls executed by adapter (effect) if required.

---

## Examples (Abbreviated, Pure Logic Emphasis)

### 19) List Component (items with add/remove)
- init: () => ({ items: [] })
- actions: LIST/ADD, LIST/REMOVE
- reducer:
  - ADD: return { ...state, items: [...state.items, payload.item] }
  - REMOVE: return { ...state, items: state.items.filter(i => i.id !== payload.id) }
- view(state):
  - ul with li keyed by id, remove buttons
  - onClick removeButton => returns { type: 'LIST/REMOVE', payload: { id } }

### 20) Form Component (controlled inputs)
- init: () => ({ values: { email: '' }, errors: {} })
- actions: FORM/CHANGE, FORM/SUBMIT
- reducer:
  - CHANGE: setAt(['values', name], value)
  - SUBMIT: validate(values) => either set errors or emit submit event (effect by adapter) and reset state
- view:
  - input value from state.values.email
  - onInput => { type: 'FORM/CHANGE', payload: { name: 'email', value: event.target.value } }

### 21) Modal Component (open/close, slots)
- props: { open: boolean }
- actions: MODAL/CLOSE
- reducer: toggle open
- view: dialog markup; onBackdropClick => CLOSE
- emit 'modal:closed' CustomEvent when transitioning open:false (adapter emits after state change)

---

## Testing Strategy

### 22) Unit Testing (Pure)
- Reducers:
  - Given state + action => expected newState (object equality)
  - No mutation: assert prevState unchanged (deepFreeze in tests)
- Views:
  - Given (state, props) => stable VNode/TemplateResult
  - Snapshot tests of VNode structure; targeted tests for specific dynamic attributes

### 23) Integration/DOM Testing
- Custom Element:
  - Mount element, set attributes/props, dispatch actions via UI events
  - Assert DOM updates occurred as per diff rules
  - Verify CustomEvents emitted with correct detail and composed:true
- Performance:
  - Batch multiple dispatches => single render per animation frame
- Tooling:
  - Test runner: browser-based (Web Test Runner/Karma) or jsdom where sufficient
  - Coverage thresholds: 90% reducers, 80% views, 70% adapters

---

## Non-Functional Requirements

### 24) Performance
- Target render throughput: 60fps on typical list sizes (e.g., 100 items)
- Diff complexity: approximately O(n) with keyed lists; avoid quadratic behavior
- Bundle size: < 10KB min+gzip core (no polyfills)
- No runtime dependencies

### 25) Compatibility
- Browsers: Last 2 versions of evergreen browsers; Safari 15+ (adoptedStyleSheets fallback to <style>)
- Shadow DOM: native; no ShadyDOM requirement
- ES Modules: distributed as ESM; no transpilation required for core

### 26) Accessibility and Security
- Provide utilities for aria attributes; document best practices
- All event details sanitized; no innerHTML from untrusted data without explicit opt-in

---

## Acceptance Criteria

### 27) Must-Haves
- defineComponent API generating a working Custom Element skeleton
- Pure init/reducer/view path with immutable state updates
- Working diff/patch engine with keyed list support and event binding
- Local store per component and optional global store; unidirectional data flow
- CustomEvent-based communication across shadow boundaries (composed:true)
- Dev-only immutability guards (freeze or Proxy) and helpful warnings
- Examples: list, form, modal—demonstrating reducers, props, events, and re-render
- Test suite covering reducers, views, and element behavior with high coverage

### 28) Nice-to-Haves
- Tagged template renderer (html) alongside VNode h()
- Memoization utilities for subtrees
- Form-associated custom elements (ElementInternals) for advanced form integration

---

## Milestones and Deliverables

### 29) Phased Plan
- M1: Core types and utilities (h/html, VNode, diff/patch, scheduler)
- M2: Store (local/global), reducers/actions, immutability enforcement (dev)
- M3: defineComponent adapter (lifecycle, props/attributes, styles adoption)
- M4: Events and communication (handler wrappers, CustomEvent emit)
- M5: Examples (list, form, modal) and docs
- M6: Test suite and CI setup, performance smoke tests

---

## Open Questions
- Should we ship both VNode and tagged template renderers, or pick one for v1?
- Dev-time immutability: deepFreeze vs Proxy trade-offs?
- Provide a minimal Result helper for pure business logic, or keep outside core?

---

If you’d like, I can save this as docs/trd-functional-web-components.md in your repo. Would you prefer that path or a different location?

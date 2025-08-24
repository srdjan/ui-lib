# funcwc - DOM-Native SSR Web Components

**Ultra-lightweight, type-safe web components with the DOM as your state container.**

Built for Deno + TypeScript, funcwc takes a revolutionary approach: **the DOM _is_ the state**. No JavaScript state objects, no synchronization overhead, just pure DOM manipulation with a delightful developer experience.

## ✨ Key Features

- **🎯 DOM-Native State**: Component state lives in CSS classes, data attributes, and element content
- **⚡ Type-Safe**: Full TypeScript inference with zero casting required  
- **🚀 SSR-First**: Render on server, send optimized HTML
- **🔄 HTMX Ready**: Built-in server actions for dynamic updates
- **📦 Zero Runtime**: No client-side framework dependencies
- **🎨 Functional API**: Chainable pipeline design

## 🚀 Quick Start

```bash
# Clone and run examples
git clone <repository-url> && cd funcwc
deno task serve  # → http://localhost:8080
```

## 🎯 Philosophy: DOM as State

Instead of managing JavaScript state objects, funcwc uses the DOM itself:

- **CSS Classes** → UI states (`active`, `open`, `loading`)
- **Data Attributes** → Component data (`data-count="5"`)  
- **Element Content** → Display values (counter numbers, text)
- **Form Values** → Input states (checkboxes, text inputs)

This eliminates state synchronization bugs and makes debugging trivial—just inspect the DOM!

## 🎬 See It In Action

Run `deno task serve` and visit http://localhost:8080 to see all examples working:

- **🎨 Theme Toggle**: CSS class switching
- **🔢 Counter**: Data attributes + element content  
- **✅ Todo Items**: Checkbox state + HTMX server sync
- **📁 Accordion**: Pure CSS transitions
- **📑 Tabs**: Multi-element state coordination

## 📋 Complete Examples

### 🎨 Theme Toggle - Pure DOM State

```tsx
import { component, toggleClasses } from './src/index.ts';

component('theme-toggle')
  .styles(`
    .theme-btn { padding: 0.5rem 1rem; border: 1px solid; border-radius: 6px; cursor: pointer; }
    .theme-btn.light { background: #fff; color: #333; }
    .theme-btn.dark { background: #333; color: #fff; }
    .theme-btn.dark .light-icon { display: none; }
    .theme-btn.light .dark-icon { display: none; }
  `)
  .view(() => (
    <button
      class="theme-btn light"
      onClick={toggleClasses(['light', 'dark'])} // ✨ Direct function call!
    >
      <span class="light-icon">☀️ Light</span>
      <span class="dark-icon">🌙 Dark</span>
    </button>
  ));
```

**Key Benefits:**
- ✅ No JavaScript state objects
- ✅ CSS handles the visual transitions  
- ✅ State visible in DOM inspector
- ✅ Type-safe event handlers

### 🔢 Counter - Type-Safe Props + DOM State

```tsx
import { component, updateParentCounter, resetCounter } from './src/index.ts';

component('counter')
  .props({ initialCount: 'number?', step: 'number?' }) // Type hints
  .styles(`
    .counter { display: inline-flex; gap: 0.5rem; padding: 1rem; border: 2px solid #007bff; }
    .counter button { padding: 0.5rem; background: #007bff; color: white; border: none; }
    .count-display { font-size: 1.5rem; min-width: 3rem; text-align: center; }
  `)
  .view((props) => {
    // ✨ Fully typed props - no casting needed in latest version!
    const count = props.initialCount ?? 0;  
    const step = props.step ?? 1;
    
    return (
      <div class="counter" data-count={count}>
        <button onClick={updateParentCounter('.counter', '.count-display', -step)}>-{step}</button>
        <span class="count-display">{count}</span>
        <button onClick={updateParentCounter('.counter', '.count-display', step)}>+{step}</button>
        <button onClick={resetCounter('.count-display', count, '.counter')}>Reset</button>
      </div>
    );
  });
```

**DOM State in Action:**
- Counter value stored in `data-count` attribute
- Display synced with element `.textContent`
- No JavaScript variables to manage!

### ✅ Todo Item - Server Actions + Local State

```tsx
import { component, conditionalClass, syncCheckboxToClass } from './src/index.ts';

component('todo-item')
  .props({ id: 'string', text: 'string', done: 'boolean?' })
  .serverActions({
    toggle: (id) => ({ 'hx-patch': `/api/todos/${id}/toggle` }),
    delete: (id) => ({ 'hx-delete': `/api/todos/${id}` }),
  })
  .api({
    'PATCH /api/todos/:id/toggle': async (req, params) => {
      // Handle server-side toggle logic
      return renderComponent('todo-item', updatedProps);
    }
  })
  .view((props, serverActions) => {
    const isDone = Boolean(props.done);
    
    return (
      <div class={`todo ${conditionalClass(isDone, 'done')}`} data-id={props.id}>
        <input 
          type="checkbox" 
          checked={isDone} 
          onChange={syncCheckboxToClass('done')} // ✨ Local DOM state
          {...(serverActions?.toggle?.(props.id) || {})} // ✨ Server persistence
        />
        <span class="todo-text">{props.text}</span>
        <button {...(serverActions?.delete?.(props.id) || {})}>×</button>
      </div>
    );
  });
```

**Hybrid State Management:**
- ✅ **Local UI state**: Checkbox syncs to CSS class instantly
- ✅ **Server persistence**: HTMX handles data updates
- ✅ **No state conflicts**: DOM is the single source of truth

## 🔧 Pipeline API Reference

### `component(name: string)`
Starts a new component definition. Component names should be kebab-case.

```tsx
component('my-component') // Creates <my-component> custom element
```

### `.props(spec: PropSpec)`
Type-safe prop parsing with automatic TypeScript inference.

```tsx
.props({ 
  count: 'number',      // Required number
  step: 'number?',      // Optional number  
  disabled: 'boolean?', // Optional boolean
  title: 'string'       // Required string
})
// Props are fully typed in .view() - no casting needed!
```

### `.serverActions(actions: ActionMap)`
Define server-side actions that return HTMX attributes.

```tsx
.serverActions({
  save: (id) => ({ 'hx-post': `/api/save/${id}`, 'hx-target': '#result' }),
  delete: (id) => ({ 'hx-delete': `/api/items/${id}`, 'hx-confirm': 'Delete?' })
})
```

### `.api(routes: RouteMap)` 
Define API endpoints directly in the component.

```tsx
.api({
  'POST /api/items': async (req) => { /* handle create */ },
  'DELETE /api/items/:id': async (req, params) => { /* handle delete */ }
})
```

### `.styles(css: string)`
Component-scoped CSS that renders with SSR output.

```tsx
.styles(`
  .my-button { background: blue; color: white; }
  .my-button:hover { background: darkblue; }
`)
```

### `.view((props, serverActions?, parts?) => JSX.Element)`
The render function. Returns JSX that compiles to optimized HTML strings.

```tsx
.view((props, serverActions) => (
  <div class="container">
    <button onClick={someAction}>Click me</button>
  </div>
))
```

## 🎮 DOM Action Helpers

**Type-safe functions for common DOM operations. Use directly in event handlers:**

### Class Manipulation
```tsx
toggleClass('active')                    // Toggle single class
toggleClasses(['open', 'visible'])       // Toggle multiple classes
toggleParentClass('expanded')            // Toggle class on parent element
```

### Counter Operations  
```tsx
updateParentCounter('.container', '.display', 5)   // Increment by 5
updateParentCounter('.container', '.display', -1)  // Decrement by 1
resetCounter('.display', 0, '.container')          // Reset to initial value
```

### Form & UI Interactions
```tsx
syncCheckboxToClass('completed')                          // Checkbox state → CSS class
activateTab('.tabs', '.tab-btn', '.content', 'active')   // Tab system activation
```

### Template Utilities
```tsx
conditionalClass(isOpen, 'open', 'closed')  // Conditional CSS classes
spreadAttrs({ 'hx-get': '/api/data' })       // Spread HTMX attributes
dataAttrs({ userId: 123, role: 'admin' })    // Generate data-* attributes
```

**All helpers generate optimized, minified JavaScript for production SSR output.**

## 🛠 Development Commands

```bash
deno task serve      # Development server → http://localhost:8080
deno task start      # Type check + serve (recommended)
deno task check      # Type check all files
deno task test       # Run tests
deno task fmt        # Format code
deno task lint       # Lint code
```

## 🎯 Why funcwc?

### Traditional React/Vue Problems:
```tsx
// ❌ Complex state management
const [count, setCount] = useState(0);
const [isOpen, setIsOpen] = useState(false);
const [loading, setLoading] = useState(false);

// ❌ State synchronization bugs
// ❌ Prop drilling
// ❌ Large bundle sizes
// ❌ Hydration mismatches
```

### funcwc Solution:
```tsx
// ✅ DOM is the state - no synchronization needed!
component('my-widget')
  .view(() => (
    <div class="widget closed" data-count="0">
      <button onClick={toggleClass('open')}>Toggle</button>
      <span class="counter">0</span>
    </div>
  ));

// ✅ Zero runtime JavaScript
// ✅ Perfect SSR
// ✅ No hydration issues
// ✅ Instant debugging (inspect DOM)
```

## 🚀 Performance Benefits

- **🏃‍♂️ Faster**: No client-side state management overhead
- **📦 Smaller**: Zero runtime dependencies, minimal JavaScript
- **🔧 Simpler**: DOM inspector shows all state
- **⚡ Instant**: Direct DOM manipulation, no virtual DOM
- **🎯 Reliable**: No state synchronization bugs

---

**Built with ❤️ for the modern web. Deno + TypeScript + DOM-native state management.**
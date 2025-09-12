# ✨ ui-lib Ergonomic API - Three Breakthroughs Restored

The **Ergonomic API** represents the original vision of ui-lib: eliminating duplication, automating tedious tasks, and creating a seamless developer experience. This document explains the three core breakthroughs that make ui-lib unique.

## 🎯 The Three Ergonomic Breakthroughs

### 1️⃣ Function-Style Props (Zero Duplication!)

**Problem**: Traditional component systems require defining props twice - once in the interface and once in the render function.

**Solution**: Props are auto-inferred from render function parameters using TypeScript magic.

```tsx
// ❌ Traditional way (duplication)
interface Props {
  title: string;
  count: number;
  active: boolean;
}

function render(props: Props) { ... }

// ✅ Ergonomic way (zero duplication)
render: ({
  title = string("Default Title"),
  count = number(0), 
  active = boolean(false)
}, api, classes) => { ... }
```

**Benefits**:
- ✅ Zero duplication - define props once
- ✅ Full TypeScript type safety
- ✅ Auto-generated prop validation
- ✅ Default values built-in

### 2️⃣ CSS-Only Format (Auto-Generated Classes!)

**Problem**: Manual CSS class naming leads to conflicts, inconsistency, and maintenance overhead.

**Solution**: Write pure CSS properties. Class names are auto-generated and scoped.

```tsx
// ❌ Traditional way (manual classes)
<div class="card-container">
  <h2 class="card-title">Title</h2>
</div>

.card-container { padding: 1rem; background: white; }
.card-title { font-size: 1.2rem; color: #333; }

// ✅ Ergonomic way (auto-generated classes)
styles: {
  container: `{ padding: 1rem; background: white; }`,
  title: `{ font-size: 1.2rem; color: #333; }`
}

render: (props, api, classes) => (
  `<div class="${classes.container}">
     <h2 class="${classes.title}">Title</h2>
   </div>`
)
```

**Benefits**:
- ✅ No manual class naming
- ✅ Automatic scoping prevents conflicts
- ✅ CSS-in-TS with full IntelliSense
- ✅ Consistent naming conventions

### 3️⃣ Unified API System (HTMX Auto-Generated!)

**Problem**: Connecting frontend and backend requires manual HTMX configuration and endpoint management.

**Solution**: Define server endpoints once. Client functions with HTMX attributes are generated automatically.

```tsx
// ❌ Traditional way (manual HTMX)
<button 
  hx-patch="/api/todos/123/toggle"
  hx-target="#todo-list"
  hx-swap="innerHTML">
  Toggle
</button>

// ✅ Ergonomic way (auto-generated HTMX)
api: {
  toggle: patch("/api/todos/:id/toggle", toggleHandler)
}

render: ({ id }, api, classes) => (
  `<button ${api.toggle(id)}>Toggle</button>`
)
// Generates: hx-patch="/api/todos/123/toggle" hx-target="..." hx-swap="..."
```

**Benefits**:
- ✅ Type-safe API calls
- ✅ Automatic HTMX attribute generation
- ✅ Seamless server-client integration
- ✅ No manual endpoint configuration

## 🚀 Quick Start

### Installation

```bash
# Import the ergonomic API
import {
  defineErgonomicComponent,
  defineSimpleComponent,
  defineApiComponent,
  string, number, boolean, oneOf,
  patch, post, del
} from "ui-lib/mod-ergonomic.ts";
```

### Basic Example

```tsx
// ✨ All three breakthroughs in one component!
defineErgonomicComponent({
  name: "user-card",
  
  // ✨ Breakthrough 2: CSS-Only Format
  styles: {
    card: `{ 
      background: white; 
      padding: 2rem; 
      border-radius: 0.5rem; 
      box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
    }`,
    name: `{ 
      font-size: 1.5rem; 
      font-weight: bold; 
      color: #333; 
    }`,
    button: `{ 
      background: #007bff; 
      color: white; 
      border: none; 
      padding: 0.5rem 1rem; 
      border-radius: 0.25rem; 
    }`
  },
  
  // ✨ Breakthrough 3: Unified API System
  api: {
    updateProfile: patch("/api/users/:id", updateHandler),
    deleteUser: del("/api/users/:id", deleteHandler)
  },
  
  // ✨ Breakthrough 1: Function-Style Props (Zero Duplication!)
  render: ({
    id = string(),
    name = string("Anonymous"),
    email = string(""),
    role = oneOf(["user", "admin"], "user"),
    active = boolean(true)
  }, api, classes) => (
    `<div class="${classes.card}">
       <h2 class="${classes.name}">${name}</h2>
       <p>Email: ${email}</p>
       <p>Role: ${role}</p>
       <p>Status: ${active ? "Active" : "Inactive"}</p>
       
       <button class="${classes.button}" ${api.updateProfile(id)}>
         Update Profile
       </button>
       
       <button class="${classes.button}" ${api.deleteUser(id)}>
         Delete User
       </button>
     </div>`
  )
});
```

### Usage in HTML

```html
<!-- All props are type-safe and auto-validated -->
<user-card 
  id="user-123"
  name="John Doe"
  email="john@example.com"
  role="admin"
  active>
</user-card>
```

## 📚 API Reference

### Component Definition Functions

#### `defineErgonomicComponent(config)`

Full-featured component with all three breakthroughs.

```tsx
defineErgonomicComponent({
  name: "component-name",
  styles: { /* CSS-only format */ },
  api: { /* Unified API system */ },
  render: (/* Function-style props */) => "..."
});
```

#### `defineSimpleComponent(name, render, styles?)`

Simplified syntax for components without API integration.

```tsx
defineSimpleComponent("simple-card",
  ({ title = string("Default") }, api, classes) => 
    `<div class="${classes.card}">${title}</div>`,
  {
    card: `{ padding: 1rem; background: white; }`
  }
);
```

#### `defineApiComponent(name, render, api, styles?)`

Component with API integration but simplified syntax.

```tsx
defineApiComponent("api-button",
  ({ id = string() }, api, classes) =>
    `<button ${api.save(id)}>Save</button>`,
  {
    save: patch("/api/items/:id", saveHandler)
  }
);
```

### Prop Helpers

- `string(defaultValue?)` - String prop with optional default
- `number(defaultValue?)` - Number prop with optional default  
- `boolean(defaultValue?)` - Boolean prop with optional default
- `oneOf(options, defaultValue?)` - Enum prop with options
- `array(defaultValue?)` - Array prop with optional default
- `object(defaultValue?)` - Object prop with optional default

### API Helpers

- `get(path, handler)` - GET endpoint
- `post(path, handler)` - POST endpoint
- `put(path, handler)` - PUT endpoint
- `patch(path, handler)` - PATCH endpoint
- `del(path, handler)` - DELETE endpoint

## 🎮 Live Demo

Run the interactive demo to see all three breakthroughs in action:

```bash
# Start the ergonomic API demo
deno task serve:ergonomic

# Open http://localhost:8080
```

The demo showcases:
- ✅ Function-style props with zero duplication
- ✅ Auto-generated CSS classes from pure CSS
- ✅ Type-safe component usage
- ✅ Beautiful, responsive design

## 🔄 Migration Guide

### From Traditional Components

```tsx
// Before: Traditional component
interface CardProps {
  title: string;
  count: number;
}

defineComponent("old-card", {
  props: (attrs) => ({
    title: attrs.title || "Default",
    count: parseInt(attrs.count || "0")
  }),
  styles: ".card { padding: 1rem; } .title { font-weight: bold; }",
  render: (props) => `
    <div class="card">
      <h2 class="title">${props.title}</h2>
      <p>Count: ${props.count}</p>
    </div>
  `
});

// After: Ergonomic component
defineErgonomicComponent({
  name: "new-card",
  styles: {
    card: `{ padding: 1rem; }`,
    title: `{ font-weight: bold; }`
  },
  render: ({
    title = string("Default"),
    count = number(0)
  }, api, classes) => `
    <div class="${classes.card}">
      <h2 class="${classes.title}">${title}</h2>
      <p>Count: ${count}</p>
    </div>
  `
});
```

**Benefits of Migration**:
- 🎯 50% less code
- ✅ Better type safety
- 🎨 Scoped CSS classes
- 🚀 Ready for API integration

## 🎉 Summary

The **Ergonomic API** transforms ui-lib from a component library into a complete development experience:

1. **Zero Duplication** - Props defined once, inferred everywhere
2. **Auto-Generated Classes** - Write CSS, get scoped classes automatically  
3. **Unified API System** - Server endpoints become client functions seamlessly

This is the original vision of ui-lib realized: **maximum developer productivity with minimum boilerplate**.

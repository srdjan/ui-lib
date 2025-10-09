# Getting Started with ui-lib

This guide will help you get up and running with ui-lib in minutes.

> Note: In application code, render components with `render(<Component />)`.
> `renderComponent` remains available for low-level access, but most users can
> stick with JSX.

## Prerequisites

- [Deno](https://deno.land/) 2.0 or higher
- Basic knowledge of TypeScript and HTML
- Familiarity with server-side rendering concepts

## Installation

### Using Deno (Recommended)

ui-lib is designed to work seamlessly with Deno:

```typescript
// Import from Deno registry
import { defineComponent, h } from "https://deno.land/x/ui_lib/mod.ts";

// Or use import map
// deno.json
{
  "imports": {
    "ui-lib": "https://deno.land/x/ui_lib/mod.ts"
  }
}
```

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/ui-lib.git
cd ui-lib

# Install and run
deno task check  # Type check
deno task test   # Run tests
deno task serve  # Start dev server
deno task bundle:state  # Emit dist/ui-lib-state.js for browser progressive enhancement

> Need help choosing between `mod.ts` and `mod-simple.ts`? The README now includes an entry point matrix to guide you.
```

## Your First Component

**Important:** Applications use `defineComponent()` to compose pre-styled
library components, not to add custom styles. Custom styling is reserved for
library components only.

Let's create a greeting component using library components:

```tsx
import { defineComponent, h } from "ui-lib";
import { Card } from "ui-lib/components";

defineComponent("greeting", {
  render: ({ name = "World" }) => (
    <card variant="elevated" padding="lg">
      <h1>Hello, {name}!</h1>
      <p>Welcome to ui-lib</p>
    </card>
  ),
});

// Use the component (JSX → HTML string)
const html = <greeting name="Developer" />;
console.log(html);
```

### Why No Custom Styles in Apps?

ui-lib enforces UI consistency by providing a rich library of pre-styled
components with variants. Applications compose these components rather than
adding custom CSS. This provides:

- **Consistency**: Uniform UI across all applications
- **Speed**: No CSS authoring needed
- **Quality**: Library components are rigorously tested
- **Maintainability**: Style updates happen at the library level

If you need to create styled components for the library itself, see the
[Library Development Guide](./library-development.md).

## Using Function-Style Props

ui-lib provides type-safe prop helpers that eliminate boilerplate:

```tsx
import { array, boolean, defineComponent, number, string } from "ui-lib";

defineComponent("todo-list", {
  render: ({
    title = string("My Todos"),
    items = array<string>([]),
    showCompleted = boolean(true),
    maxItems = number(10),
  }) => {
    const itemsToShow = items.slice(0, maxItems);
    const itemsHtml = itemsToShow.map((item) => `<li>${item}</li>`).join("");

    return `
      <div class="todo-list">
        <h2>${title}</h2>
        <ul>${itemsHtml}</ul>
        ${showCompleted ? "<p>Showing completed items</p>" : ""}
      </div>
    `;
  },
});

// Usage (JSX-only in app code)
const html = (
  <todo-list
    title="Shopping List"
    items={["Milk", "Bread", "Eggs"]}
    maxItems={5}
  />
);
```

## API Integration - Component-Colocated APIs

Define server endpoints directly in your components using HTTP method helpers. **HTMX is completely abstracted away** - no `hx-*` attributes in your code!

### Basic Example

```tsx
import { defineComponent, del, h, post } from "ui-lib/mod.ts";

defineComponent("todo-item", {
  api: {
    toggle: post("/api/todos/:id/toggle", toggleHandler),
    deleteTodo: del("/api/todos/:id", deleteHandler),
  },
  render: ({ todo }, api) => {
    // Direct spread operator - HTMX hidden!
    const toggleAttrs = Object.entries(api!.toggle(todo.id))
      .map(([key, value]) => `${key}="${value}"`)
      .join(" ");

    return (
      <div class="todo-item">
        <input
          type="checkbox"
          checked={todo.completed}
          ${toggleAttrs}
        />
        <span>{todo.text}</span>
        <button
          ${Object.entries(api!.deleteTodo(todo.id))
            .map(([k, v]) => `${k}="${v}"`)
            .join(" ")}
        >
          Delete
        </button>
      </div>
    );
  },
});
```

### Available HTTP Method Helpers

```typescript
import { create, del, get, patch, post, put, remove } from "ui-lib/mod.ts";

defineComponent("my-component", {
  api: {
    // Primary helpers
    loadData: get("/api/data", handler),
    createItem: post("/api/items", handler),
    updateItem: patch("/api/items/:id", handler),
    replaceItem: put("/api/items/:id", handler),
    deleteItem: del("/api/items/:id", handler),

    // Aliases
    addItem: create("/api/items", handler),     // Alias for post
    removeItem: remove("/api/items/:id", handler), // Alias for del
  },
  render: (props, api) => {
    // api!.loadData() returns { "hx-get": "/api/data", "hx-target": "this", ... }
    return `<button ${toAttrs(api!.loadData())}>Load</button>`;
  },
});
```

### Path Parameters

Parameters like `:id` are automatically interpolated:

```tsx
// Route: "/api/todos/:id/toggle"
api!.toggle("123")
// Generates: { "hx-post": "/api/todos/123/toggle", ... }

// Route: "/api/posts/:postId/comments/:commentId"
api!.updateComment("post-1", "comment-5")
// Generates: { "hx-patch": "/api/posts/post-1/comments/comment-5", ... }
```

### Complete Real-World Example

From the todo app ([examples/todo-app/components/todo-item.tsx](../examples/todo-app/components/todo-item.tsx)):

```tsx
import { defineComponent, del, h, post } from "ui-lib/mod.ts";
import { todoAPI } from "../api/index.ts";

defineComponent("todo-item", {
  api: {
    toggle: post("/api/todos/:id/toggle", todoAPI.toggleTodo),
    deleteTodo: del("/api/todos/:id", todoAPI.deleteTodo),
  },
  render: ({ todo }, api) => {
    return (
      <item
        title={todo.text}
        completed={todo.completed}
        priority={todo.priority}
        badges={[{
          text: todo.priority,
          variant: todo.priority === "high" ? "danger" : "success",
        }]}
        actions={[{
          text: "Delete",
          variant: "danger",
          attributes: Object.entries(api!.deleteTodo(todo.id))
            .map(([k, v]) => `${k}="${v}"`)
            .join(" "),
        }]}
        icon={`<input
          type="checkbox"
          ${todo.completed ? "checked" : ""}
          ${Object.entries(api!.toggle(todo.id))
            .map(([k, v]) => `${k}="${v}"`)
            .join(" ")}
        />`}
      />
    );
  },
});

// Register API routes once in your server
import { registerComponentApi } from "ui-lib/mod.ts";
registerComponentApi("todo-item", router);
```

### Key Benefits

- ✅ **Zero HTMX in application code** - All `hx-*` attributes generated internally
- ✅ **Type-safe APIs** - Full TypeScript support with proper types
- ✅ **Direct spread operator** - `{...api!.action(id)}` returns attribute object
- ✅ **Automatic path interpolation** - Parameters like `:id` filled automatically
- ✅ **Centralized routes** - All API endpoints defined with the component
- ✅ **Single registration** - Call `registerComponentApi()` once per component

## Styling Components

### CSS-in-TypeScript

Define styles directly in TypeScript with full type safety:

```tsx
import { css, defineComponent, string } from "ui-lib";

defineComponent("styled-card", {
  styles: css({
    padding: "1.5rem",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  }),
  render: ({ children = string() }) =>
    `<div class="styled-card">${children}</div>`,
});
```

### Typing Topics and Events (optional)

You can type helpers per call using generics:

```ts
import {
  dispatchEvent,
  getState,
  listensFor,
  publishState,
  subscribeToState,
} from "ui-lib";

type CartState = {
  items: { id: string; name: string; quantity: number; price: number }[];
  count: number;
  total: number;
};

type NotificationPayload = {
  message: string;
  type: "info" | "success" | "error" | "warning";
  duration?: number;
};

publishState<CartState>("cart", { items: [], count: 0, total: 0 });

subscribeToState<CartState>(
  "cart",
  `
  const { items, count, total } = data;
  this.querySelector('.count').textContent = String(count);
  this.querySelector('.total').textContent = total.toFixed(2);
`,
);

dispatchEvent<NotificationPayload>("show-notification", {
  message: "Saved!",
  type: "success",
  duration: 2000,
});

listensFor<NotificationPayload>(
  "show-notification",
  `console.log('notify', event.detail)`,
);

getState<CartState>("cart");
```

### Using CSS Variables

Leverage CSS custom properties for theming:

```tsx
const ThemedButton = defineComponent({
  name: "themed-button",
  styles: {
    backgroundColor: "var(--primary-color, #007bff)",
    color: "var(--text-color, white)",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "var(--border-radius, 4px)",
  },
  render: ({ label }) => <button class="themed-button">{label}</button>,
});
```

## Using Built-in Components

ui-lib comes with 50+ pre-built components:

```tsx
import { Alert, Button, Card, Input, Modal } from "ui-lib/components";

// Create a form
const ContactForm = () => (
  <Card title="Contact Us">
    <Input
      label="Name"
      placeholder="Enter your name"
      required
    />

    <Input
      label="Email"
      type="email"
      placeholder="your@email.com"
      required
    />

    <Button variant="primary" fullWidth>
      Submit
    </Button>
  </Card>
);
```

## Adding Reactivity

### Basic Reactivity with HTMX

```tsx
const SearchBox = defineComponent({
  name: "search-box",
  api: {
    search: ["GET", "/api/search", searchHandler],
  },
  render: (props, api) => (
    <div class="search-box">
      <input
        type="search"
        name="q"
        placeholder="Search..."
        onAction={{
          api: "search",
          attributes: {
            "hx-trigger": "keyup changed delay:500ms",
            "hx-target": "#search-results",
          },
        }}
      />
      <div id="search-results"></div>
    </div>
  ),
});
```

### CSS Property Reactivity

```tsx
const ThemeSwitch = defineComponent({
  name: "theme-switch",
  reactive: {
    css: {
      "--theme-mode": "data-theme",
    },
  },
  render: () => (
    <div class="theme-switch" data-theme="light">
      <button onclick="this.parentElement.dataset.theme =
        this.parentElement.dataset.theme === 'light' ? 'dark' : 'light'">
        Toggle Theme
      </button>
    </div>
  ),
});
```

### State Management

```tsx
const ShoppingCart = defineComponent({
  name: "shopping-cart",
  reactive: {
    state: {
      "cart-items": "data-items",
      "cart-total": "data-total",
    },
    on: {
      "cart:add": "handleAdd",
      "cart:remove": "handleRemove",
    },
  },
  render: () => (
    <div class="shopping-cart" data-items="0" data-total="0">
      <span>
        Items: <span class="count">0</span>
      </span>
      <span>
        Total: $<span class="total">0</span>
      </span>
    </div>
  ),
});
```

## Server Setup

### Basic HTTP Server

```tsx
import { serve } from "https://deno.land/std/http/server.ts";
import { h } from "ui-lib";
import { HomePage } from "./components/HomePage.tsx";

serve(async (req) => {
  const url = new URL(req.url);

  if (url.pathname === "/") {
    const html = <HomePage />;

    return new Response(html, {
      headers: { "content-type": "text/html" },
    });
  }

  return new Response("Not Found", { status: 404 });
}, { port: 8000 });
```

### With Routing

```tsx
import { serve } from "https://deno.land/std/http/server.ts";
import { Router } from "ui-lib/router";
import { AboutPage, ContactPage, HomePage } from "./pages/index.tsx";

const router = new Router();

router.get("/", () => <HomePage />);
router.get("/about", () => <AboutPage />);
router.get("/contact", () => <ContactPage />);

serve(router.handler(), { port: 8000 });
```

## Project Structure

Recommended project structure for ui-lib applications:

```
my-app/
├── deno.json           # Deno configuration
├── import_map.json     # Import mappings
├── src/
│   ├── components/     # Reusable components
│   │   ├── Header.ts
│   │   ├── Footer.ts
│   │   └── Navigation.ts
│   ├── pages/          # Page components
│   │   ├── HomePage.ts
│   │   └── AboutPage.ts
│   ├── styles/         # Global styles
│   │   └── theme.ts
│   ├── server.ts       # HTTP server
│   └── app.ts          # Application entry
├── public/             # Static assets
│   ├── images/
│   └── styles.css
└── tests/              # Test files
    └── components.test.ts
```

## Configuration

### deno.json

```json
{
  "tasks": {
    "dev": "deno run --watch --allow-net --allow-read src/server.ts",
    "start": "deno run --allow-net --allow-read src/server.ts",
    "test": "deno test",
    "check": "deno check src/**/*.ts"
  },
  "imports": {
    "ui-lib": "https://deno.land/x/ui_lib/mod.ts",
    "std/": "https://deno.land/std@0.224.0/"
  },
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "h",
    "strict": true
  }
}
```

## Best Practices

### 1. Component Organization

Keep components small and focused:

```tsx
// Good: Single responsibility
const UserAvatar = defineComponent({
  render: ({ src, alt, size = "md" }) => (
    <img class={`avatar avatar-${size}`} src={src} alt={alt} />
  )
});

// Avoid: Too many responsibilities
const UserProfile = defineComponent({
  render: (props) => (
    // Too complex - break into smaller components
  )
});
```

### 2. Props Validation

Use TypeScript and prop helpers for validation:

```tsx
import { number, string } from "ui-lib";

const ValidatedComponent = defineComponent({
  render: (
    name = string("Default").min(1).max(50),
    age = number(0).min(0).max(120),
  ) => <div>...</div>,
});
```

### 3. Performance

Cache expensive renders:

```tsx
import { cachedRender } from "ui-lib";

const ExpensiveComponent = defineComponent({
  name: "expensive",
  render: cachedRender((props) => {
    // Expensive computation
    return <div>...</div>;
  }, { ttl: 60000 }), // Cache for 1 minute
});
```

## Next Steps

- Explore the [Component API Reference](component-api.md)
- Learn about [Architecture](architecture.md)
- See [Examples](examples.md)
- Read [Best Practices](best-practices.md)

## Getting Help

- Check the [FAQ](faq.md)
- Join our [Discord Community](https://discord.gg/ui-lib)
- Open an [Issue on GitHub](https://github.com/yourusername/ui-lib/issues)
- Read the [API Documentation](https://ui-lib.dev/api)

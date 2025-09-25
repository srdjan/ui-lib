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

Let's create a simple greeting component:

```tsx
import { defineComponent, h } from "ui-lib";

defineComponent("greeting", {
  styles: {
    padding: "2rem",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    textAlign: "center",
  },
  render: ({ name = "World" }) => (
    <div class="greeting">
      <h1>Hello, {name}!</h1>
      <p>Welcome to ui-lib</p>
    </div>
  ),
});

// Use the component (JSX → HTML string)
const html = <greeting name="Developer" />;
console.log(html);
```

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

## API Integration

Integrate server endpoints using the `api` property with the `hx()` wrapper for
complete HTMX configuration:

```tsx
import { defineComponent, h } from "ui-lib";

defineComponent("interactive-button", {
  api: {
    like: ["POST", "/api/posts/:id/like", likeHandler],
    share: ["POST", "/api/posts/:id/share", shareHandler],
  },
  render: ({ postId, likes = 0 }, api) => (
    <div class="post-actions">
      <button
        onAction={{
          api: "like",
          args: [postId],
          attributes: { "hx-target": "#like-count", "hx-swap": "innerHTML" },
        }}
      >
        ❤️ <span id="like-count">{likes}</span>
      </button>
      <button
        onAction={{
          api: "share",
          args: [postId],
          attributes: {
            "hx-target": "#share-status",
            "hx-swap": "innerHTML",
            "hx-confirm": "Share this post?",
          },
        }}
      >
        📤 Share
      </button>
      <div id="share-status"></div>
    </div>
  ),
});
```

The `hx()` wrapper supports all HTMX configuration options:

- `target`: Element to update
- `swap`: How to replace content (innerHTML, outerHTML, etc.)
- `confirm`: Show confirmation dialog
- `trigger`: When to send the request
- `indicator`: Loading indicator
- `vals`: Additional form data
- `headers`: Custom HTTP headers

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

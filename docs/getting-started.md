# Getting Started with ui-lib

This guide will help you get up and running with ui-lib in minutes.

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
```

## Your First Component

Let's create a simple greeting component:

```typescript
import { defineComponent } from "ui-lib";

const Greeting = defineComponent({
  name: "greeting",
  styles: {
    padding: "2rem",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    textAlign: "center"
  },
  render: ({ name = "World" }) => `
    <div class="greeting">
      <h1>Hello, ${name}!</h1>
      <p>Welcome to ui-lib</p>
    </div>
  `
});

// Use the component
const html = Greeting({ name: "Developer" });
console.log(html);
```

## Using Function-Style Props

ui-lib provides type-safe prop helpers that eliminate boilerplate:

```typescript
import { defineComponent, string, number, boolean, array } from "ui-lib";

const TodoList = defineComponent({
  name: "todo-list",
  render: (
    title = string("My Todos"),
    items = array<string>([]),
    showCompleted = boolean(true),
    maxItems = number(10)
  ) => `
    <div class="todo-list">
      <h2>${title}</h2>
      <ul>
        ${items.slice(0, maxItems).map(item => 
          `<li>${item}</li>`
        ).join('')}
      </ul>
      ${showCompleted ? '<p>Showing completed items</p>' : ''}
    </div>
  `
});

// Type-safe usage
TodoList({
  title: "Shopping List",
  items: ["Milk", "Bread", "Eggs"],
  maxItems: 5
});
```

## Styling Components

### CSS-in-TypeScript

Define styles directly in TypeScript with full type safety:

```typescript
import { defineComponent, css } from "ui-lib";

const StyledCard = defineComponent({
  name: "styled-card",
  styles: css({
    padding: "1.5rem",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s",
    "&:hover": {
      transform: "translateY(-2px)"
    }
  }),
  render: ({ children }) => `
    <div class="styled-card">${children}</div>
  `
});
```

### Using CSS Variables

Leverage CSS custom properties for theming:

```typescript
const ThemedButton = defineComponent({
  name: "themed-button",
  styles: {
    backgroundColor: "var(--primary-color, #007bff)",
    color: "var(--text-color, white)",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "var(--border-radius, 4px)"
  },
  render: ({ label }) => `
    <button class="themed-button">${label}</button>
  `
});
```

## Using Built-in Components

ui-lib comes with 50+ pre-built components:

```typescript
import { 
  Button, 
  Card, 
  Input, 
  Alert,
  Modal 
} from "ui-lib/components";

// Create a form
const ContactForm = () => `
  ${Card({
    title: "Contact Us",
    children: `
      ${Input({
        label: "Name",
        placeholder: "Enter your name",
        required: true
      })}
      
      ${Input({
        label: "Email",
        type: "email",
        placeholder: "your@email.com",
        required: true
      })}
      
      ${Button({
        variant: "primary",
        fullWidth: true,
        children: "Submit"
      })}
    `
  })}
`;
```

## Adding Reactivity

### Basic Reactivity with HTMX

```typescript
const SearchBox = defineComponent({
  name: "search-box",
  render: () => `
    <div class="search-box">
      <input 
        type="search"
        name="q"
        placeholder="Search..."
        hx-get="/api/search"
        hx-trigger="keyup changed delay:500ms"
        hx-target="#search-results"
      />
      <div id="search-results"></div>
    </div>
  `
});
```

### CSS Property Reactivity

```typescript
const ThemeSwitch = defineComponent({
  name: "theme-switch",
  reactive: {
    css: {
      "--theme-mode": "data-theme"
    }
  },
  render: () => `
    <div class="theme-switch" data-theme="light">
      <button onclick="this.parentElement.dataset.theme = 
        this.parentElement.dataset.theme === 'light' ? 'dark' : 'light'">
        Toggle Theme
      </button>
    </div>
  `
});
```

### State Management

```typescript
const ShoppingCart = defineComponent({
  name: "shopping-cart",
  reactive: {
    state: {
      "cart-items": "data-items",
      "cart-total": "data-total"
    },
    on: {
      "cart:add": "handleAdd",
      "cart:remove": "handleRemove"
    }
  },
  render: () => `
    <div class="shopping-cart" data-items="0" data-total="0">
      <span>Items: <span class="count">0</span></span>
      <span>Total: $<span class="total">0</span></span>
    </div>
  `
});
```

## Server Setup

### Basic HTTP Server

```typescript
import { serve } from "https://deno.land/std/http/server.ts";
import { renderComponent } from "ui-lib";
import { HomePage } from "./components/HomePage.ts";

serve(async (req) => {
  const url = new URL(req.url);
  
  if (url.pathname === "/") {
    const html = await renderComponent("home-page", {});
    
    return new Response(html, {
      headers: { "content-type": "text/html" }
    });
  }
  
  return new Response("Not Found", { status: 404 });
}, { port: 8000 });
```

### With Routing

```typescript
import { serve } from "https://deno.land/std/http/server.ts";
import { Router } from "ui-lib/router";
import * as pages from "./pages/index.ts";

const router = new Router();

router.get("/", () => pages.HomePage());
router.get("/about", () => pages.AboutPage());
router.get("/contact", () => pages.ContactPage());

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

```typescript
// Good: Single responsibility
const UserAvatar = defineComponent({
  render: ({ src, alt, size = "md" }) => 
    `<img class="avatar avatar-${size}" src="${src}" alt="${alt}" />`
});

// Avoid: Too many responsibilities
const UserProfile = defineComponent({
  render: (props) => 
    // Too complex - break into smaller components
});
```

### 2. Props Validation

Use TypeScript and prop helpers for validation:

```typescript
import { string, number } from "ui-lib";

const ValidatedComponent = defineComponent({
  render: (
    name = string("Default").min(1).max(50),
    age = number(0).min(0).max(120)
  ) => `...`
});
```

### 3. Performance

Cache expensive renders:

```typescript
import { cachedRender } from "ui-lib";

const ExpensiveComponent = defineComponent({
  name: "expensive",
  render: cachedRender((props) => {
    // Expensive computation
    return `...`;
  }, { ttl: 60000 }) // Cache for 1 minute
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
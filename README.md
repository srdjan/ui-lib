# ui-lib

Ultra-lightweight, type-safe SSR components with DOM-native state management and
hybrid reactivity.

## Features

- 🌐 SSR-first, JSX-always rendering
- 🧭 Light Functional Programming: types-first, pure functions, Result<T,E>, no
  classes
- 🧩 DOM-native state: classes, data-* attributes, element content, CSS custom
  properties
- 🔒 **Token-Based Customization**: Components sealed with CSS variable
  interface
- 🎨 **Zero Style Conflicts**: All customization through standardized tokens
- 🕵️ HTMX encapsulated via component APIs (no hx-* in application code)
- 📦 Component-colocated API, styles, and reactivity
- 🔧 Type-safe end-to-end with strict TypeScript
- 📚 50+ components; progressive enhancement optional (zero framework runtime)

## Quick Start

### Choosing an Entry Point

| Entry Point     | Use When                                                                       | Highlights                                                            |
| --------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| `mod-token.ts`  | **Recommended**: Token-based sealed components with CSS variable customization | Block-level components only, token customization API, theme support   |
| `mod.ts`        | You need the stable SSR-focused surface with registry-driven components.       | Full prop helpers, CSS-in-TS, reactive helpers, router, API bindings. |
| `mod-simple.ts` | You want direct JSX functions and minimal ceremony.                            | JSX runtime, lightweight state helpers, curated component subset.     |

> **New**: The `mod-token.ts` entry point provides sealed components that can
> only be customized through CSS variables, ensuring complete style
> encapsulation and preventing conflicts.

### Installation

```bash
# Local clone (recommended)
git clone https://github.com/srdjan/ui-lib.git
cd ui-lib

# Dev server & tasks
deno task start         # type-check then start the Todo demo
deno task serve         # start the Todo demo directly
deno task bundle:state  # emits dist/ui-lib-state.js for optional client helpers
```

### Basic Usage (Token-Based - Recommended)

```tsx
import { applyTheme, Button, defineTokens, themes } from "ui-lib/mod-token.ts";

// Option 1: Use pre-built themes
const styles = applyTheme(themes.dark);

// Option 2: Define custom tokens
const customStyles = defineTokens({
  button: {
    primary: {
      background: "#007bff",
      backgroundHover: "#0056b3",
      textColor: "white",
    },
  },
});

// Use sealed components - no access to internals
const button = Button({
  variant: "primary",
  size: "md",
  children: "Click Me",
});
```

### Basic Usage (Traditional)

```tsx
import { defineComponent, h } from "ui-lib/mod.ts";

// Define a component
defineComponent("card", {
  styles: {
    padding: "1rem",
    borderRadius: "0.5rem",
    backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  render: ({ title = "Title", content = "Content" }) => (
    <div class="card">
      <h2>{title}</h2>
      <p>{content}</p>
    </div>
  ),
});

// Use it (JSX evaluates to an HTML string in SSR)
const html = <card title="Hello" content="World" />;
```

> Note: In application code, render components using JSX exclusively.
> `renderComponent` is an internal library helper.

### With Function-Style Props

```tsx
import { boolean, defineComponent, h, number, string } from "ui-lib";

defineComponent("counter", {
  render: ({
    label = string("Count"),
    value = number(0),
    disabled = boolean(false),
  }) => (
    <div class="counter">
      <span>{label}: {value}</span>
      <button disabled={disabled}>Increment</button>
    </div>
  ),
});

// Type-safe usage (JSX-only in app code)
const html = <counter label="Items" value={5} />;
```

### Using Built-in Components

```tsx
import { Alert, Button, Card } from "ui-lib/components";

const Page = () => (
  <>
    <Alert type="success">
      Operation completed!
    </Alert>

    <Card title="Welcome">
      <Button variant="primary">
        Get Started
      </Button>
    </Card>
  </>
);
```

### API Integration

```tsx
import { defineComponent, h } from "ui-lib";

defineComponent("todo-item", {
  api: {
    toggle: ["POST", "/api/todos/:id/toggle", toggleTodo],
    deleteTodo: ["DELETE", "/api/todos/:id", deleteTodo],
  },
  render: ({ id, text, done }, api) => (
    <div class="todo-item" data-component>
      <input
        type="checkbox"
        checked={!!done}
        onAction={{ api: "toggle", args: [id] }}
      />
      <span class={done ? "done" : ""}>{text}</span>
      <button
        class="btn btn--danger"
        onAction={{
          api: "deleteTodo",
          args: [id],
          attributes: { "hx-confirm": "Delete this todo?" },
        }}
      >
        Delete
      </button>
    </div>
  ),
});
```

The `api` property defines server endpoints and the JSX `onAction` prop binds
elements to them. HTMX is encapsulated by the library; defaults
(target/swap/headers) apply automatically.

## Three-Tier Reactivity

### Tier 1: CSS Property Reactivity

Instant visual updates via CSS custom properties:

```tsx
defineComponent("theme-toggle", {
  reactive: {
    css: {
      "--theme": "data-theme",
    },
  },
  render: () => `<button onclick="toggleTheme()">Toggle Theme</button>`,
});
```

### Tier 2: Pub/Sub State Manager

Cross-component state synchronization:

```tsx
defineComponent("cart", {
  reactive: {
    state: {
      "cart-count": "data-count",
    },
  },
  render: () => `
    <div data-count="0">
      Cart Items: <span x-text="count">0</span>
    </div>
  `,
});
```

### Tier 3: DOM Event Communication

Component-to-component messaging:

```tsx
defineComponent("notification", {
  reactive: {
    on: {
      "user:login": "handleLogin",
    },
  },
  render: () => `<div id="notification"></div>`,
});
```

## Token-Based Component System

### Why Token-Based Components?

ui-lib components are **sealed** - they can only be customized through CSS
variables (tokens). This ensures:

- **No style conflicts**: Component internals are completely isolated
- **Consistent theming**: All customization through standardized tokens
- **Type safety**: Full IntelliSense for available tokens
- **Performance**: CSS variables enable instant theming without re-rendering
- **Maintainability**: Component updates won't break your customizations

### Token Customization

```tsx
import {
  customizeComponent,
  defineTokens,
  responsiveTokens,
} from "ui-lib/mod-token.ts";

// Global token overrides
const globalStyles = defineTokens({
  button: {
    primary: {
      background: "#FF5722",
      backgroundHover: "#E64A19",
    },
  },
});

// Scoped overrides for specific sections
const darkModeStyles = customizeComponent(".dark-mode", "button", {
  primary: {
    background: "#1a1a1a",
    textColor: "#ffffff",
  },
});

// Responsive token values
const mobileStyles = responsiveTokens("button", {
  mobile: { base: { fontSize: "0.75rem" } },
  desktop: { base: { fontSize: "1rem" } },
});
```

## Component Library

ui-lib includes 50+ production-ready components (being migrated to token-based):

- **Layout**: AppLayout, Navbar, Sidebar, MainContent
- **Forms**: Input, Select, Textarea, Checkbox, Radio, Switch
- **Buttons**: Button (token-based), ButtonGroup, IconButton
- **Data**: Table, Card, List, Tree
- **Feedback**: Alert, Toast, Progress, Skeleton
- **Overlays**: Modal, Drawer, Popover, Tooltip
- **Navigation**: Tabs, Breadcrumb, Pagination, Stepper
- **Display**: Avatar, Badge, Tag, Chip

## Examples

Run the showcase server to see all components in action:

```bash
# Start the Todo app demo
deno task serve

# Open http://localhost:8080

# Run token-based component demo
deno run --allow-net examples/todo-app/token-demo.tsx
```

Repo layout (examples)

```
examples/
└── todo-app/
    ├── server.tsx         # Traditional demo server entry
    ├── token-demo.tsx     # Token-based component demo
    ├── api/               # Handlers, types, repository
    └── components/        # SSR components with colocated API/styles/reactivity
```

Notes

- **Token-based API** (recommended):
  `import { Button, defineTokens } from 'ui-lib/mod-token.ts'`
- Traditional API: `import { defineComponent } from 'ui-lib/mod.ts'`
- Simple API: `import { h } from 'ui-lib/mod-simple.ts'`

## Performance

- **SSR rendering**: ~0.5ms per component
- **Zero client runtime**: No JavaScript framework needed
- **Tiny footprint**: < 10KB for optional client enhancements
- **Streaming**: Built-in support for streaming responses

## Documentation

- [Getting Started](docs/getting-started.md)
- [Token System Guide](docs/token-system.md) **← New!**
- [Migration Guide](docs/migration-guide.md) **← New!**
- [Architecture](docs/architecture.md)
- [Component API](docs/component-api.md)
- [Examples](docs/examples.md)
- [Modern CSS Architecture](docs/modern-css-architecture.md)

## Development

```bash
# Type check
deno task check

# Run tests
deno task test

# Format code
deno task fmt

# Run examples
deno task serve

# Build documentation
deno task docs
```

## Philosophy

ui-lib reimagines web components by embracing the platform:

1. **State belongs in the DOM** - Not in JavaScript memory
2. **CSS is the styling language** - Not JavaScript objects
3. **HTML is the structure** - Not virtual DOM trees
4. **Progressive enhancement** - Not hydration
5. **Server-first** - Not client-first with SSR bolted on

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md)
for details.

## Support

- [Documentation](https://ui-lib.dev)
- [GitHub Issues](https://github.com/yourusername/ui-lib/issues)
- [Discord Community](https://discord.gg/ui-lib)

# ui-lib

Ultra-lightweight, type-safe SSR components with DOM-native state management and
hybrid reactivity.

## Features

- 🌐 SSR-first, JSX-always rendering
- 🧭 Light Functional Programming: types-first, pure functions, Result<T,E>, no
  classes
- 🧩 DOM-native state: classes, data-* attributes, element content, CSS custom
  properties
- 🕵️ HTMX encapsulated via component APIs (no hx-* in application code)
- 📦 Component-colocated API, styles, and reactivity
- 🎨 CSS-in-TS with collision-free class names
- 🔧 Type-safe end-to-end with strict TypeScript
- 📚 50+ components; progressive enhancement optional (zero framework runtime)

## Quick Start

### Choosing an Entry Point

| Entry Point     | Use When                                                                 | Highlights                                                            |
| --------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| `mod.ts`        | You need the stable SSR-focused surface with registry-driven components. | Full prop helpers, CSS-in-TS, reactive helpers, router, API bindings. |
| `mod-simple.ts` | You want direct JSX functions and minimal ceremony.                      | JSX runtime, lightweight state helpers, curated component subset.     |

> Tip: mix and match by importing from multiple entry points when prototyping,
> then converge on one surface before release.

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

### Basic Usage

```tsx
import { defineComponent, h } from "ui-lib";

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

### With Function-Style Props

```tsx
import {
  boolean,
  defineComponent,
  h,
  number,
  renderComponent,
  string,
} from "ui-lib";

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

// Type-safe usage
const html = renderComponent("counter", { label: "Items", value: "5" });
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

## Component Library

ui-lib includes 50+ production-ready components:

- **Layout**: AppLayout, Navbar, Sidebar, MainContent
- **Forms**: Input, Select, Textarea, Checkbox, Radio, Switch
- **Buttons**: Button, ButtonGroup, IconButton
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
```

Repo layout (examples)

```
examples/
└── todo-app/
    ├── server.tsx         # Demo server entry
    ├── api/               # Handlers, types, repository
    └── components/        # SSR components with colocated API/styles/reactivity
```

Notes

- Public API is exported via `mod.ts` (e.g.,
  `import { defineComponent } from 'ui-lib'`).
- You can optionally type your pub/sub topics and custom events. See “Typing
  Topics and Events” in Getting Started.

## Performance

- **SSR rendering**: ~0.5ms per component
- **Zero client runtime**: No JavaScript framework needed
- **Tiny footprint**: < 10KB for optional client enhancements
- **Streaming**: Built-in support for streaming responses

## Documentation

- [Getting Started](docs/getting-started.md)
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

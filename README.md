# ui-lib

Ultra-lightweight, type-safe SSR components with DOM-native state management and
hybrid reactivity.

## Features

- 🌐 SSR-first, JSX-always rendering
- 🧭 Light Functional Programming: types-first, pure functions, Result<T,E>, no
  classes
- 🧩 DOM-native **state management**: classes, data-* attributes, element content, CSS custom
  properties
- 🔒 **Composition-Only Pattern**: Apps compose pre-styled components, enforcing
  UI consistency
- 🎨 **Zero Style Conflicts**: No custom CSS in apps
- 🕵️ **HTMX** encapsulated via component APIs (no hx-* in application code)
- 📦 Component-colocated API, styles, and reactivity
- 🔧 Type-safe end-to-end with strict TypeScript
- 📚 50+ pre-styled components with rich variant APIs; progressive enhancement
  optional (zero framework runtime)

## Quick Start

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
import { defineComponent, h, render } from "ui-lib/mod.ts";
import { Card } from "ui-lib/components";

// Application components compose pre-styled library components
defineComponent("user-card", {
  render: ({ name = "Guest", role = "User" }) => (
    <card variant="elevated" padding="lg">
      <h2>{name}</h2>
      <p>{role}</p>
    </card>
  ),
});

// Use it (JSX + render to produce HTML on the server)
const html = render(<user-card name="Alice" role="Admin" />);
```

> **Why Composition-Only?** Applications cannot add custom styles when using
> `mod.ts`. This enforces UI consistency, reduces code by 94%, and ensures all
> apps using ui-lib have a uniform look. Custom styling is reserved for library
> component development (see `lib/internal.ts`).

> Note: In application code, call `render(<Component />)` to produce HTML.
> `renderComponent` is still available for low-level access when needed.

### With Function-Style Props

```tsx
import { boolean, defineComponent, h, number, string } from "ui-lib";
import { Button, Card } from "ui-lib/components";

defineComponent("counter", {
  render: ({
    label = string("Count"),
    value = number(0),
    disabled = boolean(false),
  }) => (
    <card variant="default" padding="md">
      <span>{label}: {value}</span>
      <button variant="primary" size="md" disabled={disabled}>
        Increment
      </button>
    </card>
  ),
});

// Type-safe usage (JSX-only in app code)
const html = <counter label="Items" value={5} />;
```

### Composing Library Components

Applications build UIs by composing pre-styled library components with variants:

```tsx
import { Alert, Badge, Button, Card } from "ui-lib/components";

const Page = () => (
  <>
    <alert variant="success">
      Operation completed!
    </alert>

    <card variant="elevated" padding="lg">
      <h2>
        Welcome <badge variant="primary">New</badge>
      </h2>
      <p>Get started with ui-lib's 50+ components</p>
      <button variant="primary" size="lg">
        Get Started
      </button>
    </card>
  </>
);
```

All components provide rich variant APIs (primary, secondary, success, danger,
etc.) for customization without CSS.

### Component-Colocated APIs (HTMX Abstracted Away)

Components define APIs with HTTP method helpers, keeping HTMX completely hidden from application code:

```tsx
import { defineComponent, del, h, post } from "ui-lib/mod.ts";
import { todoAPI } from "./api/index.ts";

defineComponent("todo-item", {
  api: {
    toggle: post("/api/todos/:id/toggle", todoAPI.toggleTodo),
    deleteTodo: del("/api/todos/:id", todoAPI.deleteTodo),
  },
  render: ({ todo }, api) => {
    return (
      <div class="todo-item">
        <input
          type="checkbox"
          checked={todo.completed}
          {...api!.toggle(todo.id)}
        />
        <span class="todo-text">{todo.text}</span>
        <span class="todo-priority">{todo.priority}</span>
        <button
          type="button"
          class="todo-delete"
          {...api!.deleteTodo(todo.id)}
        >
          Delete
        </button>
      </div>
    );
  },
});
```

**Key Benefits:**
- ✅ **Zero HTMX in app code** - All `hx-*` attributes generated internally
- ✅ **Type-safe APIs** - HTTP methods (`post`, `del`, `get`, `patch`, `put`) with route params
- ✅ **Direct spread operator** - `{...api!.toggle(id)}` returns ready-to-use attributes
- ✅ **Automatic route registration** - Call `registerComponentApi("todo-item", router)` once
- ✅ **Centralized endpoints** - All API routes defined with the component

Available HTTP helpers: `get()`, `post()`, `patch()`, `put()`, `del()` (aliased: `remove`, `create`)

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
    ├── server-custom.tsx  # Custom components demo
    ├── server-library.tsx # Library components demo
    ├── api/               # Handlers, types, repository
    └── components/        # SSR components with colocated API/styles/reactivity
```

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
2. **CSS is the styling language** - Not JavaScript objects (for library
   components)
3. **HTML is the structure** - Not virtual DOM trees
4. **Progressive enhancement** - Not hydration
5. **Server-first** - Not client-first with SSR bolted on
6. **Composition over customization** - Apps compose pre-styled components with
   variants

## Library Development

While applications use the composition-only pattern, **library components** have
full styling capabilities:

```tsx
// lib/components/my-component.ts
import { css, defineComponent } from "../../internal.ts";

defineComponent("my-component", {
  styles: css({
    padding: "1rem",
    backgroundColor: "var(--surface-bg)",
    // Full CSS-in-TS capabilities
  }),
  render: ({ variant = "default" }) => (
    <div class={`my-component my-component--${variant}`}>
      {/* component content */}
    </div>
  ),
});
```

Library components import from `lib/internal.ts` which provides unrestricted
access to:

- Full `defineComponent` with styles
- CSS-in-TS system (`css`, `createTheme`, `composeStyles`)
- Theme system and design utilities
- All internal utilities

See [Contributing Guide](CONTRIBUTING.md) for details on developing library
components.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md)
for details.

## Support

- [Documentation](https://ui-lib.dev)
- [GitHub Issues](https://github.com/yourusername/ui-lib/issues)
- [Discord Community](https://discord.gg/ui-lib)

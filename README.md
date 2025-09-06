# ui-lib

Ultra-lightweight, type-safe SSR components with DOM-native state management and hybrid reactivity.

## Features

- 🚀 **Zero Runtime Overhead** - Pure HTML/CSS output, no client-side framework needed
- 🎯 **DOM-Native State** - State lives in CSS classes, data attributes, and element content
- ⚡ **Hybrid Reactivity** - Three-tier system: CSS properties, pub/sub, and DOM events
- 🔧 **Type-Safe** - Full TypeScript support with strict typing
- 🎨 **CSS-in-TS** - Auto-generated class names from CSS properties
- 📦 **50+ Components** - Enterprise-grade component library included
- 🌐 **SSR-First** - Designed for server-side rendering from the ground up
- 🔄 **Progressive Enhancement** - Works without JS, enhanced with HTMX

## Quick Start

### Installation

```bash
# Using Deno (recommended)
import * as ui from "https://deno.land/x/ui_lib/mod.ts";

# Or clone and use locally
git clone https://github.com/yourusername/ui-lib.git
cd ui-lib
deno task start
```

### Basic Usage

```typescript
import { defineComponent, h } from "ui-lib";

// Define a component
const Card = defineComponent({
  name: "card",
  styles: {
    padding: "1rem",
    borderRadius: "0.5rem",
    backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  },
  render: ({ title, content }) => `
    <div class="card">
      <h2>${title}</h2>
      <p>${content}</p>
    </div>
  `
});

// Use it
const html = Card({ title: "Hello", content: "World" });
```

### With Function-Style Props

```typescript
import { defineComponent, string, number, boolean } from "ui-lib";

const Counter = defineComponent({
  name: "counter",
  render: (
    label = string("Count"),
    value = number(0),
    disabled = boolean(false)
  ) => `
    <div class="counter">
      <span>${label}: ${value}</span>
      <button ${disabled ? 'disabled' : ''}>Increment</button>
    </div>
  `
});

// Type-safe usage
Counter({ label: "Items", value: 5 });
```

### Using Built-in Components

```typescript
import { Button, Card, Alert } from "ui-lib/components";

const page = `
  ${Alert({ 
    type: "success", 
    children: "Operation completed!" 
  })}
  
  ${Card({ 
    title: "Welcome",
    children: Button({ 
      variant: "primary",
      children: "Get Started" 
    })
  })}
`;
```

## Three-Tier Reactivity

### Tier 1: CSS Property Reactivity
Instant visual updates via CSS custom properties:

```typescript
const ThemeToggle = defineComponent({
  reactive: {
    css: {
      "--theme": "data-theme"
    }
  },
  render: () => `
    <button onclick="toggleTheme()">Toggle Theme</button>
  `
});
```

### Tier 2: Pub/Sub State Manager
Cross-component state synchronization:

```typescript
const Cart = defineComponent({
  reactive: {
    state: {
      "cart-count": "data-count"
    }
  },
  render: () => `
    <div data-count="0">
      Cart Items: <span x-text="count">0</span>
    </div>
  `
});
```

### Tier 3: DOM Event Communication
Component-to-component messaging:

```typescript
const Notification = defineComponent({
  reactive: {
    on: {
      "user:login": "handleLogin"
    }
  },
  render: () => `
    <div id="notification"></div>
  `
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
# Start the example server
deno task serve

# Open http://localhost:8080
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
- [Best Practices](docs/best-practices.md)

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

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## Support

- [Documentation](https://ui-lib.dev)
- [GitHub Issues](https://github.com/yourusername/ui-lib/issues)
- [Discord Community](https://discord.gg/ui-lib)
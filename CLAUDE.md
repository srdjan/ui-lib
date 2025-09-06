# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

ui-lib is an ultra-lightweight, type-safe SSR component library with DOM-native state management and hybrid reactivity. It provides server-side rendering (SSR) components with zero client-side JavaScript runtime overhead, using a functional programming approach.

## Commands

### Development & Testing
```bash
deno task check       # Type check all TypeScript/TSX files
deno task test        # Run all tests
deno task fmt         # Format code
deno task fmt:check   # Check formatting without changes
deno task lint        # Lint code
deno task coverage    # Run tests with coverage report
deno task bench       # Run performance benchmarks
```

### Running Examples
```bash
deno task serve       # Start example server on port 8080
deno task start       # Type check + start server
```

### Release & Quality
```bash
deno task audit:css   # Check for inline styles and hex colors
deno task docs        # Generate documentation
deno task release:prep # Full validation before release
deno task release     # Create and tag release
```

## Architecture

### Core Concepts

1. **DOM-Native State Management**: Component state is stored directly in the DOM using CSS classes, data attributes, and element content - no virtual DOM or client-side state management needed.

2. **Function-Style Props**: Components use a functional approach where props are directly inferred from render function parameters, eliminating prop duplication.

3. **CSS-Only Styling**: Styles are defined as CSS properties that auto-generate class names - no CSS selectors needed in component definitions.

4. **Hybrid Reactivity System**: Three-tier reactivity model:
   - Tier 1: CSS Property Reactivity (instant visual updates via CSS custom properties)
   - Tier 2: Pub/Sub State Manager (cross-component state synchronization)
   - Tier 3: DOM Event Communication (component-to-component messaging)

### Project Structure

```
/lib/                     # Core library code
  /components/           # Reusable UI components
    /button/            # Button component family
    /form/              # Form components
    /data/              # Data display components
    /feedback/          # User feedback components
    /navigation/        # Navigation components
    /overlay/           # Modal/dialog components
    /utility/           # Utility components
  /layout/              # Layout system components
  /themes/              # Theme definitions and tokens
  jsx-runtime.ts        # JSX runtime for SSR
  define-component.ts   # Core component definition system
  css-in-ts.ts         # CSS-in-TypeScript system
  reactive-helpers.ts   # Reactivity utilities
  state-manager.ts      # State management infrastructure

/examples/              # Example applications
  /showcase/           # Component showcase demos
  /apps/               # Full application examples
  server.ts            # Development server
  router.ts            # API router for examples

/scripts/              # Build and maintenance scripts
```

### Key APIs

#### Component Definition
```typescript
import { defineComponent } from "./lib/define-component.ts";

const MyComponent = defineComponent({
  name: "my-component",
  styles: { /* CSS properties */ },
  render: (props) => `<div>...</div>`,
  reactive: { /* optional reactivity config */ }
});
```

#### Function-Style Props with Helpers
```typescript
import { string, number, boolean } from "./lib/prop-helpers.ts";

const Component = defineComponent({
  render: (name = string("Default"), count = number(0), active = boolean(false)) => 
    `<div>${name}: ${count}</div>`
});
```

#### CSS-in-TypeScript
```typescript
import { css } from "./lib/css-in-ts.ts";

const styles = css({
  backgroundColor: "var(--color-primary)",
  padding: "1rem",
  borderRadius: "0.5rem"
});
```

## Component Library

The library includes a comprehensive set of enterprise-grade components:

- **Button Components**: Button, ButtonGroup with variants and states
- **Form Components**: Input, Select, Textarea, Checkbox, Radio, Switch, Range
- **Data Components**: Table, Card, Badge, Tag, Avatar, Progress
- **Feedback Components**: Alert, Toast, Tooltip, Skeleton
- **Navigation Components**: Breadcrumb, Pagination, Tabs, Stepper
- **Overlay Components**: Modal, Drawer, Popover, Dropdown
- **Layout Components**: AppLayout, Navbar, Sidebar, MainContent
- **Utility Components**: Divider, Spinner, ErrorBoundary, ScrollArea

## Design Principles

1. **Zero Runtime Overhead**: Components render to pure HTML/CSS with optional progressive enhancement
2. **Type Safety**: Full TypeScript support with strict typing
3. **Functional Programming**: No classes or inheritance - pure functions and immutable data
4. **Progressive Enhancement**: Works without JavaScript, enhanced with HTMX or minimal scripts
5. **Component Composition**: Build complex UIs by composing simple, reusable components

## Testing Approach

- Unit tests for all core functionality using Deno's built-in test runner
- Component rendering tests to verify HTML output
- Integration tests for reactive features
- Performance benchmarks for SSR rendering speed

## Common Patterns

### Creating Components
Always use `defineComponent` for consistency and type safety. Components should be pure functions that return HTML strings.

### Styling
Use the CSS-in-TypeScript system for component styles. This ensures consistent styling and automatic class name generation.

### Reactivity
Add reactivity only when needed using the `reactive` configuration. Keep client-side logic minimal and leverage HTMX for interactions.

### State Management
For simple state, use CSS custom properties. For complex state, use the pub/sub system. Only add client JavaScript when absolutely necessary.

## Performance Considerations

- Components render on the server - minimize rendering logic complexity
- Use `cachedRender` for expensive components that don't change often
- Leverage streaming responses for large component trees
- Keep styles minimal and use CSS custom properties for theming

## Development Workflow

1. Type check before running: `deno task check`
2. Use the example server for testing: `deno task serve`
3. Run tests frequently: `deno task test`
4. Check CSS quality: `deno task audit:css`
5. Validate before commits: `deno task release:prep`
# Component API Reference

Complete API reference for ui-lib components and utilities.

## Available Library Components

Applications compose these pre-styled components using their variant APIs:

### Layout Components

- **Card** - Content containers (variants: `default`, `elevated`, `outlined`)
- **Container** - Page width containers (sizes: `sm`, `md`, `lg`, `xl`, `full`)
- **Grid** - CSS Grid layouts (columns: `1-12`, gap: `sm`, `md`, `lg`)
- **Stack** - Vertical/horizontal layouts (direction: `vertical`, `horizontal`)
- **Flex** - Flexbox layouts with gap control

### Form Components

- **Input** - Text inputs (types: `text`, `email`, `password`, `number`,
  `search`)
- **Textarea** - Multi-line text input
- **Select** - Dropdown selections
- **Checkbox** - Boolean selections
- **Radio** - Single selections from groups
- **Form** - Form containers with validation styling

### Button Components

- **Button** - Interactive buttons (variants: `primary`, `secondary`, `outline`,
  `ghost`)
- **ButtonGroup** - Grouped button layouts

### Feedback Components

- **Alert** - Notification messages (variants: `info`, `success`, `warning`,
  `error`)
- **Badge** - Status indicators (variants: `primary`, `success`, `warning`,
  `danger`, `neutral`)
- **Toast** - Temporary notifications
- **Progress** - Progress indicators

### Data Display Components

- **Item** - Generic item display (used for lists, todos, cards)
- **List** - Collection display
- **Stat** - Statistical data display
- **AnimatedCounter** - Animated number display

### Media Components

- **Image** - Responsive images with lazy loading
- **Video** - Video players
- **Audio** - Audio players

### Overlay Components

- **Modal** - Dialog overlays
- **Drawer** - Side panel overlays
- **Popover** - Contextual popovers
- **Tooltip** - Hover tooltips

See individual component documentation for complete prop and variant lists.

## Core APIs

### defineComponent

Creates a new component with type-safe props and optional reactivity.

**Two APIs depending on context:**

#### Application Components (Composition-Only)

Applications use `defineComponent` from `mod.ts` which enforces composition-only
patterns:

```typescript
defineComponent(name: string, config: AppComponentConfig): Component
```

**AppComponentConfig Parameters:**

| Property   | Type             | Description                           |
| ---------- | ---------------- | ------------------------------------- |
| `name`     | `string`         | Unique component identifier           |
| `render`   | `Function`       | Render function returning HTML string |
| `reactive` | `ReactiveConfig` | Optional reactivity configuration     |
| `api`      | `ApiMap`         | Optional API endpoint definitions     |

**Note:** `styles` and `clientScript` properties are **not allowed** in
application components. Apps must compose pre-styled library components with
variants.

**Example (Application):**

```tsx
import { defineComponent, h } from "ui-lib/mod.ts";
import { Button, Card } from "ui-lib/components";

// ✅ Correct: Compose library components
defineComponent("user-card", {
  render: ({ name, role }) => (
    <card variant="elevated" padding="lg">
      <h2>{name}</h2>
      <p>{role}</p>
      <button variant="primary">Edit Profile</button>
    </card>
  ),
});

// ❌ Wrong: Custom styles not allowed
defineComponent("custom-card", {
  styles: { padding: "1rem" }, // ERROR!
  render: () => <div>...</div>,
});
```

#### Library Components (Full API)

Library components use `defineComponent` from `lib/internal.ts` with full
styling capabilities:

```typescript
defineComponent(name: string, config: ComponentConfig): Component
```

**ComponentConfig Parameters:**

| Property       | Type                    | Description                                |
| -------------- | ----------------------- | ------------------------------------------ |
| `name`         | `string`                | Unique component identifier                |
| `styles`       | `StyleObject \| string` | Component styles (CSS-in-TS or CSS string) |
| `render`       | `Function`              | Render function returning HTML string      |
| `reactive`     | `ReactiveConfig`        | Optional reactivity configuration          |
| `api`          | `ApiMap`                | Optional API endpoint definitions          |
| `clientScript` | `Function`              | Optional client-side JavaScript            |

**Example (Library Component):**

```tsx
// lib/components/my-component.ts
import { css, defineComponent, h } from "../../internal.ts";

defineComponent("my-component", {
  styles: css({
    padding: "1rem",
    backgroundColor: "var(--surface-bg)",
    borderRadius: "0.5rem",
  }),
  render: ({ variant = "default" }) => (
    <div class={`my-component my-component--${variant}`}>
      {/* component content */}
    </div>
  ),
});
```

#### API Property

The `api` property allows you to define server endpoints whose client bindings
are generated for you. Applications compose library components and bind API
actions to them.

**Application Example (Composition-Only):**

```tsx
import { defineComponent, h } from "ui-lib/mod.ts";

defineComponent("user-card", {
  api: {
    updateUser: ["PUT", "/api/users/:id", updateHandler],
    deleteUser: ["DELETE", "/api/users/:id", deleteHandler],
  },
  render: ({ id, name, role }, api) => (
    // Compose library Card and Item components
    <card variant="elevated">
      <item
        title={name}
        description={role}
        actions={[
          { text: "Edit", variant: "primary", ...api.updateUser(id) },
          {
            text: "Delete",
            variant: "danger",
            confirm: "Delete this user?",
            ...api.deleteUser(id),
          },
        ]}
      />
    </card>
  ),
});
```

**API Definition Format**: `[method, path, handler]`

- `method`: HTTP method (GET, POST, PUT, PATCH, DELETE)
- `path`: URL path with optional parameters (`:id`)
- `handler`: Server-side request handler function

**hx() Wrapper Options**:

- `target`: Element to update with response
- `swap`: How to swap content (innerHTML, outerHTML, etc.)
- `confirm`: Confirmation message before request
- `trigger`: When to trigger the request
- `indicator`: Loading indicator element
- `vals`: Additional values to send
- `headers`: Custom headers
- `include`: Form elements to include

### Prop Helpers

Type-safe prop helpers with default values and validation.

#### string(defaultValue?: string)

```tsx
defineComponent("my-component", {
  render: ({
    name = string("Default"),
    title = string(), // Optional string
  }) => <div>...</div>,
});
```

#### number(defaultValue?: number)

```tsx
defineComponent("counter", {
  render: ({
    count = number(0),
    max = number(100),
  }) => <div>...</div>,
});
```

#### boolean(defaultValue?: boolean)

```tsx
defineComponent("toggle", {
  render: ({
    isActive = boolean(false),
    showDetails = boolean(true),
  }) => <div>...</div>,
});
```

#### array<T>(defaultValue?: T[])

```tsx
defineComponent("list", {
  render: ({
    items = array<string>([]),
    tags = array<{ id: number; name: string }>([]),
  }) => <div>...</div>,
});
```

#### object<T>(defaultValue?: T)

```tsx
defineComponent("settings", {
  render: ({
    config = object<Config>({ theme: "light" }),
    user = object<User>(),
  }) => <div>...</div>,
});
```

### CSS-in-TypeScript (Library Components Only)

**Note:** CSS utilities are **only available for library component development**
via `lib/internal.ts`. Applications using `mod.ts` cannot access these APIs and
must compose pre-styled components instead.

#### css(styles: CSSProperties)

Creates type-safe CSS with auto-completion (library components only).

```typescript
// lib/components/my-component.ts
import { css } from "../../internal.ts";

const styles = css({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  padding: "2rem",
  backgroundColor: "var(--bg-color)",
  "&:hover": {
    backgroundColor: "var(--bg-hover)",
  },
  "@media (max-width: 768px)": {
    padding: "1rem",
  },
});
```

#### composeStyles(...styles)

Combines multiple style objects (library components only).

```typescript
// lib/components/my-component.ts
import { composeStyles, css } from "../../internal.ts";

const baseStyles = css({ padding: "1rem" });
const themeStyles = css({ backgroundColor: "white" });

const combined = composeStyles(baseStyles, themeStyles);
```

#### createTheme(tokens: ThemeTokens)

Creates a theme with CSS custom properties.

```typescript
const theme = createTheme({
  colors: {
    primary: "#007bff",
    secondary: "#6c757d",
    success: "#28a745",
  },
  spacing: {
    sm: "0.5rem",
    md: "1rem",
    lg: "2rem",
  },
});
```

## Reactivity APIs

### Reactive Configuration

```typescript
interface ReactiveConfig {
  css?: Record<string, string>; // CSS property bindings
  state?: Record<string, string>; // State bindings
  on?: Record<string, string>; // Event listeners
  mount?: string; // Mount script
  unmount?: string; // Unmount script
  inject?: boolean; // Auto-inject state manager
}
```

### CSS Property Reactivity

Bind CSS custom properties to data attributes:

```tsx
const ThemeComponent = defineComponent({
  reactive: {
    css: {
      "--theme-color": "data-theme-color",
      "--font-size": "data-font-size",
    },
  },
  render: () => (
    <div data-theme-color="#007bff" data-font-size="16px">
      Content with reactive styles
    </div>
  ),
});
```

### State Management

Cross-component state synchronization:

```tsx
const StatefulComponent = defineComponent({
  reactive: {
    state: {
      "user-name": "data-name",
      "user-role": "data-role",
    },
  },
  render: () => (
    <div data-name="" data-role="">
      User: <span class="name"></span>
      Role: <span class="role"></span>
    </div>
  ),
});
```

### Event Communication

Component-to-component messaging:

```tsx
const EventComponent = defineComponent({
  reactive: {
    on: {
      "app:notify": "showNotification",
      "user:login": "handleLogin",
    },
  },
  render: () => <div id="notifications"></div>,
});
```

## Component Library

### Button

```typescript
interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "destructive";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  children: string;
}

Button(props: ButtonProps): string
```

### Input

```typescript
interface InputProps {
  type?: "text" | "email" | "password" | "number" | "search" | "tel" | "url";
  label?: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  leftIcon?: string;
  rightIcon?: string;
}

Input(props: InputProps): string
```

### Card

```typescript
interface CardProps {
  title?: string;
  subtitle?: string;
  children: string;
  footer?: string;
  image?: { src: string; alt: string };
  variant?: "default" | "bordered" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
}

Card(props: CardProps): string
```

### Modal

```typescript
interface ModalProps {
  title: string;
  children: string;
  footer?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeButton?: boolean;
  backdrop?: boolean;
  centered?: boolean;
}

Modal(props: ModalProps): string
```

### Table

```typescript
interface TableProps {
  columns: Array<{
    key: string;
    label: string;
    sortable?: boolean;
    width?: string;
  }>;
  data: Array<Record<string, any>>;
  striped?: boolean;
  bordered?: boolean;
  hover?: boolean;
  compact?: boolean;
}

Table(props: TableProps): string
```

### Alert

```typescript
interface AlertProps {
  type: "info" | "success" | "warning" | "error";
  title?: string;
  children: string;
  dismissible?: boolean;
  icon?: boolean;
}

Alert(props: AlertProps): string
```

### Tabs

```typescript
interface TabsProps {
  items: Array<{
    id: string;
    label: string;
    content: string;
    disabled?: boolean;
  }>;
  defaultTab?: string;
  variant?: "default" | "pills" | "underline";
  fullWidth?: boolean;
}

Tabs(props: TabsProps): string
```

## Layout Components

### AppLayout

```typescript
interface AppLayoutProps {
  navbar?: string;
  sidebar?: string;
  content: string;
  footer?: string;
  sidebarPosition?: "left" | "right";
  sidebarCollapsible?: boolean;
  containerWidth?: "full" | "xl" | "lg" | "md";
}

AppLayout(props: AppLayoutProps): string
```

### Navbar

```typescript
interface NavbarProps {
  brand?: { name: string; logo?: string; href?: string };
  items?: NavItem[];
  position?: "fixed" | "sticky" | "static";
  variant?: "light" | "dark" | "transparent";
  actions?: string;
}

Navbar(props: NavbarProps): string
```

### Sidebar

```typescript
interface SidebarProps {
  items: NavItem[];
  header?: string;
  footer?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  width?: string;
}

Sidebar(props: SidebarProps): string
```

## Form Components

### Form

```typescript
interface FormProps {
  fields: FormField[];
  onSubmit?: string;
  method?: "GET" | "POST";
  action?: string;
  layout?: "vertical" | "horizontal" | "inline";
}

Form(props: FormProps): string
```

### Select

```typescript
interface SelectProps {
  label?: string;
  options: Array<{ value: string; label: string }>;
  value?: string;
  placeholder?: string;
  multiple?: boolean;
  required?: boolean;
  disabled?: boolean;
}

Select(props: SelectProps): string
```

### Checkbox

```typescript
interface CheckboxProps {
  label: string;
  checked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  value?: string;
}

Checkbox(props: CheckboxProps): string
```

### Radio

```typescript
interface RadioProps {
  name: string;
  options: Array<{ value: string; label: string }>;
  value?: string;
  disabled?: boolean;
  inline?: boolean;
}

Radio(props: RadioProps): string
```

## Utility Functions

### escapeHtml(text: string): string

Escapes HTML special characters for safe rendering.

```typescript
const safe = escapeHtml("<script>alert('XSS')</script>");
// Result: "&lt;script&gt;alert('XSS')&lt;/script&gt;"
```

### conditionalClass(condition: boolean, className: string): string

Conditionally includes a CSS class.

```typescript
const classes = conditionalClass(isActive, "active");
```

### dataAttrs(attrs: Record<string, any>): string

Generates data attributes from an object.

```typescript
const attrs = dataAttrs({ userId: 123, role: "admin" });
// Result: 'data-user-id="123" data-role="admin"'
```

### spreadAttrs(attrs: Record<string, any>): string

Spreads attributes as HTML attribute string.

```typescript
const attrs = spreadAttrs({
  id: "my-id",
  class: "my-class",
  disabled: true,
});
// Result: 'id="my-id" class="my-class" disabled'
```

## Performance APIs

### cachedRender

Caches component render output.

```typescript
const CachedComponent = defineComponent({
  render: cachedRender((props) => {
    // Expensive render logic
    return `...`;
  }, {
    ttl: 60000, // Time to live in ms
    key: (props) => props.id, // Cache key function
  }),
});
```

### PerformanceCache

Advanced caching system.

```typescript
const cache = new PerformanceCache({
  maxSize: 100,
  ttl: 300000,
  strategy: "lru", // or "lfu", "fifo"
});

cache.set("key", value);
const cached = cache.get("key");
```

## Development Tools

### componentInspector

Debug component rendering.

```typescript
import { componentInspector } from "ui-lib/dev-tools";

componentInspector.enable();
componentInspector.log("my-component");
```

### performanceMonitor

Track rendering performance.

```typescript
import { performanceMonitor } from "ui-lib/dev-tools";

performanceMonitor.start("render");
// ... rendering logic
performanceMonitor.end("render");

const report = performanceMonitor.getReport();
```

### propValidator

Validate component props at runtime.

```typescript
import { propValidator } from "ui-lib/dev-tools";

const validator = propValidator({
  title: { type: "string", required: true },
  count: { type: "number", min: 0, max: 100 },
});

validator.validate(props);
```

## State Manager

### injectStateManager

Injects the state management script.

```typescript
const html = `
  <html>
    <head>
      ${injectStateManager()}
    </head>
    <body>...</body>
  </html>
`;
```

### createStateManagerScript

Creates custom state manager configuration.

```typescript
const script = createStateManagerScript({
  debug: true,
  throttle: 100,
  features: ["css", "state", "events"],
});
```

## API Helpers

### HTTP Method Helpers

```typescript
import { del, get, patch, post, put } from "ui-lib";

// Define API endpoints
const api = {
  getUser: get("/api/users/:id"),
  createUser: post("/api/users"),
  updateUser: put("/api/users/:id"),
  patchUser: patch("/api/users/:id"),
  deleteUser: del("/api/users/:id"),
};
```

### generateClientApi

Generates HTMX-ready attribute maps from definitions.

```typescript
const api = {
  toggle: patch("/api/todos/:id/toggle", toggleTodo),
  remove: del("/api/todos/:id", deleteTodo),
};

const client = generateClientApi(api);

// Spread onto elements
const attrs = client.toggle("42", { optimistic: true });
/*
{
  "hx-patch": "/api/todos/42/toggle",
  "hx-vals": "{\"optimistic\":true}",
  "hx-headers": "{\"Accept\":\"text/html; charset=utf-8\"}",
  "hx-target": "#main",
  "hx-swap": "innerHTML"
}
*/
```

### generateClientHx & hx

`generateClientHx` is used internally to create per-method client functions that
return HTMX attribute strings. Most applications won’t call these
directly—prefer `onAction` in JSX. The `hx()` helper remains available for
advanced per-call configuration.

```typescript
import { generateClientHx, hx } from "ui-lib";

const api = {
  toggle: ["POST", "/api/todos/:id/toggle", handler],
  remove: ["DELETE", "/api/todos/:id", handler],
};

const actions = generateClientHx(api, { target: "#main", swap: "outerHTML" });

// Advanced: build attribute string manually (usually not needed)
const toggleAttrs = actions.toggle("42", hx({ indicator: "#spinner" }));
const buttonHtml = `<button ${toggleAttrs}>Toggle</button>`;
```

**hx() Options**:

- `target`: Element selector to update
- `swap`: Content swap method (innerHTML, outerHTML, etc.)
- `confirm`: Confirmation dialog message
- `trigger`: Event that triggers the request
- `indicator`: Loading indicator element
- `disable`: Disable element during request
- `vals`: Additional form values
- `headers`: Custom request headers
- `include`: Additional form elements to include
- `pushUrl`: Update browser URL

## TypeScript Types

### Component Types

```typescript
type Component<P = any> = (props: P) => string;
type ComponentConfig = {/* ... */};
type PropsSpec<T> = (attrs: Record<string, string>) => T;
```

### Style Types

```typescript
type CSSProperties = {/* CSS properties */};
type StyleObject = CSSProperties | string;
type UnifiedStyles = {/* ... */};
```

### Reactive Types

```typescript
type ReactiveConfig = {/* ... */};
type StateManager = {/* ... */};
type EventTarget = Element | Document | Window;
```

## Advanced Usage

### Custom Prop Transformers

```tsx
const Component = defineComponent({
  name: "custom",
  props: (attrs) => ({
    title: attrs.title || "Default",
    count: parseInt(attrs.count || "0"),
    items: JSON.parse(attrs.items || "[]"),
  }),
  render: (props) => <div>...</div>,
});
```

### Composition Patterns

```tsx
// Higher-order component
const withTheme = (Component) => (props) => (
  <Component {...props} theme={getCurrentTheme()} />
);

// Component composition
const EnhancedButton = withTheme(Button);
```

### Custom Reactivity

```tsx
const CustomReactive = defineComponent({
  reactive: {
    mount: `
      this.addEventListener('click', (e) => {
        console.log('Clicked:', e.target);
      });
    `,
    unmount: `
      this.removeEventListener('click');
    `,
  },
  render: () => <div>Click me</div>,
});
```

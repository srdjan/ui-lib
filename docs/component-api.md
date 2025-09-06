# Component API Reference

Complete API reference for ui-lib components and utilities.

## Core APIs

### defineComponent

Creates a new component with type-safe props and optional reactivity.

```typescript
defineComponent(config: ComponentConfig): Component
```

#### Parameters

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Unique component identifier |
| `styles` | `StyleObject \| string` | Component styles (CSS-in-TS or CSS string) |
| `render` | `Function` | Render function returning HTML string |
| `reactive` | `ReactiveConfig` | Optional reactivity configuration |
| `api` | `ApiMap` | Optional API endpoint definitions |

#### Example

```typescript
const MyComponent = defineComponent({
  name: "my-component",
  styles: {
    padding: "1rem",
    backgroundColor: "white"
  },
  render: ({ title, content }) => `
    <div class="my-component">
      <h2>${title}</h2>
      <p>${content}</p>
    </div>
  `
});
```

### Prop Helpers

Type-safe prop helpers with default values and validation.

#### string(defaultValue?: string)

```typescript
const Component = defineComponent({
  render: (
    name = string("Default"),
    title = string()  // Optional string
  ) => `...`
});
```

#### number(defaultValue?: number)

```typescript
const Component = defineComponent({
  render: (
    count = number(0),
    max = number(100)
  ) => `...`
});
```

#### boolean(defaultValue?: boolean)

```typescript
const Component = defineComponent({
  render: (
    isActive = boolean(false),
    showDetails = boolean(true)
  ) => `...`
});
```

#### array<T>(defaultValue?: T[])

```typescript
const Component = defineComponent({
  render: (
    items = array<string>([]),
    tags = array<{id: number, name: string}>([])
  ) => `...`
});
```

#### object<T>(defaultValue?: T)

```typescript
const Component = defineComponent({
  render: (
    config = object<Config>({ theme: "light" }),
    user = object<User>()
  ) => `...`
});
```

### CSS-in-TypeScript

#### css(styles: CSSProperties)

Creates type-safe CSS with auto-completion.

```typescript
import { css } from "ui-lib";

const styles = css({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  padding: "2rem",
  backgroundColor: "var(--bg-color)",
  "&:hover": {
    backgroundColor: "var(--bg-hover)"
  },
  "@media (max-width: 768px)": {
    padding: "1rem"
  }
});
```

#### composeStyles(...styles)

Combines multiple style objects.

```typescript
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
    success: "#28a745"
  },
  spacing: {
    sm: "0.5rem",
    md: "1rem",
    lg: "2rem"
  }
});
```

## Reactivity APIs

### Reactive Configuration

```typescript
interface ReactiveConfig {
  css?: Record<string, string>;    // CSS property bindings
  state?: Record<string, string>;  // State bindings
  on?: Record<string, string>;     // Event listeners
  mount?: string;                  // Mount script
  unmount?: string;                // Unmount script
  inject?: boolean;                // Auto-inject state manager
}
```

### CSS Property Reactivity

Bind CSS custom properties to data attributes:

```typescript
const ThemeComponent = defineComponent({
  reactive: {
    css: {
      "--theme-color": "data-theme-color",
      "--font-size": "data-font-size"
    }
  },
  render: () => `
    <div data-theme-color="#007bff" data-font-size="16px">
      Content with reactive styles
    </div>
  `
});
```

### State Management

Cross-component state synchronization:

```typescript
const StatefulComponent = defineComponent({
  reactive: {
    state: {
      "user-name": "data-name",
      "user-role": "data-role"
    }
  },
  render: () => `
    <div data-name="" data-role="">
      User: <span class="name"></span>
      Role: <span class="role"></span>
    </div>
  `
});
```

### Event Communication

Component-to-component messaging:

```typescript
const EventComponent = defineComponent({
  reactive: {
    on: {
      "app:notify": "showNotification",
      "user:login": "handleLogin"
    }
  },
  render: () => `
    <div id="notifications"></div>
  `
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
  disabled: true 
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
    ttl: 60000,  // Time to live in ms
    key: (props) => props.id  // Cache key function
  })
});
```

### PerformanceCache

Advanced caching system.

```typescript
const cache = new PerformanceCache({
  maxSize: 100,
  ttl: 300000,
  strategy: "lru"  // or "lfu", "fifo"
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
  count: { type: "number", min: 0, max: 100 }
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
  features: ["css", "state", "events"]
});
```

## API Helpers

### HTTP Method Helpers

```typescript
import { get, post, put, patch, del } from "ui-lib";

// Define API endpoints
const api = {
  getUser: get("/api/users/:id"),
  createUser: post("/api/users"),
  updateUser: put("/api/users/:id"),
  patchUser: patch("/api/users/:id"),
  deleteUser: del("/api/users/:id")
};
```

### generateClientApi

Generates client API from definitions.

```typescript
const client = generateClientApi(api, {
  baseURL: "https://api.example.com",
  headers: {
    "Authorization": "Bearer token"
  }
});

// Use the client
const user = await client.getUser({ id: "123" });
```

## TypeScript Types

### Component Types

```typescript
type Component<P = any> = (props: P) => string;
type ComponentConfig = { /* ... */ };
type PropsSpec<T> = (attrs: Record<string, string>) => T;
```

### Style Types

```typescript
type CSSProperties = { /* CSS properties */ };
type StyleObject = CSSProperties | string;
type UnifiedStyles = { /* ... */ };
```

### Reactive Types

```typescript
type ReactiveConfig = { /* ... */ };
type StateManager = { /* ... */ };
type EventTarget = Element | Document | Window;
```

## Advanced Usage

### Custom Prop Transformers

```typescript
const Component = defineComponent({
  name: "custom",
  props: (attrs) => ({
    title: attrs.title || "Default",
    count: parseInt(attrs.count || "0"),
    items: JSON.parse(attrs.items || "[]")
  }),
  render: (props) => `...`
});
```

### Composition Patterns

```typescript
// Higher-order component
const withTheme = (Component) => (props) => 
  Component({ ...props, theme: getCurrentTheme() });

// Component composition
const EnhancedButton = withTheme(Button);
```

### Custom Reactivity

```typescript
const CustomReactive = defineComponent({
  reactive: {
    mount: `
      this.addEventListener('click', (e) => {
        console.log('Clicked:', e.target);
      });
    `,
    unmount: `
      this.removeEventListener('click');
    `
  },
  render: () => `<div>Click me</div>`
});
```
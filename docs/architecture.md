# Architecture

Deep dive into ui-lib's architecture and design decisions.

## Core Philosophy

ui-lib is built on seven fundamental principles:

1. **DOM-Native State** - State lives in the DOM, not in JavaScript memory
2. **Zero Runtime** - No client-side framework needed for basic functionality
3. **Progressive Enhancement** - Works without JavaScript, enhanced with it
4. **Type Safety** - Full TypeScript support from props to rendering
5. **Functional Approach** - Pure functions, immutable data, no classes
6. **Composition Over Customization** - Apps compose pre-styled components with
   variants
7. **Enforced Consistency** - Library controls styling, apps control business
   logic

## System Architecture

ui-lib now offers two distinct architectures:

### Composition-Only Architecture (mod.ts)

```
┌─────────────────────────────────────────────────────────┐
│                     Application Layer                   │
│  (defineComponent - composition only, NO custom styles) │
│  • Composes pre-styled library components               │
│  • Defines business logic and API endpoints             │
│  • Uses component variants (primary, danger, etc.)      │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                  Library Component Layer                │
│  (50+ pre-styled components with rich variant APIs)     │
│  • Button, Card, Input, Alert, Badge, Item, etc.        │
│  • Fully styled with CSS-in-TS                          │
│  • Multiple variants per component                      │
│  • Developed using lib/internal.ts                      │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                   Reactivity System                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ CSS Props.   │  │  Pub/Sub     │  │ DOM Events   │   │
│  │   (Tier 1)   │  │   (Tier 2)   │  │   (Tier 3)   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                      SSR Engine                         │
│  (Renders components to HTML strings on the server)     │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                     HTML Output                         │
│  (Pre-styled, consistent UI across all applications)    │
└─────────────────────────────────────────────────────────┘
```

**Key Constraint**: Applications cannot add custom styles. The `styles` and
`clientScript` properties are not available in `AppComponentConfig`. This
enforces:

- **UI Consistency**: All apps have uniform look and feel
- **94% Code Reduction**: No app-specific CSS needed
- **Maintainability**: Style updates at library level benefit all apps

### Token-Based Architecture (mod-token.ts) - Recommended

```
┌─────────────────────────────────────────────────────────┐
│                     Application Layer                   │
│  (Uses sealed components + token customization only)    │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                   Token System                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ defineTokens │  │ applyTheme   │  │ customizeComp│   │
│  │              │  │              │  │              │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────┬───────────────────────────────────────┘
                  │ CSS Variables Only
┌─────────────────▼───────────────────────────────────────┐
│                 Sealed Components                       │
│  ┌─────────────────────────────────────────────────────┐│
│  │ Component Factory (createTokenComponent)            ││
│  │ • CSS variable injection                            ││
│  │ • Style encapsulation                               ││
│  │ • No internal access                                ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                      SSR Engine                         │
│  (Components render with CSS variables)                 │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│              HTML + CSS Variables                       │
│  (Instantly themeable via CSS custom properties)        │
└─────────────────────────────────────────────────────────┘
```

## Component System

ui-lib supports two component definition approaches:

### Application Components (mod.ts) - Composition-Only

Applications define components by composing pre-styled library components:

```tsx
// Application component configuration (restricted)
interface AppComponentConfig {
  name: string; // Unique identifier
  render: Function; // JSX render function (composes library components)
  reactive?: Reactive; // Optional reactivity
  api?: ApiMap; // Optional API endpoints
  // NO styles property - composition only!
  // NO clientScript property - composition only!
}
```

**Example:**

```tsx
import { defineComponent, h } from "ui-lib/mod.ts";
import { Badge, Button, Card } from "ui-lib/components";

// App component composes library components with variants
defineComponent("user-card", {
  render: ({ name, role, status }) => (
    <card variant="elevated" padding="lg">
      <h2>
        {name}{" "}
        <badge variant={status === "active" ? "success" : "neutral"}>
          {status}
        </badge>
      </h2>
      <p>{role}</p>
      <button variant="primary">Edit Profile</button>
    </card>
  ),
});
```

### Library Components (lib/internal.ts) - Full API

Library components have complete styling capabilities:

```tsx
// Library component configuration (full access)
interface ComponentConfig {
  name: string; // Unique identifier
  styles?: StyleObject; // Full CSS-in-TS capabilities
  render: Function; // JSX render function
  reactive?: Reactive; // Optional reactivity
  api?: ApiMap; // Optional API endpoints
  clientScript?: Function; // Optional client-side code
}
```

### Token-Based Components (mod-token.ts) - Recommended

Components are created as sealed functions with CSS variable interfaces:

```tsx
interface TokenComponentConfig<TTokens, TProps> {
  name: string;
  tokens: ComponentTokens<TTokens>; // CSS variable contract
  render: (props: TProps, cssVars: TokenVarMap<TTokens>) => string;
  styles?: (cssVars: TokenVarMap<TTokens>) => string; // Static styles
}

// Creates a sealed component function
const Component = createTokenComponent(config);
```

**Key differences:**

- **Sealed**: No access to internal implementation
- **Token Contract**: Explicit CSS variable interface
- **Type Safety**: Full IntelliSense for available tokens
- **Encapsulation**: Complete style isolation

### Render Pipeline

#### Application Components (Composition-Only)

1. **Props Processing** - Transform raw attributes to typed props
2. **Component Composition** - Render function composes library components
3. **Library Component Resolution** - Each library component renders with its
   pre-defined styles
4. **Reactivity Injection** - Add reactive attributes if configured
5. **HTML Generation** - Convert composed JSX to HTML string

```tsx
// Composition-only render pipeline
function appComponentRender(element: JSX.Element): string {
  const component = getComponent(element.type);
  const processedProps = component.props(element.props);
  // No style generation - components compose library components
  const jsx = component.render(processedProps);
  // Library components already have styles
  return renderToString(jsx, component.reactive);
}
```

#### Library Components

1. **Props Processing** - Transform raw attributes to typed props
2. **Style Generation** - Convert CSS-in-TS to class names
3. **JSX Rendering** - Execute JSX render function with props
4. **Reactivity Injection** - Add reactive attributes if configured
5. **HTML Generation** - Convert JSX to HTML string with embedded styles

```tsx
// Library component render pipeline (full capabilities)
function libraryComponentRender(element: JSX.Element): string {
  const component = getComponent(element.type);
  const processedProps = component.props(element.props);
  const styles = generateStyles(component.styles); // CSS-in-TS
  const jsx = component.render(processedProps);
  return renderToString(jsx, component.reactive);
}
```

#### Token-Based Components

1. **Token Injection** - Generate CSS variables from token contract
2. **Props Processing** - Parse component props
3. **Variable Mapping** - Map token paths to CSS variable references
4. **Rendering** - Execute render function with CSS variable map
5. **Style Injection** - Include component styles with CSS variables

```tsx
// Token-based render pipeline
function tokenRender(props: TProps): string {
  const cssVars = generateVarMap(componentName, tokens);
  const html = renderFunction(props, cssVars);
  const styledHtml = addComponentClass(html, componentName);
  return styledHtml;
}

// CSS generation (separate)
function generateStyles(): string {
  const cssVarDefinitions = tokensToCSS(componentName, tokens);
  const staticStyles = stylesFunction(cssVars);
  return `:root { ${cssVarDefinitions} } ${staticStyles}`;
}
```

### SSR Component Tag Processing

ui-lib servers can render custom component tags directly from HTML (e.g.,
`<product-grid />`).

- Tokenizer-based: The showcase server uses a small tokenizer (not regex) to
  find tags, parse attributes, and preserve children. It handles:
  - Self-closing tags: `<my-comp ... />`
  - Paired tags with children: `<my-comp ...> ... </my-comp>`
  - Proper nesting of the same component type
- Multi-pass: The processor runs several passes (bounded) over the HTML so
  nested, different component types are rendered in order.
- Attributes: Standard HTML attributes are parsed as strings; components may
  parse/transform them (e.g., JSON in `data-*` or using prop helpers). When
  rendering through the JSX runtimes, `class`/`className` arrays or objects and
  `style` objects are normalized automatically.
- Children: Inner HTML between opening/closing tags is passed as `children` to
  the component render.

Guidelines:

- Keep attributes simple strings; if you need complex props, JSON-encode them
  and parse in your component with `object()`/`array()` prop helpers.
- Prefer self-closing tags for components without children to reduce markup
  noise.
- Ensure component names are registered on the server before processing.

## DOM-Native State Management

### Why DOM-Native?

Traditional frameworks store state in JavaScript memory and sync it to the DOM.
ui-lib inverts this - the DOM _is_ the state.

```tsx
{/* Traditional: State in JS, synced to DOM */}
<div>{count}</div>  {/* count is in JS memory */}

{/* ui-lib: State in DOM */}
<div data-count="5">5</div>  {/* count is in the DOM */}
```

### Benefits

1. **No Hydration** - State is already in the HTML
2. **SEO Friendly** - Search engines see the actual content
3. **Instant Loading** - No JS parsing/execution needed
4. **Memory Efficient** - No duplicate state in memory
5. **Debuggable** - Inspect state directly in DevTools

### State Storage Locations

| Location        | Use Case        | Example                    |
| --------------- | --------------- | -------------------------- |
| CSS Classes     | Boolean states  | `class="active collapsed"` |
| Data Attributes | Structured data | `data-user-id="123"`       |
| Element Content | Display values  | `<span>$99.99</span>`      |
| CSS Properties  | Theme values    | `style="--color: blue"`    |
| Form Values     | User input      | `<input value="text">`     |

## Three-Tier Reactivity System

### Tier 1: CSS Property Reactivity

Instant visual updates without JavaScript execution.

```html
<!-- CSS Variable bound to data attribute -->
<div data-theme="dark" style="--bg: var(--theme-dark-bg)">
  <!-- Children inherit the CSS variable -->
</div>
```

**How it works:**

1. CSS custom properties cascade through the DOM
2. Data attributes trigger CSS selectors
3. Visual updates happen at browser's native speed
4. No JavaScript execution needed

### Tier 2: Pub/Sub State Manager

Cross-component communication through a lightweight message bus.

```javascript
// Publisher
publishState("cart-count", 5);

// Subscriber
subscribeToState("cart-count", (value) => {
  element.textContent = value;
});
```

**Architecture:**

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│Component1│────▶│  State   │◀────│Component2│
└──────────┘     │  Manager │     └──────────┘
                 └──────────┘
                      ▲
                      │
                 ┌──────────┐
                 │Component3│
                 └──────────┘
```

### Tier 3: DOM Event Communication

Component-to-component messaging via custom events.

```javascript
// Sender
dispatchEvent("user:login", { userId: 123 });

// Receiver
addEventListener("user:login", (e) => {
  console.log("User logged in:", e.detail.userId);
});
```

**Event Flow:**

```
Component A          DOM            Component B
    │                 │                  │
    ├─────dispatch───▶│                  │
    │                 ├────bubble────────▶
    │                 │                  │
    │                 │◀───response──────┤
    │◀────capture─────┤                  │
```

## CSS-in-TypeScript System

### Type-Safe Styling

CSS properties are fully typed with auto-completion:

```typescript
const styles = css({
  display: "flex", // ✓ Valid CSS property
  flexDirection: "row", // ✓ Valid value
  invalidProp: "value", // ✗ TypeScript error
});
```

### Class Name Generation

Styles are converted to unique, collision-free class names:

```typescript
// Input
{ padding: "1rem", color: "blue" }

// Output
"ui-padding-1rem ui-color-blue"
```

### Style Composition

Multiple styles can be composed:

```typescript
const base = css({ padding: "1rem" });
const theme = css({ background: "white" });
const composed = composeStyles(base, theme);
// Result: "ui-padding-1rem ui-background-white"
```

## Performance Optimizations

### Server-Side Rendering

Components render in ~0.5ms on the server:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Request   │────▶│    Render   │────▶│   Response  │
└─────────────┘     └─────────────┘     └─────────────┘
                          0.5ms
```

### Caching Strategy

Three-level caching system:

1. **Component Cache** - Caches rendered components
2. **Style Cache** - Caches generated CSS classes
3. **JSX Cache** - Caches compiled JSX functions

```tsx
// Cache hierarchy
L1: JSX Cache (compiled functions)
    ↓
L2: Component Cache (rendered HTML)
    ↓
L3: HTTP Cache (full responses)
```

### Streaming Responses

Large pages stream incrementally:

```typescript
// Stream chunks as they render
for await (const chunk of renderStream(page)) {
  response.write(chunk);
}
```

## Bundle Optimization

### Tree Shaking

Only used components are included:

```typescript
// Only Button is bundled
import { Button } from "ui-lib/components";
// Card is tree-shaken out
// import { Card } from "ui-lib/components";
```

### Code Splitting

Components can be dynamically imported:

```typescript
// Lazy load heavy components
const Modal = await import("ui-lib/components/modal");
```

### Minimal Runtime

Optional client enhancements are < 10KB:

```
Core (required):           0 KB
CSS Reactivity:         ~2 KB
State Manager:          ~3 KB
Event System:           ~2 KB
HTMX Integration:       ~3 KB
─────────────────────────────
Total (all features):   ~10 KB
```

## Security Architecture

### XSS Protection

All user input is automatically escaped:

```tsx
// Input
render: ({ userInput }) => <div>{escapeHtml(userInput)}</div>

// Output (safe)
<div>&lt;script&gt;alert('XSS')&lt;/script&gt;</div>
```

### CSP Compatibility

Works with strict Content Security Policies:

```html
<!-- No inline scripts needed -->
<meta http-equiv="Content-Security-Policy" content="script-src 'self'">
```

### Input Validation

Props are validated at component boundaries:

```tsx
const Component = defineComponent({
  render: (
    email = string().email(), // Validates email format
    age = number().min(0).max(120), // Range validation
  ) => <div>...</div>,
});
```

## Integration Points

### HTMX Integration

Seamless integration with HTMX for interactivity:

```tsx
<button onAction={{ api: "doAction", attributes: { "hx-target": "#result" } }}>
  Click Me
</button>;
```

### Web Components

Note: For Web Component interop we show explicit renderToString usage. In normal
application code, use JSX directly and let SSR evaluation return the HTML
string.

Can be wrapped as standard Web Components:

```tsx
class MyElement extends HTMLElement {
  connectedCallback() {
    this.innerHTML = renderToString(<MyComponent {...this.attributes} />);
  }
}
customElements.define("my-element", MyElement);
```

### Framework Adapters

Note: Framework adapters may call renderToString internally for interop.
Application code should continue to use JSX only.

Adapters available for popular frameworks:

```tsx
// React adapter
export const ReactButton = (props) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: renderToString(<Button {...props} />),
      }}
    />
  );
};
```

## Development Workflow

### Component Development

1. **Define** - Create component with `defineComponent`
2. **Style** - Add styles using CSS-in-TS
3. **Test** - Write unit tests for rendering
4. **Document** - Add JSDoc comments
5. **Export** - Add to component index

### Testing Strategy

```
Unit Tests          Integration Tests    E2E Tests
    │                      │                 │
    ▼                      ▼                 ▼
Components ──────────▶ Pages ──────────▶ Application
```

### Build Pipeline

```
Source Files → TypeScript → Bundler → Optimized Output
     │             │           │              │
   .ts/.tsx      Type       Tree          Minified
                Check      Shaking          Code
```

## Deployment Architecture

### Edge Deployment

Optimized for edge computing:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│  Edge Node  │────▶│   Origin    │
└─────────────┘     └─────────────┘     └─────────────┘
                     Renders HTML         Data/API
```

### CDN Strategy

Static assets served from CDN:

```
HTML:   Edge rendered
CSS:    CDN cached
JS:     CDN cached (optional)
Images: CDN optimized
```

### Scaling Considerations

- **Horizontal** - Stateless SSR scales linearly
- **Vertical** - Efficient rendering uses minimal CPU
- **Caching** - Multi-level caching reduces load
- **Streaming** - Responses start immediately

## Future Architecture

### Planned Enhancements

1. **Partial Hydration** - Hydrate only interactive components
2. **Island Architecture** - Interactive islands in static sea
3. **Compiler Optimizations** - Compile-time optimizations
4. **WASM Runtime** - Optional WASM for performance
5. **Service Worker** - Offline-first capabilities

### Research Areas

- Quantum DOM updates (theoretical)
- AI-assisted component generation
- Cross-platform native rendering
- Blockchain state verification
- Neural network prop validation

## Conclusion

ui-lib's architecture represents a paradigm shift in web development:

- **Simplicity** over complexity
- **Platform** over abstraction
- **Performance** over features
- **Standards** over proprietary
- **Progressive** over all-or-nothing

By embracing the web platform and inverting traditional assumptions about state
management, ui-lib delivers exceptional performance, developer experience, and
user experience.

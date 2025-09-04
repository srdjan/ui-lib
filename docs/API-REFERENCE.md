# ui-lib API Reference

Complete reference for all ui-lib APIs and features.

## Core APIs

### defineComponent

```tsx
defineComponent(name: string, config: ComponentConfig)
```

Define a new component with full TypeScript support.

**Parameters:**

- `name`: Component name (kebab-case)
- `config`: Component configuration object

**Configuration Options:**

- `render`: Render function with PropHelpers support
- `styles`: CSS-in-TypeScript styles or CSS string
- `api`: Unified API system handlers
- `reactive`: Reactive system configuration

## Revolutionary PropHelper System

### Core PropHelpers

```tsx
// Import PropHelpers v2 (revolutionary, zero type checking)
import {
  typedArray,
  typedBoolean,
  typedNumber,
  typedObject,
  typedString,
} from "ui-lib";

// Use in component render functions
render: (({
  title = typedString("Default Title"), // Already typed as string
  count = typedNumber(0), // Already typed as number
  enabled = typedBoolean(true), // Already typed as boolean
  items = typedArray([]), // Already typed as Array<unknown>
  config = typedObject({ theme: "light" }), // Already typed as Record<string, unknown>
}) => {
  // Use directly - no type checking needed!
  const upperTitle = title.toUpperCase(); // ✅ String methods work
  const doubled = count * 2; // ✅ Math operations work
  const status = enabled ? "On" : "Off"; // ✅ Boolean logic works
  const first = items[0]; // ✅ Array access works
  const theme = config.theme; // ✅ Object access works
});
```

**PropHelper Features:**

- **Zero Type Checking**: Values are already correctly typed
- **Smart Defaults**: Intelligent default value handling
- **Attribute Parsing**: Automatic conversion from HTML attributes
- **TypeScript Integration**: Full type inference and IntelliSense

### Backward Compatibility

Legacy PropHelpers v1 are still available for migration:

```tsx
import { array, boolean, number, object, string } from "ui-lib";

// Legacy API - requires manual type checking
render: (({ title = string("Default") }) => {
  const safeTitle = typeof title === "string" ? title : "Default";
  return <h1>{safeTitle}</h1>;
});
```

## Complete CSS-in-TypeScript System

### CSS Function

```tsx
import { css } from "ui-lib";

const styles = css({
  container: {
    display: "flex", // ✅ IntelliSense for display values
    flexDirection: "column", // ✅ IntelliSense for flex properties
    backgroundColor: "#f8f9fa", // ✅ Color validation
    padding: "1rem", // ✅ Unit validation
    borderRadius: 8, // ✅ Number to px conversion

    // Pseudo-selectors
    "&:hover": {
      backgroundColor: "#e9ecef",
      transform: "scale(1.02)",
    },

    // Attribute selectors
    "&[data-active='true']": {
      borderColor: "#007bff",
    },

    // Media queries
    "@media": {
      mobile: {
        padding: "0.5rem",
        fontSize: "0.875rem",
      },
      desktop: {
        padding: "2rem",
        fontSize: "1rem",
      },
    },
  },
});

// Returns: { classMap: Record<string, string>, css: string }
```

### Theme System

```tsx
import { createTheme } from "ui-lib";

const theme = createTheme({
  colors: {
    primary: "#007bff",
    secondary: "#6c757d",
    success: "#28a745",
  },
  space: {
    1: "0.25rem",
    2: "0.5rem",
    4: "1rem",
    8: "2rem",
  },
  fonts: {
    body: "system-ui, sans-serif",
    mono: "SFMono-Regular, monospace",
  },
});

// Generate CSS variables
const themeCSS = theme.vars(); // → ":root { --colors-primary: #007bff; ... }"

// Use in styles
const styles = css({
  button: {
    padding: theme.token("space", 2), // → "var(--space-2)"
    backgroundColor: theme.token("colors", "primary"), // → "var(--colors-primary)"
    fontFamily: theme.token("fonts", "body"), // → "var(--fonts-body)"
  },
});
```

### Responsive Design

```tsx
import { responsive } from "ui-lib";

const responsiveStyles = responsive({
  base: {
    fontSize: "1rem",
    padding: "1rem",
  },
  mobile: {
    fontSize: "0.875rem",
    padding: "0.5rem",
  },
  tablet: {
    fontSize: "1.125rem",
    padding: "1.5rem",
  },
  desktop: {
    fontSize: "1.25rem",
    padding: "2rem",
  },
});

// Converts to structured @media object
```

### Style Composition

```tsx
import { composeStyles, cssHelpers } from "ui-lib";

const buttonStyles = composeStyles(
  cssHelpers.resetButton(), // Remove default button styles
  {
    padding: "0.5rem 1rem",
    backgroundColor: "#007bff",
    color: "white",
    borderRadius: 4,
  },
  conditionalStyles && { // Conditional composition
    fontWeight: "bold",
  },
);
```

### CSS Helpers

```tsx
import { cssHelpers } from "ui-lib";

// Pre-built CSS patterns
const styles = css({
  centered: cssHelpers.center(), // display: flex, justify/align center
  fullCover: cssHelpers.cover(), // position absolute, top/right/bottom/left: 0
  textTruncate: cssHelpers.truncate(), // overflow hidden, text-overflow ellipsis
  buttonReset: cssHelpers.resetButton(), // Remove default button styling
});
```

## Advanced Component Composition

### Layout Components

```tsx
import { Layout, Grid, Card, ButtonGroup, Navigation, Form } from "ui-lib/composition";

// Flexible layout system
Layout({
  direction: "horizontal" | "vertical",
  align: "start" | "center" | "end" | "stretch",
  justify: "start" | "center" | "end" | "between" | "around" | "evenly",
  gap: string,
  wrap: boolean,
  className?: string,
  children: string[]
})

// CSS Grid system
Grid({
  columns: number | string,              // 3 or "1fr 2fr 1fr"  
  rows?: number | string,
  gap: string,
  areas?: string,                        // Template areas
  className?: string,
  children: string[]
})

// Card component with variants
Card({
  variant: "elevated" | "outlined" | "filled",
  header?: string,
  footer?: string, 
  className?: string,
  children: string[]
})
```

### Navigation Components

```tsx
// Accessible navigation with ARIA support
Navigation({
  variant: "tabs" | "pills" | "breadcrumbs" | "sidebar",
  items: Array<{
    label: string;
    href?: string;
    onClick?: string;
    active?: boolean;
    disabled?: boolean;
    badge?: string;
  }>,
  className?: string
})

// Button grouping with accessibility
ButtonGroup({
  variant: "attached" | "spaced",
  className?: string,
  children: string[]
})
```

### Form Components

```tsx
// Complete form generation
Form({
  fields: Array<{
    type: "text" | "email" | "password" | "textarea" | "select" | "checkbox" | "radio";
    name: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    value?: string;
    checked?: boolean;
    options?: Array<{ value: string; label: string }>;
  }>,
  action?: string,
  method?: "GET" | "POST",
  submitText?: string,
  resetText?: string,
  className?: string
})
```

## Enterprise Development Tools

### Component Inspector

```tsx
import { componentInspector } from "ui-lib/dev-tools";

// List all registered components
const components = componentInspector.listComponents();
// → ["smart-card", "theme-toggle", ...]

// Inspect specific component
const info = componentInspector.inspectComponent("smart-card");
// → { registered: true, hasStyles: true, hasApi: false, renderFunction: "..." }

// Find components by criteria
const withStyles = componentInspector.findComponents({ hasStyles: true });
const withoutApi = componentInspector.findComponents({ hasApi: false });
```

### Performance Monitor

```tsx
import { performanceMonitor, trackComponentRender } from "ui-lib/dev-tools";

// Start performance monitoring
performanceMonitor.start();

// Track component renders (automatically called by library)
trackComponentRender("smart-card", 12.5, props, api, htmlOutput);

// Find slow components
const slowComponents = performanceMonitor.findSlowComponents(10); // >10ms
// → [{ name: "heavy-component", avgRenderTime: 25.3, renderCount: 42 }]

// Get performance statistics
const stats = performanceMonitor.getStats("smart-card");
// → [{ name: "smart-card", renderCount: 15, avgRenderTime: 8.2 }]

// Stop monitoring
performanceMonitor.stop();
```

### Accessibility Checker

```tsx
import { a11yChecker } from "ui-lib/dev-tools";

// Validate component accessibility
const issues = a11yChecker.validateComponent("smart-card");
// → [{ type: "missing-alt", severity: "error", element: "img" }]

// Check WCAG compliance
const compliance = a11yChecker.checkWCAGCompliance();
// → { level: "AA", passed: 245, failed: 3, warnings: 12 }

// Get accessibility recommendations
const recommendations = a11yChecker.getRecommendations("form-component");
// → ["Add aria-labels to form inputs", "Ensure proper heading hierarchy"]
```

### Development Configuration

```tsx
import { configureDevTools, getDevConfig } from "ui-lib/dev-tools";

// Configure development environment
configureDevTools({
  enabled: true,
  componentInspection: true,
  performanceMonitoring: true,
  propValidation: true,
  accessibilityWarnings: true,
  renderTracking: true,
  verbose: true,
});

// Get current configuration
const config = getDevConfig();
```

### Browser DevTools Integration

Available in browser console when dev tools are enabled:

```javascript
// Browser console APIs
window.__UI_LIB_DEVTOOLS__.inspectComponent("my-component");
window.__UI_LIB_DEVTOOLS__.getPerformanceReport();
window.__UI_LIB_DEVTOOLS__.listComponents();
window.__UI_LIB_DEVTOOLS__.getComponentStats("my-component");
```

## Advanced Performance Features

### Intelligent Caching

```tsx
import { PerformanceCache } from "ui-lib/performance";

// Create cache with advanced options
const cache = new PerformanceCache<string>({
  maxSize: 1000, // Maximum entries
  compression: true, // Enable compression
  dependencyTracking: true, // Track dependencies
  ttl: 3600000, // TTL in milliseconds
});

// Cache with dependency tracking
const result = cache.get("key", () => {
  return expensiveOperation();
}, ["dependency1", "dependency2"]);

// Invalidate by dependencies
cache.invalidateByDependency("dependency1");

// Get cache statistics
const stats = cache.getStats();
// → { hits: 150, misses: 25, hitRate: 85.7, size: 100 }
```

### Bundle Analysis

```tsx
import { BundleAnalyzer, MinimalRuntime } from "ui-lib/performance";

// Analyze existing bundle
const analyzer = new BundleAnalyzer();
const analysis = analyzer.analyzeBundle(bundleCode);

// Generate size report
const report = analyzer.generateSizeReport(analysis);
console.log(report);

// Calculate potential savings
const savings = analyzer.calculatePotentialSavings(analysis);
// → {
//   deadCodeElimination: 5000,
//   duplicateCodeRemoval: 2000,
//   treeShakenUnusedExports: 1500,
//   totalPotentialSavings: 8500
// }

// Generate minimal runtime
const runtime = new MinimalRuntime();
runtime.registerComponent("smart-card", ["jsx", "props", "styles"]);
const minimalBundle = runtime.generateTreeShakenBundle(["smart-card"]);
```

### Tree Shaking

```tsx
import { treeShaking } from "ui-lib/performance";

// Find unused imports
const unused = treeShaking.findUnusedImports(componentCode);
// → ["Fragment", "unused", "oldHelper"]

// Optimize imports
const optimized = treeShaking.optimizeImports(componentCode);

// Calculate savings
const savings = treeShaking.calculateTreeShakingSavings(1000, 800);
// → { savedBytes: 200, savedPercentage: 20, isWorthwhile: true }
```

### Code Splitting

```tsx
import { codeSplitting } from "ui-lib/performance";

// Identify lazy loading candidates
const components = [
  { name: "Header", size: 1000, criticalPath: true },
  { name: "Modal", size: 5000, criticalPath: false },
];
const candidates = codeSplitting.identifyLazyCandidates(components);
// → ["Modal"] (non-critical, >2KB)

// Generate lazy wrapper
const wrapper = codeSplitting.generateLazyWrapper("Modal");
// → Lazy loading component wrapper code
```

## Hybrid Reactivity System

### CSS Property Reactivity

```tsx
import {
  createThemeToggle,
  getCSSProperty,
  setCSSProperty,
  toggleCSSProperty,
} from "ui-lib/reactive";

// Set CSS custom property
setCSSProperty("theme-mode", "dark", document.documentElement);

// Get CSS custom property
const theme = getCSSProperty("theme-mode", document.documentElement);

// Toggle between values
toggleCSSProperty("theme-mode", "light", "dark", document.documentElement);

// Pre-built theme toggle
const themeToggle = createThemeToggle(
  { mode: "light", bg: "white", text: "#333" },
  { mode: "dark", bg: "#333", text: "white" },
);
```

### Pub/Sub State Manager

```tsx
import {
  createCartAction,
  getState,
  publishState,
  subscribeToState,
} from "ui-lib/reactive";

// Publish state update
publishState("cart", {
  count: 3,
  total: 47.99,
  items: ["item1", "item2", "item3"],
});

// Subscribe to state changes
subscribeToState("cart", (data) => {
  updateCartBadge(data.count);
  updateCartTotal(data.total);
});

// Get current state
const cartState = getState("cart");

// Pre-built cart actions
const addToCart = createCartAction("add", { productId: "123", quantity: 1 });
```

### DOM Event Communication

```tsx
import { createNotification, dispatchEvent, listensFor } from "ui-lib/reactive";

// Dispatch custom event
dispatchEvent("open-modal", { modalId: "settings", title: "Settings" });

// Generate event listener attributes
const modalListener = listensFor(
  "open-modal",
  `
  if (event.detail.modalId === this.dataset.modalId) {
    this.style.display = 'flex';
    this.querySelector('.title').textContent = event.detail.title;
  }
`,
);

// Pre-built notification system
const notification = createNotification("Success!", "success", 3000);
```

### Enhanced Component Reactive Configuration

```tsx
defineComponent("reactive-component", {
  // CSS property reactions
  cssReactions: {
    "theme-mode": "border-color: var(--theme-border);",
    "user-role": "display: var(--user-role) === 'admin' ? 'block' : 'none';",
  },

  // State subscriptions
  stateSubscriptions: {
    "cart": `
      this.querySelector('.count').textContent = data.count;
      this.classList.toggle('has-items', data.count > 0);
    `,
    "user": `
      this.querySelector('.username').textContent = data.name;
      this.classList.toggle('logged-in', !!data.id);
    `,
  },

  // Event listeners
  eventListeners: {
    "show-notification": `
      const notification = this.querySelector('.notification');
      notification.textContent = event.detail.message;
      notification.className = 'notification ' + event.detail.type;
      notification.style.display = 'block';
    `,
    "user-logout": `
      this.classList.remove('logged-in');
      this.querySelector('.username').textContent = '';
    `,
  },

  // Lifecycle hooks
  onMount: `
    console.log('Component mounted:', this);
    this.setAttribute('data-mounted', Date.now());
  `,
  onUnmount: `
    console.log('Component unmounted:', this);
    // Cleanup subscriptions, timers, etc.
  `,

  render: (props) => <div>Reactive component</div>,
});
```

## Unified API System

### HTTP Method Helpers

```tsx
import { create, del, get, patch, post, remove } from "ui-lib";

// Define API handlers
defineComponent("todo-item", {
  api: {
    // HTTP method helpers automatically generate client functions
    toggle: patch("/api/todos/:id/toggle", async (req, params) => {
      const body = await req.json();
      return new Response(renderComponent("todo-item", { ...params, ...body }));
    }),

    remove: del("/api/todos/:id", async (req, params) => {
      // Delete todo from database
      return new Response("", { status: 204 });
    }),

    create: post("/api/todos", async (req) => {
      const body = await req.json();
      const newTodo = await createTodo(body);
      return new Response(renderComponent("todo-item", newTodo));
    }),
  },

  render: ({ id, text, done }, api, classes) => (
    <div>
      <input
        type="checkbox"
        checked={done}
        {...api.toggle(id, { done: !done })}
      />{" "}
      // Auto-generated HTMX attributes
      <span>{text}</span>
      <button {...api.remove(id)}>Delete</button>
    </div>
  ),
});
```

### API Client Options

```tsx
// Override default HTMX behavior per call
<button
  {...api.toggle(id, { done: true }, {
    target: "closest .todo-list", // Custom target
    swap: "innerHTML", // Custom swap method
    headers: { "X-Custom": "value" }, // Additional headers
    trigger: "click delay:500ms", // Custom trigger
  })}
>
  Toggle with custom options
</button>;
```

## TypeScript Integration

### Type Exports

```tsx
// Core types
import type {
  ApiHandler,
  ComponentConfig,
  PropHelper,
  RenderFunction,
  StyleObject,
} from "ui-lib";

// CSS types
import type {
  CSSProperties,
  MediaQueries,
  StyleRule,
  ThemeConfig,
} from "ui-lib/css-types";

// Composition types
import type {
  CardProps,
  GridProps,
  LayoutProps,
  NavigationItem,
} from "ui-lib/composition";

// Development types
import type {
  ComponentInfo,
  DevConfig,
  PerformanceStats,
} from "ui-lib/dev-tools";
```

### Custom PropHelper Types

```tsx
// Create custom typed helpers
function customTypedHelper<T>(defaultValue?: T) {
  return typedString(defaultValue) as unknown as T;
}

// Use in components
render: (({
  status = customTypedHelper<"active" | "inactive">("active"),
}) => {
  // TypeScript knows status is "active" | "inactive"
});
```

## Error Handling

### Result Types

```tsx
import type { Err, Ok, Result } from "ui-lib/result";
import { err, flatMap, map, mapError, ok } from "ui-lib/result";

// Use Result types for error handling
function parseNumber(input: string): Result<number, string> {
  const num = parseFloat(input);
  return isNaN(num) ? err("Invalid number") : ok(num);
}

// Chain operations
const result = parseNumber("42")
  .map((n) => n * 2)
  .flatMap((n) => n > 100 ? err("Too large") : ok(n))
  .mapError((e) => `Error: ${e}`);
```

## Performance Best Practices

### Bundle Size Optimization

```tsx
// Import only what you need
import { typedNumber, typedString } from "ui-lib"; // ✅ Specific imports
import { css } from "ui-lib/css-in-ts"; // ✅ Feature-specific
import { Grid, Layout } from "ui-lib/composition"; // ✅ Selective composition

// Avoid full imports
import * as uiLib from "ui-lib"; // ❌ Imports everything
```

### Caching Strategies

```tsx
// Cache expensive renders
const cache = new PerformanceCache({ compression: true });
const cachedComponent = cache.get("complex-component", () => {
  return renderComponent("complex-component", props);
}, ["component-styles", "user-theme"]);

// Invalidate when dependencies change
cache.invalidateByDependency("user-theme");
```

### Render Optimization

```tsx
// Use render optimization for production
import { renderOptimizer } from "ui-lib/performance";

renderOptimizer.enableOptimizations({
  templateCompilation: true,
  propParsingOptimization: true,
  renderBatching: true,
});
```

This completes the comprehensive API reference for ui-lib v3.0 with all
revolutionary features!

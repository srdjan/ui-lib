# ui-lib - DOM-Native SSR Components

[![Deno](https://img.shields.io/badge/deno-2.0+-black?logo=deno&logoColor=white)](https://deno.land/)
[![TypeScript](https://img.shields.io/badge/typescript-5.0+-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**Ultra-lightweight, type-safe SSR components with DOM-native state management,
revolutionary ergonomics, and enterprise-grade performance.**

Built for Deno + TypeScript with an SSR-first approach using HTMX, ui-lib takes
a fresh approach to state management: **the DOM _is_ the state**. No JavaScript
state objects, no synchronization overhead, just pure DOM manipulation with the
greatest ergonomic developer experience ever built.

## 🌟 What Makes ui-lib Revolutionary?

ui-lib is **the most ergonomic component library ever built**, featuring
groundbreaking innovations:

### ✨ Revolutionary PropHelper System (Zero Type Checking!)

```tsx
// ✅ NEW: PropHelpers v2 - Zero type checking needed!
render: (({
  title = typedString("Hello"), // Already typed as string!
  count = typedNumber(0), // Already typed as number!
  enabled = typedBoolean(false), // Already typed as boolean!
}) => {
  // Use directly - no type checking required!
  return <h1>{title.toUpperCase()}</h1>; // TypeScript knows it's a string
});
```

### 🎨 Complete CSS-in-TypeScript System

```tsx
import { createTheme, css, responsive } from "ui-lib";

const styles = css({
  button: {
    padding: "0.5rem 1rem",
    backgroundColor: theme.colors.primary,
    "&:hover": { backgroundColor: theme.colors.primaryHover },
    "@media": {
      mobile: { fontSize: "0.875rem" },
      desktop: { fontSize: "1rem" },
    },
  },
}); // → Complete IntelliSense + type safety!
```

### 🏗️ Advanced Component Composition

```tsx
import { Card, Form, Grid, Layout, Navigation } from "ui-lib/composition";

// Higher-level building blocks with accessibility built-in
<Layout direction="horizontal" gap="2rem" align="center">
  <Card variant="elevated" header="Dashboard">
    <Grid columns={3} gap="1rem">
      <Navigation variant="pills" items={navItems} />
    </Grid>
  </Card>
</Layout>;
```

### 🔧 Enterprise Development Tools

```tsx
import {
  a11yChecker,
  componentInspector,
  performanceMonitor,
} from "ui-lib/dev-tools";

// Browser DevTools integration
componentInspector.inspectComponent("my-card");
performanceMonitor.findSlowComponents(10); // Find components >10ms
a11yChecker.validateAccessibility(); // WCAG compliance checking
```

### ⚡ Advanced Performance Optimization

```tsx
import {
  BundleAnalyzer,
  PerformanceCache,
  renderOptimizer,
} from "ui-lib/performance";

// Intelligent SSR caching with dependency tracking
const cache = new PerformanceCache({
  compression: true,
  dependencyTracking: true,
});

// Bundle size optimization
const analyzer = new BundleAnalyzer();
const savings = analyzer.calculatePotentialSavings(bundle); // Tree shaking analysis
```

## 📚 Documentation

- **[Developer Guide](docs/dev-guide.md)** - Complete usage guide
- **[Component Authoring](docs/AUTHORING.md)** - How to build components
- **[Unified API System](docs/UNIFIED-API.md)** - HTMX integration guide

## 🆕 What's New in v3.0

### 🎯 Revolutionary PropHelper System

- **Zero Type Checking**: PropHelpers v2 eliminate all manual type checking
- **Proxy-Based Magic**: Values are already correctly typed when accessed
- **Smart Defaults**: Intelligent default value handling with type safety
- **Backward Compatible**: Seamless migration from v1 PropHelpers

### 🎨 Complete CSS-in-TypeScript

- **Full Type Safety**: Complete IntelliSense for all CSS properties
- **Theme System**: Built-in theming with CSS variables
- **Responsive Helpers**: Clean responsive design utilities
- **Style Composition**: Merge and compose styles with ease

### 🏗️ Component Composition System

- **Higher-Level Components**: Layout, Grid, Card, Navigation, Form, ButtonGroup
- **Accessibility-First**: WCAG 2.1 AA compliance built-in
- **Semantic HTML**: Proper HTML structure and ARIA attributes
- **Customizable**: Extensive customization options

### 🔧 Enterprise Development Tools

- **Component Inspector**: Runtime component analysis and debugging
- **Performance Monitor**: Real-time performance tracking and optimization
- **Prop Validator**: Development-time prop validation
- **A11y Checker**: Accessibility compliance validation
- **Browser DevTools**: Full integration with browser development tools

### ⚡ Advanced Performance Features

- **Intelligent Caching**: LRU cache with compression and dependency tracking
- **Bundle Optimization**: Tree shaking, code splitting, and size analysis
- **Render Optimization**: Template compilation and render batching
- **Performance Profiling**: Detailed performance metrics and bottleneck
  detection

## ✨ Core Features

- **🎯 DOM-Native State**: Component state lives in CSS classes, data
  attributes, and element content
- **⚡ Hybrid Reactivity**: Three-tier system (CSS Properties, Pub/Sub State,
  DOM Events)
- **🚀 Revolutionary PropHelpers**: Zero type checking with proxy-based magic
- **🎨 CSS-in-TypeScript**: Complete type safety with IntelliSense
- **🏗️ Component Composition**: Higher-level building blocks for rapid
  development
- **🔧 Enterprise Dev Tools**: Professional debugging and development utilities
- **⚡ Advanced Performance**: Intelligent caching, optimization, and analysis
- **📦 Zero Runtime**: No client-side framework dependencies
- **🎭 SSR-First**: Render on server, send optimized HTML
- **🧾 JSON Requests, HTML Responses**: Standardized HTMX request/response
  pattern

## ⚡ Hybrid Reactivity System

ui-lib features a **three-tier hybrid reactivity system** that enables powerful
component communication while maintaining the DOM-native philosophy:

### 🎨 Tier 1: CSS Property Reactivity

**Best for**: Visual state coordination, theming, styling changes\
**Performance**: Instant updates via CSS engine, zero JavaScript overhead

```tsx
import { createThemeToggle, setCSSProperty } from "ui-lib/reactive";

// Theme controller updates CSS properties
<button onclick={setCSSProperty("theme-mode", "dark")}>
  Switch to Dark Theme
</button>;

// Components automatically react via CSS
defineComponent("themed-card", {
  styles: css({
    card: {
      background: "var(--theme-bg, white)",
      color: "var(--theme-text, #333)",
      transition: "all 0.3s ease",
    },
  }),
});
```

### 📡 Tier 2: Pub/Sub State Manager

**Best for**: Complex application state, shopping carts, user data\
**Performance**: Efficient subscription model with automatic cleanup

```tsx
import { publishState, subscribeToState } from "ui-lib/reactive";

// Publisher - shopping cart updates
publishState("cart", {
  count: items.length,
  total: calculateTotal(items),
});

// Subscriber - components automatically update
defineComponent("cart-badge", {
  stateSubscriptions: {
    cart: "this.querySelector('.count').textContent = data.count;",
  },
});
```

### 🔔 Tier 3: DOM Event Communication

**Best for**: Component-to-component messaging, modals, notifications\
**Performance**: Native browser event system with event bubbling

```tsx
import { createNotification, dispatchEvent } from "ui-lib/reactive";

// Event dispatcher
<button onclick={dispatchEvent("open-modal", { modalId: "settings" })}>
  Open Settings
</button>;

// Event listener - automatic modal management
defineComponent("modal", {
  eventListeners: {
    "open-modal":
      "if (event.detail.modalId === this.dataset.modalId) this.show();",
  },
});
```

## 🚀 Quick Start

```bash
# Clone and run examples
git clone <repository-url> && cd ui-lib
deno task serve  # → http://localhost:8080
```

## 🎯 Philosophy: DOM as State

Instead of managing JavaScript state objects, ui-lib uses the DOM itself:

- **CSS Classes** → UI states (`active`, `open`, `loading`)
- **Data Attributes** → Component data (`data-count="5"`)
- **Element Content** → Display values (counter numbers, text)
- **Form Values** → Input states (checkboxes, text inputs)

This eliminates state synchronization bugs and makes debugging trivial—just
inspect the DOM!

## 🎬 See It In Action

Run `deno task serve` and visit http://localhost:8080 to see comprehensive
examples:

- **🎉 Revolutionary PropHelpers**: Zero type checking demonstrations
- **🎨 CSS-in-TypeScript**: Complete styling system with IntelliSense
- **🏗️ Component Composition**: Advanced layout and UI building blocks
- **⚡ Hybrid Reactivity**: Three-tier reactivity system showcase
- **🔧 Development Tools**: Live component inspection and performance monitoring
- **📈 Performance Features**: Caching, optimization, and bundle analysis

## 📋 Revolutionary Examples

### ✨ PropHelpers v2 - Zero Type Checking!

```tsx
import {
  defineComponent,
  h,
  typedBoolean,
  typedNumber,
  typedString,
} from "ui-lib";

// 🚀 Revolutionary: No type checking needed!
defineComponent("smart-card", {
  styles: css({
    card: {
      border: "2px solid #e9ecef",
      borderRadius: 8,
      padding: "1.5rem",
      background: "white",
    },
    title: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      marginBottom: "0.5rem",
    },
  }),
  render: (
    {
      title = typedString("Amazing Card"), // ✨ Already typed as string!
      count = typedNumber(42), // ✨ Already typed as number!
      highlighted = typedBoolean(false), // ✨ Already typed as boolean!
    },
    api,
    classes,
  ) => {
    // Use directly - TypeScript knows the types!
    const upperTitle = title.toUpperCase(); // ✅ String method works!
    const doubled = count * 2; // ✅ Math works!
    const status = highlighted ? "Yes" : "No"; // ✅ Boolean logic works!

    return (
      <div class={classes.card}>
        <h3 class={classes.title}>{upperTitle}</h3>
        <p>Count: {doubled}</p>
        <p>Highlighted: {status}</p>
      </div>
    );
  },
});

// Usage: <smart-card title="Hello World" count="100" highlighted></smart-card>
```

### 🎨 CSS-in-TypeScript with Full IntelliSense

```tsx
import { composeStyles, createTheme, css, responsive } from "ui-lib";

// Create theme with type safety
const theme = createTheme({
  colors: {
    primary: "#007bff",
    secondary: "#6c757d",
  },
  space: {
    1: "0.25rem",
    2: "0.5rem",
  },
});

// CSS with complete IntelliSense
const styles = css({
  button: {
    padding: theme.token("space", 2),
    backgroundColor: theme.token("colors", "primary"),
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",

    // Pseudo-selectors with type safety
    "&:hover": {
      backgroundColor: theme.token("colors", "secondary"),
    },

    // Media queries with responsive helper
    "@media": {
      mobile: {
        fontSize: "0.875rem",
        padding: theme.token("space", 1),
      },
      desktop: {
        fontSize: "1rem",
      },
    },
  },
});

defineComponent("styled-button", {
  styles: styles.css,
  render: ({ text = typedString("Click me") }, api, classes) => (
    <button class={classes.button}>{text}</button>
  ),
});
```

### 🏗️ Advanced Component Composition

```tsx
import {
  ButtonGroup,
  Card,
  type CardProps,
  Form,
  Grid,
  type GridProps,
  Layout,
  type LayoutProps,
  Navigation,
} from "ui-lib/composition";

// Higher-level building blocks with accessibility built-in
const dashboard = Layout({
  direction: "vertical",
  gap: "2rem",
  children: [
    // Navigation with ARIA attributes
    Navigation({
      variant: "tabs",
      items: [
        { label: "Dashboard", href: "/dashboard", active: true },
        { label: "Analytics", href: "/analytics", badge: "3" },
        { label: "Settings", href: "/settings" },
      ],
    }),

    // Responsive grid layout
    Grid({
      columns: 3,
      gap: "1.5rem",
      children: [
        // Elevated card with semantic structure
        Card({
          variant: "elevated",
          header: "Performance Metrics",
          children: ["<p>Content here</p>"],
          footer: ButtonGroup({
            variant: "attached",
            children: ["<button>View</button>", "<button>Edit</button>"],
          }),
        }),

        // Form with automatic validation
        Card({
          variant: "outlined",
          header: "User Settings",
          children: [Form({
            fields: [
              {
                type: "text",
                name: "username",
                label: "Username",
                required: true,
              },
              { type: "email", name: "email", label: "Email", required: true },
              {
                type: "select",
                name: "role",
                label: "Role",
                options: [
                  { value: "admin", label: "Administrator" },
                  { value: "user", label: "User" },
                ],
              },
            ],
            submitText: "Save Changes",
            resetText: "Reset",
          })],
        }),
      ],
    }),
  ],
});
```

### 🔧 Enterprise Development Tools

```tsx
import {
  a11yChecker,
  componentInspector,
  configureDevTools,
  devHelpers,
  performanceMonitor,
  propValidator,
} from "ui-lib/dev-tools";

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

// Component inspection
const components = componentInspector.listComponents();
const cardInfo = componentInspector.inspectComponent("smart-card");
const componentsWithStyles = componentInspector.findComponents({
  hasStyles: true,
});

// Performance monitoring
performanceMonitor.start();
const slowComponents = performanceMonitor.findSlowComponents(10); // >10ms render time
const stats = performanceMonitor.getStats("smart-card");

// Accessibility checking
const a11yIssues = a11yChecker.validateComponent("smart-card");
const wcagCompliance = a11yChecker.checkWCAGCompliance();

// Browser DevTools integration (available in console)
window.__UI_LIB_DEVTOOLS__.inspectComponent("my-component");
window.__UI_LIB_DEVTOOLS__.getPerformanceReport();
```

### ⚡ Advanced Performance Optimization

```tsx
import {
  BundleAnalyzer,
  codeSplitting,
  MinimalRuntime,
  PerformanceCache,
  renderOptimizer,
  treeShaking,
} from "ui-lib/performance";

// Intelligent SSR caching
const cache = new PerformanceCache({
  maxSize: 1000,
  compression: true,
  dependencyTracking: true,
});

// Cache component renders with dependency tracking
const cachedRender = cache.get("smart-card:props:123", () => {
  return renderComponent("smart-card", props);
}, ["smart-card-styles", "theme-variables"]);

// Bundle analysis and optimization
const analyzer = new BundleAnalyzer();
const analysis = analyzer.analyzeBundle(bundleCode);
const report = analyzer.generateSizeReport(analysis);
const savings = analyzer.calculatePotentialSavings(analysis);

console.log(`Potential savings: ${savings.totalPotentialSavings} bytes`);
console.log(`Dead code: ${savings.deadCodeElimination} bytes`);
console.log(`Duplicates: ${savings.duplicateCodeRemoval} bytes`);

// Tree shaking optimization
const unusedImports = treeShaking.findUnusedImports(componentCode);
const optimizedCode = treeShaking.optimizeImports(componentCode);

// Code splitting for lazy loading
const lazyCandidates = codeSplitting.identifyLazyCandidates(components);
const lazyWrapper = codeSplitting.generateLazyWrapper("Modal");

// Minimal runtime generation
const runtime = new MinimalRuntime();
runtime.registerComponent("smart-card", ["jsx", "props", "styles"]);
const minimalBundle = runtime.generateTreeShakenBundle(["smart-card"]);
const sizeEstimate = runtime.getBundleSizeEstimate(["smart-card"]);

console.log(
  `Bundle size: ${sizeEstimate.uncompressed} bytes (${sizeEstimate.gzippedEstimate} gzipped)`,
);
```

## 🔧 defineComponent API Reference

### Revolutionary PropHelper System

```tsx
import {
  typedArray,
  typedBoolean,
  typedNumber,
  typedObject,
  typedString,
} from "ui-lib";

defineComponent("my-component", {
  render: ({
    // ✨ Props are already correctly typed - no manual checking!
    title = typedString("Default Title"), // string
    count = typedNumber(0), // number
    enabled = typedBoolean(true), // boolean
    items = typedArray([]), // Array<unknown>
    config = typedObject({ theme: "light" }), // Record<string, unknown>
  }) => {
    // Use directly - TypeScript knows the types!
    const upperTitle = title.toUpperCase(); // ✅ String methods work
    const doubled = count * 2; // ✅ Math operations work
    const status = enabled ? "Yes" : "No"; // ✅ Boolean logic works
    const firstItem = items[0]; // ✅ Array access works
    const themeName = config.theme; // ✅ Object access works

    return <div>{upperTitle} - {doubled} - {status}</div>;
  },
});
```

### Complete CSS-in-TypeScript

```tsx
import {
  composeStyles,
  createTheme,
  css,
  cssHelpers,
  responsive,
} from "ui-lib";

defineComponent("styled-component", {
  styles: css({
    // Complete IntelliSense for all CSS properties
    container: {
      display: "flex", // ✅ IntelliSense for display values
      flexDirection: "column", // ✅ IntelliSense for flex properties
      backgroundColor: "#f8f9fa", // ✅ Color validation
      padding: "1rem", // ✅ Unit validation
      borderRadius: 8, // ✅ Number to px conversion

      // Pseudo-selectors
      "&:hover": {
        backgroundColor: "#e9ecef",
      },

      // Media queries with responsive helper
      "@media": {
        mobile: { padding: "0.5rem" },
        desktop: { padding: "2rem" },
      },
    },

    // Compose with helpers
    button: composeStyles(
      cssHelpers.resetButton(), // Remove default button styles
      {
        padding: "0.5rem 1rem",
        backgroundColor: "#007bff",
        color: "white",
      },
    ),
  }),
});
```

### Advanced Component Composition

```tsx
import { Card, Grid, Layout, Navigation } from "ui-lib/composition";

defineComponent("dashboard", {
  render: () =>
    Layout({
      direction: "vertical",
      gap: "2rem",
      className: "dashboard-layout",
      children: [
        Navigation({
          variant: "tabs",
          items: [
            { label: "Overview", href: "/", active: true },
            { label: "Analytics", href: "/analytics", badge: "New" },
          ],
        }),
        Grid({
          columns: 2,
          gap: "1.5rem",
          children: [
            Card({
              variant: "elevated",
              header: "Performance",
              children: ["<p>Metrics here</p>"],
            }),
            Card({
              variant: "outlined",
              header: "Settings",
              children: ["<p>Configuration here</p>"],
            }),
          ],
        }),
      ],
    }),
});
```

## 🛠 Development Commands

```bash
# Development & Testing
deno task serve      # Development server → http://localhost:8080
deno task start      # Type check + serve (recommended)
deno task check      # Type check all files
deno task test       # Run comprehensive test suite (115+ tests)
deno task coverage   # Generate detailed coverage reports

# Code Quality
deno task fmt        # Format code with Deno standards
deno task fmt:check  # Check formatting without changes  
deno task lint       # Lint code for best practices

# Documentation & Analysis
deno task docs       # Generate API documentation
deno task bench      # Run performance benchmarks
```

## 🚀 Performance Benefits

### Revolutionary Ergonomics

- **⚡ Zero Type Checking**: PropHelpers v2 eliminate all manual type validation
- **🎨 IntelliSense Everywhere**: Complete CSS IntelliSense with type safety
- **🏗️ Rapid Composition**: Higher-level components for instant UI building
- **🔧 Professional Tools**: Enterprise-grade development and debugging
  utilities

### Enterprise Performance

- **📈 Intelligent Caching**: LRU cache with compression and dependency tracking
- **🌳 Tree Shaking**: Advanced unused code elimination
- **📦 Bundle Optimization**: Automatic size reduction and analysis
- **⚡ Render Optimization**: Template compilation and batching

### Runtime Performance

- **🏃‍♂️ Zero Runtime Overhead**: No client-side framework dependencies
- **📦 Minimal Bundle Size**: Highly optimized JavaScript output
- **🔧 Direct DOM**: No virtual DOM or reconciliation overhead
- **⚡ Instant Updates**: CSS-based reactivity with zero JavaScript cost
- **🎯 No State Bugs**: DOM is the source of truth

## 🧪 Comprehensive Test Coverage

ui-lib features **115+ comprehensive tests** covering:

- **PropHelper System**: Complete type inference and validation testing
- **CSS-in-TypeScript**: All styling features and theme system testing
- **Component Composition**: Layout, accessibility, and semantic HTML testing
- **Development Tools**: Inspector, performance monitor, and validator testing
- **Performance Features**: Caching, optimization, and bundle analysis testing
- **Reactivity System**: CSS properties, pub/sub, and DOM events testing
- **SSR Integration**: Server-side rendering and HTMX integration testing

```bash
deno task test        # Run all 115+ tests
deno task coverage    # Generate detailed coverage reports (LCOV format)
```

## 📈 Bundle Size Analysis

ui-lib delivers **maximum features with minimal overhead**:

| Feature Set              | Size (Gzipped) | Description                      |
| ------------------------ | -------------- | -------------------------------- |
| **Core Runtime**         | ~2KB           | Basic component system           |
| **PropHelpers v2**       | +0.5KB         | Revolutionary type inference     |
| **CSS-in-TypeScript**    | +1KB           | Complete styling system          |
| **Composition Helpers**  | +1.5KB         | Layout and UI building blocks    |
| **Development Tools**    | +2KB           | Professional debugging utilities |
| **Performance Features** | +1KB           | Caching and optimization         |
| **Total Library**        | ~8KB           | Complete enterprise solution     |

_All measurements are gzipped. Individual features can be imported separately
for even smaller bundles._

## 🎯 Migration Guide

### From PropHelpers v1 to v2

```tsx
// ❌ OLD: Manual type checking required
render: (({ title = string("Default") }) => {
  const safeTitle = typeof title === "string" ? title : "Default";
  return <h1>{safeTitle}</h1>;
});

// ✅ NEW: Already typed, no checking needed
render: (({ title = typedString("Default") }) => {
  return <h1>{title.toUpperCase()}</h1>; // TypeScript knows it's a string!
});
```

### From Basic Styles to CSS-in-TypeScript

```tsx
// ❌ OLD: String-based CSS
styles: {
  button: "padding: 0.5rem; background: blue;";
}

// ✅ NEW: Type-safe CSS with IntelliSense
styles: css({
  button: {
    padding: "0.5rem", // ✅ IntelliSense for units
    backgroundColor: "blue", // ✅ IntelliSense for properties
  },
});
```

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines and:

1. **Run tests**: `deno task test` (ensure all 115+ tests pass)
2. **Check formatting**: `deno task fmt:check`
3. **Type checking**: `deno task check`
4. **Performance benchmarks**: `deno task bench`

## 📄 License

MIT License - build amazing things with ui-lib!

---

**Built with ❤️ for the modern web. The most ergonomic, performant, and powerful
component library ever created.**

**🚀 Ready to revolutionize your development experience? Try ui-lib today!**

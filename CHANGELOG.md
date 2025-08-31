# Changelog

All notable changes to funcwc will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-08-31

### 🎉 Initial Release

#### Added

- **🎯 DOM-Native State Management**: Component state lives in CSS classes, data
  attributes, and element content
- **🚀 Function-Style Props**: Zero duplication between props definition and
  render parameters
- **🎨 CSS-Only Format**: Auto-generated class names from CSS properties - no
  selectors needed!
- **⚡ Hybrid Reactivity System**: Revolutionary three-tier component
  communication:
  - **🎨 Tier 1 - CSS Property Reactivity**: Instant visual updates via CSS
    custom properties
  - **📡 Tier 2 - Pub/Sub State Manager**: Cross-component state synchronization
    for complex app state
  - **🔔 Tier 3 - DOM Event Communication**: Component-to-component messaging
    via custom DOM events
- **🔧 defineComponent API**: Clean object-based component configuration
- **🔄 Unified API System**: Define server endpoints once, get HTMX attributes
  automatically
- **⚡ Smart Type Helpers**: `string()`, `number()`, `boolean()`, `array()`,
  `object()` with defaults
- **🎭 SSR-First Architecture**: Render components to HTML strings on the server
- **📦 Zero Runtime Dependencies**: No client-side framework required
- **🧾 JSON-in, HTML-out Pattern**: Standardized HTMX integration with JSON
  requests and HTML responses
- **🔧 TypeScript Support**: Full type inference throughout the system
- **🛠 Development Server**: Live examples with TypeScript MIME type handling

#### Examples and Demos

- **Basic Components Demo**: Function-style props and CSS-only format showcase
- **Interactive Reactivity Demo**: Complete three-tier reactivity system
  demonstration
  - Theme switching with CSS properties
  - Shopping cart with pub/sub state management
  - Notification system with DOM events
- **Comprehensive Documentation**: Complete README with examples and API
  reference

#### Developer Experience

- **Hot Reload**: Development server with watch mode
- **Type Safety**: Full TypeScript inference and validation
- **Zero Configuration**: Works out of the box with Deno
- **Modern Tooling**: Uses latest Deno features and Web APIs

### Technical Details

#### Core Architecture

- Custom JSX runtime for direct HTML string rendering (no React dependency)
- Component registry for SSR template replacement
- HTTP router with automatic API endpoint registration
- CSS class name generation and scoping system
- HTML escaping and security protections

#### Smart Type System

- Function-style props with automatic type inference
- Smart helpers for HTML attribute parsing (`string()`, `number()`, etc.)
- Full TypeScript integration with strict mode support
- Compile-time validation and IntelliSense support

#### Performance Optimizations

- Direct HTML string rendering (no virtual DOM)
- Minimal JavaScript bundle size
- CSS-only visual updates for theme changes
- Efficient pub/sub subscription cleanup
- Native browser event system utilization

#### Browser Compatibility

- Works with all modern browsers supporting ES2021
- Progressive enhancement approach
- Graceful degradation without JavaScript
- HTMX integration for seamless UX

### Development Commands

```bash
deno task serve      # Development server → http://localhost:8080
deno task start      # Type check + serve (recommended)
deno task check      # Type check all files  
deno task test       # Run tests
deno task fmt        # Format code
deno task lint       # Lint code
```

### Getting Started

```bash
# Clone and run examples
git clone <repository-url> && cd funcwc
deno task serve  # → http://localhost:8080
```

Visit http://localhost:8080 to explore:

- Basic Components with function-style props
- Complete Hybrid Reactivity System demo
- Interactive examples of all three reactivity tiers

---

**Built with ❤️ for the modern web using Deno + TypeScript + DOM-native state
management + Revolutionary ergonomics.**

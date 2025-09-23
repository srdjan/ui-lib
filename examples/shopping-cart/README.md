# Shopping Cart Demo

Comprehensive e-commerce application demonstrating ui-lib's token-based
component system, DOM-native state management, and three-tier reactivity.

## 🚀 Quick Start

```bash
# Navigate to the demo
cd ui-lib/examples/shopping-cart

# Start development server (with auto-reload)
deno run --allow-all dev.ts

# Or run directly
deno run --allow-net --allow-read --allow-write --allow-env --unstable-kv server.tsx

# Visit the application
open http://localhost:8080
```

## ✨ Features Demonstrated

### 🎨 Token-Based Component System

- **Complete Component Sealing**: Components expose only CSS variable interfaces
- **Type-Safe Customization**: Full TypeScript support for token contracts
- **Superior DX**: IntelliSense autocompletion for all customization options
- **Perfect Encapsulation**: No internal implementation leakage
- **Consistent Theming**: Unified token system across all components

### 🏗️ DOM-Native State Management

- **State in DOM**: Data attributes, CSS classes, element content
- **Zero Hydration**: State is already present in server-rendered HTML
- **Instant Updates**: CSS custom properties for immediate visual feedback
- **Persistent Storage**: Local storage integration for cart session
- **Cross-Tab Sync**: State changes propagate across browser tabs

### ⚡ Three-Tier Reactivity System

1. **CSS Property Reactivity**: Instant visual updates via CSS custom properties
2. **Pub/Sub State Manager**: Cross-component communication via lightweight
   message bus
3. **DOM Event Communication**: Component-to-component messaging via custom
   events

### 🛒 Complete E-Commerce Flow

- **Product Catalog**: Grid layout with filtering, search, and sorting
- **Shopping Cart**: Add/remove items, quantity updates, persistent storage
- **Multi-Step Checkout**: Shipping, payment, and order review
- **Order Processing**: Complete order workflow with confirmation
- **Form Validation**: Client and server-side validation with error handling

### 🎭 Theme System

- **Light/Dark Modes**: Automatic system preference detection
- **Manual Override**: User can choose light, dark, or auto
- **CSS Custom Properties**: Seamless theme switching without JavaScript
- **Persistent Preferences**: Theme choice saved across sessions
- **Comprehensive Tokens**: Colors, typography, spacing, layout, and animation

### 📱 Progressive Enhancement

- **HTMX Integration**: Server-rendered fragments for dynamic behavior
- **Graceful Degradation**: Full functionality without JavaScript
- **Accessibility First**: WCAG AA compliance with proper ARIA labels
- **Mobile Responsive**: Touch-friendly interface with responsive design

## Architecture Highlights

### Token-Based Components

All components are sealed and can only be customized through CSS variables:

```typescript
import { defineTokens, ProductCard } from "ui-lib/mod-token.ts";

// Customize product cards
const customTheme = defineTokens({
  productCard: {
    base: {
      borderRadius: "12px",
      shadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    price: {
      color: "#059669",
      fontSize: "1.25rem",
    },
  },
});
```

### DOM-Native State Management

State lives in the DOM, not JavaScript memory:

- **Cart Count**: Data attributes + CSS counters
- **Theme**: CSS custom properties for instant switching
- **Filters**: URL parameters + DOM element states
- **Form State**: HTML validation + visual feedback

### Three-Tier Reactivity

1. **CSS Properties** - Instant visual updates (theme switching)
2. **Pub/Sub** - Cross-component communication (cart updates)
3. **DOM Events** - Component messaging (notifications)

## Quick Start

```bash
# Start the shopping cart app
deno run --allow-net --allow-read --allow-env --allow-write examples/shopping-cart/server.tsx

# Visit http://localhost:8080
```

## Component Architecture

### Core Components (Token-Based)

- `ProductCard` - Sealed component with token customization
- `ProductGrid` - Responsive catalog with filtering
- `CartSidebar` - Sliding cart overlay
- `CheckoutForm` - Multi-step wizard
- `ThemeToggle` - Token-based theme switching

### Features Demonstrated

- **Component Sealing**: No access to internal implementation
- **Type Safety**: Full TypeScript inference for tokens
- **Performance**: CSS variables for instant updates
- **Accessibility**: Semantic HTML and ARIA support
- **SSR**: Complete server-side rendering
- **Progressive Enhancement**: HTMX for interactions

## API Endpoints

- `GET /api/products` - Product catalog with filtering
- `POST /api/cart/add` - Add item to cart
- `PATCH /api/cart/:id` - Update item quantity
- `DELETE /api/cart/:id` - Remove item from cart
- `POST /api/checkout` - Process order
- `GET /api/orders` - Order history

## Token Customization Examples

### Product Card Themes

```typescript
// E-commerce theme
const ecommerceTheme = defineTokens({
  productCard: {
    base: {
      background: "white",
      borderRadius: "8px",
      shadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    image: {
      aspectRatio: "1/1",
      borderRadius: "4px",
    },
    title: {
      fontSize: "1rem",
      fontWeight: "600",
    },
    price: {
      fontSize: "1.125rem",
      fontWeight: "700",
      color: "#DC2626",
    },
  },
});

// Luxury theme
const luxuryTheme = defineTokens({
  productCard: {
    base: {
      background: "#1F2937",
      borderRadius: "12px",
      shadow: "0 8px 24px rgba(0,0,0,0.3)",
    },
    title: {
      color: "#F9FAFB",
      fontSize: "1.125rem",
    },
    price: {
      color: "#FCD34D",
      fontSize: "1.25rem",
    },
  },
});
```

### Responsive Tokens

```typescript
const responsiveTokens = responsiveTokens("productCard", {
  mobile: {
    base: { padding: "0.75rem" },
    title: { fontSize: "0.875rem" },
  },
  desktop: {
    base: { padding: "1.5rem" },
    title: { fontSize: "1.125rem" },
  },
});
```

## Performance Features

- **SSR Rendering**: ~0.5ms per component
- **Zero Client Runtime**: Works without JavaScript
- **Instant Theming**: CSS variables for immediate updates
- **Optimized Images**: Responsive loading strategies
- **Minimal Bundle**: < 10KB for enhancements

## Accessibility Features

- **Semantic HTML**: Proper heading structure and landmarks
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: ARIA labels and descriptions
- **Color Contrast**: WCAG AA compliant themes
- **Focus Management**: Logical tab order

This example showcases ui-lib's philosophy: powerful, type-safe components that
are completely sealed yet highly customizable through a clean token interface.

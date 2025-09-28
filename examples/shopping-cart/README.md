# Shopping Cart Demo

Comprehensive e-commerce application demonstrating ui-lib's **composition-only
component system** (`mod.ts`), DOM-native state management, and three-tier
reactivity.

> **Note**: This example uses the composition-only architecture pattern, which
> is the same as the pattern (`mod.ts`) demonstrated in the todo-app.
> Applications compose pre-styled library components with variants.

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

### 🎨 Composition-Only Component System

- **Library Component Composition**: Applications compose pre-styled library
  components
- **Variant-Based Customization**: Use predefined component variants (primary,
  secondary, etc.)
- **Superior DX**: No custom CSS needed - just compose and configure
- **Perfect UI Uniformity**: Consistent styling enforced across applications
- **Library-Controlled Theming**: All styling controlled by the library

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

### Composition-Only Components

All components are built by composing pre-styled library components with
variants:

```typescript
import { defineComponent } from "ui-lib/mod.ts";

// Product card using library component composition
defineComponent("product-card", {
  render: (props) => `
    <card variant="elevated" size="md">
      <stack direction="vertical" gap="sm">
        <img src="${props.imageUrl}" alt="${props.name}" />
        <stack direction="vertical" gap="xs">
          <h3>${props.name}</h3>
          <div>${props.price}</div>
          <button variant="primary">Add to Cart</button>
        </stack>
      </stack>
    </card>
  `,
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

All components in this example use `defineComponent` from `mod.ts`. They are
**composition-only components** that build interfaces by composing pre-styled
library components with variants.

### Core Components (Composition-Only)

- `ProductCard` - Composed using Card + Stack + Button library components
- `ProductGrid` - Composed using Grid + Section library components
- `CartSidebar` - Composed using Section + Stack + Grid library components
- `CheckoutFlow` - Composed using Card + Grid + Button library components
- All styling handled by library component variants

**Architecture Pattern**: Composition-only (`mod.ts`)

- Components built by composing library components
- No custom CSS in application components
- Styling through library component variants only
- Enforced UI uniformity across applications

### Features Demonstrated

- **Library Component Composition**: Applications build UIs by composing library
  components
- **Variant-Based Styling**: Components styled through predefined variants
- **UI Uniformity**: Consistent design enforced by library
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

## Component Composition Examples

### Product Card Composition

```typescript
// Basic product card using library components
defineComponent("product-card", {
  render: (props) => `
    <card variant="elevated" size="md">
      <stack direction="vertical" gap="sm">
        <img src="${props.imageUrl}" alt="${props.name}" />
        <stack direction="vertical" gap="xs">
          <h3>${props.name}</h3>
          <div>${formatPrice(props.price)}</div>
          <button variant="primary" size="md">
            ${props.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </stack>
      </stack>
    </card>
  `,
});
```

### Different Variants

```typescript
// Use different variants for different contexts
// Featured product
<product-card variant="featured" show-quick-add="true" />

// Sale item
<product-card variant="sale" show-discount="true" />

// Out of stock
<product-card variant="disabled" />
```

## Performance Features

- **SSR Rendering**: ~0.5ms per component
- **Zero Client Runtime**: Works without JavaScript
- **Consistent Styling**: Library-controlled styling through variants
- **Optimized Images**: Responsive loading strategies
- **Minimal Bundle**: < 10KB for enhancements

## Accessibility Features

- **Semantic HTML**: Proper heading structure and landmarks
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: ARIA labels and descriptions
- **Color Contrast**: WCAG AA compliant themes
- **Focus Management**: Logical tab order

This example showcases ui-lib's philosophy: powerful, type-safe components that
enforce UI uniformity while enabling rapid development through composition.

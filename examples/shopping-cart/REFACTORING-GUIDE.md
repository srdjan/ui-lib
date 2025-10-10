# Shopping Cart Refactoring Guide

**Purpose**: Complete refactoring guide to bring shopping cart example in line with ui-lib's fundamental principles: **zero exposed HTMX** and **zero custom CSS**.

**Based on**: Patterns and lessons learned from successful TODO app refactoring.

---

## Table of Contents

1. [Fundamental Principles](#fundamental-principles)
2. [Audit Results](#audit-results)
3. [Refactoring Patterns](#refactoring-patterns)
4. [Step-by-Step Implementation](#step-by-step-implementation)
5. [Testing Checklist](#testing-checklist)

---

## Fundamental Principles

### 🚨 CRITICAL: HTMX Must Be Completely Hidden

This is a **NON-NEGOTIABLE** requirement of ui-lib. Applications **MUST NEVER** expose raw `hx-*` attributes in component code.

**❌ WRONG - Exposed HTMX:**
```tsx
<button
  hx-get="/api/products?featured=true"
  hx-target="#product-grid"
  hx-swap="innerHTML"
>
  Featured Products
</button>
```

**✅ CORRECT - Hidden behind API helpers:**
```tsx
defineComponent("product-filter", {
  api: {
    featured: get("/api/products?featured=true", handler),
  },
  render: (props, api) => (
    <button {...api!.featured(hx({ target: "#product-grid", swap: "innerHTML" }))}>
      Featured Products
    </button>
  ),
});
```

### 🎨 Zero Custom CSS Allowed

Applications compose pre-styled library components. All styling comes from `lib/styles/css-generator.ts`.

**❌ WRONG - Custom inline CSS:**
```tsx
<style>
  .product-card {
    background: white;
    border-radius: 12px;
    /* ...140 more lines... */
  }
</style>
```

**✅ CORRECT - Library CSS classes:**
```tsx
<div class="card card--elevated">
  {/* Use library components */}
</div>
```

---

## Audit Results

### Critical Violations Found

#### 1. server.tsx (Lines 288-309)
**Violation**: Filter buttons with raw HTMX attributes

```tsx
// ❌ VIOLATION
<button
  hx-get="/api/products?featured=true"
  hx-target="#product-grid"
  hx-swap="innerHTML"
  hx-headers='{"Accept": "text/html"}'
>
  🌟 Featured Products
</button>
```

**Count**: 3 filter buttons × 4 attributes each = 12 exposed HTMX attributes

**Fix Required**: Create filter component with API helpers

---

#### 2. server.tsx (Lines 336-476)
**Violation**: 140 lines of inline CSS for product cards

```tsx
// ❌ VIOLATION
<style>
  .product-card { /* ... */ }
  .product-card:hover { /* ... */ }
  .product-card__image { /* ... */ }
  /* ...135 more lines... */
</style>
```

**Status**: ✅ **FIXED** - Removed and added to css-generator.ts

---

#### 3. components/product-card.tsx (Lines 56-62)
**Violation**: Raw HTMX attributes mixed with API helper

```tsx
// ❌ VIOLATION
<button
  type="button"
  variant="primary"
  {...api!.addToCart()}
  hx-vals={JSON.stringify({ productId, quantity, sessionId })}
  hx-target="#cart-count"
  hx-ext="json-enc"
>
```

**Problem**: Mixing API helper with raw `hx-*` attributes

**Fix Required**: Pass vals, target, ext via `hx()` enhancement options

---

#### 4. api/handlers.tsx (Lines 280-335)
**Violation**: Massive HTMX exposure in cart sidebar HTML generation

```tsx
// ❌ VIOLATION - Cart Item HTML with raw HTMX
hx-patch="/api/cart/items/${item.id}"
hx-ext="json-enc"
hx-vals='{"quantity":${item.quantity - 1}}'
hx-target="#cart-sidebar .cart-items"
hx-swap="innerHTML"
```

**Count**: ~50+ exposed HTMX attributes across cart items and checkout button

**Fix Required**: Create cart-item component, move all HTMX to API helpers

---

## Refactoring Patterns

### Pattern 1: Simple Button with API Helper

**Before:**
```tsx
<button
  hx-get="/api/products?category=electronics"
  hx-target="#product-grid"
  hx-swap="innerHTML"
>
  📱 Electronics
</button>
```

**After:**
```tsx
// In component definition
defineComponent("product-filters", {
  api: {
    electronics: get("/api/products?category=electronics", handler),
  },
  render: (props, api) => (
    <button {...api!.electronics(hx({ target: "#product-grid", swap: "innerHTML" }))}>
      📱 Electronics
    </button>
  ),
});

// In server.tsx
registerComponentApi("product-filters", router);
```

**Key Points**:
- API helper handles the route
- `hx()` passes enhancement options (target, swap, etc.)
- Spread operator applies attributes: `{...api!.methodName()}`
- Register component API in server

---

### Pattern 2: Form with Data Submission

**Before:**
```tsx
<button
  {...api!.addToCart()}
  hx-vals={JSON.stringify({ productId, quantity, sessionId })}
  hx-target="#cart-count"
  hx-ext="json-enc"
>
```

**After:**
```tsx
// In component definition
defineComponent("product-card", {
  api: {
    addToCart: post("/api/cart/add", addToCartHandler),
  },
  render: ({ product, sessionId }, api) => (
    <button
      {...api!.addToCart(hx({
        vals: { productId: product.id, quantity: 1, sessionId },
        target: "#cart-count",
        ext: "json-enc",
      }))}
    >
      Add to Cart
    </button>
  ),
});
```

**Key Points**:
- Pass `vals` object via `hx()` options
- Include `ext: "json-enc"` for JSON encoding
- All HTMX configuration in `hx()` helper
- No raw `hx-*` attributes in JSX

---

### Pattern 3: Navigation with URL Update

**Before:**
```tsx
<button
  hx-get="/?filter=all"
  hx-target="body"
  hx-swap="outerHTML"
  hx-push-url="true"
>
```

**After:**
```tsx
defineComponent("todo-app", {
  api: {
    filterAll: get("/?filter=all", () => new Response("")),
  },
  render: (props, api) => (
    <button
      {...api!.filterAll(hx({
        target: "body",
        swap: "outerHTML",
        pushUrl: true,
      }))}
    >
      All
    </button>
  ),
});
```

**Key Points**:
- Use `pushUrl: true` for browser history
- Target `body` and swap `outerHTML` for full page updates
- Handler can return empty response if main route handles rendering

---

### Pattern 4: Dynamic Item with Parameters

**Before:**
```tsx
items.map(item => `
  <button
    hx-delete="/api/cart/items/${item.id}"
    hx-target="#cart-sidebar .cart-items"
    hx-swap="innerHTML"
  >
    Delete
  </button>
`)
```

**After:**
```tsx
// Create cart-item component
defineComponent("cart-item", {
  api: {
    remove: del("/api/cart/items/:id", removeHandler),
    updateQty: patch("/api/cart/items/:id", updateHandler),
  },
  render: ({ item }, api) => (
    <div class="cart-item">
      <button
        {...api!.remove(item.id, hx({
          target: "closest .cart-items",
          swap: "innerHTML",
        }))}
      >
        Delete
      </button>
    </div>
  ),
});

// Use in cart sidebar
items.map(item => renderComponent("cart-item", { item }))
```

**Key Points**:
- Create component for repeated items
- API helpers support path parameters (`:id`)
- Pass ID as first argument: `api!.remove(item.id)`
- Use `closest` selector for contextual targets

---

## Step-by-Step Implementation

### Phase 1: Filter Buttons Refactoring

**File**: `examples/shopping-cart/server.tsx`

**Step 1.1**: Create product-filters component

```tsx
// examples/shopping-cart/components/product-filters.tsx
import { h } from "jsx";
import { defineComponent, get, hx } from "../../../mod.ts";

defineComponent("product-filters", {
  api: {
    featured: get("/api/products?featured=true", () => new Response("")),
    electronics: get("/api/products?category=electronics", () => new Response("")),
    clothing: get("/api/products?category=clothing", () => new Response("")),
  },
  render: (_props, api) => (
    <div style="display: flex; gap: var(--spacing-md); margin-bottom: var(--spacing-xl);">
      <button
        style="padding: var(--spacing-md) var(--spacing-lg); background: var(--color-primary); color: var(--color-on-primary); border: none; border-radius: var(--layout-border-radius); font-weight: var(--typography-weight-medium); cursor: pointer;"
        {...api!.featured(hx({ target: "#product-grid", swap: "innerHTML" }))}
      >
        🌟 Featured Products
      </button>
      <button
        style="padding: var(--spacing-md) var(--spacing-lg); background: var(--color-secondary); color: var(--color-on-secondary); border: none; border-radius: var(--layout-border-radius); font-weight: var(--typography-weight-medium); cursor: pointer;"
        {...api!.electronics(hx({ target: "#product-grid", swap: "innerHTML" }))}
      >
        📱 Electronics
      </button>
      <button
        style="padding: var(--spacing-md) var(--spacing-lg); background: var(--color-secondary); color: var(--color-on-secondary); border: none; border-radius: var(--layout-border-radius); font-weight: var(--typography-weight-medium); cursor: pointer;"
        {...api!.clothing(hx({ target: "#product-grid", swap: "innerHTML" }))}
      >
        👕 Clothing
      </button>
    </div>
  ),
});
```

**Step 1.2**: Import component in server.tsx

```tsx
// At top of server.tsx
import "./components/product-filters.tsx";
```

**Step 1.3**: Replace filter buttons in HomePage

```tsx
// In HomePage function, replace lines 285-313 with:
<product-filters />
```

**Step 1.4**: Register component API

```tsx
// In server.tsx, after line 585
registerComponentApi("product-filters", router);
```

---

### Phase 2: Product Card Refactoring

**File**: `examples/shopping-cart/components/product-card.tsx`

**Step 2.1**: Fix HTMX in product-card.tsx

```tsx
// Replace lines 51-65 with:
<button
  type="button"
  variant="primary"
  disabled={!product.inStock}
  {...api!.addToCart(hx({
    vals: {
      productId: product.id,
      quantity: 1,
      sessionId,
    },
    target: "#cart-count",
    ext: "json-enc",
  }))}
>
  {product.inStock ? "Add to Cart" : "Out of Stock"}
</button>
```

**Step 2.2**: Verify component registration

```tsx
// Already registered at line 585
registerComponentApi("shopping-product-card", router);
```

---

### Phase 3: Cart Sidebar Refactoring

**File**: `examples/shopping-cart/api/handlers.tsx`

**Step 3.1**: Create cart-item component

```tsx
// examples/shopping-cart/components/cart-item.tsx
import { h } from "jsx";
import { defineComponent, del, hx, patch } from "../../../mod.ts";
import type { CartItem } from "../api/types.ts";

export type CartItemProps = {
  readonly item: CartItem;
  readonly sessionId: string;
};

defineComponent<CartItemProps>("cart-item", {
  api: {
    decreaseQty: patch("/api/cart/items/:id/decrease", decreaseQtyHandler),
    increaseQty: patch("/api/cart/items/:id/increase", increaseQtyHandler),
    remove: del("/api/cart/items/:id", removeHandler),
  },
  render: ({ item, sessionId }, api) => (
    <div class="cart-item" data-item-id={item.id}>
      <div class="cart-item__image">
        <img src={item.product.imageUrl} alt={item.product.name} />
      </div>
      <div class="cart-item__details">
        <h4 class="cart-item__name">{item.product.name}</h4>
        <p class="cart-item__price">${item.product.price.toFixed(2)}</p>
      </div>
      <div class="cart-item__quantity">
        <button
          class="qty-btn"
          disabled={item.quantity <= 1}
          {...api!.decreaseQty(item.id, hx({
            vals: { sessionId },
            target: "#cart-sidebar .cart-items",
            swap: "innerHTML",
            ext: "json-enc",
          }))}
        >
          -
        </button>
        <span>{item.quantity}</span>
        <button
          class="qty-btn"
          {...api!.increaseQty(item.id, hx({
            vals: { sessionId },
            target: "#cart-sidebar .cart-items",
            swap: "innerHTML",
            ext: "json-enc",
          }))}
        >
          +
        </button>
      </div>
      <button
        class="cart-item__remove"
        {...api!.remove(item.id, hx({
          vals: { sessionId },
          target: "#cart-sidebar .cart-items",
          swap: "innerHTML",
          ext: "json-enc",
        }))}
      >
        ×
      </button>
    </div>
  ),
});

// Handler implementations (need to be created)
const decreaseQtyHandler = async (req: Request, params: { id: string }) => {
  // Implementation
};

const increaseQtyHandler = async (req: Request, params: { id: string }) => {
  // Implementation
};

const removeHandler = async (req: Request, params: { id: string }) => {
  // Implementation
};
```

**Step 3.2**: Update cart sidebar to use component

```tsx
// In api/handlers.tsx, replace lines 270-300 with:
const cartItemsHtml = cart.items.map(item =>
  renderComponent("cart-item", { item, sessionId })
).join("");
```

**Step 3.3**: Create checkout button component

```tsx
// examples/shopping-cart/components/checkout-button.tsx
import { h } from "jsx";
import { defineComponent, get, hx } from "../../../mod.ts";

defineComponent("checkout-button", {
  api: {
    goToCheckout: get("/checkout", () => new Response("")),
  },
  render: ({ sessionId }, api) => (
    <button
      class="checkout-btn"
      {...api!.goToCheckout(hx({ target: "body", swap: "outerHTML" }))}
    >
      Proceed to Checkout
    </button>
  ),
});
```

**Step 3.4**: Register components

```tsx
// In server.tsx
import "./components/cart-item.tsx";
import "./components/checkout-button.tsx";

registerComponentApi("cart-item", router);
registerComponentApi("checkout-button", router);
```

---

### Phase 4: CSS Class Addition

**File**: `lib/styles/css-generator.ts`

**Step 4.1**: Add cart sidebar styles

```typescript
// Add after product grid styles (around line 310)

/* Cart Sidebar */
.cart-sidebar {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  background: var(--color-surface);
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
  transition: right var(--animation-duration-normal) ease;
  z-index: 1000;
  overflow-y: auto;
}

.cart-sidebar--open {
  right: 0;
}

.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--animation-duration-normal) ease;
  z-index: 999;
}

.cart-overlay--visible {
  opacity: 1;
  pointer-events: auto;
}

/* Cart Item */
.cart-item {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-4);
  border-bottom: 1px solid var(--surface-border);
}

.cart-item__image {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}

.cart-item__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--layout-border-radius);
}

.cart-item__details {
  flex: 1;
}

.cart-item__name {
  font-size: var(--typography-text-base);
  font-weight: var(--typography-weight-semibold);
  margin: 0 0 var(--space-2) 0;
}

.cart-item__price {
  font-size: var(--typography-text-sm);
  color: var(--color-gray-600);
  margin: 0;
}

.cart-item__quantity {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--surface-border);
  border-radius: var(--layout-border-radius);
  background: var(--color-surface);
  cursor: pointer;
  transition: all var(--animation-duration-fast) ease;
}

.qty-btn:hover:not(:disabled) {
  background: var(--color-gray-100);
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cart-item__remove {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--color-error);
  font-size: var(--typography-text-xl);
  cursor: pointer;
  transition: all var(--animation-duration-fast) ease;
}

.cart-item__remove:hover {
  background: var(--color-error-container);
}

/* Checkout Button */
.checkout-btn {
  width: 100%;
  padding: var(--space-4);
  background: var(--color-primary);
  color: var(--color-on-primary);
  border: none;
  border-radius: var(--layout-border-radius);
  font-weight: var(--typography-weight-semibold);
  cursor: pointer;
  transition: all var(--animation-duration-fast) ease;
}

.checkout-btn:hover {
  background: var(--color-primary-dark);
}
```

**Step 4.2**: Add app-specific layout styles

```typescript
// Add after cart styles

/* App Container */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4) var(--space-6);
  background: var(--color-surface);
  border-bottom: 1px solid var(--surface-border);
}

.app-logo {
  font-size: var(--typography-text-xl);
  font-weight: var(--typography-weight-bold);
  color: var(--color-primary);
  text-decoration: none;
}

.app-nav {
  display: flex;
  gap: var(--space-4);
}

.app-nav a {
  color: var(--color-on-surface);
  text-decoration: none;
  font-weight: var(--typography-weight-medium);
  transition: color var(--animation-duration-fast) ease;
}

.app-nav a:hover {
  color: var(--color-primary);
}

.app-main {
  flex: 1;
  padding: var(--space-6);
}

.app-footer {
  padding: var(--space-6);
  text-align: center;
  color: var(--color-on-surface-variant);
  border-top: 1px solid var(--surface-border);
}

/* Theme Toggle */
.theme-toggle,
.cart-toggle {
  padding: var(--space-2) var(--space-3);
  background: transparent;
  border: 1px solid var(--surface-border);
  border-radius: var(--layout-border-radius);
  cursor: pointer;
  transition: all var(--animation-duration-fast) ease;
}

.theme-toggle:hover,
.cart-toggle:hover {
  background: var(--color-surface-variant);
}

.cart-badge {
  display: inline-block;
  margin-left: var(--space-2);
  padding: 2px 8px;
  background: var(--color-error);
  color: var(--color-on-error);
  border-radius: 12px;
  font-size: var(--typography-text-xs);
  font-weight: var(--typography-weight-bold);
}

.cart-badge.hidden {
  display: none;
}
```

---

## Testing Checklist

### ✅ Before Starting

- [ ] TODO app is working correctly with zero exposed HTMX
- [ ] CSS generator includes all new styles
- [ ] All components are defined before use

### ✅ After Phase 1 (Filter Buttons)

- [ ] Server starts without errors
- [ ] Filter buttons render on homepage
- [ ] No `hx-*` attributes in browser DevTools HTML
- [ ] Clicking "Featured" loads filtered products
- [ ] Clicking "Electronics" loads electronics
- [ ] Clicking "Clothing" loads clothing
- [ ] Product grid updates without page reload

### ✅ After Phase 2 (Product Cards)

- [ ] Product cards render correctly
- [ ] "Add to Cart" button works
- [ ] Cart count updates
- [ ] No `hx-vals`, `hx-target`, `hx-ext` in HTML source
- [ ] Out of stock products show disabled button

### ✅ After Phase 3 (Cart Sidebar)

- [ ] Cart sidebar opens/closes
- [ ] Cart items display correctly
- [ ] Quantity decrease button works (disabled at 1)
- [ ] Quantity increase button works
- [ ] Remove item button works
- [ ] Cart items update without full reload
- [ ] Checkout button navigates to checkout
- [ ] No raw HTMX in cart sidebar HTML

### ✅ Final Validation

- [ ] Run `grep -r "hx-" examples/shopping-cart/` returns ZERO matches in .tsx files
- [ ] Run `grep -r "<style>" examples/shopping-cart/server.tsx` returns ZERO matches
- [ ] All interactions work via API helpers
- [ ] All styling comes from css-generator.ts
- [ ] Shopping cart matches TODO app architecture

---

## Common Pitfalls to Avoid

### ❌ Pitfall 1: Mixing API helpers with raw HTMX

**Wrong:**
```tsx
<button
  {...api!.addToCart()}
  hx-vals={JSON.stringify({ id: 1 })}  // ❌ RAW HTMX
>
```

**Correct:**
```tsx
<button
  {...api!.addToCart(hx({ vals: { id: 1 } }))}  // ✅ via hx() helper
>
```

---

### ❌ Pitfall 2: Forgetting to register component API

**Wrong:**
```tsx
// Component has api: { ... } but not registered
defineComponent("my-component", {
  api: { action: post("/api/...", handler) },
  render: (props, api) => <button {...api!.action()}>Click</button>,
});
// ❌ Missing: registerComponentApi("my-component", router);
```

**Correct:**
```tsx
// In server.tsx
registerComponentApi("my-component", router);  // ✅ Registered
```

---

### ❌ Pitfall 3: Using inline styles instead of CSS classes

**Wrong:**
```tsx
<div style="display: flex; gap: 1rem;">  // ❌ INLINE STYLES
```

**Correct:**
```tsx
<div class="stack stack--horizontal stack--gap-md">  // ✅ LIBRARY CLASSES
```

---

### ❌ Pitfall 4: Incorrect argument order for registerComponentApi

**Wrong:**
```tsx
registerComponentApi(router, "component-name");  // ❌ WRONG ORDER
```

**Correct:**
```tsx
registerComponentApi("component-name", router);  // ✅ CORRECT ORDER
```

---

## Summary

This refactoring brings shopping cart in line with ui-lib's **fundamental principles**:

1. **✅ Zero Exposed HTMX**: All `hx-*` attributes hidden behind API helpers with spread operator
2. **✅ Zero Custom CSS**: All styling from `css-generator.ts`, applications compose library components
3. **✅ Ergonomic API**: Use `{...api!.methodName(hx({...}))}` pattern throughout
4. **✅ Component Registration**: All component APIs registered with `registerComponentApi()`
5. **✅ Consistent Architecture**: Matches TODO app patterns exactly

**Estimated Effort**: 4-6 hours for complete implementation and testing

**Files Modified**:
- ✅ `lib/styles/css-generator.ts` - CSS additions
- ✅ `server.tsx` - Remove inline CSS (completed)
- `server.tsx` - Add component imports and registrations
- `components/product-filters.tsx` - New component
- `components/product-card.tsx` - Fix HTMX
- `components/cart-item.tsx` - New component
- `components/checkout-button.tsx` - New component
- `api/handlers.tsx` - Use components instead of raw HTML

**Result**: Clean, maintainable shopping cart that demonstrates ui-lib's **core design philosophy**.

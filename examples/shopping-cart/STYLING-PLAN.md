# Shopping Cart Styling Improvement Plan

## Overview
Improve the layout, sizing, and spacing of shopping cart pages by adding semantic CSS classes to ui-lib's CSS generator. All styles will be defined in `lib/styles/css-generator.ts` and consumed via class names in the shopping cart application.

## Current Issues

### 1. **Inline Styles in Server.tsx**
- HomePage has inline styles for headings, descriptions, and layout containers
- CheckoutPage has inline typography styles
- Loading indicator has inline flexbox and animation styles

### 2. **Inline Styles in Components**
- `product-filters.tsx` has extensive inline button styles
- `cart-item.tsx` may have inline styles (needs verification)

### 3. **Missing Layout Structure**
- No semantic page layout classes (`.page-header`, `.page-content`, `.page-section`)
- No container width constraints for content areas
- No responsive spacing utilities

## Styling Strategy

### A. **Utility Class System** (Design Tokens Based)
Add utility classes to CSS generator for common patterns:

```css
/* Spacing Utilities */
.mb-xs { margin-bottom: var(--space-2); }    /* 0.5rem */
.mb-sm { margin-bottom: var(--space-3); }    /* 0.75rem */
.mb-md { margin-bottom: var(--space-4); }    /* 1rem */
.mb-lg { margin-bottom: var(--space-6); }    /* 1.5rem */
.mb-xl { margin-bottom: var(--space-8); }    /* 2rem */

.mt-xs, .mt-sm, .mt-md, .mt-lg, .mt-xl { /* same pattern */ }
.p-md, .p-lg, .p-xl { /* padding utilities */ }

/* Typography Utilities */
.text-3xl { font-size: var(--typography-text-3xl); font-weight: var(--typography-weight-bold); }
.text-2xl { font-size: var(--typography-text-2xl); font-weight: var(--typography-weight-bold); }
.text-lg { font-size: var(--typography-text-lg); }
.text-muted { color: var(--color-on-surface-variant); }

/* Flexbox Utilities */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.gap-sm { gap: var(--space-3); }
.gap-md { gap: var(--space-4); }
.gap-lg { gap: var(--space-6); }
```

### B. **Semantic Layout Classes**
Add shopping-specific layout classes:

```css
/* Page Sections */
.page-hero {
  margin-bottom: var(--space-8);
}

.page-hero__title {
  font-size: var(--typography-text-3xl);
  font-weight: var(--typography-weight-bold);
  margin-bottom: var(--space-4);
  color: var(--color-on-background);
}

.page-hero__subtitle {
  font-size: var(--typography-text-lg);
  color: var(--color-on-surface-variant);
  margin-bottom: var(--space-6);
}

/* Container Variants */
.container {
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-4);
  padding-right: var(--space-4);
}

.container--narrow {
  max-width: 768px;
}

.container--wide {
  max-width: 1400px;
}
```

### C. **Shopping Cart Specific Components**
Add component-specific styles for cart functionality:

```css
/* Cart Item */
.cart-item {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-4);
  border-bottom: 1px solid var(--surface-border);
  align-items: flex-start;
}

.cart-item__image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.cart-item__details {
  flex: 1;
  min-width: 0;
}

.cart-item__name {
  font-size: var(--typography-text-base);
  font-weight: var(--typography-weight-medium);
  margin: 0 0 var(--space-2) 0;
  color: var(--color-on-surface);
}

.cart-item__price {
  font-size: var(--typography-text-sm);
  color: var(--color-on-surface-variant);
  margin-bottom: var(--space-3);
}

.cart-item__quantity {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.cart-item__remove {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--surface-background);
  border: 1px solid var(--surface-border);
  color: var(--color-error);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: all var(--animation-duration-fast) var(--animation-ease-smooth);
  flex-shrink: 0;
}

.cart-item__remove:hover {
  background: var(--color-error-container);
  border-color: var(--color-error);
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  background: var(--surface-background);
  border: 1px solid var(--surface-border);
  color: var(--color-on-surface);
  font-size: var(--typography-text-base);
  font-weight: var(--typography-weight-medium);
  cursor: pointer;
  transition: all var(--animation-duration-fast) var(--animation-ease-smooth);
}

.quantity-btn:hover:not(:disabled) {
  background: var(--color-primary-container);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-value {
  min-width: 32px;
  text-align: center;
  font-weight: var(--typography-weight-medium);
}

/* Cart Empty State */
.cart-empty {
  text-align: center;
  padding: var(--space-12);
  color: var(--color-on-surface-variant);
}

.cart-empty h3 {
  color: var(--color-on-surface);
  margin-bottom: var(--space-4);
}
```

### D. **Product Filter Buttons**
Replace inline styles in `product-filters.tsx` with classes:

```css
/* Filter Buttons */
.filter-buttons {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
  flex-wrap: wrap;
}

.filter-btn {
  padding: var(--space-3) var(--space-5);
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--typography-weight-medium);
  cursor: pointer;
  transition: all var(--animation-duration-fast) var(--animation-ease-smooth);
}

.filter-btn--primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
}

.filter-btn--primary:hover {
  background: var(--color-primary-container);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.filter-btn--secondary {
  background: var(--color-secondary);
  color: var(--color-on-secondary);
}

.filter-btn--secondary:hover {
  background: var(--color-secondary-container);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
```

### E. **Shopping Cart Sidebar & Header**
Add styles for cart sidebar and app header:

```css
/* App Layout */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: var(--surface-background);
  border-bottom: 1px solid var(--surface-border);
  padding: var(--space-4) var(--space-6);
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-logo {
  font-size: var(--typography-text-xl);
  font-weight: var(--typography-weight-bold);
  color: var(--color-primary);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.app-nav {
  display: flex;
  align-items: center;
  gap: var(--space-6);
}

.app-main {
  flex: 1;
  padding: var(--space-6);
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.app-footer {
  background: var(--surface-background);
  border-top: 1px solid var(--surface-border);
  padding: var(--space-6);
  text-align: center;
  color: var(--color-on-surface-variant);
  font-size: var(--typography-text-sm);
}

/* Cart Sidebar */
.cart-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: var(--surface-background);
  box-shadow: var(--shadow-xl);
  transform: translateX(100%);
  transition: transform var(--animation-duration-normal) var(--animation-ease-smooth);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.cart-sidebar.open {
  transform: translateX(0);
}

.cart-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--animation-duration-normal) var(--animation-ease-smooth);
  z-index: 999;
}

.cart-overlay.open {
  opacity: 1;
  pointer-events: auto;
}

.cart-toggle {
  position: relative;
  background: var(--surface-background);
  border: 1px solid var(--surface-border);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--animation-duration-fast) var(--animation-ease-smooth);
}

.cart-toggle:hover {
  background: var(--color-primary-container);
  border-color: var(--color-primary);
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--color-error);
  color: var(--color-on-error);
  border-radius: 12px;
  padding: 2px 8px;
  font-size: var(--typography-text-xs);
  font-weight: var(--typography-weight-bold);
  min-width: 20px;
  text-align: center;
}

.cart-badge.hidden {
  display: none;
}
```

### F. **Loading Indicator**
Replace inline loading styles with classes:

```css
/* Loading States */
.loading-indicator {
  text-align: center;
  padding: var(--space-8);
}

.loading-spinner {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-on-surface-variant);
}

.loading-spinner__icon {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-primary);
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

## Implementation Plan

### Phase 1: Add CSS Utility Classes to Generator ✅
**File**: `lib/styles/css-generator.ts`
**Action**: Add utility classes section with spacing, typography, and flexbox utilities
**Outcome**: Applications can use `class="mb-lg text-lg flex gap-md"` instead of inline styles

### Phase 2: Add Semantic Layout Classes ✅
**File**: `lib/styles/css-generator.ts`
**Action**: Add `.page-hero`, `.container`, `.app-header`, `.app-main`, `.app-footer`
**Outcome**: Consistent page structure across all shopping cart pages

### Phase 3: Add Shopping Cart Component Styles ✅
**File**: `lib/styles/css-generator.ts`
**Action**: Add `.cart-item`, `.cart-sidebar`, `.filter-buttons` classes
**Outcome**: Cart components styled consistently without inline styles

### Phase 4: Update Server.tsx to Use Classes ✅
**File**: `examples/shopping-cart/server.tsx`
**Actions**:
- Replace inline styles in HomePage with `.page-hero`, `.page-hero__title`, `.page-hero__subtitle`
- Replace inline styles in Layout with `.app-container`, `.app-header`, `.app-main`, `.app-footer`
- Replace inline loading indicator styles with `.loading-indicator`, `.loading-spinner`
**Outcome**: Zero inline styles in server.tsx

### Phase 5: Update Components to Use Classes ✅
**Files**: `product-filters.tsx`, `cart-item.tsx`
**Actions**:
- Replace inline button styles in `product-filters.tsx` with `.filter-buttons`, `.filter-btn--primary`, `.filter-btn--secondary`
- Update `cart-item.tsx` to use `.cart-item`, `.cart-item__*` classes if needed
**Outcome**: Zero inline styles in component files

### Phase 6: Test & Verify ✅
**Actions**:
- Restart shopping cart server
- Verify all pages render correctly
- Check responsive behavior
- Verify dark mode compatibility
**Outcome**: Polished, professional shopping cart UI with zero inline styles

## Design Tokens Reference

All classes will use existing design tokens:

**Spacing**: `--space-{1-12}` (0.25rem to 3rem)
**Colors**: `--color-primary`, `--color-secondary`, `--color-error`, `--surface-*`
**Typography**: `--typography-text-{xs,sm,base,lg,xl,2xl,3xl,4xl}`
**Radius**: `--radius-{sm,md,lg,xl}`
**Shadows**: `--shadow-{sm,md,lg,xl,focus}`
**Animation**: `--animation-duration-{fast,normal}`, `--animation-ease-smooth`

## Success Criteria

- ✅ Zero inline `style=""` attributes in server.tsx
- ✅ Zero inline `style=""` attributes in component files
- ✅ All spacing uses design token classes
- ✅ All typography uses utility classes
- ✅ Consistent layout structure with semantic classes
- ✅ Professional, polished appearance
- ✅ Responsive design maintained
- ✅ Dark mode compatibility preserved

## Notes

- All styles defined in `lib/styles/css-generator.ts`
- Applications consume via class names only
- Follows ui-lib composition-only principle
- Design token system provides consistency
- Utility-first approach for common patterns
- Semantic classes for component-specific styles

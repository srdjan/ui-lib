# Modern CSS Architecture Guide for Todo Application

## Overview

This document provides guidance on the modern CSS architecture implemented in the todo application, showcasing best practices for organizing CSS in SSR applications using the ui-lib component system.

## Architecture Principles

### 1. Cascade Layers Strategy

We implement a **5-layer cascade architecture** that provides clear separation of concerns:

```css
@layer reset, tokens, utilities, components, overrides;
```

**Benefits:**
- **Predictable specificity** - No more CSS specificity wars
- **Clear boundaries** - Each layer has a specific purpose
- **Safe overrides** - Consumers can customize without `!important`
- **Maintainable** - Easy to reason about CSS precedence

### 2. Public vs Private API Design

**Public API (Documented for consumers):**
- Semantic classes: `.card`, `.alert`, `.btn`, `.page`
- Data attributes: `data-variant="primary"`, `data-size="lg"`
- Design tokens: `--space-*`, `--surface-*`, `--text-*`

**Private API (Internal implementation):**
- Utility classes: `.u-stack`, `.u-cluster`, `.u-center`
- Zero specificity with `:where()` wrapper
- Not exposed in public documentation

### 3. Component CSS Organization

**Library Components (Item):**
- Use **CSS-in-TS** with design tokens
- Type-safe styling with IntelliSense
- Collision-free class names
- Modern CSS features (container queries, logical properties)

**Application Components (TodoApp):**
- Use **semantic CSS classes** from the design system
- Application-specific styles in separate layer
- Compose using utility classes for layout

## Implementation Examples

### Library Component Pattern

```typescript
// lib/components/data-display/item.ts
import { css } from "../../css-in-ts.ts";
import { componentTokens } from "../../themes/component-tokens.ts";

function createItemStyles() {
  return css({
    item: {
      display: "flex",
      padding: componentTokens.spacing[4],
      backgroundColor: componentTokens.colors.surface.background,
      borderRadius: componentTokens.radius.md,
      transition: `all ${componentTokens.animation.duration.normal}`,

      // Container queries for true component responsiveness
      containerType: "inline-size",
      "@media": {
        "(max-width: 300px)": {
          flexDirection: "column",
        },
      },

      // Logical properties for internationalization
      paddingInline: componentTokens.spacing[4],
      borderInlineStart: "4px solid transparent",
    },
  });
}
```

### Application Component Pattern

```html
<!-- Uses semantic classes from the design system -->
<body class="page">
  <div class="u-center app-container">
    <div class="u-flow" style="--flow-space: var(--space-2xl)">
      <section class="section">
        <div class="card" data-size="lg">
          <form class="u-flow">
            <div class="form-group">
              <label class="form-label">Label</label>
              <input class="form-input" />
            </div>
            <button class="btn" data-variant="primary">Submit</button>
          </form>
        </div>
      </section>
    </div>
  </div>
</body>
```

## Design Token System

### Token Categories

```css
:root {
  /* Spacing scale */
  --space-xs: 0.5rem;
  --space-sm: 0.75rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;

  /* Surface tokens */
  --surface-base: #ffffff;
  --surface-muted: #f9fafb;
  --border-base: #e5e7eb;

  /* Text hierarchy */
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-tertiary: #9ca3af;
}
```

### Token Usage

**✅ Good:**
```css
.card {
  padding: var(--space-lg);
  background-color: var(--surface-base);
  border: 1px solid var(--border-base);
}
```

**❌ Avoid:**
```css
.card {
  padding: 24px; /* Use tokens instead */
  background-color: #ffffff; /* Use tokens instead */
}
```

## Modern CSS Features

### 1. Container Queries

Enable components to adapt to their container rather than viewport:

```css
.item {
  container-type: inline-size;
}

@container (max-width: 300px) {
  .item {
    flex-direction: column;
  }
}
```

### 2. Logical Properties

Support international layouts automatically:

```css
.card {
  padding-inline: var(--space-lg);    /* horizontal padding */
  padding-block: var(--space-md);     /* vertical padding */
  margin-inline: auto;                /* horizontal centering */
  border-inline-start: 4px solid;     /* left border in LTR, right in RTL */
}
```

### 3. CSS Nesting

Organize related styles together:

```css
.btn {
  padding: var(--space-sm) var(--space-lg);

  &:hover:not(:disabled) {
    background-color: var(--surface-muted);
  }

  &[data-variant="primary"] {
    background-color: var(--color-primary);
    color: white;
  }
}
```

### 4. Custom Properties for Theming

Enable flexible theming:

```css
.alert {
  padding: var(--space-md);
  border-radius: var(--radius-md);

  &[data-tone="info"] {
    --alert-bg: #eff6ff;
    --alert-border: #3b82f6;
    --alert-text: #1e40af;

    background-color: var(--alert-bg);
    border-color: var(--alert-border);
    color: var(--alert-text);
  }
}
```

## Layout Composition

### Utility Classes for Layout

```css
/* Stack - vertical rhythm */
.u-stack > * + * {
  margin-block-start: var(--space, var(--space-md));
}

/* Cluster - horizontal grouping */
.u-cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space, var(--space-md));
  align-items: center;
}

/* Center - constrained width centering */
.u-center {
  max-inline-size: var(--measure, var(--container-max-width));
  margin-inline: auto;
  padding-inline: var(--container-padding-inline);
}
```

### Usage Examples

```html
<!-- Vertical rhythm with custom spacing -->
<div class="u-stack" style="--space: var(--space-lg)">
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</div>

<!-- Horizontal grouping -->
<div class="u-cluster">
  <button class="btn">Save</button>
  <button class="btn">Cancel</button>
</div>

<!-- Centered container -->
<div class="u-center">
  <article class="prose">...</article>
</div>
```

## Accessibility & Performance

### Accessibility Features

```css
/* Respect user motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* Screen reader only content */
.u-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Focus-visible for keyboard users */
.btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Performance Optimizations

```css
/* CSS containment for complex components */
.item {
  contain: layout style;
  container-type: inline-size;
}

/* Will-change sparingly for animations */
.modal[data-state="opening"] {
  will-change: transform, opacity;
}

.modal[data-state="open"] {
  will-change: auto;
}
```

## File Organization

```
examples/todo-app/
├── styles/
│   └── base.css           # Cascade layers + design system
├── server.tsx             # Application component using semantic classes
└── ARCHITECTURE.md        # This documentation

lib/components/
├── data-display/
│   └── item.ts           # CSS-in-TS with design tokens
├── themes/
│   └── component-tokens.ts # Design token definitions
└── css-in-ts.ts          # Type-safe CSS system
```

## Migration Path

### Phase 1: Establish Foundation
1. ✅ Create cascade layers structure
2. ✅ Define design token system
3. ✅ Implement utility classes

### Phase 2: Refactor Components
1. ✅ Update Item component to use CSS-in-TS + tokens
2. ✅ Update TodoApp to use semantic classes
3. ✅ Remove hardcoded CSS values

### Phase 3: Enhancement
1. Add dark mode support via custom properties
2. Implement responsive typography scale
3. Add animation system with reduced motion support

### Phase 4: Documentation
1. Document public API classes
2. Create component gallery
3. Provide migration guides

## Best Practices Summary

### ✅ Do

- **Use design tokens** for all spacing, colors, and typography
- **Leverage cascade layers** for predictable CSS architecture
- **Implement container queries** for component responsiveness
- **Use logical properties** for internationalization support
- **Provide semantic classes** as public API
- **Test with keyboard navigation** and screen readers
- **Respect user preferences** (motion, color scheme)

### ❌ Don't

- **Expose utility classes** in public documentation
- **Use hardcoded values** instead of design tokens
- **Mix layout and visual concerns** in the same classes
- **Rely on element selectors** alone
- **Use `!important`** except in reset layer
- **Create deeply nested selectors** (max 3 levels)
- **Add vendor prefixes** manually (use autoprefixer)

## Conclusion

This architecture provides:

1. **Maintainable CSS** through clear separation of concerns
2. **Type-safe styling** with IntelliSense support
3. **Modern CSS features** for better UX
4. **Accessibility built-in** from the ground up
5. **Performance optimized** with containment and careful will-change usage
6. **Future-proof** design system that scales

The combination of cascade layers, design tokens, and CSS-in-TS creates a robust foundation for building consistent, maintainable user interfaces at scale.
# Modern CSS Architecture for ui-lib

## Overview

The ui-lib CSS architecture has been modernized to leverage cutting-edge CSS features while maintaining excellent developer experience and performance. This new system implements a sophisticated cascade layer strategy, comprehensive design token system, and full support for modern CSS features like container queries.

## Architecture Principles

### 1. Cascade Layers Strategy

The CSS is organized into five distinct layers with clear responsibilities:

```css
@layer reset, tokens, utilities, components, overrides;
```

- **reset**: Minimal, orthogonal browser normalization
- **tokens**: Design tokens as CSS custom properties (public but non-breaking)
- **utilities**: Private `.u-*` prefixed layout primitives (internal use only)
- **components**: Public semantic classes (`.card`, `.alert`, etc.)
- **overrides**: Consumer escape hatch for customization

### 2. API Design Philosophy

**Public API (Documented)**
- Semantic class names: `.card`, `.alert`, `.page`, `.toolbar`, `.prose`
- Variant attributes: `data-variant="elevated"`, `data-tone="info"`
- Size modifiers: `data-size="sm|md|lg"`
- Design tokens: `--space-*`, `--surface-*`, `--radius-*`

**Private API (Internal)**
- Utility classes: `.u-*` prefix signals "not for end users"
- Use `:where()` wrapper for zero specificity
- Never document these in public-facing docs

### 3. Modern CSS Features

- **Container Queries**: Components respond to their container size, not viewport
- **Cascade Layers**: Eliminates specificity wars and provides clear style organization
- **Logical Properties**: Full internationalization support with writing-mode awareness
- **Custom Properties**: Dynamic theming and contextual styling
- **CSS Containment**: Performance optimization for complex components

## Getting Started

### Installation

The modern CSS system is built into ui-lib. Import from the main module:

```typescript
import { css, dev, prod, ModernCSS } from './lib/modern-css.ts';
```

### Basic Usage

#### Creating Component Styles

```typescript
import { css, token } from './lib/modern-css.ts';

// Create modern component styles
const cardStyles = css.component('card', {
  container: {
    backgroundColor: token('surface', 'background'),
    border: `1px solid ${token('surface', 'border')}`,
    borderRadius: token('radius', 'lg'),
    padding: token('space', '6'),
    containerType: 'inline-size', // Enable container queries

    // Container queries for responsive design
    '@container': {
      '(min-width: 300px)': {
        padding: token('space', '8'),
      },
      '(min-width: 500px)': {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: token('space', '6'),
      },
    },

    // Modern focus management
    '&:focus-visible': {
      outline: `2px solid ${token('color', 'primary-500')}`,
      outlineOffset: '2px',
    },
  },
});
```

#### Using Design Tokens

```typescript
import { token } from './lib/modern-css.ts';

// Access design tokens type-safely
const styles = {
  padding: token('space', '4'),         // var(--space-4)
  color: token('color', 'primary-500'), // var(--color-primary-500)
  borderRadius: token('radius', 'md'),   // var(--radius-md)
};
```

#### Responsive Components with Container Queries

```typescript
const responsiveGrid = css.responsive('grid', {
  grid: {
    display: 'grid',
    gap: token('space', '4'),
    containerType: 'inline-size',

    // Responsive without media queries
    '@container': {
      '(min-width: 400px)': {
        gridTemplateColumns: 'repeat(2, 1fr)',
      },
      '(min-width: 600px)': {
        gridTemplateColumns: 'repeat(3, 1fr)',
      },
    },
  },
});
```

## Design Token System

### Token Categories

The design system provides tokens in the following categories:

```typescript
// Spatial tokens
token('space', '4')     // 1rem (16px)
token('space', '8')     // 2rem (32px)

// Color tokens
token('color', 'primary-500')    // Brand primary
token('color', 'success-500')    // Success green
token('surface', 'background')   // Semantic surface

// Typography tokens
token('typography', 'text-base') // Base font size
token('typography', 'weight-bold') // Bold font weight

// Size tokens
token('size', 'button-md')       // Medium button height
token('radius', 'lg')            // Large border radius
```

### Semantic Aliases

Common token combinations are available as semantic aliases:

```typescript
// Interactive states
'interactive-bg': token('color', 'primary-500'),
'interactive-bg-hover': token('color', 'primary-600'),

// Content hierarchy
'content-primary': token('surface', 'foreground'),
'content-secondary': token('color', 'gray-600'),

// Feedback states
'feedback-success': token('color', 'success-500'),
'feedback-error': token('color', 'error-500'),
```

## Component System

### Public Component Classes

The design system provides semantic component classes:

```html
<!-- Layout Components -->
<div class="card" data-variant="elevated">...</div>
<div class="stack" data-size="lg">...</div>
<div class="cluster" data-variant="center">...</div>

<!-- Interactive Components -->
<button class="button" data-variant="primary" data-size="md">...</button>
<input class="input" data-size="lg">

<!-- Feedback Components -->
<div class="alert" data-variant="success" data-size="sm">...</div>
<span class="badge" data-variant="primary">...</span>
```

### Variant System

Components support semantic variants through data attributes:

```html
<!-- Button variants -->
<button class="button" data-variant="primary">Primary</button>
<button class="button" data-variant="secondary">Secondary</button>
<button class="button" data-variant="outline">Outline</button>

<!-- Alert variants -->
<div class="alert" data-variant="info">Info message</div>
<div class="alert" data-variant="success">Success message</div>
<div class="alert" data-variant="warning">Warning message</div>
<div class="alert" data-variant="error">Error message</div>
```

### Size System

Consistent sizing across components:

```html
<button class="button" data-size="xs">Extra Small</button>
<button class="button" data-size="sm">Small</button>
<button class="button" data-size="md">Medium (default)</button>
<button class="button" data-size="lg">Large</button>
<button class="button" data-size="xl">Extra Large</button>
```

## Migration Guide

### Migrating Existing Components

The system provides automatic migration for existing CSS-in-TS components:

```typescript
import { css } from './lib/modern-css.ts';

// Your existing component styles
const legacyStyles = {
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '0.375rem',
    // ... other styles
  },
};

// Automatically migrate to modern system
const { styles, report } = css.migrate('button', legacyStyles);

console.log('Migration report:', {
  tokenReplacements: report.tokenReplacementCount,
  modernizationScore: report.modernizationScore,
  warnings: report.warnings,
});
```

### Migration Best Practices

1. **Use the migration tool first**: Always start with `css.migrate()` to get a baseline
2. **Replace hardcoded values**: Use design tokens instead of pixel values and hex colors
3. **Add container queries**: Enable responsive behavior without media queries
4. **Use logical properties**: Support international layouts with `inlineStart`, `blockEnd`, etc.
5. **Add accessibility features**: Use `focus-visible` and ARIA-appropriate styling

### Common Migration Patterns

#### Before (Legacy)
```typescript
const styles = css({
  button: {
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '6px',
    fontSize: '14px',
    '&:hover': {
      backgroundColor: '#2563eb',
    },
    '&:focus': {
      outline: 'none',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.4)',
    },
  },
});
```

#### After (Modern)
```typescript
const styles = css.component('button', {
  button: {
    padding: `${token('space', '2')} ${token('space', '4')}`,
    backgroundColor: token('color', 'primary-500'),
    color: token('color', 'white'),
    borderRadius: token('radius', 'md'),
    fontSize: token('typography', 'text-sm'),

    '&:hover:not(:disabled)': {
      backgroundColor: token('color', 'primary-600'),
    },

    '&:focus-visible': {
      outline: 'none',
      boxShadow: token('shadow', 'focus'),
    },

    '@media': {
      'reduced-motion': {
        transition: 'none',
      },
    },
  },
});
```

## Performance Optimization

### CSS Bundling

The system provides intelligent CSS bundling with multiple optimization strategies:

```typescript
import { bundlePresets } from './lib/modern-css.ts';

// Development bundle with debugging features
const devBundle = bundlePresets.development();

// Production bundle with optimizations
const prodBundle = bundlePresets.production();

// Minimal bundle with essential styles only
const minimalBundle = bundlePresets.minimal();

// Custom bundle with specific components
const customBundle = CSSBundler.createComponentBundle([
  'button', 'card', 'alert'
]);
```

### Critical CSS Extraction

For optimal loading performance, extract critical above-the-fold styles:

```typescript
import { css } from './lib/modern-css.ts';

// Get critical CSS for immediate rendering
const criticalCSS = css.critical();

// Inline in HTML head
const html = `
<!DOCTYPE html>
<html>
<head>
  <style>${criticalCSS}</style>
</head>
<body>
  <!-- Your content -->
</body>
</html>
`;
```

### Bundle Analysis

Monitor CSS performance with built-in analytics:

```typescript
import { dev } from './lib/modern-css.ts';

const stats = dev.stats('production');
console.log({
  totalSize: `${Math.round(stats.totalSize / 1024)}KB`,
  gzippedSize: `${Math.round(stats.gzippedSize / 1024)}KB`,
  compressionRatio: `${Math.round((1 - stats.gzippedSize / stats.totalSize) * 100)}%`,
});
```

## Development Tools

### CSS Debugging

Enable visual CSS debugging in development:

```typescript
import { dev } from './lib/modern-css.ts';

// Initialize with development features
dev.init();

// Enable CSS debugging (browser only)
dev.debug();

// In browser console: toggleCSSDebug()
```

### Performance Monitoring

Monitor CSS parsing performance:

```typescript
import { CSSPerformanceMonitor } from './lib/modern-css.ts';

// Measure CSS parsing time
const parseTime = await CSSPerformanceMonitor.measureParsing(cssString);

// Analyze CSS complexity
const complexity = CSSPerformanceMonitor.analyzeComplexity(cssString);
console.log('Complexity score:', complexity.complexityScore);
```

## Best Practices

### 1. Component Design

- **Use semantic class names**: `.card`, `.alert`, `.button` over generic names
- **Leverage data attributes**: Use `data-variant`, `data-size`, `data-state` for variations
- **Design for container queries**: Make components respond to their container, not viewport
- **Use logical properties**: Support international layouts from the start

### 2. Performance

- **Use CSS containment**: Add `contain: layout style paint` to complex components
- **Minimize layers**: Only use cascade layers when you need the specificity control
- **Optimize animations**: Use `transform` and `opacity` for smooth animations
- **Bundle efficiently**: Use component-specific bundles for critical paths

### 3. Accessibility

- **Focus management**: Always use `:focus-visible` for keyboard navigation
- **Color contrast**: Use semantic color tokens that meet WCAG guidelines
- **Reduced motion**: Respect `prefers-reduced-motion` settings
- **Screen readers**: Use semantic HTML with appropriate ARIA labels

### 4. Maintainability

- **Use design tokens**: Avoid hardcoded values in component styles
- **Document public APIs**: Clearly separate public component classes from internal utilities
- **Version migrations**: Use the migration tools to upgrade legacy components
- **Test responsiveness**: Verify container query behavior across different contexts

## Examples

### Complete Card Component

```typescript
import { css, token, cssUtils } from './lib/modern-css.ts';

const cardStyles = css.component('card', {
  container: {
    backgroundColor: token('surface', 'background'),
    border: `1px solid ${token('surface', 'border')}`,
    borderRadius: token('radius', 'lg'),
    boxShadow: token('shadow', 'sm'),
    padding: token('space', '6'),
    containerType: 'inline-size',
    contain: 'layout style paint',

    // Smooth interactions with reduced motion support
    ...cssUtils.reducedMotion(
      {
        transition: `all ${token('animation', 'duration-normal')} ${token('animation', 'ease-out')}`,
        '&:hover': {
          boxShadow: token('shadow', 'md'),
          borderColor: token('surface', 'border-strong'),
        },
      },
      { transition: 'none' }
    ),

    // Container queries for responsive layout
    '@container': {
      '(min-width: 300px)': {
        padding: token('space', '8'),
      },
      '(min-width: 500px)': {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: token('space', '6'),
      },
    },

    // Accessibility features
    ...cssUtils.focusVisible({
      outline: `2px solid ${token('color', 'primary-500')}`,
      outlineOffset: '2px',
    }),
  },

  header: {
    marginBlockEnd: token('space', '4'),
    '@container': {
      '(min-width: 500px)': { marginBlockEnd: 0 },
    },
  },

  title: {
    fontSize: token('typography', 'text-xl'),
    fontWeight: token('typography', 'weight-bold'),
    lineHeight: token('typography', 'leading-tight'),
    color: token('surface', 'foreground'),
    marginBlockEnd: token('space', '2'),
  },

  content: {
    fontSize: token('typography', 'text-base'),
    lineHeight: token('typography', 'leading-relaxed'),
    color: token('surface', 'foreground'),
  },
});

// Usage in HTML
function CardComponent({ title, content }: { title: string; content: string }) {
  return `
    <div class="${cardStyles.classMap.container}" data-component="card">
      <header class="${cardStyles.classMap.header}">
        <h2 class="${cardStyles.classMap.title}">${title}</h2>
      </header>
      <div class="${cardStyles.classMap.content}">
        ${content}
      </div>
    </div>
  `;
}
```

### SSR Integration

```typescript
import { ModernCSS } from './lib/modern-css.ts';

// Initialize the system
ModernCSS.initialize({ developmentMode: false });

// Generate complete stylesheet for SSR
const stylesheet = ModernCSS.generateProdStylesheet();

// Generate HTML with embedded styles
function generatePage(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Modern CSS App</title>
  <style>${stylesheet}</style>
</head>
<body>
  ${content}
</body>
</html>
  `;
}
```

## Conclusion

The modern CSS architecture provides a robust foundation for building scalable, performant, and maintainable user interfaces. By leveraging cascade layers, design tokens, container queries, and modern CSS features, developers can create components that are both powerful and easy to use.

The migration tools ensure a smooth transition from existing CSS-in-TS approaches, while the comprehensive design system provides consistency across the entire application.

For questions or contributions, please refer to the ui-lib documentation or open an issue in the repository.
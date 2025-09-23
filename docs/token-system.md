# Token System Guide

ui-lib's token system provides a secure, type-safe way to customize component
appearance without exposing internal implementation details. Components are
completely sealed - they can only be modified through CSS variables (tokens).

## Overview

### What Are Tokens?

Tokens are CSS custom properties that define the visual aspects of components.
Instead of directly modifying component styles, you customize components by
setting token values.

```typescript
// ❌ No direct style access (not possible)
Button.styles.backgroundColor = "red";

// ✅ Customization through tokens
const styles = defineTokens({
  button: {
    primary: {
      background: "#FF5722",
      backgroundHover: "#E64A19",
    },
  },
});
```

### Benefits

- **Encapsulation**: Component internals are completely hidden
- **Consistency**: All customization through standardized interface
- **Type Safety**: Full IntelliSense for available tokens
- **Performance**: CSS variables enable instant theming
- **No Conflicts**: Component styles are isolated from application styles
- **Future-Proof**: Component updates won't break your customizations

## Getting Started

### Basic Usage

```typescript
import { Button, defineTokens } from "ui-lib/mod-token.ts";

// Define custom tokens
const customStyles = defineTokens({
  button: {
    primary: {
      background: "#007bff",
      backgroundHover: "#0056b3",
      textColor: "white",
      borderRadius: "8px",
    },
  },
});

// Use the component
const button = Button({
  variant: "primary",
  children: "Click Me",
});

// Include styles in your HTML
const html = `
  <style>${customStyles}</style>
  ${button}
`;
```

### Component Anatomy

Every token-based component has the same structure:

```typescript
// Component function - sealed, only exposes render method
const component = ComponentName(props);

// Token contract - defines what can be customized
type ComponentTokens = {
  base: {/* common properties */};
  variants: {/* variant-specific properties */};
  states: {/* state-specific properties */};
};

// Generated CSS - includes all component styles with variables
const styles = ComponentName.injectStyles();
```

## Token Structure

### Button Token Structure

```typescript
type ButtonTokens = {
  // Base properties (all variants inherit)
  base: {
    height: string;
    paddingX: string;
    fontSize: string;
    fontWeight: string;
    borderRadius: string;
    transitionDuration: string;
    // ... more base properties
  };

  // Variant-specific tokens
  primary: {
    background: string;
    backgroundHover: string;
    backgroundActive: string;
    textColor: string;
    focusRingColor: string;
  };

  secondary: {/* ... */};
  outline: {/* ... */};
  ghost: {/* ... */};
  destructive: {/* ... */};

  // State tokens
  disabled: {
    opacity: string;
    cursor: string;
  };

  // Size tokens
  sizeXs: { height: string; paddingX: string; fontSize: string };
  sizeSm: { height: string; paddingX: string; fontSize: string };
  sizeMd: { height: string; paddingX: string; fontSize: string };
  sizeLg: { height: string; paddingX: string; fontSize: string };
  sizeXl: { height: string; paddingX: string; fontSize: string };
};
```

## Customization Methods

### 1. Global Token Overrides

Apply tokens globally to all instances of a component:

```typescript
import { defineTokens } from "ui-lib/mod-token.ts";

const globalStyles = defineTokens({
  button: {
    primary: {
      background: "#FF5722",
      backgroundHover: "#E64A19",
    },
    base: {
      borderRadius: "12px",
      fontWeight: "600",
    },
  },
});
```

### 2. Scoped Customization

Apply different tokens to specific sections:

```typescript
import { customizeComponent } from "ui-lib/mod-token.ts";

// Dark mode buttons
const darkModeStyles = customizeComponent(".dark-mode", "button", {
  primary: {
    background: "#1a1a1a",
    backgroundHover: "#2a2a2a",
    textColor: "#ffffff",
  },
});

// CTA section with special styling
const ctaStyles = customizeComponent(".cta-section", "button", {
  primary: {
    background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
    backgroundHover: "linear-gradient(45deg, #FF5252, #26C6DA)",
  },
});
```

### 3. Responsive Tokens

Different token values at different breakpoints:

```typescript
import { responsiveTokens } from "ui-lib/mod-token.ts";

const responsiveStyles = responsiveTokens("button", {
  mobile: {
    base: {
      height: "48px", // Larger for touch
      fontSize: "16px",
    },
  },
  tablet: {
    base: {
      height: "44px",
      fontSize: "14px",
    },
  },
  desktop: {
    base: {
      height: "40px",
      fontSize: "14px",
    },
  },
});
```

### 4. Inline Token Overrides

Override tokens directly in CSS:

```html
<style>
  /* Override specific tokens for this section */
  .special-section {
    --button-primary-background: #7c3aed;
    --button-primary-backgroundHover: #6d28d9;
    --button-base-borderRadius: 24px;
  }
</style>

<div class="special-section">
  <!-- Buttons here use the overridden tokens -->
</div>
```

## Theme System

### Pre-built Themes

```typescript
import { applyTheme, themes } from "ui-lib/mod-token.ts";

// Apply a pre-built theme
const lightStyles = applyTheme(themes.light);
const darkStyles = applyTheme(themes.dark);
const highContrastStyles = applyTheme(themes.highContrast);
```

### Custom Themes

```typescript
import { applyTheme, createTheme } from "ui-lib/mod-token.ts";

const corporateTheme = createTheme("corporate", {
  button: {
    primary: {
      background: "#003366",
      backgroundHover: "#002244",
      textColor: "#FFFFFF",
    },
    secondary: {
      background: "#F5F5F5",
      backgroundHover: "#E0E0E0",
      textColor: "#003366",
    },
  },
});

const styles = applyTheme(corporateTheme);
```

### Dynamic Theme Switching

```typescript
// Client-side theme switching
function switchTheme(themeName: string) {
  const theme = themes[themeName];
  if (theme) {
    applyTheme(theme); // Automatically injects into document.head
  }
}

// Switch themes instantly
switchTheme("dark");
switchTheme("light");
```

## Component Integration

### SSR Integration

```typescript
import { Button } from "ui-lib/mod-token.ts";

function renderPage() {
  // Get component styles
  const componentStyles = Button.injectStyles();

  // Get theme styles
  const themeStyles = applyTheme(themes.dark);

  // Render complete page
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          ${componentStyles}
          ${themeStyles}
        </style>
      </head>
      <body>
        ${Button({ variant: "primary", children: "Hello World" })}
      </body>
    </html>
  `;
}
```

### Client Enhancement

```typescript
// Optional client-side enhancements
import { applyTheme, themes } from "ui-lib/mod-token.ts";

// Theme persistence
const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(themes[savedTheme]);

// Theme toggle
function toggleTheme() {
  const current = localStorage.getItem("theme") || "light";
  const next = current === "light" ? "dark" : "light";

  localStorage.setItem("theme", next);
  applyTheme(themes[next]);
}
```

## Best Practices

### 1. Use Semantic Token Names

```typescript
// ✅ Good - semantic names
const theme = defineTokens({
  button: {
    primary: { background: "#007bff" },
    secondary: { background: "#6c757d" },
    success: { background: "#28a745" },
    danger: { background: "#dc3545" },
  },
});

// ❌ Avoid - implementation details
const theme = defineTokens({
  button: {
    blueButton: { background: "#007bff" },
    grayButton: { background: "#6c757d" },
  },
});
```

### 2. Maintain Color Contrast

```typescript
const accessibleTheme = defineTokens({
  button: {
    primary: {
      background: "#0066CC", // 4.5:1 contrast ratio
      textColor: "#FFFFFF", // High contrast
      focusRingColor: "#FFD700", // Visible focus ring
    },
  },
});
```

### 3. Progressive Enhancement

```typescript
// Base styles work without JavaScript
const baseStyles = defineTokens({
  button: {
    primary: {
      background: "#007bff",
      textColor: "white",
    },
  },
});

// Enhanced styles for JavaScript-enabled clients
const enhancedStyles = defineTokens({
  button: {
    primary: {
      background: "linear-gradient(135deg, #007bff, #0056b3)",
      transitionDuration: "200ms",
    },
  },
});
```

### 4. Token Validation

```typescript
// Type-safe token definitions prevent runtime errors
const validTokens = defineTokens({
  button: {
    primary: {
      background: "#FF5722", // ✅ Valid CSS color
      borderRadius: "8px", // ✅ Valid CSS length
      fontWeight: "600", // ✅ Valid CSS font-weight
    },
  },
});
```

## Advanced Usage

### Custom Token Utilities

```typescript
// Create reusable token utilities
function createBrandTheme(brandColor: string) {
  return defineTokens({
    button: {
      primary: {
        background: brandColor,
        backgroundHover: darken(brandColor, 0.1),
        backgroundActive: darken(brandColor, 0.2),
      },
    },
  });
}

// Generate themes programmatically
const redTheme = createBrandTheme("#E53E3E");
const blueTheme = createBrandTheme("#3182CE");
```

### Token Debugging

```typescript
// Debug mode to see which tokens are being used
if (import.meta.env.DEV) {
  console.log("Button tokens:", Button.tokenContract);
  console.log("Generated CSS:", Button.cssVarDefinitions);
}

// CSS debugging (shows all token values)
const debugStyles = `
  :root {
    /* Show all token values in DevTools */
    ${Button.cssVarDefinitions}
  }
`;
```

### Integration with Design Systems

```typescript
// Map design system tokens to component tokens
import { designTokens } from "./design-system";

const mappedTokens = defineTokens({
  button: {
    primary: {
      background: designTokens.colors.primary.main,
      backgroundHover: designTokens.colors.primary.dark,
      textColor: designTokens.colors.primary.contrastText,
      borderRadius: designTokens.radii.medium,
      fontSize: designTokens.typography.button.fontSize,
    },
  },
});
```

## Migration from Traditional Components

See the [Migration Guide](migration-guide.md) for detailed instructions on
moving from traditional ui-lib components to token-based components.

## Troubleshooting

### Common Issues

1. **Tokens not applying**: Ensure styles are included in the page before
   components
2. **TypeScript errors**: Check token structure matches component's token
   contract
3. **Specificity issues**: Use CSS cascade properly with token overrides
4. **Performance**: Group token definitions to minimize style recalculations

### CSS Variable Debugging

```css
/* See all token values in DevTools */
:root {
  --debug: var(--button-primary-background, "NOT SET");
}

/* Test token inheritance */
.debug-button {
  background: var(--button-primary-background);
  border: 2px solid red; /* Visible if token missing */
}
```

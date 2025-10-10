# Theme System Documentation

## Overview

ui-lib provides a comprehensive, type-safe theme system that enables customizable theming with light and dark mode support. The system uses CSS custom properties (CSS variables) for DOM-native theming without runtime overhead.

## Key Features

- ✅ **Base themes**: Built-in light and dark themes
- ✅ **Custom themes**: Define your own themes by extending base themes
- ✅ **Type safety**: Full TypeScript support with IntelliSense
- ✅ **SSR-friendly**: Themes render server-side, no hydration needed
- ✅ **System preferences**: Automatic dark mode detection
- ✅ **localStorage persistence**: Theme choice persists across sessions
- ✅ **Runtime switching**: Switch themes client-side without reload
- ✅ **Zero runtime overhead**: CSS custom properties handle all styling

## Architecture

### Three-Layer System

1. **Theme Definition** (`lib/theme-system.ts`)
   - Base theme configurations (light/dark)
   - Theme extension API
   - CSS generation functions

2. **Theme Manager** (`lib/state-patterns/theme-manager.ts`)
   - Runtime theme switching
   - State management integration
   - localStorage persistence
   - System preference detection

3. **Application Integration**
   - SSR CSS injection via `getBaseThemeCss()`
   - Client-side script via `createThemeManagerScript()`
   - Theme tokens via `themeToken()`

## Quick Start

### Basic Usage

```typescript
import { getBaseThemeCss, lightTheme, darkTheme } from "ui-lib";

function Layout({ children }) {
  const themeCSS = getBaseThemeCss([lightTheme, darkTheme]);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>${themeCSS}</style>
      </head>
      <body>
        ${children}
      </body>
    </html>
  `;
}
```

### With Runtime Switching

```typescript
import {
  getBaseThemeCss,
  createThemeManagerScript,
  lightTheme,
  darkTheme,
} from "ui-lib";

function Layout({ children }) {
  const themeCSS = getBaseThemeCss([lightTheme, darkTheme], {
    includeSystemPreference: true,
    defaultTheme: "light",
  });

  const themeScript = createThemeManagerScript([lightTheme, darkTheme], {
    defaultTheme: "light",
    persistToLocalStorage: true,
  });

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>${themeCSS}</style>
        <script>${themeScript}</script>
      </head>
      <body>
        <!-- Theme toggle button -->
        <button onclick="window.uiLibThemeToggle()">
          Toggle Theme
        </button>
        ${children}
      </body>
    </html>
  `;
}
```

## Theme Configuration

### Base Themes

ui-lib provides two comprehensive base themes:

```typescript
import { lightTheme, darkTheme, BASE_THEMES } from "ui-lib";

// Access base themes
const light = BASE_THEMES.light;
const dark = BASE_THEMES.dark;
```

### Theme Structure

Each theme includes:

```typescript
interface ThemeConfig {
  name: string;
  displayName?: string;
  isDark?: boolean;
  tokens: {
    colors: ThemeColors;
    spacing?: Record<string, string>;
    typography?: Record<string, string>;
    radius?: Record<string, string>;
    shadow?: Record<string, string>;
    animation?: Record<string, string>;
    surface?: Record<string, string>;
  };
}
```

### Color Tokens

Comprehensive color system with semantic naming:

```typescript
interface ThemeColors {
  // Surface colors
  background: string;
  surface: string;
  surfaceVariant: string;
  overlay: string;

  // Text colors
  onBackground: string;
  onSurface: string;
  onSurfaceVariant: string;

  // Primary colors
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;

  // Secondary colors
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;

  // State colors
  success: string;
  onSuccess: string;
  warning: string;
  onWarning: string;
  error: string;
  onError: string;
  info: string;
  onInfo: string;

  // Border and outline
  outline: string;
  outlineVariant: string;

  // Interactive states
  hover: string;
  focus: string;
  pressed: string;
  disabled: string;
}
```

## Custom Themes

### Extending Base Themes

```typescript
import { defineTheme } from "ui-lib";

const brandTheme = defineTheme({
  name: "brand",
  displayName: "Brand Theme",
  extends: "light", // or lightTheme
  tokens: {
    colors: {
      primary: "#FF5733",
      onPrimary: "#FFFFFF",
      primaryContainer: "#FFE5DD",
      onPrimaryContainer: "#5C1A0A",
    },
  },
});
```

### Creating from Scratch

```typescript
import { createMinimalTheme } from "ui-lib";

const customTheme = createMinimalTheme(
  "custom",
  {
    primary: "#6366F1",
    background: "#FFFFFF",
    onBackground: "#111827",
    surface: "#F9FAFB",
    onSurface: "#1F2937",
    // ... other essential colors
  },
  false // isDark
);
```

### Full Custom Theme

```typescript
const fullCustomTheme: ThemeConfig = {
  name: "custom",
  displayName: "My Custom Theme",
  isDark: false,
  tokens: {
    colors: {
      // Define all colors
      background: "#FFFFFF",
      surface: "#F9FAFB",
      // ... all required color tokens
    },
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
    },
    typography: {
      fontFamily: "Inter, sans-serif",
      textBase: "1rem",
      textLg: "1.125rem",
      // ...
    },
    radius: {
      sm: "0.125rem",
      md: "0.375rem",
      lg: "0.5rem",
    },
    shadow: {
      sm: "0 1px 2px rgba(0,0,0,0.05)",
      md: "0 4px 6px rgba(0,0,0,0.1)",
    },
    animation: {
      durationFast: "150ms",
      durationNormal: "250ms",
      easingEaseOut: "cubic-bezier(0, 0, 0.2, 1)",
    },
  },
};
```

## Using Theme Tokens

### In CSS

Theme tokens are exposed as CSS custom properties:

```css
.my-component {
  background-color: var(--theme-colors-background);
  color: var(--theme-colors-on-background);
  padding: var(--theme-spacing-md);
  border-radius: var(--theme-radius-md);
  font-family: var(--theme-typography-fontFamily);
  transition: all var(--theme-animation-durationNormal);
}

.my-button {
  background: var(--theme-colors-primary);
  color: var(--theme-colors-on-primary);
  padding: var(--theme-spacing-sm) var(--theme-spacing-md);
  border-radius: var(--theme-radius-lg);
}

.my-button:hover {
  background: var(--theme-colors-hover);
}
```

### In TypeScript

```typescript
import { themeToken } from "ui-lib";

// Generate CSS variable reference
const primaryColor = themeToken("colors", "primary");
// Returns: "var(--theme-colors-primary)"

// Use in component styles
defineComponent("my-component", {
  styles: css({
    container: {
      backgroundColor: themeToken("colors", "background"),
      color: themeToken("colors", "onBackground"),
      padding: themeToken("spacing", "md"),
    },
  }),
  render: () => <div class="container">Hello</div>,
});
```

## Runtime Theme Management

### With State Manager Integration

```typescript
import {
  createThemeManager,
  createStateManager,
  lightTheme,
  darkTheme,
} from "ui-lib";

// Server-side: Create state manager
const stateManager = createStateManager();

// Server-side: Create theme manager
const themeManager = createThemeManager(
  stateManager,
  [lightTheme, darkTheme],
  {
    defaultTheme: "light",
    persistToLocalStorage: true,
    cssScope: "global",
  }
);

// Server-side: Switch theme
themeManager.switchTheme("dark");

// Client-side: Subscribe to theme changes
themeManager.subscribe((state) => {
  console.log("Current theme:", state.currentTheme);
  console.log("Is dark mode:", state.isDarkMode);
  console.log("Available themes:", state.availableThemes);
}, document.body);

// Client-side: Toggle dark mode
themeManager.toggleDarkMode();

// Client-side: Get current theme
const currentTheme = themeManager.getCurrentTheme();
```

### Standalone (Without State Manager)

Use the lightweight client-side script:

```typescript
import { createThemeManagerScript } from "ui-lib";

const script = createThemeManagerScript([lightTheme, darkTheme], {
  defaultTheme: "light",
  persistToLocalStorage: true,
});

// Inject in <script> tag
// Access via global API:
// - window.uiLibThemeManager.switchTheme(name)
// - window.uiLibThemeManager.toggleDarkMode()
// - window.uiLibThemeToggle() - shortcut for toggle
```

### Client-Side API

The theme manager script exposes these globals:

```javascript
// Switch to a specific theme
window.uiLibThemeManager.switchTheme("dark");

// Toggle between light and dark
window.uiLibThemeManager.toggleDarkMode();

// Shortcut for toggle
window.uiLibThemeToggle();

// Get current theme name
window.uiLibThemeManager.getCurrentTheme();

// Get available themes
window.uiLibThemeManager.getAvailableThemes();
```

## Configuration Options

### `getBaseThemeCss()` Options

```typescript
getBaseThemeCss(themes, {
  // Enable automatic dark mode based on system preference
  includeSystemPreference: true, // default: true

  // Default theme to use
  defaultTheme: "light", // default: first theme
});
```

### `createThemeManager()` Options

```typescript
createThemeManager(stateManager, themes, {
  // State manager topic for pub/sub
  topic: "theme", // default: "theme"

  // Persist theme choice to localStorage
  persistToLocalStorage: true, // default: true

  // CSS scope for theme application
  cssScope: "global", // default: "global" | "component"

  // Default theme to use
  defaultTheme: "light", // default: first theme
});
```

## Examples

### Complete Shopping Cart Example

See [examples/shopping-cart/server.tsx](../examples/shopping-cart/server.tsx) for a complete working example with:

- Theme CSS injection
- Runtime theme switching
- Theme toggle button
- System preference detection
- localStorage persistence

### Theme Toggle Button

```html
<button
  class="theme-toggle"
  onclick="window.uiLibThemeToggle()"
  aria-label="Toggle dark mode"
  title="Toggle between light and dark theme"
>
  🌓
</button>
```

With CSS:

```css
.theme-toggle {
  background: var(--theme-colors-surface-variant);
  border: 1px solid var(--theme-colors-outline);
  border-radius: var(--theme-radius-md);
  padding: var(--theme-spacing-sm) var(--theme-spacing-md);
  cursor: pointer;
  transition: all var(--theme-animation-durationNormal);
}

.theme-toggle:hover {
  background: var(--theme-colors-hover);
  border-color: var(--theme-colors-primary);
}
```

### Dynamic Theme Switcher

```html
<select onchange="window.uiLibThemeManager.switchTheme(this.value)">
  <option value="light">Light</option>
  <option value="dark">Dark</option>
  <option value="brand">Brand</option>
</select>
```

### React to Theme Changes

```javascript
// Subscribe to theme state changes
if (window.funcwcState) {
  window.funcwcState.subscribe("theme", (state) => {
    console.log("Theme changed to:", state.currentTheme);
    console.log("Is dark mode:", state.isDarkMode);

    // Update UI based on theme
    document.body.classList.toggle("dark-mode", state.isDarkMode);
  });
}
```

## Best Practices

### 1. Use Semantic Tokens

Prefer semantic tokens over direct colors:

```css
/* Good */
background-color: var(--theme-colors-background);
color: var(--theme-colors-on-background);

/* Avoid */
background-color: white;
color: black;
```

### 2. Leverage Theme Hierarchy

Use the "on" prefix for contrast colors:

```css
.card {
  background: var(--theme-colors-surface);
  color: var(--theme-colors-on-surface);
}

.button {
  background: var(--theme-colors-primary);
  color: var(--theme-colors-on-primary);
}
```

### 3. Test Both Light and Dark Modes

Always test your application in both themes to ensure proper contrast and readability.

### 4. Provide Theme Toggle

Give users control over their theme preference:

```typescript
// Always include a theme toggle button
<button onclick="window.uiLibThemeToggle()">🌓</button>
```

### 5. Respect System Preferences

Enable system preference detection by default:

```typescript
getBaseThemeCss(themes, {
  includeSystemPreference: true,
});
```

## Performance

### Zero Runtime Overhead

- Theme CSS is generated once at build/server time
- CSS custom properties provide instant theme switching
- No JavaScript required for static themes
- Optional lightweight script (<2KB) for dynamic switching

### Optimizations

- **Caching**: Generate theme CSS once, cache the result
- **Minimal Script**: Client script only includes theme metadata
- **CSS-Only Switching**: Theme changes via data-attribute, CSS does the rest
- **No Hydration**: Themes work without JavaScript

## Accessibility

### High Contrast Mode

The theme system respects high contrast preferences:

```css
@media (prefers-contrast: high) {
  :root {
    --theme-colors-border: var(--theme-colors-outline-variant);
  }
}
```

### Reduced Motion

All animations respect reduced motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Color Contrast

Base themes meet WCAG AA standards for color contrast:

- Light mode: 4.5:1 minimum for text
- Dark mode: 7:1 for optimal readability

## Troubleshooting

### Theme Not Applying

1. **Check CSS injection**: Ensure `getBaseThemeCss()` output is in a `<style>` tag
2. **Check data-attribute**: Verify `data-theme` attribute is set on root element
3. **Check console**: Look for theme manager errors

### Theme Not Persisting

1. **Check localStorage**: Ensure browser allows localStorage
2. **Check configuration**: Verify `persistToLocalStorage: true`
3. **Check topic**: Ensure consistent topic name

### System Preference Not Working

1. **Check browser support**: Verify `prefers-color-scheme` media query support
2. **Check configuration**: Ensure `includeSystemPreference: true`
3. **Check OS settings**: Verify system-level dark mode is enabled

## Migration Guide

### From Old Theme System

If migrating from the deleted `theme-system.ts`:

1. **Update imports**:
   ```typescript
   // Old
   import { ThemeManager } from "./lib/state-patterns/theme-manager.ts";

   // New
   import { createThemeManager } from "ui-lib";
   ```

2. **Update instantiation**:
   ```typescript
   // Old (class-based)
   const themeManager = new ThemeManager(stateManager, themes, config);

   // New (functional)
   const themeManager = createThemeManager(stateManager, themes, config);
   ```

3. **Update theme definitions**: Use new `ThemeConfig` format with `tokens` property

4. **Update CSS**: Change CSS variable names from `--color-*` to `--theme-colors-*`

## API Reference

### Functions

- `getBaseThemeCss(themes, options?)` - Generate CSS for themes
- `defineTheme(extension)` - Define custom theme
- `createMinimalTheme(name, colors, isDark)` - Quick theme creation
- `themeToken(category, key)` - Get CSS variable reference
- `createThemeManager(stateManager, themes, config?)` - Create theme manager
- `createThemeManagerScript(themes, config?)` - Generate client script

### Types

- `ThemeConfig` - Complete theme configuration
- `ThemeTokens` - Theme token structure
- `ThemeColors` - Color token structure
- `ThemeExtension` - Theme extension config
- `ThemeManager` - Theme manager interface
- `ThemeState` - Current theme state
- `ThemeManagerConfig` - Manager configuration

## Related Documentation

- [Component API](./component-api.md) - Using themes in components
- [Getting Started](./getting-started.md) - Basic setup
- [Architecture](./architecture.md) - System design
- [Examples](./examples.md) - More examples

## Support

For issues, questions, or feature requests related to the theme system, please open an issue on GitHub.

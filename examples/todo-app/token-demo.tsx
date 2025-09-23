/** @jsx h */
/**
 * Token-based Component Demo
 * Shows how to use sealed components with CSS variable customization
 */

import {
  applyTheme,
  Button,
  createTheme,
  customizeComponent,
  defineTokens,
  html,
  themes,
} from "../../mod-token.ts";

// Create a custom theme for the todo app
const todoTheme = createTheme("todo", {
  button: {
    // Override primary button colors
    primary: {
      background: "#10B981", // Green
      backgroundHover: "#059669",
      backgroundActive: "#047857",
      textColor: "#FFFFFF",
      focusRingColor: "#A7F3D0",
    },
    // Override destructive button for delete actions
    destructive: {
      background: "#DC2626",
      backgroundHover: "#B91C1C",
      backgroundActive: "#991B1B",
    },
    // Custom sizes for compact UI
    sizeSm: {
      height: "1.75rem",
      paddingX: "0.625rem",
      fontSize: "0.813rem",
    },
  },
});

// Generate CSS for the theme
const themeStyles = applyTheme(todoTheme);

// Additional scoped customizations
const darkModeStyles = customizeComponent(".dark-mode", "button", {
  primary: {
    background: "#065F46",
    backgroundHover: "#064E3B",
    textColor: "#F0FDF4",
  },
  secondary: {
    background: "#1F2937",
    backgroundHover: "#111827",
    textColor: "#F9FAFB",
  },
});

// Responsive token overrides
const responsiveStyles = defineTokens({
  button: {
    // On mobile, make buttons slightly larger for touch
    "@media (max-width: 640px)": {
      base: {
        height: "3rem",
        fontSize: "1rem",
      },
    },
  },
});

/**
 * Example component showing various button uses
 */
export function TodoAppButtons() {
  return html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Token-Based Components Demo</title>
        <style>
          ${themeStyles}
          ${darkModeStyles}
          ${responsiveStyles}

          /* Application styles - not component internals */
          body {
            font-family: system-ui, sans-serif;
            padding: 2rem;
            background: #F9FAFB;
          }

          .demo-section {
            margin-bottom: 3rem;
          }

          .demo-section h2 {
            margin-bottom: 1rem;
            color: #1F2937;
          }

          .button-group {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            margin-bottom: 1rem;
          }

          .dark-mode {
            background: #111827;
            color: #F9FAFB;
            padding: 2rem;
            border-radius: 0.5rem;
          }

          /* Custom token overrides for specific sections */
          .cta-section {
            --button-primary-background: #7C3AED;
            --button-primary-backgroundHover: #6D28D9;
          }

          .danger-zone {
            --button-destructive-background: #EF4444;
            --button-destructive-backgroundHover: #DC2626;
          }
        </style>
      </head>
      <body>
        <h1>Token-Based Components Demo</h1>

        <div class="demo-section">
          <h2>Default Theme Buttons</h2>
          <div class="button-group">
            ${Button({ variant: "primary", children: "Add Todo" })}
            ${Button({ variant: "secondary", children: "Cancel" })}
            ${Button({ variant: "outline", children: "Filter" })}
            ${Button({ variant: "ghost", children: "More Options" })}
            ${Button({ variant: "destructive", children: "Delete All" })}
          </div>
        </div>

        <div class="demo-section">
          <h2>Size Variations</h2>
          <div class="button-group">
            ${Button({ size: "xs", children: "Extra Small" })}
            ${Button({ size: "sm", children: "Small" })}
            ${Button({ size: "md", children: "Medium" })}
            ${Button({ size: "lg", children: "Large" })}
            ${Button({ size: "xl", children: "Extra Large" })}
          </div>
        </div>

        <div class="demo-section">
          <h2>States</h2>
          <div class="button-group">
            ${
    Button({ loading: true, loadingText: "Saving...", children: "Save" })
  }
            ${Button({ disabled: true, children: "Disabled" })}
            ${Button({ leftIcon: "✅", children: "Complete" })}
            ${Button({ rightIcon: "→", children: "Next" })}
          </div>
        </div>

        <div class="demo-section dark-mode">
          <h2>Dark Mode (Scoped Tokens)</h2>
          <div class="button-group">
            ${Button({ variant: "primary", children: "Dark Primary" })}
            ${Button({ variant: "secondary", children: "Dark Secondary" })}
            ${Button({ variant: "outline", children: "Dark Outline" })}
          </div>
        </div>

        <div class="demo-section cta-section">
          <h2>CTA Section (Inline Token Override)</h2>
          <div class="button-group">
            ${
    Button({ variant: "primary", size: "lg", children: "Get Started Now" })
  }
          </div>
        </div>

        <div class="demo-section danger-zone">
          <h2>Danger Zone (Inline Token Override)</h2>
          <div class="button-group">
            ${Button({ variant: "destructive", children: "Delete Account" })}
            ${
    Button({ variant: "destructive", size: "sm", children: "Remove Item" })
  }
          </div>
        </div>

        <div class="demo-section">
          <h2>Pre-built Themes</h2>
          <p>Available themes: light, dark, highContrast</p>
          <div class="button-group">
            <button onclick="applyTheme('light')">Light Theme</button>
            <button onclick="applyTheme('dark')">Dark Theme</button>
            <button onclick="applyTheme('highContrast')">High Contrast</button>
          </div>
        </div>

        <script>
          // Demo theme switcher (would normally use the imported themes)
          function applyTheme(themeName) {
            console.log('Switching to theme:', themeName);
            // In a real app, you would import and apply the theme:
            // applyTheme(themes[themeName]);
          }
        </script>
      </body>
    </html>
  `);
}

/**
 * Key Benefits of Token-Based Components:
 *
 * 1. **Encapsulation**: Components are sealed - no access to internals
 * 2. **Consistency**: All customization through standardized tokens
 * 3. **Type Safety**: Token interfaces provide IntelliSense
 * 4. **Performance**: CSS variables enable instant theming
 * 5. **Scoping**: Apply different tokens to different sections
 * 6. **Responsive**: Token values can change at breakpoints
 * 7. **Theme Support**: Easy theme switching without re-rendering
 * 8. **No Style Conflicts**: Component styles are isolated
 *
 * Developers can ONLY customize what's exposed through tokens.
 * This prevents:
 * - Breaking component internals
 * - Creating inconsistent UIs
 * - Style specificity wars
 * - Maintenance nightmares
 */

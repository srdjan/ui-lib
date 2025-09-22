// Token System Public API
// This is the only way for application developers to customize components

import type { ComponentTokens, TokenSet } from "./component-tokens.ts";
import { applyTokenOverrides, scopedTokens } from "./component-factory.ts";

// Re-export token types for each component
export type { ButtonTokens } from "./component-tokens.ts";
export type { InputTokens, CardTokens, ModalTokens, LayoutTokens, FeedbackTokens } from "./component-tokens.ts";

// Theme definition type
export type Theme = {
  name: string;
  tokens: {
    button?: Partial<ComponentTokens<any>>;
    input?: Partial<ComponentTokens<any>>;
    card?: Partial<ComponentTokens<any>>;
    modal?: Partial<ComponentTokens<any>>;
    layout?: Partial<ComponentTokens<any>>;
    feedback?: Partial<ComponentTokens<any>>;
  };
};

// Token override configuration
export type TokenOverrides = {
  button?: Record<string, any>;
  input?: Record<string, any>;
  card?: Record<string, any>;
  modal?: Record<string, any>;
  layout?: Record<string, any>;
  feedback?: Record<string, any>;
};

/**
 * Define custom tokens for components
 * This is the primary way to customize component appearance
 *
 * @example
 * ```typescript
 * const myTokens = defineTokens({
 *   button: {
 *     primary: {
 *       background: "#007bff",
 *       backgroundHover: "#0056b3",
 *       textColor: "white",
 *     }
 *   }
 * });
 * ```
 */
export function defineTokens(overrides: TokenOverrides): string {
  const styles: string[] = [];

  for (const [component, tokens] of Object.entries(overrides)) {
    if (tokens) {
      const cssVars = applyTokenOverrides(component, tokens);
      styles.push(`:root { ${cssVars}; }`);
    }
  }

  return styles.join("\n");
}

/**
 * Apply token overrides to a specific scope (CSS selector)
 *
 * @example
 * ```typescript
 * const darkModeTokens = customizeComponent(".dark-mode", "button", {
 *   primary: {
 *     background: "#1a1a1a",
 *     textColor: "#ffffff",
 *   }
 * });
 * ```
 */
export function customizeComponent<T extends Record<string, TokenSet>>(
  selector: string,
  component: string,
  overrides: Partial<ComponentTokens<T>>,
): string {
  return scopedTokens(selector, component, overrides);
}

/**
 * Create a complete theme with multiple component customizations
 *
 * @example
 * ```typescript
 * const corporateTheme = createTheme("corporate", {
 *   button: {
 *     primary: { background: "#003366" }
 *   },
 *   input: {
 *     default: { borderColor: "#003366" }
 *   }
 * });
 * ```
 */
export function createTheme(name: string, tokens: TokenOverrides): Theme {
  return { name, tokens };
}

/**
 * Apply a theme to the document
 * For SSR: Returns CSS string to inject
 * For client: Also injects styles into document head
 *
 * @example
 * ```typescript
 * const theme = createTheme("dark", { ... });
 * const styles = applyTheme(theme);
 * // Include `styles` in your SSR response
 * ```
 */
export function applyTheme(theme: Theme): string {
  const styles = defineTokens(theme.tokens);

  // If running in browser, inject styles
  if (typeof document !== "undefined") {
    const styleId = `ui-theme-${theme.name}`;
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = styles;
  }

  return styles;
}

/**
 * Generate responsive token overrides
 * Applies different tokens at different breakpoints
 *
 * @example
 * ```typescript
 * const responsiveTokens = responsiveTokens("button", {
 *   mobile: { base: { fontSize: "0.75rem" } },
 *   tablet: { base: { fontSize: "0.875rem" } },
 *   desktop: { base: { fontSize: "1rem" } }
 * });
 * ```
 */
export function responsiveTokens(
  component: string,
  breakpoints: {
    mobile?: Partial<ComponentTokens<any>>;
    tablet?: Partial<ComponentTokens<any>>;
    desktop?: Partial<ComponentTokens<any>>;
  }
): string {
  const styles: string[] = [];

  if (breakpoints.mobile) {
    const mobileVars = applyTokenOverrides(component, breakpoints.mobile);
    styles.push(`@media (max-width: 640px) { :root { ${mobileVars}; } }`);
  }

  if (breakpoints.tablet) {
    const tabletVars = applyTokenOverrides(component, breakpoints.tablet);
    styles.push(`@media (min-width: 641px) and (max-width: 1024px) { :root { ${tabletVars}; } }`);
  }

  if (breakpoints.desktop) {
    const desktopVars = applyTokenOverrides(component, breakpoints.desktop);
    styles.push(`@media (min-width: 1025px) { :root { ${desktopVars}; } }`);
  }

  return styles.join("\n");
}

/**
 * Get CSS for all component default styles
 * Use this in SSR to include all component styles in the initial response
 */
export function getAllComponentStyles(): string {
  // This would be populated by component registrations
  // For now, return a placeholder
  return `
    /* Component styles will be injected here */
    /* Each component's injectStyles() method provides the CSS */
  `;
}

// Pre-built themes for quick start
export const themes = {
  light: createTheme("light", {
    button: {
      primary: {
        background: "#3B82F6",
        backgroundHover: "#2563EB",
        textColor: "#FFFFFF",
      },
    },
  }),

  dark: createTheme("dark", {
    button: {
      primary: {
        background: "#1E40AF",
        backgroundHover: "#1E3A8A",
        textColor: "#F9FAFB",
      },
      secondary: {
        background: "#374151",
        backgroundHover: "#4B5563",
        textColor: "#F9FAFB",
      },
    },
  }),

  highContrast: createTheme("high-contrast", {
    button: {
      primary: {
        background: "#000000",
        backgroundHover: "#1F2937",
        textColor: "#FFFFFF",
      },
      outline: {
        borderColor: "#000000",
        borderColorHover: "#000000",
      },
    },
  }),
};
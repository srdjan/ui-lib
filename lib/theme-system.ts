/**
 * Theme System - Base themes and user-defined theme support
 *
 * Provides:
 * - Comprehensive base theme (light + dark)
 * - Type-safe theme configuration
 * - CSS custom property generation
 * - Theme extension and customization
 * - SSR-friendly CSS injection
 *
 * Philosophy:
 * - DOM-native theming via CSS custom properties
 * - Functional approach (no classes)
 * - Integration with existing design tokens
 * - Progressive enhancement
 */

import { DESIGN_TOKENS, type DesignTokens } from "./styles/design-tokens.ts";

// ============================================================
// Type Definitions
// ============================================================

/**
 * Complete theme configuration with all token categories
 */
export interface ThemeConfig {
  readonly name: string;
  readonly displayName?: string;
  readonly isDark?: boolean;
  readonly tokens: ThemeTokens;
}

/**
 * Theme tokens structure matching design system
 */
export interface ThemeTokens {
  readonly colors: ThemeColors;
  readonly spacing?: Record<string, string>;
  readonly typography?: Record<string, string>;
  readonly radius?: Record<string, string>;
  readonly shadow?: Record<string, string>;
  readonly animation?: Record<string, string>;
  readonly surface?: Record<string, string>;
}

/**
 * Color tokens for comprehensive theming
 */
export interface ThemeColors {
  // Surface colors
  readonly background: string;
  readonly surface: string;
  readonly surfaceVariant: string;
  readonly overlay: string;

  // Text colors
  readonly onBackground: string;
  readonly onSurface: string;
  readonly onSurfaceVariant: string;

  // Primary colors
  readonly primary: string;
  readonly onPrimary: string;
  readonly primaryContainer: string;
  readonly onPrimaryContainer: string;

  // Secondary colors
  readonly secondary: string;
  readonly onSecondary: string;
  readonly secondaryContainer: string;
  readonly onSecondaryContainer: string;

  // State colors
  readonly success: string;
  readonly onSuccess: string;
  readonly warning: string;
  readonly onWarning: string;
  readonly error: string;
  readonly onError: string;
  readonly info: string;
  readonly onInfo: string;

  // Border and outline
  readonly outline: string;
  readonly outlineVariant: string;

  // Interactive states
  readonly hover: string;
  readonly focus: string;
  readonly pressed: string;
  readonly disabled: string;
}

/**
 * Theme extension configuration for user-defined themes
 */
export interface ThemeExtension {
  readonly name: string;
  readonly displayName?: string;
  readonly isDark?: boolean;
  readonly extends?: string | ThemeConfig;
  readonly tokens: Partial<ThemeTokens>;
}

// ============================================================
// Base Themes
// ============================================================

/**
 * Light theme - Default theme with modern, accessible colors
 */
export const lightTheme: ThemeConfig = {
  name: "light",
  displayName: "Light",
  isDark: false,
  tokens: {
    colors: {
      // Surface colors (warmer, more refined)
      background: "#FFFFFF",
      surface: "#FAFAFA",
      surfaceVariant: "#F5F5F5",
      overlay: "rgba(0, 0, 0, 0.4)",

      // Text colors (better contrast)
      onBackground: "#0A0A0A",
      onSurface: "#171717",
      onSurfaceVariant: "#737373",

      // Primary colors (Refined indigo)
      primary: "#6366F1",
      onPrimary: "#FFFFFF",
      primaryContainer: "#E0E7FF",
      onPrimaryContainer: "#3730A3",

      // Secondary colors (Elegant slate)
      secondary: "#64748B",
      onSecondary: "#FFFFFF",
      secondaryContainer: "#F1F5F9",
      onSecondaryContainer: "#1E293B",

      // State colors (with container support)
      success: "#22C55E",
      onSuccess: "#FFFFFF",
      warning: "#F59E0B",
      onWarning: "#1A1A1A",
      error: "#EF4444",
      onError: "#FFFFFF",
      info: "#0EA5E9",
      onInfo: "#FFFFFF",

      // Border and outline (refined)
      outline: "#D4D4D8",
      outlineVariant: "#E4E4E7",

      // Interactive states (refined with indigo)
      hover: "rgba(99, 102, 241, 0.08)",
      focus: "rgba(99, 102, 241, 0.12)",
      pressed: "rgba(99, 102, 241, 0.16)",
      disabled: "#A1A1AA",
    },
    spacing: {
      xs: "0.25rem", // 4px
      sm: "0.5rem", // 8px
      md: "1rem", // 16px
      lg: "1.5rem", // 24px
      xl: "2rem", // 32px
      xxl: "3rem", // 48px
    },
    typography: {
      fontFamily:
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontFamilyDisplay:
        '"Cal Sans", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontFamilyMono:
        '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, "Roboto Mono", Consolas, monospace',

      textXs: "0.75rem", // 12px
      textSm: "0.875rem", // 14px
      textBase: "1rem", // 16px
      textLg: "1.125rem", // 18px
      textXl: "1.25rem", // 20px
      text2xl: "1.5rem", // 24px
      text3xl: "1.875rem", // 30px
      text4xl: "2.25rem", // 36px
      text5xl: "3rem", // 48px

      weightLight: "300",
      weightRegular: "400",
      weightMedium: "500",
      weightSemibold: "600",
      weightBold: "700",
      weightExtrabold: "800",
      weightBlack: "900",

      leadingTight: "1.25",
      leadingNormal: "1.5",
      leadingRelaxed: "1.75",
    },
    radius: {
      none: "0",
      sm: "0.125rem", // 2px
      base: "0.25rem", // 4px
      md: "0.375rem", // 6px
      lg: "0.5rem", // 8px
      xl: "0.75rem", // 12px
      full: "9999px",
    },
    shadow: {
      none: "none",
      xs: "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 1px 0 rgba(0, 0, 0, 0.02)",
      sm: "0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
      base: "0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.06)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.06)",
      xl: "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.06)",
      "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.2)",
      primary: "0 4px 14px 0 rgba(99, 102, 241, 0.2)",
      focus: "0 0 0 3px rgba(99, 102, 241, 0.12), 0 0 0 1px rgba(99, 102, 241, 0.4)",
    },
    animation: {
      durationInstant: "50ms",
      durationFast: "150ms",
      durationNormal: "250ms",
      durationSlow: "350ms",
      durationSlower: "500ms",
      durationSlowest: "750ms",

      easingEaseOut: "cubic-bezier(0.16, 1, 0.3, 1)",
      easingEaseIn: "cubic-bezier(0.4, 0, 1, 1)",
      easingEaseInOut: "cubic-bezier(0.65, 0, 0.35, 1)",
      easingSpring: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      easingSmooth: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
    surface: {
      background: "var(--theme-color-background)",
      foreground: "var(--theme-color-onBackground)",
      muted: "var(--theme-color-surface)",
      subtle: "var(--theme-color-surfaceVariant)",
      border: "var(--theme-color-outline)",
      borderStrong: "var(--theme-color-outlineVariant)",
    },
  },
};

/**
 * Dark theme - Modern dark mode with proper contrast
 */
export const darkTheme: ThemeConfig = {
  name: "dark",
  displayName: "Dark",
  isDark: true,
  tokens: {
    colors: {
      // Surface colors (refined slate)
      background: "#0A0A0A",
      surface: "#171717",
      surfaceVariant: "#262626",
      overlay: "rgba(0, 0, 0, 0.7)",

      // Text colors (better contrast)
      onBackground: "#FAFAFA",
      onSurface: "#F5F5F5",
      onSurfaceVariant: "#A3A3A3",

      // Primary colors (Lighter indigo for dark mode)
      primary: "#818CF8",
      onPrimary: "#1E1B4B",
      primaryContainer: "#3730A3",
      onPrimaryContainer: "#E0E7FF",

      // Secondary colors (Lighter slate)
      secondary: "#94A3B8",
      onSecondary: "#1E293B",
      secondaryContainer: "#475569",
      onSecondaryContainer: "#CBD5E1",

      // State colors (Lighter for visibility)
      success: "#4ADE80",
      onSuccess: "#14532D",
      warning: "#FBBF24",
      onWarning: "#451A03",
      error: "#F87171",
      onError: "#7F1D1D",
      info: "#38BDF8",
      onInfo: "#0C4A6E",

      // Border and outline (refined)
      outline: "#404040",
      outlineVariant: "#525252",

      // Interactive states (refined with indigo)
      hover: "rgba(129, 140, 248, 0.12)",
      focus: "rgba(129, 140, 248, 0.16)",
      pressed: "rgba(129, 140, 248, 0.20)",
      disabled: "#525252",
    },
    spacing: lightTheme.tokens.spacing,
    typography: lightTheme.tokens.typography,
    radius: lightTheme.tokens.radius,
    shadow: {
      none: "none",
      xs: "0 1px 2px 0 rgba(0, 0, 0, 0.4), 0 1px 1px 0 rgba(0, 0, 0, 0.3)",
      sm: "0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px -1px rgba(0, 0, 0, 0.4)",
      base: "0 1px 3px 0 rgba(0, 0, 0, 0.6), 0 1px 2px -1px rgba(0, 0, 0, 0.5)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.6), 0 2px 4px -2px rgba(0, 0, 0, 0.5)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.5)",
      xl: "0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.5)",
      "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
      primary: "0 4px 14px 0 rgba(129, 140, 248, 0.3)",
      focus: "0 0 0 3px rgba(129, 140, 248, 0.16), 0 0 0 1px rgba(129, 140, 248, 0.5)",
    },
    animation: lightTheme.tokens.animation,
    surface: lightTheme.tokens.surface,
  },
};

// ============================================================
// Theme CSS Generation
// ============================================================

/**
 * Generate CSS custom properties from theme configuration
 */
function generateThemeCSS(theme: ThemeConfig): string {
  const properties: string[] = [];

  // Process all token categories
  Object.entries(theme.tokens).forEach(([category, tokens]) => {
    if (!tokens || typeof tokens !== "object") return;

    Object.entries(tokens).forEach(([key, value]) => {
      // Convert camelCase to kebab-case for CSS
      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      properties.push(`--theme-${category}-${cssKey}: ${value};`);
    });
  });

  return properties.join("\n  ");
}

/**
 * Get base theme CSS for injection into HTML
 *
 * This is the main function users will call to get CSS for their themes.
 *
 * @param themes - Array of theme configurations (defaults to light + dark)
 * @param options - CSS generation options
 * @returns CSS string ready for <style> tag injection
 *
 * @example
 * ```typescript
 * const css = getBaseThemeCss();
 * // In your layout:
 * <style>${css}</style>
 * ```
 */
export function getBaseThemeCss(
  themes: readonly ThemeConfig[] = [lightTheme, darkTheme],
  options: {
    includeSystemPreference?: boolean;
    defaultTheme?: string;
  } = {},
): string {
  const {
    includeSystemPreference = true,
    defaultTheme = "light",
  } = options;

  // Find default theme
  const defaultThemeConfig = themes.find((t) => t.name === defaultTheme) ||
    themes[0];
  if (!defaultThemeConfig) {
    throw new Error("No themes provided or default theme not found");
  }

  // Generate root CSS with default theme
  const rootCSS = `:root {
  ${generateThemeCSS(defaultThemeConfig)}
}`;

  // Generate theme-specific CSS classes
  const themeClasses = themes.map((theme) => {
    return `[data-theme="${theme.name}"] {
  ${generateThemeCSS(theme)}
}`;
  }).join("\n\n");

  // Generate system preference media query if enabled
  const darkThemeConfig = themes.find((t) => t.isDark);
  const systemPreferenceCSS = includeSystemPreference && darkThemeConfig
    ? `

/* Automatic dark mode based on system preference */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    ${generateThemeCSS(darkThemeConfig)}
  }
}`
    : "";

  return `/* ui-lib Base Theme System */
${rootCSS}

${themeClasses}${systemPreferenceCSS}

/* Theme transition for smooth switching */
[data-theme] {
  transition: background-color 250ms ease, color 250ms ease;
}`;
}

/**
 * Define a custom theme by extending an existing theme
 *
 * @param extension - Theme extension configuration
 * @returns Complete theme configuration
 *
 * @example
 * ```typescript
 * const brandTheme = defineTheme({
 *   name: "brand",
 *   extends: "light",
 *   tokens: {
 *     colors: {
 *       primary: "#FF5733",
 *       background: "#F0F0F0"
 *     }
 *   }
 * });
 * ```
 */
export function defineTheme(extension: ThemeExtension): ThemeConfig {
  // Find base theme to extend
  let baseTheme: ThemeConfig;

  if (typeof extension.extends === "string") {
    baseTheme = extension.extends === "dark" ? darkTheme : lightTheme;
  } else if (extension.extends) {
    baseTheme = extension.extends;
  } else {
    baseTheme = lightTheme;
  }

  // Deep merge tokens (type assertion needed for partial colors)
  const mergedTokens: ThemeTokens = {
    colors: {
      ...baseTheme.tokens.colors,
      ...(extension.tokens.colors || {}),
    } as ThemeColors,
    spacing: {
      ...(baseTheme.tokens.spacing || {}),
      ...(extension.tokens.spacing || {}),
    },
    typography: {
      ...(baseTheme.tokens.typography || {}),
      ...(extension.tokens.typography || {}),
    },
    radius: {
      ...(baseTheme.tokens.radius || {}),
      ...(extension.tokens.radius || {}),
    },
    shadow: {
      ...(baseTheme.tokens.shadow || {}),
      ...(extension.tokens.shadow || {}),
    },
    animation: {
      ...(baseTheme.tokens.animation || {}),
      ...(extension.tokens.animation || {}),
    },
    surface: {
      ...(baseTheme.tokens.surface || {}),
      ...(extension.tokens.surface || {}),
    },
  };

  return {
    name: extension.name,
    displayName: extension.displayName || extension.name,
    isDark: extension.isDark ?? baseTheme.isDark,
    tokens: mergedTokens,
  };
}

/**
 * Create a minimal theme with only essential tokens
 * Useful for quick prototyping
 *
 * Note: Provide at least the essential colors. Missing colors will
 * be inherited from the base theme (light or dark).
 *
 * @param name - Theme name
 * @param colors - Color tokens to override (partial)
 * @param isDark - Whether this is a dark theme
 * @returns Minimal theme configuration
 */
export function createMinimalTheme(
  name: string,
  colors: Partial<ThemeColors>,
  isDark = false,
): ThemeConfig {
  const baseTheme = isDark ? darkTheme : lightTheme;

  // Manually merge to satisfy type checker
  const mergedColors: ThemeColors = {
    ...baseTheme.tokens.colors,
    ...colors,
  } as ThemeColors;

  return defineTheme({
    name,
    isDark,
    extends: baseTheme,
    tokens: { colors: mergedColors },
  });
}

/**
 * Get theme token value helper for use in components
 *
 * @param category - Token category (colors, spacing, etc.)
 * @param key - Token key
 * @returns CSS variable reference
 *
 * @example
 * ```typescript
 * const primaryColor = themeToken("colors", "primary");
 * // Returns: "var(--theme-colors-primary)"
 * ```
 */
export function themeToken(category: string, key: string): string {
  const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
  return `var(--theme-${category}-${cssKey})`;
}

/**
 * Export base themes as a registry for convenience
 */
export const BASE_THEMES = {
  light: lightTheme,
  dark: darkTheme,
} as const;

// Enhanced design token system with semantic aliases and CSS custom properties
// Provides a comprehensive design system foundation

import { wrapInLayer } from "./css-layers.ts";

/**
 * Design Token Categories
 */
export interface DesignTokens {
  readonly space: Record<string, string>;
  readonly color: Record<string, string>;
  readonly surface: Record<string, string>;
  readonly typography: Record<string, string>;
  readonly radius: Record<string, string>;
  readonly shadow: Record<string, string>;
  readonly animation: Record<string, string>;
  readonly size: Record<string, string>;
  readonly container: Record<string, string>; // NEW
  readonly zIndex: Record<string, string>; // NEW
}

/**
 * Core Design Tokens
 * Based on modern design system principles with semantic naming
 */
export const DESIGN_TOKENS: DesignTokens = {
  // Spatial system using golden ratio and consistent rhythm
  space: {
    "0": "0",
    "px": "1px",
    "1": "0.25rem", // 4px
    "2": "0.5rem", // 8px
    "3": "0.75rem", // 12px
    "4": "1rem", // 16px
    "5": "1.25rem", // 20px
    "6": "1.5rem", // 24px
    "8": "2rem", // 32px
    "10": "2.5rem", // 40px
    "12": "3rem", // 48px
    "16": "4rem", // 64px
    "20": "5rem", // 80px
    "24": "6rem", // 96px
    "32": "8rem", // 128px
    "40": "10rem", // 160px
    "48": "12rem", // 192px
    "56": "14rem", // 224px
    "64": "16rem", // 256px
  },

  // Color system with semantic aliases
  color: {
    // Neutral scale (warmer grays for better aesthetics)
    "white": "#ffffff",
    "gray-50": "#fafafa",
    "gray-100": "#f5f5f5",
    "gray-200": "#e5e5e5",
    "gray-300": "#d4d4d4",
    "gray-400": "#a3a3a3",
    "gray-500": "#737373",
    "gray-600": "#525252",
    "gray-700": "#404040",
    "gray-800": "#262626",
    "gray-900": "#171717",
    "gray-950": "#0a0a0a",
    "black": "#000000",

    // Brand colors (refined indigo for sophistication)
    "primary-50": "#eef2ff",
    "primary-100": "#e0e7ff",
    "primary-200": "#c7d2fe",
    "primary-300": "#a5b4fc",
    "primary-400": "#818cf8",
    "primary-500": "#6366f1",
    "primary-600": "#4f46e5",
    "primary-700": "#4338ca",
    "primary-800": "#3730a3",
    "primary-900": "#312e81",
    "primary-950": "#1e1b4b",

    // Semantic colors (with full scale for containers)
    "success-50": "#f0fdf4",
    "success-100": "#dcfce7",
    "success-200": "#bbf7d0",
    "success-300": "#86efac",
    "success-400": "#4ade80",
    "success-500": "#22c55e",
    "success-600": "#16a34a",
    "success-700": "#15803d",
    "success-800": "#166534",
    "success-900": "#14532d",

    "warning-50": "#fffbeb",
    "warning-100": "#fef3c7",
    "warning-200": "#fde68a",
    "warning-300": "#fcd34d",
    "warning-400": "#fbbf24",
    "warning-500": "#f59e0b",
    "warning-600": "#d97706",
    "warning-700": "#b45309",
    "warning-800": "#92400e",
    "warning-900": "#78350f",

    "error-50": "#fef2f2",
    "error-100": "#fee2e2",
    "error-200": "#fecaca",
    "error-300": "#fca5a5",
    "error-400": "#f87171",
    "error-500": "#ef4444",
    "error-600": "#dc2626",
    "error-700": "#b91c1c",
    "error-800": "#991b1b",
    "error-900": "#7f1d1d",

    "info-50": "#f0f9ff",
    "info-100": "#e0f2fe",
    "info-200": "#bae6fd",
    "info-300": "#7dd3fc",
    "info-400": "#38bdf8",
    "info-500": "#0ea5e9",
    "info-600": "#0284c7",
    "info-700": "#0369a1",
    "info-800": "#075985",
    "info-900": "#0c4a6e",
  },

  // Surface colors for better semantic meaning
  surface: {
    "background": "var(--color-white)",
    "foreground": "var(--color-gray-900)",
    "muted": "var(--color-gray-50)",
    "subtle": "var(--color-gray-100)",
    "border": "var(--color-gray-200)",
    "border-strong": "var(--color-gray-300)",
    "accent": "var(--color-primary-500)",
    "accent-subtle": "var(--color-primary-50)",
    "overlay": "rgba(0, 0, 0, 0.5)",
  },

  // Typography scale with fluid sizing
  typography: {
    // Modern font stacks with better character
    "font-sans":
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    "font-display":
      '"Cal Sans", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    "font-mono":
      '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, "Roboto Mono", Consolas, monospace',

    // Refined fluid typography scale (wider range)
    "text-xs": "clamp(0.6875rem, 0.65rem + 0.15vw, 0.75rem)", // 11-12px
    "text-sm": "clamp(0.8125rem, 0.75rem + 0.25vw, 0.875rem)", // 13-14px
    "text-base": "clamp(0.9375rem, 0.85rem + 0.35vw, 1rem)", // 15-16px
    "text-lg": "clamp(1.0625rem, 0.95rem + 0.45vw, 1.125rem)", // 17-18px
    "text-xl": "clamp(1.1875rem, 1.05rem + 0.55vw, 1.25rem)", // 19-20px
    "text-2xl": "clamp(1.4375rem, 1.25rem + 0.75vw, 1.625rem)", // 23-26px
    "text-3xl": "clamp(1.8125rem, 1.5rem + 1.25vw, 2.125rem)", // 29-34px
    "text-4xl": "clamp(2.25rem, 1.75rem + 2vw, 2.875rem)", // 36-46px
    "text-5xl": "clamp(2.875rem, 2.25rem + 2.5vw, 3.75rem)", // 46-60px

    // Extended weight range for better hierarchy
    "weight-light": "300",
    "weight-normal": "400",
    "weight-medium": "500",
    "weight-semibold": "600",
    "weight-bold": "700",
    "weight-extrabold": "800",
    "weight-black": "900",

    "leading-none": "1",
    "leading-tight": "1.25",
    "leading-snug": "1.375",
    "leading-normal": "1.5",
    "leading-relaxed": "1.625",
    "leading-loose": "2",

    "tracking-tighter": "-0.05em",
    "tracking-tight": "-0.025em",
    "tracking-normal": "0em",
    "tracking-wide": "0.025em",
    "tracking-wider": "0.05em",
    "tracking-widest": "0.1em",
  },

  // Border radius with semantic names (refined for modern look)
  radius: {
    "none": "0",
    "xs": "0.125rem", // 2px - NEW for very subtle rounding
    "sm": "0.25rem", // 4px
    "base": "0.375rem", // 6px
    "md": "0.5rem", // 8px
    "lg": "0.75rem", // 12px
    "xl": "1rem", // 16px
    "2xl": "1.25rem", // 20px - slightly larger for drama
    "3xl": "1.5rem", // 24px
    "full": "9999px",
  },

  // Elevation system using refined shadows with subtle depth
  shadow: {
    "none": "none",
    // Refined shadows (lighter, more natural)
    "xs": "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 1px 0 rgba(0, 0, 0, 0.02)",
    "sm": "0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
    "base": "0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.06)",
    "md": "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)",
    "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.06)",
    "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.06)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.2)",

    // Colored shadows for emphasis (NEW)
    "primary": "0 4px 14px 0 rgba(99, 102, 241, 0.2)",
    "success": "0 4px 14px 0 rgba(34, 197, 94, 0.2)",
    "warning": "0 4px 14px 0 rgba(245, 158, 11, 0.2)",
    "error": "0 4px 14px 0 rgba(239, 68, 68, 0.2)",

    // Inner shadows
    "inner-sm": "inset 0 1px 2px 0 rgba(0, 0, 0, 0.04)",
    "inner": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",

    // Refined focus rings (NEW double-layer effect)
    "focus": "0 0 0 3px rgba(99, 102, 241, 0.12), 0 0 0 1px rgba(99, 102, 241, 0.4)",
    "focus-error": "0 0 0 3px rgba(239, 68, 68, 0.12), 0 0 0 1px rgba(239, 68, 68, 0.4)",
    "focus-success": "0 0 0 3px rgba(34, 197, 94, 0.12), 0 0 0 1px rgba(34, 197, 94, 0.4)",
  },

  // Animation tokens with refined timing and spring-like easings
  animation: {
    // Refined duration scale
    "duration-instant": "50ms", // NEW - micro-feedback
    "duration-fast": "150ms",
    "duration-normal": "250ms",
    "duration-slow": "350ms",
    "duration-slower": "500ms",
    "duration-slowest": "750ms", // NEW - dramatic effects

    // Spring-like easings for natural motion
    "ease-linear": "linear",
    "ease-out": "cubic-bezier(0.16, 1, 0.3, 1)", // Smoother deceleration
    "ease-in": "cubic-bezier(0.4, 0, 1, 1)",
    "ease-in-out": "cubic-bezier(0.65, 0, 0.35, 1)", // More refined
    "ease-spring": "cubic-bezier(0.68, -0.55, 0.265, 1.55)", // Bouncy
    "ease-smooth": "cubic-bezier(0.4, 0, 0.2, 1)", // Default smooth
  },

  // Sizing tokens for consistent component dimensions
  size: {
    "button-xs": "1.5rem", // 24px
    "button-sm": "2rem", // 32px
    "button-md": "2.5rem", // 40px
    "button-lg": "3rem", // 48px
    "button-xl": "3.5rem", // 56px

    "input-sm": "2rem", // 32px
    "input-md": "2.5rem", // 40px
    "input-lg": "3rem", // 48px

    "icon-xs": "0.75rem", // 12px
    "icon-sm": "1rem", // 16px
    "icon-md": "1.25rem", // 20px
    "icon-lg": "1.5rem", // 24px
    "icon-xl": "2rem", // 32px
  },

  // Container widths for better content layout (NEW)
  container: {
    "xs": "20rem", // 320px
    "sm": "24rem", // 384px
    "md": "28rem", // 448px
    "lg": "32rem", // 512px
    "xl": "36rem", // 576px
    "2xl": "42rem", // 672px
    "3xl": "48rem", // 768px
    "4xl": "56rem", // 896px
    "5xl": "64rem", // 1024px
    "6xl": "72rem", // 1152px
    "7xl": "80rem", // 1280px
    "prose": "65ch", // Optimal reading width
  },

  // Z-index scale for clear stacking order (NEW)
  zIndex: {
    "base": "0",
    "dropdown": "1000",
    "sticky": "1100",
    "fixed": "1200",
    "overlay": "1300",
    "modal": "1400",
    "popover": "1500",
    "tooltip": "1600",
    "toast": "1700",
  },
} as const;

/**
 * Generate CSS custom properties from design tokens
 */
export function generateTokenCSS(): string {
  const tokenDeclarations: string[] = [];

  Object.entries(DESIGN_TOKENS).forEach(([category, tokens]) => {
    Object.entries(tokens).forEach(([key, value]) => {
      tokenDeclarations.push(`--${category}-${key}: ${value};`);
    });
  });

  const css = `:root {
  ${tokenDeclarations.join("\n  ")}
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --surface-background: var(--color-gray-900);
    --surface-foreground: var(--color-gray-50);
    --surface-muted: var(--color-gray-800);
    --surface-subtle: var(--color-gray-700);
    --surface-border: var(--color-gray-600);
    --surface-border-strong: var(--color-gray-500);
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --surface-border: var(--color-gray-900);
    --shadow-focus: 0 0 0 3px var(--color-primary-400);
  }
}`;

  return wrapInLayer("tokens", css);
}

/**
 * Utility function to reference design tokens
 */
export function token(category: keyof DesignTokens, key: string): string {
  return `var(--${category}-${key})`;
}

/**
 * Create semantic aliases for common token combinations
 */
export const SEMANTIC_TOKENS = {
  // Interactive states
  "interactive-bg": token("color", "primary-500"),
  "interactive-bg-hover": token("color", "primary-600"),
  "interactive-bg-active": token("color", "primary-700"),
  "interactive-border": token("color", "primary-300"),
  "interactive-text": token("color", "white"),

  // Content hierarchy
  "content-primary": token("surface", "foreground"),
  "content-secondary": token("color", "gray-600"),
  "content-tertiary": token("color", "gray-500"),
  "content-disabled": token("color", "gray-400"),

  // Feedback states
  "feedback-success": token("color", "success-500"),
  "feedback-warning": token("color", "warning-500"),
  "feedback-error": token("color", "error-500"),
  "feedback-info": token("color", "info-500"),

  // Layout spacing
  "layout-gap-sm": token("space", "2"),
  "layout-gap-md": token("space", "4"),
  "layout-gap-lg": token("space", "6"),
  "layout-padding-sm": token("space", "3"),
  "layout-padding-md": token("space", "4"),
  "layout-padding-lg": token("space", "6"),
} as const;

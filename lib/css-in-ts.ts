// CSS-in-TypeScript implementation for ui-lib
// Provides type-safe styling with IntelliSense and theme support

import type {
  CSSProperties,
  MediaQueries,
  PseudoSelectors,
  StyleMap,
  StyleObject,
  ThemeTokens,
} from "./css-types.ts";
import { defaultBreakpoints } from "./css-types.ts";

/**
 * Convert a StyleObject to CSS string
 */
function styleObjectToCSS(styles: StyleObject, selector: string): string {
  const rules: string[] = [];
  const baseStyles: Record<string, string> = {};
  const pseudoStyles: Record<string, StyleObject> = {};
  const mediaStyles: Record<string, StyleObject> = {};

  // Separate base styles, pseudo-selectors, and media queries
  for (const [key, value] of Object.entries(styles)) {
    if (key.startsWith("&:") || key.startsWith("&::")) {
      pseudoStyles[key] = value as StyleObject;
    } else if (key === "@media") {
      const mediaQueries = value as MediaQueries["@media"];
      if (mediaQueries) {
        for (
          const [breakpoint, breakpointStyles] of Object.entries(mediaQueries)
        ) {
          if (breakpointStyles) {
            mediaStyles[breakpoint] = breakpointStyles;
          }
        }
      }
    } else if (value !== undefined) {
      baseStyles[key] = formatCSSValue(key, value);
    }
  }

  // Generate base CSS rule
  if (Object.keys(baseStyles).length > 0) {
    const declarations = Object.entries(baseStyles)
      .map(([prop, val]) => `${kebabCase(prop)}: ${val};`)
      .join(" ");
    rules.push(`.${selector} { ${declarations} }`);
  }

  // Generate pseudo-selector rules
  for (const [pseudo, pseudoStyle] of Object.entries(pseudoStyles)) {
    const pseudoSelector = pseudo.replace("&", `.${selector}`);
    const declarations = styleObjectToDeclarations(pseudoStyle);
    if (declarations) {
      rules.push(`${pseudoSelector} { ${declarations} }`);
    }
  }

  // Generate media query rules
  for (const [breakpoint, breakpointStyles] of Object.entries(mediaStyles)) {
    const mediaQuery = getBreakpointQuery(breakpoint);
    const mediaRules = styleObjectToCSS(breakpointStyles, selector);
    if (mediaRules) {
      rules.push(`@media ${mediaQuery} { ${mediaRules} }`);
    }
  }

  return rules.join(" ");
}

/**
 * Convert style object to CSS declarations (for internal use)
 */
function styleObjectToDeclarations(styles: StyleObject): string {
  const declarations: string[] = [];

  for (const [key, value] of Object.entries(styles)) {
    if (!key.startsWith("&") && key !== "@media" && value !== undefined) {
      declarations.push(`${kebabCase(key)}: ${formatCSSValue(key, value)};`);
    }
  }

  return declarations.join(" ");
}

/**
 * Format CSS value with proper units and conversions
 */
function formatCSSValue(property: string, value: unknown): string {
  if (typeof value === "number") {
    // Add 'px' to numeric values for properties that need units
    const unitlessProperties = [
      "opacity",
      "flexGrow",
      "flexShrink",
      "fontWeight",
      "lineHeight",
      "order",
      "zIndex",
      "animationIterationCount",
    ];

    if (unitlessProperties.includes(property)) {
      return String(value);
    }

    // Default to px for other numeric values
    return `${value}px`;
  }

  return String(value);
}

/**
 * Convert camelCase to kebab-case
 */
function kebabCase(str: string): string {
  // Handle CSS custom properties (already kebab-cased)
  if (str.startsWith("--")) {
    return str;
  }

  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/^ms-/, "-ms-") // Handle vendor prefix
    .toLowerCase();
}

/**
 * Get media query string for a breakpoint
 */
function getBreakpointQuery(breakpoint: string): string {
  // Check default breakpoints
  if (breakpoint in defaultBreakpoints) {
    return defaultBreakpoints[breakpoint as keyof typeof defaultBreakpoints];
  }

  // Allow custom media query strings
  if (breakpoint.startsWith("(") && breakpoint.endsWith(")")) {
    return breakpoint;
  }

  // Default to min-width for unknown breakpoints
  return `(min-width: ${breakpoint})`;
}

/**
 * Main CSS function for creating type-safe styles
 */
export function css(
  styles: Record<string, StyleObject>,
): { classMap: Record<string, string>; css: string } {
  const classMap: Record<string, string> = {};
  const cssRules: string[] = [];

  for (const [key, styleObject] of Object.entries(styles)) {
    // Generate unique class name
    const className = generateClassName(key);
    classMap[key] = className;

    // Generate CSS for this class
    const cssRule = styleObjectToCSS(styleObject, className);
    if (cssRule) {
      cssRules.push(cssRule);
    }
  }

  return {
    classMap,
    css: cssRules.join("\n    "),
  };
}

/**
 * Generate a unique class name from a key
 */
function generateClassName(key: string): string {
  // Simple hash function for generating unique suffixes
  const hash = key
    .split("")
    .reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0);

  const suffix = Math.abs(hash).toString(36).slice(0, 5);
  return `${kebabCase(key)}-${suffix}`;
}

/**
 * Create theme-aware CSS with token replacements
 */
export function createTheme(tokens: ThemeTokens): {
  vars: () => string;
  token: (category: keyof ThemeTokens, key: string | number) => string;
} {
  // Generate CSS custom properties from tokens
  const vars = () => {
    const properties: string[] = [];

    for (const [category, values] of Object.entries(tokens)) {
      if (values && typeof values === "object") {
        for (const [key, value] of Object.entries(values)) {
          properties.push(`--${category}-${key}: ${value};`);
        }
      }
    }

    return `:root { ${properties.join(" ")} }`;
  };

  // Helper to reference tokens
  const token = (category: keyof ThemeTokens, key: string | number): string => {
    return `var(--${category}-${key})`;
  };

  return { vars, token };
}

/**
 * Utility functions for common patterns
 */
export const cssHelpers = {
  /**
   * Center content using flexbox
   */
  center: (): CSSProperties => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }),

  /**
   * Absolute position covering parent
   */
  cover: (): CSSProperties => ({
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }),

  /**
   * Truncate text with ellipsis
   */
  truncate: (): CSSProperties => ({
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }),

  /**
   * Hide element visually but keep for screen readers
   */
  visuallyHidden: (): CSSProperties => ({
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
  }),

  /**
   * Reset button styles
   */
  resetButton: (): CSSProperties => ({
    background: "none",
    border: "none",
    padding: 0,
    margin: 0,
    font: "inherit",
    color: "inherit",
    cursor: "pointer",
  }),

  /**
   * Container with responsive padding
   */
  container: (maxWidth: string = "1200px"): CSSProperties => ({
    width: "100%",
    maxWidth,
    marginLeft: "auto",
    marginRight: "auto",
    paddingLeft: "1rem",
    paddingRight: "1rem",
  }),
};

/**
 * Type-safe style composition
 */
export function composeStyles(
  ...styles: (CSSProperties | undefined)[]
): CSSProperties {
  return Object.assign({}, ...styles.filter(Boolean));
}

/**
 * Create responsive style values
 */
export function responsive<T>(values: {
  base?: T;
  mobile?: T;
  tablet?: T;
  desktop?: T;
  wide?: T;
}): StyleObject {
  const { base, ...breakpoints } = values;

  const result: StyleObject = base ? (base as any) : {};

  if (Object.keys(breakpoints).length > 0) {
    result["@media"] = breakpoints as any;
  }

  return result;
}

/**
 * Export types for external use
 */
export type {
  CSSProperties,
  StyleMap,
  StyleObject,
  ThemeTokens,
} from "./css-types.ts";

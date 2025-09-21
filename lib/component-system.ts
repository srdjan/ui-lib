// Component Design System with clear public/private API boundaries
// Establishes semantic component classes and variant system

import {
  cssUtils,
  modernCSS,
  type ModernStyleObject,
  responsiveComponent,
} from "./modern-css-system.ts";
import { SEMANTIC_TOKENS, token } from "./styles/design-tokens.ts";
import { createComponent } from "./styles/css-layers.ts";

/**
 * Public Component API
 * These are the semantic classes exposed to developers
 */
export interface ComponentAPI {
  // Layout Components
  readonly card: ComponentConfig;
  readonly stack: ComponentConfig;
  readonly cluster: ComponentConfig;
  readonly center: ComponentConfig;
  readonly sidebar: ComponentConfig;
  readonly switcher: ComponentConfig;

  // Interactive Components
  readonly button: ComponentConfig;
  readonly input: ComponentConfig;
  readonly select: ComponentConfig;
  readonly checkbox: ComponentConfig;
  readonly radio: ComponentConfig;

  // Feedback Components
  readonly alert: ComponentConfig;
  readonly badge: ComponentConfig;
  readonly progress: ComponentConfig;
  readonly toast: ComponentConfig;

  // Navigation Components
  readonly toolbar: ComponentConfig;
  readonly menu: ComponentConfig;
  readonly breadcrumb: ComponentConfig;

  // Content Components
  readonly prose: ComponentConfig;
  readonly table: ComponentConfig;
  readonly code: ComponentConfig;
}

/**
 * Component Configuration
 */
export interface ComponentConfig {
  readonly baseStyles: ModernStyleObject;
  readonly variants?: Record<string, ModernStyleObject>;
  readonly sizes?: Record<string, ModernStyleObject>;
  readonly states?: Record<string, ModernStyleObject>;
  readonly container?: boolean;
}

/**
 * Variant Attributes
 */
export type VariantAttribute = `data-variant`;
export type SizeAttribute = `data-size`;
export type StateAttribute = `data-state`;
export type ToneAttribute = `data-tone`;

/**
 * Component Size System
 */
export const COMPONENT_SIZES = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
} as const;

export type ComponentSize = keyof typeof COMPONENT_SIZES;

/**
 * Component Tone System (for semantic variants)
 */
export const COMPONENT_TONES = {
  neutral: "neutral",
  primary: "primary",
  success: "success",
  warning: "warning",
  error: "error",
  info: "info",
} as const;

export type ComponentTone = keyof typeof COMPONENT_TONES;

/**
 * Design System Components
 */
export const DESIGN_SYSTEM: ComponentAPI = {
  // Layout Components
  card: {
    baseStyles: {
      backgroundColor: token("surface", "background"),
      border: `1px solid ${token("surface", "border")}`,
      borderRadius: token("radius", "lg"),
      boxShadow: token("shadow", "sm"),
      padding: token("space", "6"),
      containerType: "inline-size",

      "&:hover": {
        boxShadow: token("shadow", "md"),
        borderColor: token("surface", "border-strong"),
      },

      "@container": {
        "(min-width: 300px)": {
          padding: token("space", "8"),
        },
      },

      "@media": {
        "reduced-motion": {
          transition: "none",
        },
      },
    },
    variants: {
      elevated: {
        boxShadow: token("shadow", "lg"),
        border: "none",
      },
      outlined: {
        boxShadow: "none",
        borderWidth: "2px",
      },
      filled: {
        backgroundColor: token("surface", "muted"),
        border: "none",
        boxShadow: "none",
      },
    },
    container: true,
  },

  stack: {
    baseStyles: {
      display: "flex",
      flexDirection: "column",
      gap: token("space", "4"),
      alignItems: "stretch",
    },
    sizes: {
      sm: { gap: token("space", "2") },
      md: { gap: token("space", "4") },
      lg: { gap: token("space", "6") },
      xl: { gap: token("space", "8") },
    },
  },

  cluster: {
    baseStyles: {
      display: "flex",
      flexWrap: "wrap",
      gap: token("space", "4"),
      alignItems: "center",
      justifyContent: "flex-start",
    },
    sizes: {
      sm: { gap: token("space", "2") },
      md: { gap: token("space", "4") },
      lg: { gap: token("space", "6") },
    },
    variants: {
      center: { justifyContent: "center" },
      end: { justifyContent: "flex-end" },
      between: { justifyContent: "space-between" },
      around: { justifyContent: "space-around" },
    },
  },

  center: {
    baseStyles: {
      marginInline: "auto",
      maxInlineSize: "60ch",
      paddingInline: token("space", "4"),
      boxSizing: "content-box",

      "@container": {
        "(min-width: 768px)": {
          paddingInline: token("space", "6"),
        },
      },
    },
    sizes: {
      sm: { maxInlineSize: "40ch" },
      md: { maxInlineSize: "60ch" },
      lg: { maxInlineSize: "80ch" },
      xl: { maxInlineSize: "100ch" },
    },
  },

  sidebar: {
    baseStyles: {
      display: "flex",
      flexWrap: "wrap",
      gap: token("space", "4"),
      alignItems: "stretch",

      "> :first-child": {
        flexBasis: "20rem",
        flexGrow: 1,
      },

      "> :last-child": {
        flexBasis: "0",
        flexGrow: 999,
        minInlineSize: "50%",
      },
    },
    variants: {
      reverse: {
        flexDirection: "row-reverse",
      },
    },
  },

  switcher: {
    baseStyles: {
      display: "flex",
      flexWrap: "wrap",
      gap: token("space", "4"),

      "> *": {
        flexGrow: 1,
        flexBasis: "calc((30rem - 100%) * 999)",
      },
    },
    sizes: {
      sm: { "> *": { flexBasis: "calc((20rem - 100%) * 999)" } },
      md: { "> *": { flexBasis: "calc((30rem - 100%) * 999)" } },
      lg: { "> *": { flexBasis: "calc((40rem - 100%) * 999)" } },
    },
  },

  // Interactive Components
  button: {
    baseStyles: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: token("space", "2"),
      padding: `${token("space", "2")} ${token("space", "4")}`,
      borderRadius: token("radius", "md"),
      border: "1px solid transparent",
      fontSize: token("typography", "text-sm"),
      fontWeight: token("typography", "weight-medium"),
      lineHeight: token("typography", "leading-tight"),
      textDecoration: "none",
      userSelect: "none",
      cursor: "pointer",
      transition: `all ${token("animation", "duration-normal")} ${
        token("animation", "ease-out")
      }`,
      contain: "layout style paint",

      ...cssUtils.focusVisible({
        boxShadow: token("shadow", "focus"),
      }),

      '&:disabled, &[aria-disabled="true"]': {
        opacity: 0.6,
        cursor: "not-allowed",
        pointerEvents: "none",
      },

      "@media": {
        "reduced-motion": {
          transition: "none",
        },
      },
    },
    variants: {
      primary: {
        backgroundColor: SEMANTIC_TOKENS["interactive-bg"],
        color: SEMANTIC_TOKENS["interactive-text"],

        "&:hover:not(:disabled)": {
          backgroundColor: SEMANTIC_TOKENS["interactive-bg-hover"],
        },

        "&:active:not(:disabled)": {
          backgroundColor: SEMANTIC_TOKENS["interactive-bg-active"],
        },
      },
      secondary: {
        backgroundColor: token("surface", "muted"),
        color: token("surface", "foreground"),

        "&:hover:not(:disabled)": {
          backgroundColor: token("color", "gray-200"),
        },
      },
      outline: {
        backgroundColor: "transparent",
        borderColor: token("surface", "border-strong"),
        color: token("surface", "foreground"),

        "&:hover:not(:disabled)": {
          backgroundColor: token("surface", "muted"),
        },
      },
      ghost: {
        backgroundColor: "transparent",
        color: token("surface", "foreground"),

        "&:hover:not(:disabled)": {
          backgroundColor: token("surface", "muted"),
        },
      },
      link: {
        backgroundColor: "transparent",
        color: SEMANTIC_TOKENS["interactive-bg"],
        padding: 0,
        height: "auto",
        textDecoration: "underline",

        "&:hover:not(:disabled)": {
          color: SEMANTIC_TOKENS["interactive-bg-hover"],
        },
      },
    },
    sizes: {
      xs: {
        padding: `${token("space", "1")} ${token("space", "2")}`,
        fontSize: token("typography", "text-xs"),
        height: token("size", "button-xs"),
      },
      sm: {
        padding: `${token("space", "1.5")} ${token("space", "3")}`,
        fontSize: token("typography", "text-xs"),
        height: token("size", "button-sm"),
      },
      md: {
        padding: `${token("space", "2")} ${token("space", "4")}`,
        fontSize: token("typography", "text-sm"),
        height: token("size", "button-md"),
      },
      lg: {
        padding: `${token("space", "2.5")} ${token("space", "5")}`,
        fontSize: token("typography", "text-base"),
        height: token("size", "button-lg"),
      },
      xl: {
        padding: `${token("space", "3")} ${token("space", "6")}`,
        fontSize: token("typography", "text-lg"),
        height: token("size", "button-xl"),
      },
    },
    states: {
      loading: {
        opacity: 0.8,
        cursor: "wait",
      },
    },
  },

  // Feedback Components
  alert: {
    baseStyles: {
      position: "relative",
      padding: token("space", "4"),
      borderRadius: token("radius", "md"),
      border: "1px solid",
      fontSize: token("typography", "text-sm"),
      lineHeight: token("typography", "leading-normal"),

      "& [data-alert-icon]": {
        marginInlineEnd: token("space", "3"),
        flexShrink: 0,
      },

      "& [data-alert-title]": {
        fontWeight: token("typography", "weight-semibold"),
        marginBlockEnd: token("space", "1"),
      },
    },
    variants: {
      info: {
        backgroundColor: token("color", "info-50"),
        borderColor: token("color", "info-200"),
        color: token("color", "info-900"),
      },
      success: {
        backgroundColor: token("color", "success-50"),
        borderColor: token("color", "success-200"),
        color: token("color", "success-900"),
      },
      warning: {
        backgroundColor: token("color", "warning-50"),
        borderColor: token("color", "warning-200"),
        color: token("color", "warning-900"),
      },
      error: {
        backgroundColor: token("color", "error-50"),
        borderColor: token("color", "error-200"),
        color: token("color", "error-900"),
      },
    },
  },

  badge: {
    baseStyles: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: token("typography", "text-xs"),
      fontWeight: token("typography", "weight-medium"),
      lineHeight: token("typography", "leading-none"),
      borderRadius: token("radius", "full"),
      padding: `${token("space", "1")} ${token("space", "2")}`,
      textTransform: "uppercase",
      letterSpacing: token("typography", "tracking-wide"),
    },
    variants: {
      neutral: {
        backgroundColor: token("color", "gray-100"),
        color: token("color", "gray-800"),
      },
      primary: {
        backgroundColor: token("color", "primary-100"),
        color: token("color", "primary-800"),
      },
      success: {
        backgroundColor: token("color", "success-100"),
        color: token("color", "success-800"),
      },
      warning: {
        backgroundColor: token("color", "warning-100"),
        color: token("color", "warning-800"),
      },
      error: {
        backgroundColor: token("color", "error-100"),
        color: token("color", "error-800"),
      },
    },
  },

  // Navigation Components
  toolbar: {
    baseStyles: {
      display: "flex",
      alignItems: "center",
      gap: token("space", "2"),
      padding: `${token("space", "2")} ${token("space", "4")}`,
      backgroundColor: token("surface", "background"),
      borderBottom: `1px solid ${token("surface", "border")}`,
    },
    variants: {
      elevated: {
        boxShadow: token("shadow", "sm"),
        borderBottom: "none",
      },
    },
  },

  // Content Components
  prose: {
    baseStyles: {
      maxInlineSize: "65ch",
      fontSize: token("typography", "text-base"),
      lineHeight: token("typography", "leading-relaxed"),
      color: token("surface", "foreground"),

      "& h1, & h2, & h3, & h4, & h5, & h6": {
        fontWeight: token("typography", "weight-bold"),
        lineHeight: token("typography", "leading-tight"),
        marginBlockStart: token("space", "8"),
        marginBlockEnd: token("space", "4"),
      },

      "& h1": { fontSize: token("typography", "text-3xl") },
      "& h2": { fontSize: token("typography", "text-2xl") },
      "& h3": { fontSize: token("typography", "text-xl") },
      "& h4": { fontSize: token("typography", "text-lg") },

      "& p": {
        marginBlockEnd: token("space", "4"),
      },

      "& ul, & ol": {
        marginBlockEnd: token("space", "4"),
        paddingInlineStart: token("space", "6"),
      },

      "& li": {
        marginBlockEnd: token("space", "1"),
      },

      "& a": {
        color: SEMANTIC_TOKENS["interactive-bg"],
        textDecoration: "underline",

        "&:hover": {
          color: SEMANTIC_TOKENS["interactive-bg-hover"],
        },
      },

      "& code": {
        backgroundColor: token("surface", "muted"),
        padding: `${token("space", "0.5")} ${token("space", "1")}`,
        borderRadius: token("radius", "sm"),
        fontSize: "0.9em",
        fontFamily: token("typography", "font-mono"),
      },

      "& pre": {
        backgroundColor: token("surface", "muted"),
        padding: token("space", "4"),
        borderRadius: token("radius", "md"),
        overflow: "auto",
        fontSize: token("typography", "text-sm"),
        fontFamily: token("typography", "font-mono"),
        marginBlockEnd: token("space", "6"),
      },

      "& blockquote": {
        borderInlineStart: `4px solid ${token("surface", "border-strong")}`,
        paddingInlineStart: token("space", "4"),
        fontStyle: "italic",
        color: token("color", "gray-600"),
        marginBlockEnd: token("space", "6"),
      },
    },
  },

  // Placeholder implementations for other components
  input: { baseStyles: {} },
  select: { baseStyles: {} },
  checkbox: { baseStyles: {} },
  radio: { baseStyles: {} },
  progress: { baseStyles: {} },
  toast: { baseStyles: {} },
  menu: { baseStyles: {} },
  breadcrumb: { baseStyles: {} },
  table: { baseStyles: {} },
  code: { baseStyles: {} },
};

/**
 * Generate component system CSS
 */
export function generateComponentCSS(): string {
  const componentCSS: string[] = [];

  for (const [componentName, config] of Object.entries(DESIGN_SYSTEM)) {
    const baseCSS = generateComponentBaseCSS(componentName, config);
    componentCSS.push(baseCSS);

    if (config.variants) {
      const variantCSS = generateVariantCSS(componentName, config.variants);
      componentCSS.push(variantCSS);
    }

    if (config.sizes) {
      const sizeCSS = generateSizeCSS(componentName, config.sizes);
      componentCSS.push(sizeCSS);
    }

    if (config.states) {
      const stateCSS = generateStateCSS(componentName, config.states);
      componentCSS.push(stateCSS);
    }
  }

  return componentCSS.join("\n\n");
}

/**
 * Generate base component CSS
 */
function generateComponentBaseCSS(
  name: string,
  config: ComponentConfig,
): string {
  const { css } = modernCSS({
    layer: "components",
    container: config.container ? { name, type: "inline-size" } : undefined,
    styles: {
      [name]: config.baseStyles,
    },
  });

  return css;
}

/**
 * Generate variant CSS
 */
function generateVariantCSS(
  componentName: string,
  variants: Record<string, ModernStyleObject>,
): string {
  const variantRules: string[] = [];

  for (const [variantName, styles] of Object.entries(variants)) {
    const { css } = modernCSS({
      layer: "components",
      styles: {
        [`${componentName}[data-variant="${variantName}"]`]: styles,
      },
    });
    variantRules.push(css);
  }

  return variantRules.join("\n\n");
}

/**
 * Generate size CSS
 */
function generateSizeCSS(
  componentName: string,
  sizes: Record<string, ModernStyleObject>,
): string {
  const sizeRules: string[] = [];

  for (const [sizeName, styles] of Object.entries(sizes)) {
    const { css } = modernCSS({
      layer: "components",
      styles: {
        [`${componentName}[data-size="${sizeName}"]`]: styles,
      },
    });
    sizeRules.push(css);
  }

  return sizeRules.join("\n\n");
}

/**
 * Generate state CSS
 */
function generateStateCSS(
  componentName: string,
  states: Record<string, ModernStyleObject>,
): string {
  const stateRules: string[] = [];

  for (const [stateName, styles] of Object.entries(states)) {
    const { css } = modernCSS({
      layer: "components",
      styles: {
        [`${componentName}[data-state="${stateName}"]`]: styles,
      },
    });
    stateRules.push(css);
  }

  return stateRules.join("\n\n");
}

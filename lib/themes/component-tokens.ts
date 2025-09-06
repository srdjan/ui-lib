// Design tokens for ui-lib component library
// Provides consistent spacing, colors, and sizing across all components

export const componentTokens = {
  // Color palette
  colors: {
    // Primary colors
    primary: {
      50: "var(--blue-0)",
      100: "var(--blue-1)",
      200: "var(--blue-2)",
      300: "var(--blue-3)",
      400: "var(--blue-5)",
      500: "var(--blue-6)",
      600: "var(--blue-7)",
      700: "var(--blue-8)",
      800: "var(--blue-9)",
      900: "var(--blue-10)",
      950: "var(--blue-11)",
    },

    // Semantic colors
    success: {
      50: "var(--green-0)",
      100: "var(--green-1)",
      200: "var(--green-2)",
      300: "var(--green-3)",
      400: "var(--green-5)",
      500: "var(--green-6)",
      600: "var(--green-7)",
      700: "var(--green-8)",
      800: "var(--green-9)",
      900: "var(--green-10)",
    },

    warning: {
      50: "var(--yellow-0)",
      100: "var(--yellow-1)",
      200: "var(--yellow-2)",
      300: "var(--yellow-3)",
      400: "var(--yellow-5)",
      500: "var(--yellow-6)",
      600: "var(--yellow-7)",
      700: "var(--yellow-8)",
      800: "var(--yellow-9)",
      900: "var(--yellow-10)",
    },

    error: {
      50: "var(--red-0)",
      100: "var(--red-1)",
      200: "var(--red-2)",
      300: "var(--red-3)",
      400: "var(--red-5)",
      500: "var(--red-6)",
      600: "var(--red-7)",
      700: "var(--red-8)",
      800: "var(--red-9)",
      900: "var(--red-10)",
    },

    // Neutral colors
    gray: {
      50: "var(--gray-50)",
      100: "var(--gray-100)",
      200: "var(--gray-200)",
      300: "var(--gray-300)",
      400: "var(--gray-400)",
      500: "var(--gray-500)",
      600: "var(--gray-600)",
      700: "var(--gray-700)",
      800: "var(--gray-800)",
      900: "var(--gray-900)",
      950: "var(--gray-950)",
    },

    // Surface colors
    surface: {
      background: "var(--gray-0)",
      foreground: "var(--gray-900)",
      muted: "var(--gray-50)",
      border: "var(--gray-200)",
      input: "var(--gray-0)",
      overlay: "rgba(0, 0, 0, 0.5)",
    },
  },

  // Typography scale
  typography: {
    sizes: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
    },

    weights: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
    },

    lineHeights: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.625",
    },

    letterSpacing: {
      tight: "-0.025em",
      normal: "0em",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
    },
  },

  // Spacing scale (consistent with Tailwind)
  spacing: {
    0: "0",
    px: "1px",
    0.5: "0.125rem", // 2px
    1: "0.25rem", // 4px
    1.5: "0.375rem", // 6px
    2: "0.5rem", // 8px
    2.5: "0.625rem", // 10px
    3: "0.75rem", // 12px
    3.5: "0.875rem", // 14px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    7: "1.75rem", // 28px
    8: "2rem", // 32px
    9: "2.25rem", // 36px
    10: "2.5rem", // 40px
    11: "2.75rem", // 44px
    12: "3rem", // 48px
    14: "3.5rem", // 56px
    16: "4rem", // 64px
    20: "5rem", // 80px
    24: "6rem", // 96px
    32: "8rem", // 128px
  },

  // Border radius scale
  radius: {
    none: "0",
    sm: "0.125rem", // 2px
    base: "0.25rem", // 4px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    "2xl": "1rem", // 16px
    "3xl": "1.5rem", // 24px
    full: "9999px",
  },

  // Shadow scale
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    lg:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
    xl:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
    none: "none",
  },

  // Animation & transition
  animation: {
    duration: {
      fast: "150ms",
      normal: "250ms",
      slow: "350ms",
    },

    easing: {
      linear: "linear",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },

  // Component-specific tokens
  component: {
    button: {
      height: {
        xs: "1.5rem", // 24px
        sm: "2rem", // 32px
        md: "2.5rem", // 40px
        lg: "3rem", // 48px
        xl: "3.5rem", // 56px
      },
      padding: {
        xs: "0.25rem 0.5rem",
        sm: "0.375rem 0.75rem",
        md: "0.5rem 1rem",
        lg: "0.625rem 1.25rem",
        xl: "0.75rem 1.5rem",
      },
    },

    input: {
      height: {
        sm: "2rem", // 32px
        md: "2.5rem", // 40px
        lg: "3rem", // 48px
      },
      padding: {
        sm: "0.375rem 0.75rem",
        md: "0.5rem 0.75rem",
        lg: "0.75rem 1rem",
      },
    },
  },
} as const;

// Type helpers for consuming tokens
export type ColorToken = keyof typeof componentTokens.colors;
export type SpacingToken = keyof typeof componentTokens.spacing;
export type RadiusToken = keyof typeof componentTokens.radius;
export type ShadowToken = keyof typeof componentTokens.shadows;

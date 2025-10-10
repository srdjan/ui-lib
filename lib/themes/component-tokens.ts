// Design tokens for ui-lib component library
// Provides consistent spacing, colors, and sizing across all components

export const componentTokens = {
  // Color palette
  colors: {
    // Primary colors (refined indigo)
    primary: {
      50: "var(--color-primary-50)",
      100: "var(--color-primary-100)",
      200: "var(--color-primary-200)",
      300: "var(--color-primary-300)",
      400: "var(--color-primary-400)",
      500: "var(--color-primary-500)",
      600: "var(--color-primary-600)",
      700: "var(--color-primary-700)",
      800: "var(--color-primary-800)",
      900: "var(--color-primary-900)",
      950: "var(--color-primary-950)",
    },

    // Semantic colors (full scales for containers)
    success: {
      50: "var(--color-success-50)",
      100: "var(--color-success-100)",
      200: "var(--color-success-200)",
      300: "var(--color-success-300)",
      400: "var(--color-success-400)",
      500: "var(--color-success-500)",
      600: "var(--color-success-600)",
      700: "var(--color-success-700)",
      800: "var(--color-success-800)",
      900: "var(--color-success-900)",
    },

    warning: {
      50: "var(--color-warning-50)",
      100: "var(--color-warning-100)",
      200: "var(--color-warning-200)",
      300: "var(--color-warning-300)",
      400: "var(--color-warning-400)",
      500: "var(--color-warning-500)",
      600: "var(--color-warning-600)",
      700: "var(--color-warning-700)",
      800: "var(--color-warning-800)",
      900: "var(--color-warning-900)",
    },

    error: {
      50: "var(--color-error-50)",
      100: "var(--color-error-100)",
      200: "var(--color-error-200)",
      300: "var(--color-error-300)",
      400: "var(--color-error-400)",
      500: "var(--color-error-500)",
      600: "var(--color-error-600)",
      700: "var(--color-error-700)",
      800: "var(--color-error-800)",
      900: "var(--color-error-900)",
    },

    // Neutral colors (warmer grays)
    gray: {
      50: "var(--color-gray-50)",
      100: "var(--color-gray-100)",
      200: "var(--color-gray-200)",
      300: "var(--color-gray-300)",
      400: "var(--color-gray-400)",
      500: "var(--color-gray-500)",
      600: "var(--color-gray-600)",
      700: "var(--color-gray-700)",
      800: "var(--color-gray-800)",
      900: "var(--color-gray-900)",
      950: "var(--color-gray-950)",
    },

    // Surface colors
    surface: {
      background: "var(--surface-background)",
      foreground: "var(--surface-foreground)",
      muted: "var(--surface-muted)",
      border: "var(--surface-border)",
      input: "var(--surface-background)",
      overlay: "var(--surface-overlay)",
    },
  },

  // Typography scale (fluid sizing)
  typography: {
    sizes: {
      xs: "var(--typography-text-xs)", // Fluid 11-12px
      sm: "var(--typography-text-sm)", // Fluid 13-14px
      base: "var(--typography-text-base)", // Fluid 15-16px
      lg: "var(--typography-text-lg)", // Fluid 17-18px
      xl: "var(--typography-text-xl)", // Fluid 19-20px
      "2xl": "var(--typography-text-2xl)", // Fluid 23-26px
      "3xl": "var(--typography-text-3xl)", // Fluid 29-34px
      "4xl": "var(--typography-text-4xl)", // Fluid 36-46px
      "5xl": "var(--typography-text-5xl)", // Fluid 46-60px
    },

    weights: {
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      black: "900",
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
    xs: "var(--radius-xs)", // 2px
    sm: "var(--radius-sm)", // 4px
    base: "var(--radius-base)", // 6px
    md: "var(--radius-md)", // 8px
    lg: "var(--radius-lg)", // 12px
    xl: "var(--radius-xl)", // 16px
    "2xl": "var(--radius-2xl)", // 20px
    "3xl": "var(--radius-3xl)", // 24px
    full: "var(--radius-full)", // 9999px
  },

  // Shadow scale (refined, lighter)
  shadows: {
    none: "none",
    xs: "var(--shadow-xs)", // Subtle micro-shadow
    sm: "var(--shadow-sm)", // Refined light shadow
    base: "var(--shadow-base)", // Standard elevation
    md: "var(--shadow-md)", // Medium elevation
    lg: "var(--shadow-lg)", // High elevation
    xl: "var(--shadow-xl)", // Very high elevation
    "2xl": "var(--shadow-2xl)", // Dramatic elevation
    inner: "var(--shadow-inner)", // Inner shadow
    innerSm: "var(--shadow-inner-sm)", // Subtle inner shadow
    primary: "var(--shadow-primary)", // Colored shadow - indigo
    success: "var(--shadow-success)", // Colored shadow - green
    warning: "var(--shadow-warning)", // Colored shadow - yellow
    error: "var(--shadow-error)", // Colored shadow - red
    focus: "var(--shadow-focus)", // Focus ring - indigo
    focusError: "var(--shadow-focus-error)", // Focus ring - red
    focusSuccess: "var(--shadow-focus-success)", // Focus ring - green
  },

  // Animation & transition (refined with spring easings)
  animation: {
    duration: {
      instant: "var(--animation-duration-instant)", // 50ms - micro-feedback
      fast: "var(--animation-duration-fast)", // 150ms
      normal: "var(--animation-duration-normal)", // 250ms
      slow: "var(--animation-duration-slow)", // 350ms
      slower: "var(--animation-duration-slower)", // 500ms
      slowest: "var(--animation-duration-slowest)", // 750ms
    },

    easing: {
      linear: "var(--animation-ease-linear)",
      out: "var(--animation-ease-out)", // Smoother deceleration
      in: "var(--animation-ease-in)",
      "in-out": "var(--animation-ease-in-out)", // More refined
      spring: "var(--animation-ease-spring)", // Bouncy, natural
      smooth: "var(--animation-ease-smooth)", // Default smooth
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

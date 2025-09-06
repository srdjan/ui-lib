// Design tokens for ui-lib component library
// Provides consistent spacing, colors, and sizing across all components

export const componentTokens = {
  // Color palette
  colors: {
    // Primary colors
    primary: {
      50: "#eff6ff",
      100: "#dbeafe", 
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6", // Base primary
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
      950: "#172554",
    },
    
    // Semantic colors
    success: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0", 
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e", // Base success
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
    },
    
    warning: {
      50: "#fefce8",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d", 
      400: "#fbbf24",
      500: "#f59e0b", // Base warning
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
    },
    
    error: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171", 
      500: "#ef4444", // Base error
      600: "#dc2626",
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
    },
    
    // Neutral colors
    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280", // Base gray
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
      950: "#030712",
    },
    
    // Surface colors
    surface: {
      background: "#ffffff",
      foreground: "#111827",
      muted: "#f9fafb",
      border: "#e5e7eb",
      input: "#ffffff",
      overlay: "rgba(0, 0, 0, 0.5)",
    }
  },
  
  // Typography scale
  typography: {
    sizes: {
      xs: "0.75rem",    // 12px
      sm: "0.875rem",   // 14px  
      base: "1rem",     // 16px
      lg: "1.125rem",   // 18px
      xl: "1.25rem",    // 20px
      "2xl": "1.5rem",  // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem",  // 36px
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
    }
  },
  
  // Spacing scale (consistent with Tailwind)
  spacing: {
    0: "0",
    px: "1px",
    0.5: "0.125rem",  // 2px
    1: "0.25rem",     // 4px
    1.5: "0.375rem",  // 6px
    2: "0.5rem",      // 8px
    2.5: "0.625rem",  // 10px
    3: "0.75rem",     // 12px
    3.5: "0.875rem",  // 14px
    4: "1rem",        // 16px
    5: "1.25rem",     // 20px
    6: "1.5rem",      // 24px
    7: "1.75rem",     // 28px
    8: "2rem",        // 32px
    9: "2.25rem",     // 36px
    10: "2.5rem",     // 40px
    11: "2.75rem",    // 44px
    12: "3rem",       // 48px
    14: "3.5rem",     // 56px
    16: "4rem",       // 64px
    20: "5rem",       // 80px
    24: "6rem",       // 96px
    32: "8rem",       // 128px
  },
  
  // Border radius scale
  radius: {
    none: "0",
    sm: "0.125rem",   // 2px
    base: "0.25rem",  // 4px
    md: "0.375rem",   // 6px
    lg: "0.5rem",     // 8px
    xl: "0.75rem",    // 12px
    "2xl": "1rem",    // 16px
    "3xl": "1.5rem",  // 24px
    full: "9999px",
  },
  
  // Shadow scale
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
    none: "0 0 #0000",
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
    }
  },
  
  // Component-specific tokens
  component: {
    button: {
      height: {
        xs: "1.5rem",    // 24px
        sm: "2rem",      // 32px  
        md: "2.5rem",    // 40px
        lg: "3rem",      // 48px
        xl: "3.5rem",    // 56px
      },
      padding: {
        xs: "0.25rem 0.5rem",
        sm: "0.375rem 0.75rem", 
        md: "0.5rem 1rem",
        lg: "0.625rem 1.25rem",
        xl: "0.75rem 1.5rem",
      }
    },
    
    input: {
      height: {
        sm: "2rem",      // 32px
        md: "2.5rem",    // 40px  
        lg: "3rem",      // 48px
      },
      padding: {
        sm: "0.375rem 0.75rem",
        md: "0.5rem 0.75rem",
        lg: "0.75rem 1rem", 
      }
    }
  }
} as const;

// Type helpers for consuming tokens
export type ColorToken = keyof typeof componentTokens.colors;
export type SpacingToken = keyof typeof componentTokens.spacing;
export type RadiusToken = keyof typeof componentTokens.radius;
export type ShadowToken = keyof typeof componentTokens.shadows;
// Component Token System
// Defines CSS variable contracts for each component
// Components can ONLY be customized through these tokens

// Token type definitions
export type TokenValue = string | number;
export type TokenSet = Record<string, TokenValue | TokenSet>; // Allow nested token sets
export type ComponentTokens<T extends Record<string, TokenSet>> = T;

// Button component tokens
export type ButtonTokens = ComponentTokens<{
  base: {
    // Sizing
    height: string;
    paddingX: string;
    paddingY: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;

    // Borders & Radius
    borderWidth: string;
    borderStyle: string;
    borderRadius: string;

    // Transitions
    transitionDuration: string;
    transitionTiming: string;

    // Focus
    focusRingWidth: string;
    focusRingOffset: string;
  };

  primary: {
    background: string;
    backgroundHover: string;
    backgroundActive: string;
    borderColor: string;
    textColor: string;
    focusRingColor: string;
  };

  secondary: {
    background: string;
    backgroundHover: string;
    backgroundActive: string;
    borderColor: string;
    textColor: string;
    focusRingColor: string;
  };

  outline: {
    background: string;
    backgroundHover: string;
    backgroundActive: string;
    borderColor: string;
    borderColorHover: string;
    textColor: string;
    focusRingColor: string;
  };

  ghost: {
    background: string;
    backgroundHover: string;
    backgroundActive: string;
    textColor: string;
    focusRingColor: string;
  };

  destructive: {
    background: string;
    backgroundHover: string;
    backgroundActive: string;
    borderColor: string;
    textColor: string;
    focusRingColor: string;
  };

  disabled: {
    opacity: string;
    cursor: string;
  };

  sizeXs: {
    height: string;
    paddingX: string;
    fontSize: string;
  };
  sizeSm: {
    height: string;
    paddingX: string;
    fontSize: string;
  };
  sizeMd: {
    height: string;
    paddingX: string;
    fontSize: string;
  };
  sizeLg: {
    height: string;
    paddingX: string;
    fontSize: string;
  };
  sizeXl: {
    height: string;
    paddingX: string;
    fontSize: string;
  };
}>;

// Input component tokens
export type InputTokens = ComponentTokens<{
  base: {
    height: string;
    paddingX: string;
    paddingY: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    borderWidth: string;
    borderRadius: string;
    transitionDuration: string;
    transitionTiming: string;
  };

  default: {
    background: string;
    borderColor: string;
    borderColorFocus: string;
    textColor: string;
    placeholderColor: string;
    focusRingColor: string;
  };

  error: {
    borderColor: string;
    focusRingColor: string;
  };

  disabled: {
    background: string;
    borderColor: string;
    textColor: string;
    opacity: string;
    cursor: string;
  };
}>;

// Card component tokens
export type CardTokens = ComponentTokens<{
  base: {
    padding: string;
    borderRadius: string;
    borderWidth: string;
    transitionDuration: string;
  };

  default: {
    background: string;
    borderColor: string;
    shadowColor: string;
    shadowSize: string;
  };

  hover: {
    shadowSize: string;
    transform: string;
  };

  elevated: {
    shadowColor: string;
    shadowSize: string;
  };
}>;

// Modal component tokens
export type ModalTokens = ComponentTokens<{
  overlay: {
    background: string;
    backdropFilter: string;
    zIndex: string;
  };

  content: {
    background: string;
    borderRadius: string;
    padding: string;
    maxWidth: string;
    maxHeight: string;
    shadowColor: string;
    shadowSize: string;
    zIndex: string;
  };

  header: {
    padding: string;
    borderBottomWidth: string;
    borderBottomColor: string;
    fontSize: string;
    fontWeight: string;
  };

  body: {
    padding: string;
  };

  footer: {
    padding: string;
    borderTopWidth: string;
    borderTopColor: string;
  };
}>;

// Container/Layout component tokens
export type LayoutTokens = ComponentTokens<{
  container: {
    maxWidth: string;
    padding: string;
    marginX: string;
  };

  section: {
    paddingY: string;
    paddingX: string;
  };

  grid: {
    gap: string;
    columnGap: string;
    rowGap: string;
  };

  stack: {
    gap: string;
  };
}>;

// Alert/Toast component tokens
export type FeedbackTokens = ComponentTokens<{
  alert: {
    padding: string;
    borderRadius: string;
    borderWidth: string;
    fontSize: string;
  };

  success: {
    background: string;
    borderColor: string;
    textColor: string;
    iconColor: string;
  };

  warning: {
    background: string;
    borderColor: string;
    textColor: string;
    iconColor: string;
  };

  error: {
    background: string;
    borderColor: string;
    textColor: string;
    iconColor: string;
  };

  info: {
    background: string;
    borderColor: string;
    textColor: string;
    iconColor: string;
  };
}>;

// Token default values (library defaults)
export const defaultButtonTokens: ButtonTokens = {
  base: {
    height: "2.5rem",
    paddingX: "1rem",
    paddingY: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    lineHeight: "1.25",
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: "0.375rem",
    transitionDuration: "150ms",
    transitionTiming: "ease-out",
    focusRingWidth: "3px",
    focusRingOffset: "2px",
  },
  primary: {
    background: "#3B82F6",
    backgroundHover: "#2563EB",
    backgroundActive: "#1D4ED8",
    borderColor: "transparent",
    textColor: "#FFFFFF",
    focusRingColor: "#93C5FD",
  },
  secondary: {
    background: "#F3F4F6",
    backgroundHover: "#E5E7EB",
    backgroundActive: "#D1D5DB",
    borderColor: "transparent",
    textColor: "#1F2937",
    focusRingColor: "#9CA3AF",
  },
  outline: {
    background: "transparent",
    backgroundHover: "#F9FAFB",
    backgroundActive: "#F3F4F6",
    borderColor: "#D1D5DB",
    borderColorHover: "#9CA3AF",
    textColor: "#374151",
    focusRingColor: "#9CA3AF",
  },
  ghost: {
    background: "transparent",
    backgroundHover: "#F3F4F6",
    backgroundActive: "#E5E7EB",
    textColor: "#374151",
    focusRingColor: "#9CA3AF",
  },
  destructive: {
    background: "#EF4444",
    backgroundHover: "#DC2626",
    backgroundActive: "#B91C1C",
    borderColor: "transparent",
    textColor: "#FFFFFF",
    focusRingColor: "#FCA5A5",
  },
  disabled: {
    opacity: "0.6",
    cursor: "not-allowed",
  },
  sizeXs: {
    height: "1.5rem",
    paddingX: "0.5rem",
    fontSize: "0.75rem",
  },
  sizeSm: {
    height: "2rem",
    paddingX: "0.75rem",
    fontSize: "0.813rem",
  },
  sizeMd: {
    height: "2.5rem",
    paddingX: "1rem",
    fontSize: "0.875rem",
  },
  sizeLg: {
    height: "3rem",
    paddingX: "1.25rem",
    fontSize: "1rem",
  },
  sizeXl: {
    height: "3.5rem",
    paddingX: "1.5rem",
    fontSize: "1.125rem",
  },
};

// Utility to generate CSS variable names
export function generateTokenVarName(component: string, path: string[]): string {
  return `--${component}-${path.join("-")}`;
}

// Utility to flatten token object to CSS variables
export function tokensToCSS<T extends Record<string, TokenSet>>(
  component: string,
  tokens: ComponentTokens<T>
): string {
  const cssVars: string[] = [];

  function flatten(obj: any, prefix: string[] = []): void {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "object" && value !== null) {
        flatten(value, [...prefix, key]);
      } else {
        const varName = generateTokenVarName(component, [...prefix, key]);
        cssVars.push(`${varName}: ${value};`);
      }
    }
  }

  flatten(tokens);
  return cssVars.join("\n  ");
}

// Type for all component tokens
export type AllComponentTokens = {
  button?: Partial<ButtonTokens>;
  input?: Partial<InputTokens>;
  card?: Partial<CardTokens>;
  modal?: Partial<ModalTokens>;
  layout?: Partial<LayoutTokens>;
  feedback?: Partial<FeedbackTokens>;
};

// Deep merge utility for token overrides
export function mergeTokens<T extends Record<string, TokenSet>>(
  defaults: ComponentTokens<T>,
  overrides?: Partial<ComponentTokens<T>>
): ComponentTokens<T> {
  if (!overrides) return defaults;

  const result = { ...defaults };

  for (const [key, value] of Object.entries(overrides)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      result[key as keyof T] = {
        ...defaults[key as keyof T],
        ...value,
      } as T[keyof T];
    } else {
      result[key as keyof T] = value as T[keyof T];
    }
  }

  return result;
}
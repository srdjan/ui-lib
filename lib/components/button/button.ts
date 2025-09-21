// Button component - Enterprise-grade button with variants and states
import { css } from "../../css-in-ts.ts";
import { componentTokens } from "../../themes/component-tokens.ts";
import type { ComponentSize, InteractiveComponentProps } from "../types.ts";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "link"
  | "destructive";

export type ButtonProps = InteractiveComponentProps & {
  readonly variant?: ButtonVariant;
  readonly size?: ComponentSize;
  readonly fullWidth?: boolean;
  readonly loading?: boolean;
  readonly loadingText?: string;
  readonly leftIcon?: string;
  readonly rightIcon?: string;
  readonly type?: "button" | "submit" | "reset";
  readonly children?: string | string[];
};

/**
 * Button component with comprehensive variants and states
 *
 * @example
 * ```tsx
 * // Basic usage
 * Button({ children: "Click me" })
 *
 * // With variants and sizes
 * Button({ variant: "primary", size: "lg", children: "Large Primary" })
 *
 * // With icons
 * Button({ leftIcon: "📁", children: "Save File", variant: "outline" })
 *
 * // Loading state
 * Button({ loading: true, loadingText: "Saving...", children: "Save" })
 * ```
 */
export function Button(props: ButtonProps): string {
  const {
    variant = "primary",
    size = "md",
    fullWidth = false,
    loading = false,
    loadingText = "Loading...",
    leftIcon,
    rightIcon,
    disabled = false,
    type = "button",
    className = "",
    onClick,
    onFocus,
    onBlur,
    children = [],
  } = props;

  const styles = css({
    button: {
      // Base styles
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: componentTokens.spacing[2],
      fontWeight: componentTokens.typography.weights.medium,
      fontSize: componentTokens.typography.sizes.sm,
      lineHeight: componentTokens.typography.lineHeights.tight,
      borderRadius: componentTokens.radius.md,
      border: "1px solid transparent",
      cursor: "pointer",
      transition:
        `all ${componentTokens.animation.duration.normal} ${componentTokens.animation.easing.out}`,
      textDecoration: "none",
      userSelect: "none",
      whiteSpace: "nowrap",

      // Focus styles
      "&:focus": {
        outline: "none",
        boxShadow: `0 0 0 3px ${componentTokens.colors.primary[200]}`,
      },

      "&:focus:not(:focus-visible)": {
        boxShadow: "none",
      },

      // Disabled styles
      "&:disabled, &[aria-disabled='true']": {
        cursor: "not-allowed",
        opacity: 0.6,
      },

      // Size variants
      ...(size === "xs" && {
        height: componentTokens.component.button.height.xs,
        padding: componentTokens.component.button.padding.xs,
        fontSize: componentTokens.typography.sizes.xs,
      }),

      ...(size === "sm" && {
        height: componentTokens.component.button.height.sm,
        padding: componentTokens.component.button.padding.sm,
        fontSize: componentTokens.typography.sizes.sm,
      }),

      ...(size === "md" && {
        height: componentTokens.component.button.height.md,
        padding: componentTokens.component.button.padding.md,
        fontSize: componentTokens.typography.sizes.sm,
      }),

      ...(size === "lg" && {
        height: componentTokens.component.button.height.lg,
        padding: componentTokens.component.button.padding.lg,
        fontSize: componentTokens.typography.sizes.base,
      }),

      ...(size === "xl" && {
        height: componentTokens.component.button.height.xl,
        padding: componentTokens.component.button.padding.xl,
        fontSize: componentTokens.typography.sizes.lg,
      }),

      // Full width
      ...(fullWidth && {
        width: "100%",
      }),

      // Variant styles
      ...(variant === "primary" && {
        backgroundColor: componentTokens.colors.primary[500],
        color: "white",
        "&:hover:not(:disabled)": {
          backgroundColor: componentTokens.colors.primary[600],
        },
        "&:active:not(:disabled)": {
          backgroundColor: componentTokens.colors.primary[700],
        },
      }),

      ...(variant === "secondary" && {
        backgroundColor: componentTokens.colors.gray[100],
        color: componentTokens.colors.gray[900],
        "&:hover:not(:disabled)": {
          backgroundColor: componentTokens.colors.gray[200],
        },
        "&:active:not(:disabled)": {
          backgroundColor: componentTokens.colors.gray[300],
        },
      }),

      ...(variant === "outline" && {
        backgroundColor: "transparent",
        borderColor: componentTokens.colors.gray[300],
        color: componentTokens.colors.gray[700],
        "&:hover:not(:disabled)": {
          backgroundColor: componentTokens.colors.gray[50],
          borderColor: componentTokens.colors.gray[400],
        },
        "&:active:not(:disabled)": {
          backgroundColor: componentTokens.colors.gray[100],
        },
      }),

      ...(variant === "ghost" && {
        backgroundColor: "transparent",
        color: componentTokens.colors.gray[700],
        "&:hover:not(:disabled)": {
          backgroundColor: componentTokens.colors.gray[100],
        },
        "&:active:not(:disabled)": {
          backgroundColor: componentTokens.colors.gray[200],
        },
      }),

      ...(variant === "link" && {
        backgroundColor: "transparent",
        color: componentTokens.colors.primary[600],
        padding: "0",
        height: "auto",
        textDecoration: "underline",
        "&:hover:not(:disabled)": {
          color: componentTokens.colors.primary[700],
          textDecoration: "underline",
        },
      }),

      ...(variant === "destructive" && {
        backgroundColor: componentTokens.colors.error[500],
        color: "white",
        "&:hover:not(:disabled)": {
          backgroundColor: componentTokens.colors.error[600],
        },
        "&:active:not(:disabled)": {
          backgroundColor: componentTokens.colors.error[700],
        },
      }),
    },

    icon: {
      display: "inline-block",
      flexShrink: 0,
    },

    spinner: {
      display: "inline-block",
      width: "1rem",
      height: "1rem",
      border: "2px solid transparent",
      borderTop: "2px solid currentColor",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },

    content: {
      opacity: loading ? 0 : 1,
      transition:
        `opacity ${componentTokens.animation.duration.fast} ${componentTokens.animation.easing.out}`,
    },

    loadingContent: {
      position: "absolute",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: componentTokens.spacing[2],
      opacity: loading ? 1 : 0,
      transition:
        `opacity ${componentTokens.animation.duration.fast} ${componentTokens.animation.easing.out}`,
    },
  });

  // Prepare content
  const buttonText = Array.isArray(children) ? children.join("") : children;
  const content = [
    leftIcon && `<span class="${styles.classMap.icon}">${leftIcon}</span>`,
    buttonText,
    rightIcon && `<span class="${styles.classMap.icon}">${rightIcon}</span>`,
  ].filter(Boolean).join("");

  const loadingContent = [
    `<span class="${styles.classMap.spinner}"></span>`,
    loadingText,
  ].join("");

  // Build attributes
  const attributes = {
    class: `${styles.classMap.button} ${className}`.trim(),
    type,
    ...(disabled && { disabled: "true", "aria-disabled": "true" }),
    ...(onClick && { onclick: onClick }),
    ...(onFocus && { onfocus: onFocus }),
    ...(onBlur && { onblur: onBlur }),
  };

  const attributeString = Object.entries(attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  return `
    <button ${attributeString}>
      <span class="${styles.classMap.content}">${content}</span>
      ${
    loading
      ? `<span class="${styles.classMap.loadingContent}">${loadingContent}</span>`
      : ""
  }
    </button>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `.trim();
}

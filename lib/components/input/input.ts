// Input component - Versatile text input with variants and states
import { css } from "../../css-in-ts.ts";
import { componentTokens } from "../../themes/component-tokens.ts";
import type { BaseComponentProps, ComponentSize } from "../types.ts";

export type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "search"
  | "tel"
  | "url"
  | "textarea";

export type InputVariant =
  | "default"
  | "filled"
  | "flushed"
  | "unstyled"
  | "compact";

export interface InputProps extends BaseComponentProps {
  type?: InputType;
  variant?: InputVariant;
  size?: ComponentSize;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  required?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  name?: string;
  id?: string;
  label?: string; // optional visual label support
  rows?: number; // for textarea type
  style?: string; // optional inline style on wrapper
  "aria-label"?: string;
  "aria-describedby"?: string;
  leftAddon?: string;
  rightAddon?: string;
  leftIcon?: string;
  rightIcon?: string;
  error?: boolean;
  errorMessage?: string;
  helpText?: string;
  onChange?: string;
  onInput?: string;
  onFocus?: string;
  onBlur?: string;
  onKeyDown?: string;
  onKeyUp?: string;
}

/**
 * Input component with comprehensive variants and accessibility features
 *
 * @example
 * ```tsx
 * // Basic input
 * Input({ placeholder: "Enter your name" })
 *
 * // With addons and icons
 * Input({
 *   leftIcon: "👤",
 *   placeholder: "Username",
 *   rightAddon: "@company.com"
 * })
 *
 * // Error state
 * Input({
 *   error: true,
 *   errorMessage: "Please enter a valid email",
 *   type: "email"
 * })
 * ```
 */
export function Input(props: InputProps): string {
  const {
    type = "text",
    variant = "default",
    size = "md",
    placeholder,
    value,
    defaultValue,
    required = false,
    disabled = false,
    readOnly = false,
    autoFocus = false,
    maxLength,
    minLength,
    min,
    max,
    step,
    pattern,
    name,
    id,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedBy,
    leftAddon,
    rightAddon,
    leftIcon,
    rightIcon,
    error = false,
    errorMessage,
    helpText,
    className = "",
    onChange,
    onInput,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp,
    label,
    rows,
    style,
  } = props;

  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasLeftAddon = Boolean(leftAddon || leftIcon);
  const hasRightAddon = Boolean(rightAddon || rightIcon);

  const styles = css({
    wrapper: {
      position: "relative",
      width: "100%",
    },

    label: {
      display: "block",
      marginBottom: componentTokens.spacing[2],
      fontSize: componentTokens.typography.sizes.sm,
      fontWeight: componentTokens.typography.weights.medium,
      color: componentTokens.colors.gray[700],
    },

    labelRequired: {
      marginLeft: componentTokens.spacing[1],
      color: componentTokens.colors.error[600],
    },

    inputGroup: {
      display: "flex",
      alignItems: "stretch",
      width: "100%",
      position: "relative",

      // Size variants for group
      ...(size === "sm" && {
        height: componentTokens.component.input.height.sm,
      }),
      ...(size === "md" && {
        height: componentTokens.component.input.height.md,
      }),
      ...(size === "lg" && {
        height: componentTokens.component.input.height.lg,
      }),
    },

    fieldWrapper: {
      position: "relative",
      flex: "1",
    },

    input: {
      width: "100%",
      border: "1px solid",
      borderColor: error
        ? componentTokens.colors.error[300]
        : componentTokens.colors.gray[300],
      borderRadius: componentTokens.radius.md,
      fontSize: componentTokens.typography.sizes.sm,
      fontWeight: componentTokens.typography.weights.normal,
      lineHeight: componentTokens.typography.lineHeights.tight,
      color: componentTokens.colors.gray[900],
      backgroundColor: componentTokens.colors.surface.input,
      transition:
        `all ${componentTokens.animation.duration.normal} ${componentTokens.animation.easing.out}`,

      // Size variants
      ...(size === "sm" && {
        height: componentTokens.component.input.height.sm,
        padding: componentTokens.component.input.padding.sm,
        fontSize: componentTokens.typography.sizes.sm,
      }),
      ...(size === "md" && {
        height: componentTokens.component.input.height.md,
        padding: componentTokens.component.input.padding.md,
        fontSize: componentTokens.typography.sizes.sm,
      }),
      ...(size === "lg" && {
        height: componentTokens.component.input.height.lg,
        padding: componentTokens.component.input.padding.lg,
        fontSize: componentTokens.typography.sizes.base,
      }),

      // Variant styles
      ...(variant === "default" && {
        backgroundColor: componentTokens.colors.surface.input,
        borderColor: error
          ? componentTokens.colors.error[300]
          : componentTokens.colors.gray[300],
      }),

      ...(variant === "filled" && {
        backgroundColor: componentTokens.colors.gray[50],
        borderColor: "transparent",
        "&:hover": {
          backgroundColor: componentTokens.colors.gray[100],
        },
      }),

      ...(variant === "flushed" && {
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderRadius: 0,
        borderBottom: `2px solid ${
          error
            ? componentTokens.colors.error[300]
            : componentTokens.colors.gray[300]
        }`,
        paddingLeft: 0,
        paddingRight: 0,
      }),

      ...(variant === "unstyled" && {
        backgroundColor: "transparent",
        border: "none",
        borderRadius: 0,
        padding: 0,
      }),

      // Compact variant for denser forms
      ...(variant === "compact" && {
        backgroundColor: componentTokens.colors.gray[50],
        borderColor: componentTokens.colors.gray[300],
        // Size adjustments: step down one size where possible
        ...(size === "lg" && {
          height: componentTokens.component.input.height.md,
          padding: componentTokens.component.input.padding.md,
          fontSize: componentTokens.typography.sizes.sm,
        }),
        ...(size === "md" && {
          height: componentTokens.component.input.height.sm,
          padding: componentTokens.component.input.padding.sm,
          fontSize: componentTokens.typography.sizes.sm,
        }),
        ...(size === "sm" && {
          // sm is already smallest; nudge padding/font a bit tighter
          padding: "0.375rem 0.5rem",
          fontSize: componentTokens.typography.sizes.xs,
        }),
      }),

      // States
      "&:hover:not(:disabled)": {
        borderColor: error
          ? componentTokens.colors.error[400]
          : componentTokens.colors.gray[400],
      },

      "&:focus": {
        outline: "none",
        borderColor: error
          ? componentTokens.colors.error[500]
          : componentTokens.colors.primary[500],
        boxShadow: error
          ? `0 0 0 3px ${componentTokens.colors.error[100]}`
          : `0 0 0 3px ${componentTokens.colors.primary[100]}`,
      },

      "&:disabled": {
        backgroundColor: componentTokens.colors.gray[100],
        borderColor: componentTokens.colors.gray[200],
        color: componentTokens.colors.gray[500],
        cursor: "not-allowed",
      },

      "&:read-only": {
        backgroundColor: componentTokens.colors.gray[50],
        cursor: "default",
      },

      "&::placeholder": {
        color: componentTokens.colors.gray[400],
      },

      // Adjust padding when addons are present
      ...(hasLeftAddon && {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderLeft: "none",
      }),

      ...(hasRightAddon && {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderRight: "none",
      }),
    },

    addon: {
      display: "flex",
      alignItems: "center",
      padding: `0 ${componentTokens.spacing[3]}`,
      backgroundColor: componentTokens.colors.gray[50],
      borderColor: error
        ? componentTokens.colors.error[300]
        : componentTokens.colors.gray[300],
      border: "1px solid",
      fontSize: componentTokens.typography.sizes.sm,
      color: componentTokens.colors.gray[600],
      whiteSpace: "nowrap",
    },

    leftAddon: {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderRight: "none",
      borderTopLeftRadius: componentTokens.radius.md,
      borderBottomLeftRadius: componentTokens.radius.md,
    },

    rightAddon: {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderLeft: "none",
      borderTopRightRadius: componentTokens.radius.md,
      borderBottomRightRadius: componentTokens.radius.md,
    },

    icon: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      color: componentTokens.colors.gray[400],
      pointerEvents: "none",
      zIndex: 1,
      fontSize: "1rem",
    },

    leftIcon: {
      left: componentTokens.spacing[3],
    },

    rightIcon: {
      right: componentTokens.spacing[3],
    },

    helpText: {
      fontSize: componentTokens.typography.sizes.xs,
      color: componentTokens.colors.gray[600],
      marginTop: componentTokens.spacing[1],
    },

    errorText: {
      fontSize: componentTokens.typography.sizes.xs,
      color: componentTokens.colors.error[600],
      marginTop: componentTokens.spacing[1],
      display: "flex",
      alignItems: "center",
      gap: componentTokens.spacing[1],
    },

    // Adjust input padding when icons are present (without inline styles)
    inputWithLeftIcon: {
      paddingLeft: componentTokens.spacing[10],
    },
    inputWithRightIcon: {
      paddingRight: componentTokens.spacing[10],
    },
  });

  // Build input attributes
  const isTextarea = type === "textarea";

  const inputClasses = [
    styles.classMap.input,
    className,
    (leftIcon && !leftAddon) ? styles.classMap.inputWithLeftIcon : "",
    (rightIcon && !rightAddon) ? styles.classMap.inputWithRightIcon : "",
  ].filter(Boolean).join(" ");

  const inputAttributes: Record<string, string | number | boolean> = {
    ...(isTextarea ? {} : { type }),
    id: inputId,
    class: inputClasses,
    ...(name && { name }),
    ...(placeholder && { placeholder }),
    ...(value !== undefined && { value: String(value) }),
    ...(defaultValue !== undefined &&
      { "default-value": String(defaultValue) }),
    ...(required && { required: true }),
    ...(disabled && { disabled: true }),
    ...(readOnly && { readonly: true }),
    ...(autoFocus && { autofocus: true }),
    ...(maxLength && { maxlength: maxLength }),
    ...(minLength && { minlength: minLength }),
    ...(min !== undefined && { min }),
    ...(max !== undefined && { max }),
    ...(step !== undefined && { step }),
    ...(pattern && !isTextarea && { pattern }),
    ...(rows !== undefined && isTextarea && { rows }),
    ...(ariaLabel && { "aria-label": ariaLabel }),
    ...(ariaDescribedBy && { "aria-describedby": ariaDescribedBy }),
    ...(error && { "aria-invalid": true }),
    ...(onChange && { onchange: onChange }),
    ...(onInput && { oninput: onInput }),
    ...(onFocus && { onfocus: onFocus }),
    ...(onBlur && { onblur: onBlur }),
    ...(onKeyDown && { onkeydown: onKeyDown }),
    ...(onKeyUp && { onkeyup: onKeyUp }),
  };

  const inputAttributeString = Object.entries(inputAttributes)
    .map(([key, value]) => `${key}="${value}` + `"`)
    .join(" ");

  // Build the input group
  const inputElement = isTextarea
    ? `<textarea ${inputAttributeString}></textarea>`
    : `<input ${inputAttributeString} />`;

  const inputGroup = [
    // Left addon
    leftAddon &&
    `<div class="${styles.classMap.addon} ${styles.classMap.leftAddon}">${leftAddon}</div>`,

    // Input with icons
    `<div class="${styles.classMap.fieldWrapper}">
      ${
      leftIcon && !leftAddon
        ? `<span class="${styles.classMap.icon} ${styles.classMap.leftIcon}">${leftIcon}</span>`
        : ""
    }
      ${inputElement}
      ${
      rightIcon && !rightAddon
        ? `<span class="${styles.classMap.icon} ${styles.classMap.rightIcon}">${rightIcon}</span>`
        : ""
    }
    </div>`,

    // Right addon
    rightAddon &&
    `<div class="${styles.classMap.addon} ${styles.classMap.rightAddon}">${rightAddon}</div>`,
  ].filter(Boolean).join("");

  // Build help/error text
  const helpTextElement = helpText && !error
    ? `<div class="${styles.classMap.helpText}">${helpText}</div>`
    : "";

  const errorTextElement = error && errorMessage
    ? `<div class="${styles.classMap.errorText}">⚠️ ${errorMessage}</div>`
    : "";

  const labelElement = label
    ? `<label for="${inputId}" class="${styles.classMap.label}">${label}${
      required
        ? `<span class="${styles.classMap.labelRequired}" aria-hidden="true">*</span>`
        : ""
    }</label>`
    : "";

  return `
    <div class="${styles.classMap.wrapper}">
      ${labelElement}
      <div class="${styles.classMap.inputGroup}">
        ${inputGroup}
      </div>
      ${helpTextElement}
      ${errorTextElement}
    </div>
  `.trim();
}

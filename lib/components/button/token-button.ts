// Token-based Button Component
// This component can ONLY be customized via CSS variables

import { createTokenComponent } from "../../tokens/component-factory.ts";
import type { ButtonTokens } from "../../tokens/component-tokens.ts";
import { defaultButtonTokens } from "../../tokens/component-tokens.ts";
import type { ComponentSize } from "../types.ts";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";

export type ButtonProps = {
  readonly variant?: ButtonVariant;
  readonly size?: ComponentSize;
  readonly fullWidth?: boolean;
  readonly loading?: boolean;
  readonly loadingText?: string;
  readonly leftIcon?: string;
  readonly rightIcon?: string;
  readonly disabled?: boolean;
  readonly type?: "button" | "submit" | "reset";
  readonly onClick?: string;
  readonly className?: string;
  readonly children?: string | string[];
};

// Create the sealed Button component
export const Button = createTokenComponent<ButtonTokens, ButtonProps>({
  name: "button",
  tokens: defaultButtonTokens,

  // Static styles that use CSS variables
  styles: (cssVars) => `
    .ui-button {
      /* Base styles using CSS variables */
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;

      /* Sizing from tokens */
      height: ${cssVars.base.height};
      padding-left: ${cssVars.base.paddingX};
      padding-right: ${cssVars.base.paddingX};
      font-size: ${cssVars.base.fontSize};
      font-weight: ${cssVars.base.fontWeight};
      line-height: ${cssVars.base.lineHeight};

      /* Borders and radius */
      border-width: ${cssVars.base.borderWidth};
      border-style: ${cssVars.base.borderStyle};
      border-radius: ${cssVars.base.borderRadius};

      /* Transitions */
      transition: all ${cssVars.base.transitionDuration} ${cssVars.base.transitionTiming};

      /* Base properties */
      cursor: pointer;
      text-decoration: none;
      user-select: none;
      white-space: nowrap;
      position: relative;
      overflow: hidden;
    }

    /* Size modifiers */
    .ui-button--xs {
      height: ${cssVars.sizeXs.height};
      padding-left: ${cssVars.sizeXs.paddingX};
      padding-right: ${cssVars.sizeXs.paddingX};
      font-size: ${cssVars.sizeXs.fontSize};
    }

    .ui-button--sm {
      height: ${cssVars.sizeSm.height};
      padding-left: ${cssVars.sizeSm.paddingX};
      padding-right: ${cssVars.sizeSm.paddingX};
      font-size: ${cssVars.sizeSm.fontSize};
    }

    .ui-button--md {
      height: ${cssVars.sizeMd.height};
      padding-left: ${cssVars.sizeMd.paddingX};
      padding-right: ${cssVars.sizeMd.paddingX};
      font-size: ${cssVars.sizeMd.fontSize};
    }

    .ui-button--lg {
      height: ${cssVars.sizeLg.height};
      padding-left: ${cssVars.sizeLg.paddingX};
      padding-right: ${cssVars.sizeLg.paddingX};
      font-size: ${cssVars.sizeLg.fontSize};
    }

    .ui-button--xl {
      height: ${cssVars.sizeXl.height};
      padding-left: ${cssVars.sizeXl.paddingX};
      padding-right: ${cssVars.sizeXl.paddingX};
      font-size: ${cssVars.sizeXl.fontSize};
    }

    /* Variant: Primary */
    .ui-button--primary {
      background-color: ${cssVars.primary.background};
      border-color: ${cssVars.primary.borderColor};
      color: ${cssVars.primary.textColor};
    }

    .ui-button--primary:hover:not(:disabled) {
      background-color: ${cssVars.primary.backgroundHover};
    }

    .ui-button--primary:active:not(:disabled) {
      background-color: ${cssVars.primary.backgroundActive};
    }

    .ui-button--primary:focus-visible {
      outline: none;
      box-shadow: 0 0 0 ${cssVars.base.focusRingWidth} ${cssVars.primary.focusRingColor};
    }

    /* Variant: Secondary */
    .ui-button--secondary {
      background-color: ${cssVars.secondary.background};
      border-color: ${cssVars.secondary.borderColor};
      color: ${cssVars.secondary.textColor};
    }

    .ui-button--secondary:hover:not(:disabled) {
      background-color: ${cssVars.secondary.backgroundHover};
    }

    .ui-button--secondary:active:not(:disabled) {
      background-color: ${cssVars.secondary.backgroundActive};
    }

    .ui-button--secondary:focus-visible {
      outline: none;
      box-shadow: 0 0 0 ${cssVars.base.focusRingWidth} ${cssVars.secondary.focusRingColor};
    }

    /* Variant: Outline */
    .ui-button--outline {
      background-color: ${cssVars.outline.background};
      border-color: ${cssVars.outline.borderColor};
      color: ${cssVars.outline.textColor};
    }

    .ui-button--outline:hover:not(:disabled) {
      background-color: ${cssVars.outline.backgroundHover};
      border-color: ${cssVars.outline.borderColorHover};
    }

    .ui-button--outline:active:not(:disabled) {
      background-color: ${cssVars.outline.backgroundActive};
    }

    .ui-button--outline:focus-visible {
      outline: none;
      box-shadow: 0 0 0 ${cssVars.base.focusRingWidth} ${cssVars.outline.focusRingColor};
    }

    /* Variant: Ghost */
    .ui-button--ghost {
      background-color: ${cssVars.ghost.background};
      border-color: transparent;
      color: ${cssVars.ghost.textColor};
    }

    .ui-button--ghost:hover:not(:disabled) {
      background-color: ${cssVars.ghost.backgroundHover};
    }

    .ui-button--ghost:active:not(:disabled) {
      background-color: ${cssVars.ghost.backgroundActive};
    }

    .ui-button--ghost:focus-visible {
      outline: none;
      box-shadow: 0 0 0 ${cssVars.base.focusRingWidth} ${cssVars.ghost.focusRingColor};
    }

    /* Variant: Destructive */
    .ui-button--destructive {
      background-color: ${cssVars.destructive.background};
      border-color: ${cssVars.destructive.borderColor};
      color: ${cssVars.destructive.textColor};
    }

    .ui-button--destructive:hover:not(:disabled) {
      background-color: ${cssVars.destructive.backgroundHover};
    }

    .ui-button--destructive:active:not(:disabled) {
      background-color: ${cssVars.destructive.backgroundActive};
    }

    .ui-button--destructive:focus-visible {
      outline: none;
      box-shadow: 0 0 0 ${cssVars.base.focusRingWidth} ${cssVars.destructive.focusRingColor};
    }

    /* States */
    .ui-button--fullwidth {
      width: 100%;
    }

    .ui-button:disabled,
    .ui-button[aria-disabled='true'] {
      opacity: ${cssVars.disabled.opacity};
      cursor: ${cssVars.disabled.cursor};
    }

    /* Focus reset for non-keyboard */
    .ui-button:focus:not(:focus-visible) {
      outline: none;
      box-shadow: none;
    }

    /* Loading state */
    .ui-button__content {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: opacity ${cssVars.base.transitionDuration} ${cssVars.base.transitionTiming};
    }

    .ui-button__content--loading {
      opacity: 0;
    }

    .ui-button__loading {
      position: absolute;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      opacity: 0;
      transition: opacity ${cssVars.base.transitionDuration} ${cssVars.base.transitionTiming};
    }

    .ui-button__loading--visible {
      opacity: 1;
    }

    .ui-button__spinner {
      display: inline-block;
      width: 1rem;
      height: 1rem;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: ui-button-spin 0.6s linear infinite;
    }

    .ui-button__icon {
      display: inline-block;
      flex-shrink: 0;
    }

    @keyframes ui-button-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `,

  render: (props, _cssVars) => {
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
      onClick,
      className = "",
      children = [],
    } = props;

    // Build class list
    const classes = [
      "ui-button",
      `ui-button--${variant}`,
      `ui-button--${size}`,
      fullWidth && "ui-button--fullwidth",
      className,
    ].filter(Boolean).join(" ");

    // Prepare content
    const buttonText = Array.isArray(children) ? children.join("") : children;
    const content = [
      leftIcon && `<span class="ui-button__icon">${leftIcon}</span>`,
      buttonText,
      rightIcon && `<span class="ui-button__icon">${rightIcon}</span>`,
    ].filter(Boolean).join("");

    const loadingContent = [
      `<span class="ui-button__spinner"></span>`,
      loadingText,
    ].join("");

    // Build attributes
    const attributes: Record<string, string> = {
      class: classes,
      type,
    };

    if (disabled) {
      attributes.disabled = "true";
      attributes["aria-disabled"] = "true";
    }

    if (onClick) {
      attributes.onclick = onClick;
    }

    const attributeString = Object.entries(attributes)
      .map(([key, value]) => `${key}="${value}"`)
      .join(" ");

    return `
      <button ${attributeString}>
        <span class="ui-button__content ${
      loading ? "ui-button__content--loading" : ""
    }">${content}</span>
        <span class="ui-button__loading ${
      loading ? "ui-button__loading--visible" : ""
    }">${loadingContent}</span>
      </button>
    `.trim();
  },
});

// Export the type-safe token customization interface
export type { ButtonTokens } from "../../tokens/component-tokens.ts";

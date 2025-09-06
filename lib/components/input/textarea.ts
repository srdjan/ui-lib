// Textarea component - Multi-line text input with auto-resize functionality
import { css } from "../../css-in-ts.ts";
import { componentTokens } from "../../themes/component-tokens.ts";
import type { ComponentSize, BaseComponentProps } from "../types.ts";

export type TextareaVariant = "default" | "filled" | "flushed" | "unstyled";
export type TextareaResize = "none" | "both" | "horizontal" | "vertical" | "auto";

export interface TextareaProps extends BaseComponentProps {
  variant?: TextareaVariant;
  size?: ComponentSize;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  required?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  rows?: number;
  cols?: number;
  minRows?: number;
  maxRows?: number;
  resize?: TextareaResize;
  name?: string;
  id?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
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
 * Textarea component with auto-resize and comprehensive styling options
 * 
 * @example
 * ```tsx
 * // Basic textarea
 * Textarea({ placeholder: "Enter your message", rows: 4 })
 * 
 * // Auto-resizing textarea
 * Textarea({ 
 *   resize: "auto",
 *   minRows: 2,
 *   maxRows: 8,
 *   placeholder: "Type your story..."
 * })
 * 
 * // Error state
 * Textarea({ 
 *   error: true,
 *   errorMessage: "Message is required",
 *   required: true
 * })
 * ```
 */
export function Textarea(props: TextareaProps): string {
  const {
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
    rows = 3,
    cols,
    minRows = 2,
    maxRows = 10,
    resize = "vertical",
    name,
    id,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedBy,
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
  } = props;

  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  const styles = css({
    wrapper: {
      position: "relative",
      width: "100%",
    },
    
    textarea: {
      width: "100%",
      border: "1px solid",
      borderColor: error ? componentTokens.colors.error[300] : componentTokens.colors.gray[300],
      borderRadius: componentTokens.radius.md,
      fontSize: componentTokens.typography.sizes.sm,
      fontWeight: componentTokens.typography.weights.normal,
      fontFamily: "inherit",
      lineHeight: componentTokens.typography.lineHeights.normal,
      color: componentTokens.colors.gray[900],
      backgroundColor: componentTokens.colors.surface.input,
      transition: `all ${componentTokens.animation.duration.normal} ${componentTokens.animation.easing.out}`,
      
      // Resize behavior
      ...(resize === "none" && { resize: "none" }),
      ...(resize === "both" && { resize: "both" }),
      ...(resize === "horizontal" && { resize: "horizontal" }),
      ...(resize === "vertical" && { resize: "vertical" }),
      ...(resize === "auto" && { 
        resize: "none",
        overflow: "hidden",
      }),
      
      // Size variants
      ...(size === "sm" && {
        padding: componentTokens.component.input.padding.sm,
        fontSize: componentTokens.typography.sizes.sm,
      }),
      ...(size === "md" && {
        padding: componentTokens.component.input.padding.md,
        fontSize: componentTokens.typography.sizes.sm,
      }),
      ...(size === "lg" && {
        padding: componentTokens.component.input.padding.lg,
        fontSize: componentTokens.typography.sizes.base,
      }),
      
      // Variant styles
      ...(variant === "default" && {
        backgroundColor: componentTokens.colors.surface.input,
        borderColor: error ? componentTokens.colors.error[300] : componentTokens.colors.gray[300],
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
        borderBottom: `2px solid ${error ? componentTokens.colors.error[300] : componentTokens.colors.gray[300]}`,
        paddingLeft: 0,
        paddingRight: 0,
      }),
      
      ...(variant === "unstyled" && {
        backgroundColor: "transparent",
        border: "none",
        borderRadius: 0,
        padding: 0,
      }),
      
      // States
      "&:hover:not(:disabled)": {
        borderColor: error ? componentTokens.colors.error[400] : componentTokens.colors.gray[400],
      },
      
      "&:focus": {
        outline: "none",
        borderColor: error ? componentTokens.colors.error[500] : componentTokens.colors.primary[500],
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
    
    charCount: {
      fontSize: componentTokens.typography.sizes.xs,
      color: componentTokens.colors.gray[500],
      textAlign: "right",
      marginTop: componentTokens.spacing[1],
    },
  });
  
  // Build textarea attributes
  const textareaAttributes: Record<string, string | number | boolean> = {
    id: textareaId,
    class: `${styles.classMap.textarea} ${className}`.trim(),
    ...(name && { name }),
    ...(placeholder && { placeholder }),
    ...(defaultValue !== undefined && { "default-value": String(defaultValue) }),
    ...(required && { required: true }),
    ...(disabled && { disabled: true }),
    ...(readOnly && { readonly: true }),
    ...(autoFocus && { autofocus: true }),
    ...(maxLength && { maxlength: maxLength }),
    ...(minLength && { minlength: minLength }),
    ...(rows && { rows }),
    ...(cols && { cols }),
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
  
  // Add auto-resize functionality if enabled
  if (resize === "auto") {
    const autoResizeScript = `
      function autoResize(element) {
        element.style.height = 'auto';
        const scrollHeight = element.scrollHeight;
        const minHeight = ${minRows} * 1.5; // Approximate line height in rem
        const maxHeight = ${maxRows} * 1.5;
        const newHeight = Math.max(minHeight, Math.min(maxHeight, scrollHeight / 16)); // Convert px to rem
        element.style.height = newHeight + 'rem';
      }
      
      const textarea = document.getElementById('${textareaId}');
      if (textarea) {
        autoResize(textarea);
        textarea.addEventListener('input', () => autoResize(textarea));
        textarea.addEventListener('focus', () => autoResize(textarea));
      }
    `;
    
    textareaAttributes.oninput = `(${autoResizeScript})(this); ${textareaAttributes.oninput || ''}`;
  }
  
  const textareaAttributeString = Object.entries(textareaAttributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");
  
  // Character count display
  const charCountElement = maxLength 
    ? `<div class="${styles.classMap.charCount}">
        <span id="${textareaId}-char-count">0</span>/${maxLength}
       </div>`
    : "";
  
  // Character count script
  const charCountScript = maxLength 
    ? `
      <script>
        (function() {
          const textarea = document.getElementById('${textareaId}');
          const charCount = document.getElementById('${textareaId}-char-count');
          if (textarea && charCount) {
            function updateCharCount() {
              const currentLength = textarea.value.length;
              charCount.textContent = currentLength;
              
              // Change color if approaching limit
              if (currentLength > maxLength * 0.9) {
                charCount.style.color = '${componentTokens.colors.warning[600]}';
              } else if (currentLength >= maxLength) {
                charCount.style.color = '${componentTokens.colors.error[600]}';
              } else {
                charCount.style.color = '${componentTokens.colors.gray[500]}';
              }
            }
            
            textarea.addEventListener('input', updateCharCount);
            textarea.addEventListener('focus', updateCharCount);
            updateCharCount(); // Initial update
          }
        })();
      </script>
    `
    : "";
  
  // Build help/error text
  const helpTextElement = helpText && !error 
    ? `<div class="${styles.classMap.helpText}">${helpText}</div>`
    : "";
  
  const errorTextElement = error && errorMessage
    ? `<div class="${styles.classMap.errorText}">⚠️ ${errorMessage}</div>`
    : "";
  
  return `
    <div class="${styles.classMap.wrapper}">
      <textarea ${textareaAttributeString}>${value || ""}</textarea>
      ${helpTextElement}
      ${errorTextElement}
      ${charCountElement}
    </div>
    ${charCountScript}
  `.trim();
}
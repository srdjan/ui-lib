// Alert component - Contextual feedback messages with variants and icons
import { css } from "../../css-in-ts.ts";
import { componentTokens } from "../../themes/component-tokens.ts";
import type { BaseComponentProps } from "../types.ts";

export type AlertVariant = "info" | "success" | "warning" | "error";
export type AlertStyle = "subtle" | "solid" | "left-accent" | "top-accent";

export type AlertProps = BaseComponentProps & {
  readonly variant?: AlertVariant;
  readonly style?: AlertStyle;
  readonly title?: string;
  readonly description?: string;
  readonly icon?: string;
  readonly closable?: boolean;
  readonly onClose?: string;
  readonly children?: string | string[];
}

/**
 * Alert component for displaying contextual feedback messages
 * 
 * @example
 * ```tsx
 * // Basic alerts
 * Alert({ variant: "success", children: "Operation completed successfully!" })
 * Alert({ variant: "error", title: "Error", description: "Something went wrong" })
 * 
 * // Closable alert with custom icon
 * Alert({ 
 *   variant: "warning",
 *   style: "left-accent",
 *   icon: "⚠️",
 *   title: "Warning",
 *   description: "Please review your settings",
 *   closable: true,
 *   onClose: "handleAlertClose"
 * })
 * ```
 */
export function Alert(props: AlertProps): string {
  const {
    variant = "info",
    style = "subtle",
    title,
    description,
    icon,
    closable = false,
    onClose,
    className = "",
    children = [],
  } = props;

  const alertId = `alert-${Math.random().toString(36).substr(2, 9)}`;
  
  // Default icons for each variant
  const defaultIcons = {
    info: "ℹ️",
    success: "✅", 
    warning: "⚠️",
    error: "❌",
  };
  
  const alertIcon = icon || defaultIcons[variant];
  const alertText = Array.isArray(children) ? children.join("") : children;
  
  const styles = css({
    alert: {
      position: "relative",
      padding: componentTokens.spacing[4],
      borderRadius: componentTokens.radius.md,
      fontSize: componentTokens.typography.sizes.sm,
      lineHeight: componentTokens.typography.lineHeights.normal,
      display: "flex",
      gap: componentTokens.spacing[3],
      alignItems: "flex-start",
      
      // Style variants
      ...(style === "subtle" && {
        ...(variant === "info" && {
          backgroundColor: componentTokens.colors.primary[50],
          borderColor: componentTokens.colors.primary[200],
          color: componentTokens.colors.primary[800],
          border: `1px solid ${componentTokens.colors.primary[200]}`,
        }),
        ...(variant === "success" && {
          backgroundColor: componentTokens.colors.success[50],
          borderColor: componentTokens.colors.success[200],
          color: componentTokens.colors.success[800],
          border: `1px solid ${componentTokens.colors.success[200]}`,
        }),
        ...(variant === "warning" && {
          backgroundColor: componentTokens.colors.warning[50],
          borderColor: componentTokens.colors.warning[200],
          color: componentTokens.colors.warning[800],
          border: `1px solid ${componentTokens.colors.warning[200]}`,
        }),
        ...(variant === "error" && {
          backgroundColor: componentTokens.colors.error[50],
          borderColor: componentTokens.colors.error[200],
          color: componentTokens.colors.error[800],
          border: `1px solid ${componentTokens.colors.error[200]}`,
        }),
      }),
      
      ...(style === "solid" && {
        color: "white",
        ...(variant === "info" && {
          backgroundColor: componentTokens.colors.primary[500],
        }),
        ...(variant === "success" && {
          backgroundColor: componentTokens.colors.success[500],
        }),
        ...(variant === "warning" && {
          backgroundColor: componentTokens.colors.warning[500],
        }),
        ...(variant === "error" && {
          backgroundColor: componentTokens.colors.error[500],
        }),
      }),
      
      ...(style === "left-accent" && {
        borderLeft: `4px solid`,
        backgroundColor: componentTokens.colors.gray[50],
        border: `1px solid ${componentTokens.colors.gray[200]}`,
        ...(variant === "info" && {
          borderLeftColor: componentTokens.colors.primary[500],
          color: componentTokens.colors.primary[800],
        }),
        ...(variant === "success" && {
          borderLeftColor: componentTokens.colors.success[500],
          color: componentTokens.colors.success[800],
        }),
        ...(variant === "warning" && {
          borderLeftColor: componentTokens.colors.warning[500],
          color: componentTokens.colors.warning[800],
        }),
        ...(variant === "error" && {
          borderLeftColor: componentTokens.colors.error[500],
          color: componentTokens.colors.error[800],
        }),
      }),
      
      ...(style === "top-accent" && {
        borderTop: `4px solid`,
        backgroundColor: componentTokens.colors.gray[50],
        border: `1px solid ${componentTokens.colors.gray[200]}`,
        ...(variant === "info" && {
          borderTopColor: componentTokens.colors.primary[500],
          color: componentTokens.colors.primary[800],
        }),
        ...(variant === "success" && {
          borderTopColor: componentTokens.colors.success[500],
          color: componentTokens.colors.success[800],
        }),
        ...(variant === "warning" && {
          borderTopColor: componentTokens.colors.warning[500],
          color: componentTokens.colors.warning[800],
        }),
        ...(variant === "error" && {
          borderTopColor: componentTokens.colors.error[500],
          color: componentTokens.colors.error[800],
        }),
      }),
    },
    
    icon: {
      flexShrink: 0,
      fontSize: "1.25rem",
      lineHeight: 1,
    },
    
    content: {
      flex: 1,
      minWidth: 0,
    },
    
    title: {
      fontWeight: componentTokens.typography.weights.semibold,
      marginBottom: description || alertText ? componentTokens.spacing[1] : 0,
      fontSize: componentTokens.typography.sizes.sm,
    },
    
    description: {
      fontSize: componentTokens.typography.sizes.sm,
      opacity: 0.9,
    },
    
    closeButton: {
      position: "absolute",
      top: componentTokens.spacing[2],
      right: componentTokens.spacing[2],
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: componentTokens.spacing[1],
      borderRadius: componentTokens.radius.sm,
      fontSize: "1rem",
      lineHeight: 1,
      color: "currentColor",
      opacity: 0.7,
      transition: `all ${componentTokens.animation.duration.fast} ${componentTokens.animation.easing.out}`,
      
      "&:hover": {
        opacity: 1,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      },
      
      "&:focus": {
        outline: "none",
        opacity: 1,
        boxShadow: `0 0 0 2px currentColor`,
      },
    },
  });
  
  // Close functionality
  const closeScript = closable ? `
    <script>
      (function() {
        function closeAlert() {
          const alert = document.getElementById('${alertId}');
          if (alert) {
            // Fade out animation
            alert.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-10px)';
            
            // Remove from DOM after animation
            setTimeout(() => {
              alert.remove();
            }, 300);
            
            // Call custom close handler
            ${onClose ? `(${onClose})();` : ''}
          }
        }
        
        // Make function globally accessible
        window.closeAlert_${alertId.replace(/-/g, '_')} = closeAlert;
      })();
    </script>
  ` : "";
  
  const closeButton = closable ? `
    <button 
      class="${styles.classMap.closeButton}"
      type="button"
      aria-label="Close alert"
      onclick="closeAlert_${alertId.replace(/-/g, '_')}()"
    >
      ✕
    </button>
  ` : "";
  
  const titleElement = title ? `<div class="${styles.classMap.title}">${title}</div>` : "";
  
  const contentElement = description || alertText ? `
    <div class="${styles.classMap.description}">
      ${description || alertText}
    </div>
  ` : "";
  
  return `
    <div 
      id="${alertId}"
      class="${styles.classMap.alert} ${className}"
      role="alert"
      aria-live="polite"
    >
      ${alertIcon ? `<div class="${styles.classMap.icon}">${alertIcon}</div>` : ""}
      <div class="${styles.classMap.content}">
        ${titleElement}
        ${contentElement}
      </div>
      ${closeButton}
    </div>
    ${closeScript}
  `.trim();
}
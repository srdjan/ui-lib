// Toast component - Temporary notification messages
import { css } from "../../css-in-ts.ts";
import { componentTokens } from "../../themes/component-tokens.ts";
import type { BaseComponentProps } from "../types.ts";

export type ToastVariant = "info" | "success" | "warning" | "error";
export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type ToastProps = BaseComponentProps & {
  readonly variant?: ToastVariant;
  readonly title?: string;
  readonly description?: string;
  readonly icon?: string;
  readonly duration?: number; // in milliseconds
  readonly position?: ToastPosition;
  readonly closable?: boolean;
  readonly onClose?: string;
  readonly children?: string | string[];
};

/**
 * Toast component for temporary notification messages
 *
 * @example
 * ```tsx
 * // Basic toast
 * Toast({ variant: "success", children: "Settings saved successfully!" })
 *
 * // Toast with title and description
 * Toast({
 *   variant: "error",
 *   title: "Upload Failed",
 *   description: "Your file could not be uploaded. Please try again.",
 *   duration: 5000,
 *   closable: true
 * })
 *
 * // Programmatic toast creation
 * showToast({
 *   variant: "info",
 *   title: "New Message",
 *   description: "You have a new message from John",
 *   position: "top-right"
 * })
 * ```
 */
export function Toast(props: ToastProps): string {
  const {
    variant = "info",
    title,
    description,
    icon,
    duration = 4000,
    position = "top-right",
    closable = true,
    onClose,
    className = "",
    children = [],
  } = props;

  const toastId = `toast-${Math.random().toString(36).substr(2, 9)}`;
  const toastText = Array.isArray(children) ? children.join("") : children;

  // Default icons for each variant
  const defaultIcons = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "❌",
  };

  const toastIcon = icon || defaultIcons[variant];

  const styles = css({
    toast: {
      position: "relative",
      maxWidth: "28rem",
      minWidth: "20rem",
      backgroundColor: "white",
      border: "1px solid",
      borderRadius: componentTokens.radius.lg,
      boxShadow: componentTokens.shadows.lg,
      padding: componentTokens.spacing[4],
      display: "flex",
      gap: componentTokens.spacing[3],
      alignItems: "flex-start",
      fontSize: componentTokens.typography.sizes.sm,
      lineHeight: componentTokens.typography.lineHeights.normal,
      transform: "translateX(100%)",
      opacity: 0,
      transition:
        `all ${componentTokens.animation.duration.normal} ${componentTokens.animation.easing.out}`,

      // Variant colors
      ...(variant === "info" && {
        borderColor: componentTokens.colors.primary[200],
        color: componentTokens.colors.gray[800],
      }),
      ...(variant === "success" && {
        borderColor: componentTokens.colors.success[200],
        color: componentTokens.colors.gray[800],
      }),
      ...(variant === "warning" && {
        borderColor: componentTokens.colors.warning[200],
        color: componentTokens.colors.gray[800],
      }),
      ...(variant === "error" && {
        borderColor: componentTokens.colors.error[200],
        color: componentTokens.colors.gray[800],
      }),

      // Animation states
      "&[data-state='entering']": {
        transform: "translateX(0)",
        opacity: 1,
      },

      "&[data-state='exiting']": {
        transform: "translateX(100%)",
        opacity: 0,
      },
    },

    icon: {
      flexShrink: 0,
      fontSize: "1.25rem",
      lineHeight: 1,
      marginTop: componentTokens.spacing[0.5],
    },

    content: {
      flex: 1,
      minWidth: 0,
    },

    title: {
      fontWeight: componentTokens.typography.weights.semibold,
      marginBottom: componentTokens.spacing[1],
      color: componentTokens.colors.gray[900],
    },

    description: {
      fontSize: componentTokens.typography.sizes.sm,
      color: componentTokens.colors.gray[600],
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
      color: componentTokens.colors.gray[500],
      opacity: 0.7,
      transition:
        `all ${componentTokens.animation.duration.fast} ${componentTokens.animation.easing.out}`,

      "&:hover": {
        opacity: 1,
        backgroundColor: componentTokens.colors.gray[100],
      },

      "&:focus": {
        outline: "none",
        opacity: 1,
        boxShadow: `0 0 0 2px ${componentTokens.colors.primary[200]}`,
      },
    },

    progressBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      height: "3px",
      backgroundColor: variant === "info"
        ? componentTokens.colors.primary[500]
        : variant === "success"
        ? componentTokens.colors.success[500]
        : variant === "warning"
        ? componentTokens.colors.warning[500]
        : componentTokens.colors.error[500],
      borderRadius:
        `0 0 ${componentTokens.radius.lg} ${componentTokens.radius.lg}`,
      transform: "scaleX(1)",
      transformOrigin: "left",
      transition: `transform ${duration}ms linear`,
    },
  });

  // Toast lifecycle management
  const toastScript = `
    <script>
      (function() {
        const toast = document.getElementById('${toastId}');
        if (!toast) return;
        
        let isClosing = false;
        
        function closeToast() {
          if (isClosing) return;
          isClosing = true;
          
          toast.setAttribute('data-state', 'exiting');
          
          setTimeout(() => {
            if (toast.parentNode) {
              toast.remove();
            }
            
            // Call custom close handler
            ${onClose ? `(${onClose})();` : ""}
          }, 300);
        }
        
        // Auto-close after duration
        ${
    duration > 0
      ? `
          const progressBar = toast.querySelector('[data-progress]');
          if (progressBar) {
            // Start progress bar animation
            setTimeout(() => {
              progressBar.style.transform = 'scaleX(0)';
            }, 50);
          }
          
          const autoCloseTimer = setTimeout(closeToast, ${duration});
          
          // Pause timer on hover
          toast.addEventListener('mouseenter', () => {
            clearTimeout(autoCloseTimer);
            if (progressBar) {
              progressBar.style.animationPlayState = 'paused';
            }
          });
          
          // Resume timer on mouse leave
          toast.addEventListener('mouseleave', () => {
            setTimeout(closeToast, 1000); // Give 1 second before auto-close
            if (progressBar) {
              progressBar.style.animationPlayState = 'running';
            }
          });
        `
      : ""
  }
        
        // Enter animation
        setTimeout(() => {
          toast.setAttribute('data-state', 'entering');
        }, 50);
        
        // Make close function globally accessible
        window.closeToast_${toastId.replace(/-/g, "_")} = closeToast;
      })();
    </script>
  `;

  const closeButton = closable
    ? `
    <button 
      class="${styles.classMap.closeButton}"
      type="button"
      aria-label="Close notification"
      onclick="closeToast_${toastId.replace(/-/g, "_")}()"
    >
      ✕
    </button>
  `
    : "";

  const titleElement = title
    ? `<div class="${styles.classMap.title}">${title}</div>`
    : "";

  const contentElement = description || toastText
    ? `
    <div class="${styles.classMap.description}">
      ${description || toastText}
    </div>
  `
    : "";

  const progressBar = duration > 0
    ? `
    <div class="${styles.classMap.progressBar}" data-progress></div>
  `
    : "";

  return `
    <div 
      id="${toastId}"
      class="${styles.classMap.toast} ${className}"
      role="alert"
      aria-live="assertive"
      data-state="initial"
    >
      ${
    toastIcon ? `<div class="${styles.classMap.icon}">${toastIcon}</div>` : ""
  }
      <div class="${styles.classMap.content}">
        ${titleElement}
        ${contentElement}
      </div>
      ${closeButton}
      ${progressBar}
    </div>
    ${toastScript}
  `.trim();
}

/**
 * Global toast container and management functions
 */
export const ToastContainer = (position: ToastPosition = "top-right") => {
  const posClass = `pos-${position}`;
  return `
    <style>
      .toast-container {
        position: fixed;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: ${componentTokens.spacing[2]};
        pointer-events: none;
      }
      .toast-container > * { pointer-events: auto; }
      .toast-container.pos-top-left { top: ${
    componentTokens.spacing[4]
  }; left: ${componentTokens.spacing[4]}; }
      .toast-container.pos-top-center { top: ${
    componentTokens.spacing[4]
  }; left: 50%; transform: translateX(-50%); }
      .toast-container.pos-top-right { top: ${
    componentTokens.spacing[4]
  }; right: ${componentTokens.spacing[4]}; }
      .toast-container.pos-bottom-left { bottom: ${
    componentTokens.spacing[4]
  }; left: ${componentTokens.spacing[4]}; }
      .toast-container.pos-bottom-center { bottom: ${
    componentTokens.spacing[4]
  }; left: 50%; transform: translateX(-50%); }
      .toast-container.pos-bottom-right { bottom: ${
    componentTokens.spacing[4]
  }; right: ${componentTokens.spacing[4]}; }
    </style>
    <div id="toast-container-${position}" class="toast-container ${posClass}">
      <!-- Toasts will be inserted here -->
    </div>
  `;
};

/**
 * Utility function to show toasts programmatically
 * This creates a JavaScript function that can be injected into the page
 */
export function createShowToastScript(): string {
  return `
    (function(){
      if (!document.getElementById('toast-runtime-styles')) {
        const s = document.createElement('style');
        s.id = 'toast-runtime-styles';
        s.textContent = \`
.toast-component{position:relative;max-width:28rem;min-width:20rem;background:var(--gray-0);border:1px solid var(--gray-200);border-radius:0.5rem;box-shadow:${componentTokens.shadows.lg};padding:1rem;display:flex;gap:0.75rem;align-items:flex-start;font-size:0.875rem;line-height:1.5;transform:translateX(100%);opacity:0;transition:all 0.3s ease;pointer-events:auto}
.toast-component[data-state='entering']{transform:translateX(0);opacity:1}
.toast-icon{flex-shrink:0;font-size:1.25rem;line-height:1;margin-top:0.125rem}
.toast-content{flex:1;min-width:0}
.toast-title{font-weight:600;margin-bottom:0.25rem;color:var(--gray-900)}
.toast-desc{font-size:0.875rem;color:var(--gray-600)}
.toast-close{position:absolute;top:0.5rem;right:0.5rem;background:none;border:none;cursor:pointer;padding:0.25rem;border-radius:0.125rem;font-size:1rem;line-height:1;color:var(--gray-500);opacity:.7;transition:all .15s ease}
.toast-close:hover{opacity:1;background-color:var(--gray-100)}
.toast-progress{position:absolute;bottom:0;left:0;height:3px;border-radius:0 0 0.5rem 0.5rem;transform:scaleX(1);transform-origin:left;transition:transform var(--toast-duration, 4000ms) linear}
.toast-progress.shrink{transform:scaleX(0)}
.toast-component.variant-info{border-color:var(--blue-2)}
.toast-component.variant-success{border-color:var(--green-2)}
.toast-component.variant-warning{border-color:var(--yellow-2)}
.toast-component.variant-error{border-color:var(--red-2)}
.toast-progress.variant-info{background-color:var(--blue-6)}
.toast-progress.variant-success{background-color:var(--green-6)}
.toast-progress.variant-warning{background-color:var(--yellow-6)}
.toast-progress.variant-error{background-color:var(--red-6)}
        \`;
        document.head.appendChild(s);
      }
      window.showToast = function(props) {
      const position = props.position || 'top-right';
      const containerId = 'toast-container-' + position;
      let container = document.getElementById(containerId);
      
      // Create container if it doesn't exist
      if (!container) {
        const containerHtml = \`${
    ToastContainer("top-right").replace(/`/g, "\\`")
  }\`;
        document.body.insertAdjacentHTML('beforeend', containerHtml);
        container = document.getElementById(containerId);
      }
      
      // Generate toast HTML using the Toast function
      const toastId = 'toast-' + Math.random().toString(36).substr(2, 9);
      const variant = props.variant || 'info';
      const title = props.title || '';
      const description = props.description || props.children || '';
      const icon = props.icon || (variant === 'info' ? 'ℹ️' : variant === 'success' ? '✅' : variant === 'warning' ? '⚠️' : '❌');
      const duration = props.duration || 4000;
      const closable = props.closable !== false;
      
      const toastHtml = \`
        <div 
          id="\${toastId}"
          class="toast-component variant-\${variant}"
          role="alert"
          aria-live="assertive"
          data-state="initial"

        >
          <div class="toast-icon">
            \${icon}
          </div>
          <div class="toast-content">
            \${title ? \`<div class="toast-title">\${title}</div>\` : ''}
            \${description ? \`<div class="toast-desc">\${description}</div>\` : ''}
          </div>
          \${closable ? \`
            <button
              onclick="closeToast('\${toastId}')"
              class="toast-close"
            >
              ✕
            </button>
          \` : ''}
          \${duration > 0 ? \`
            <div
              class="toast-progress variant-\${variant}"
              data-progress
            ></div>
          \` : ''}
        </div>
      \`;
      
      container.insertAdjacentHTML('beforeend', toastHtml);
      const toastElement = container.lastElementChild;
      
      // Setup close function
      window.closeToast = function(toastId) {
        const toast = document.getElementById(toastId);
        if (toast) {
          toast.style.transform = 'translateX(100%)';
          toast.style.opacity = '0';
          setTimeout(() => toast.remove(), 300);
          if (props.onClose) props.onClose();
        }
      };
      
      // Enter animation
      setTimeout(() => {
        toastElement.style.transform = 'translateX(0)';
        toastElement.style.opacity = '1';
      }, 50);
      
      // Auto-close
      if (duration > 0) {
        const progressBar = toastElement.querySelector('[data-progress]');
        if (progressBar) {
          (progressBar as HTMLElement).style.setProperty('--toast-duration', duration + 'ms');
          setTimeout(() => {
            (progressBar as HTMLElement).style.transform = 'scaleX(0)';
          }, 100);
        }
        
        setTimeout(() => {
          if (toastElement.parentNode) {
            window.closeToast(toastId);
          }
        }, duration);
      }
      
      return toastElement;
    };
    })();
  `;
}

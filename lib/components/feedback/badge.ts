// Badge component - Small status descriptors and labels
import { css } from "../../css-in-ts.ts";
import { componentTokens } from "../../themes/component-tokens.ts";
import type { ComponentSize, BaseComponentProps } from "../types.ts";

export type BadgeVariant = "solid" | "subtle" | "outline" | "ghost";
export type BadgeColorScheme = "gray" | "primary" | "success" | "warning" | "error" | "info";
export type BadgeShape = "rectangle" | "pill" | "circle";

export interface BadgeProps extends BaseComponentProps {
  variant?: BadgeVariant;
  colorScheme?: BadgeColorScheme;
  size?: ComponentSize;
  shape?: BadgeShape;
  icon?: string;
  removable?: boolean;
  onRemove?: string;
  children?: string | string[] | number;
}

/**
 * Badge component for status indicators and labels
 * 
 * @example
 * ```tsx
 * // Basic badges
 * Badge({ children: "New" })
 * Badge({ variant: "solid", colorScheme: "success", children: "Active" })
 * 
 * // Badge with icon and removal
 * Badge({ 
 *   icon: "🏷️", 
 *   children: "Tag",
 *   removable: true,
 *   onRemove: "handleTagRemove",
 *   shape: "pill"
 * })
 * 
 * // Notification badge
 * Badge({ 
 *   variant: "solid",
 *   colorScheme: "error",
 *   shape: "circle",
 *   size: "sm",
 *   children: 5
 * })
 * ```
 */
export function Badge(props: BadgeProps): string {
  const {
    variant = "subtle",
    colorScheme = "gray",
    size = "md",
    shape = "rectangle",
    icon,
    removable = false,
    onRemove,
    className = "",
    children = [],
  } = props;

  const badgeId = `badge-${Math.random().toString(36).substr(2, 9)}`;
  const badgeText = Array.isArray(children) ? children.join("") : String(children);
  
  // Color scheme definitions
  const colorSchemes = {
    gray: {
      solid: { bg: componentTokens.colors.gray[500], color: "white" },
      subtle: { bg: componentTokens.colors.gray[100], color: componentTokens.colors.gray[800] },
      outline: { bg: "transparent", color: componentTokens.colors.gray[600], border: componentTokens.colors.gray[300] },
      ghost: { bg: "transparent", color: componentTokens.colors.gray[600] },
    },
    primary: {
      solid: { bg: componentTokens.colors.primary[500], color: "white" },
      subtle: { bg: componentTokens.colors.primary[100], color: componentTokens.colors.primary[800] },
      outline: { bg: "transparent", color: componentTokens.colors.primary[600], border: componentTokens.colors.primary[300] },
      ghost: { bg: "transparent", color: componentTokens.colors.primary[600] },
    },
    success: {
      solid: { bg: componentTokens.colors.success[500], color: "white" },
      subtle: { bg: componentTokens.colors.success[100], color: componentTokens.colors.success[800] },
      outline: { bg: "transparent", color: componentTokens.colors.success[600], border: componentTokens.colors.success[300] },
      ghost: { bg: "transparent", color: componentTokens.colors.success[600] },
    },
    warning: {
      solid: { bg: componentTokens.colors.warning[500], color: "white" },
      subtle: { bg: componentTokens.colors.warning[100], color: componentTokens.colors.warning[800] },
      outline: { bg: "transparent", color: componentTokens.colors.warning[600], border: componentTokens.colors.warning[300] },
      ghost: { bg: "transparent", color: componentTokens.colors.warning[600] },
    },
    error: {
      solid: { bg: componentTokens.colors.error[500], color: "white" },
      subtle: { bg: componentTokens.colors.error[100], color: componentTokens.colors.error[800] },
      outline: { bg: "transparent", color: componentTokens.colors.error[600], border: componentTokens.colors.error[300] },
      ghost: { bg: "transparent", color: componentTokens.colors.error[600] },
    },
    info: {
      solid: { bg: componentTokens.colors.primary[500], color: "white" },
      subtle: { bg: componentTokens.colors.primary[50], color: componentTokens.colors.primary[700] },
      outline: { bg: "transparent", color: componentTokens.colors.primary[600], border: componentTokens.colors.primary[300] },
      ghost: { bg: "transparent", color: componentTokens.colors.primary[600] },
    },
  };
  
  const colors = colorSchemes[colorScheme][variant];
  
  const styles = css({
    badge: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: componentTokens.spacing[1],
      fontWeight: componentTokens.typography.weights.medium,
      fontSize: componentTokens.typography.sizes.xs,
      lineHeight: componentTokens.typography.lineHeights.tight,
      whiteSpace: "nowrap",
      verticalAlign: "middle",
      backgroundColor: colors.bg,
      color: colors.color,
      border: colors.border ? `1px solid ${colors.border}` : "none",
      transition: `all ${componentTokens.animation.duration.normal} ${componentTokens.animation.easing.out}`,
      
      // Size variants
      ...(size === "xs" && {
        fontSize: "0.625rem", // 10px
        padding: `${componentTokens.spacing[0.5]} ${componentTokens.spacing[1.5]}`,
        minHeight: "1rem",
      }),
      ...(size === "sm" && {
        fontSize: componentTokens.typography.sizes.xs,
        padding: `${componentTokens.spacing[0.5]} ${componentTokens.spacing[2]}`,
        minHeight: "1.25rem",
      }),
      ...(size === "md" && {
        fontSize: componentTokens.typography.sizes.xs,
        padding: `${componentTokens.spacing[1]} ${componentTokens.spacing[2.5]}`,
        minHeight: "1.5rem",
      }),
      ...(size === "lg" && {
        fontSize: componentTokens.typography.sizes.sm,
        padding: `${componentTokens.spacing[1]} ${componentTokens.spacing[3]}`,
        minHeight: "1.75rem",
      }),
      ...(size === "xl" && {
        fontSize: componentTokens.typography.sizes.sm,
        padding: `${componentTokens.spacing[1.5]} ${componentTokens.spacing[4]}`,
        minHeight: "2rem",
      }),
      
      // Shape variants
      ...(shape === "rectangle" && {
        borderRadius: componentTokens.radius.sm,
      }),
      ...(shape === "pill" && {
        borderRadius: componentTokens.radius.full,
      }),
      ...(shape === "circle" && {
        borderRadius: componentTokens.radius.full,
        aspectRatio: "1",
        padding: 0,
        minWidth: size === "xs" ? "1rem" : size === "sm" ? "1.25rem" : size === "md" ? "1.5rem" : size === "lg" ? "1.75rem" : "2rem",
      }),
    },
    
    icon: {
      fontSize: "0.875em",
      lineHeight: 1,
      flexShrink: 0,
    },
    
    content: {
      flex: shape === "circle" ? 0 : 1,
      textAlign: "center",
      minWidth: 0,
    },
    
    removeButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "1em",
      height: "1em",
      marginLeft: componentTokens.spacing[1],
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      color: "currentColor",
      border: "none",
      borderRadius: componentTokens.radius.full,
      cursor: "pointer",
      fontSize: "0.75em",
      lineHeight: 1,
      opacity: 0.8,
      transition: `all ${componentTokens.animation.duration.fast} ${componentTokens.animation.easing.out}`,
      
      "&:hover": {
        opacity: 1,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        transform: "scale(1.1)",
      },
      
      "&:focus": {
        outline: "none",
        opacity: 1,
        boxShadow: `0 0 0 2px currentColor`,
      },
    },
  });
  
  // Remove functionality
  const removeScript = removable ? `
    <script>
      (function() {
        function removeBadge() {
          const badge = document.getElementById('${badgeId}');
          if (badge) {
            // Scale out animation
            badge.style.transition = 'all 0.2s ease';
            badge.style.transform = 'scale(0)';
            badge.style.opacity = '0';
            
            // Remove from DOM after animation
            setTimeout(() => {
              badge.remove();
            }, 200);
            
            // Call custom remove handler
            ${onRemove ? `(${onRemove})();` : ''}
          }
        }
        
        // Make function globally accessible
        window.removeBadge_${badgeId.replace(/-/g, '_')} = removeBadge;
      })();
    </script>
  ` : "";
  
  const removeButton = removable && shape !== "circle" ? `
    <button 
      class="${styles.classMap.removeButton}"
      type="button"
      aria-label="Remove badge"
      onclick="removeBadge_${badgeId.replace(/-/g, '_')}()"
    >
      ×
    </button>
  ` : "";
  
  const iconElement = icon ? `<span class="${styles.classMap.icon}">${icon}</span>` : "";
  
  const contentElement = shape === "circle" && badgeText.length > 2 
    ? badgeText.slice(0, 2) + (badgeText.length > 2 ? "+" : "") // Truncate for circle badges
    : badgeText;
  
  return `
    <span 
      id="${badgeId}"
      class="${styles.classMap.badge} ${className}"
      role="status"
      aria-label="${badgeText ? `Badge: ${badgeText}` : "Badge"}"
    >
      ${iconElement}
      <span class="${styles.classMap.content}">${contentElement}</span>
      ${removeButton}
    </span>
    ${removeScript}
  `.trim();
}
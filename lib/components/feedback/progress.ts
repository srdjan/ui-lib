// Progress component - Linear and circular progress indicators
import { css } from "../../css-in-ts.ts";
import { componentTokens } from "../../themes/component-tokens.ts";
import type { ComponentSize, BaseComponentProps } from "../types.ts";

export type ProgressVariant = "linear" | "circular";
export type ProgressColorScheme = "primary" | "success" | "warning" | "error";

export interface ProgressProps extends BaseComponentProps {
  variant?: ProgressVariant;
  value?: number;
  max?: number;
  size?: ComponentSize;
  colorScheme?: ProgressColorScheme;
  isIndeterminate?: boolean;
  hasStripe?: boolean;
  isAnimated?: boolean;
  thickness?: number;
  trackColor?: string;
  label?: string;
  valueText?: string;
  showValue?: boolean;
  children?: string | string[];
}

/**
 * Progress component for showing completion progress
 * 
 * @example
 * ```tsx
 * // Basic linear progress
 * Progress({ value: 65, max: 100 })
 * 
 * // Circular progress with label
 * Progress({ 
 *   variant: "circular", 
 *   value: 75, 
 *   size: "lg",
 *   label: "Loading..." 
 * })
 * 
 * // Indeterminate progress with stripes
 * Progress({ 
 *   isIndeterminate: true,
 *   hasStripe: true,
 *   isAnimated: true,
 *   colorScheme: "success"
 * })
 * ```
 */
export function Progress(props: ProgressProps): string {
  const {
    variant = "linear",
    value = 0,
    max = 100,
    size = "md",
    colorScheme = "primary",
    isIndeterminate = false,
    hasStripe = false,
    isAnimated = false,
    thickness = 4,
    trackColor,
    label,
    valueText,
    showValue = false,
    className = "",
    children = [],
  } = props;

  const progressId = `progress-${Math.random().toString(36).substr(2, 9)}`;
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const progressText = Array.isArray(children) ? children.join("") : children;
  
  // Color schemes
  const colorSchemes = {
    primary: {
      bg: componentTokens.colors.primary[500],
      light: componentTokens.colors.primary[100],
    },
    success: {
      bg: componentTokens.colors.success[500],
      light: componentTokens.colors.success[100],
    },
    warning: {
      bg: componentTokens.colors.warning[500],
      light: componentTokens.colors.warning[100],
    },
    error: {
      bg: componentTokens.colors.error[500],
      light: componentTokens.colors.error[100],
    },
  };
  
  const colors = colorSchemes[colorScheme];
  
  const styles = css({
    wrapper: {
      width: "100%",
    },
    
    labelContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: componentTokens.spacing[2],
    },
    
    label: {
      fontSize: componentTokens.typography.sizes.sm,
      fontWeight: componentTokens.typography.weights.medium,
      color: componentTokens.colors.gray[700],
    },
    
    valueLabel: {
      fontSize: componentTokens.typography.sizes.sm,
      color: componentTokens.colors.gray[600],
    },
    
    // Linear progress styles
    linearTrack: {
      width: "100%",
      backgroundColor: trackColor || componentTokens.colors.gray[200],
      borderRadius: componentTokens.radius.full,
      overflow: "hidden",
      position: "relative",
      
      // Size variants for linear
      ...(size === "xs" && { height: "0.25rem" }),
      ...(size === "sm" && { height: "0.5rem" }),
      ...(size === "md" && { height: "0.75rem" }),
      ...(size === "lg" && { height: "1rem" }),
      ...(size === "xl" && { height: "1.25rem" }),
    },
    
    linearFill: {
      height: "100%",
      backgroundColor: colors.bg,
      transition: isIndeterminate ? "none" : `width ${componentTokens.animation.duration.normal} ${componentTokens.animation.easing.out}`,
      borderRadius: "inherit",
      
      // Stripe pattern
      ...(hasStripe && {
        backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)`,
        backgroundSize: "1rem 1rem",
      }),
      
      // Animation for stripes
      ...(hasStripe && isAnimated && {
        animation: "progress-stripes 1s linear infinite",
      }),
      
      // Indeterminate animation
      ...(isIndeterminate && {
        width: "40%",
        animation: "progress-indeterminate 2s ease-in-out infinite",
      }),
    },
    
    // Circular progress styles
    circularContainer: {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      
      // Size variants for circular
      ...(size === "xs" && { 
        width: "2rem", 
        height: "2rem",
        fontSize: componentTokens.typography.sizes.xs,
      }),
      ...(size === "sm" && { 
        width: "3rem", 
        height: "3rem",
        fontSize: componentTokens.typography.sizes.sm,
      }),
      ...(size === "md" && { 
        width: "4rem", 
        height: "4rem",
        fontSize: componentTokens.typography.sizes.sm,
      }),
      ...(size === "lg" && { 
        width: "6rem", 
        height: "6rem",
        fontSize: componentTokens.typography.sizes.base,
      }),
      ...(size === "xl" && { 
        width: "8rem", 
        height: "8rem",
        fontSize: componentTokens.typography.sizes.lg,
      }),
    },
    
    circularSvg: {
      transform: "rotate(-90deg)",
      width: "100%",
      height: "100%",
    },
    
    circularTrack: {
      fill: "none",
      stroke: trackColor || componentTokens.colors.gray[200],
      strokeWidth: thickness,
    },
    
    circularFill: {
      fill: "none",
      stroke: colors.bg,
      strokeWidth: thickness,
      strokeLinecap: "round",
      transition: isIndeterminate ? "none" : `stroke-dashoffset ${componentTokens.animation.duration.normal} ${componentTokens.animation.easing.out}`,
      
      // Indeterminate animation
      ...(isIndeterminate && {
        animation: "progress-circular 2s linear infinite",
      }),
    },
    
    circularLabel: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontWeight: componentTokens.typography.weights.semibold,
      color: componentTokens.colors.gray[700],
      textAlign: "center",
      fontSize: "inherit",
    },
  });
  
  // Render linear progress
  if (variant === "linear") {
    const hasLabel = Boolean(label || progressText || showValue);
    
    return `
      <div class="${styles.classMap.wrapper} ${className}">
        ${hasLabel ? `
          <div class="${styles.classMap.labelContainer}">
            <div class="${styles.classMap.label}">
              ${label || progressText || ""}
            </div>
            ${showValue || valueText ? `
              <div class="${styles.classMap.valueLabel}">
                ${valueText || `${Math.round(percentage)}%`}
              </div>
            ` : ""}
          </div>
        ` : ""}
        
        <div 
          class="${styles.classMap.linearTrack}"
          role="progressbar"
          aria-valuenow="${isIndeterminate ? undefined : value}"
          aria-valuemin="0"
          aria-valuemax="${max}"
          ${label ? `aria-labelledby="${progressId}-label"` : ""}
        >
          <div 
            class="${styles.classMap.linearFill}"
            style="width: ${isIndeterminate ? "40%" : `${percentage}%`}"
          ></div>
        </div>
      </div>
      
      <style>
        @keyframes progress-stripes {
          0% { background-position: 0 0; }
          100% { background-position: 1rem 0; }
        }
        
        @keyframes progress-indeterminate {
          0% { left: -40%; }
          100% { left: 100%; }
        }
      </style>
    `;
  }
  
  // Render circular progress
  const radius = 50 - thickness / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = isIndeterminate ? circumference * 0.75 : circumference - (percentage / 100) * circumference;
  
  return `
    <div class="${styles.classMap.wrapper} ${className}">
      <div class="${styles.classMap.circularContainer}">
        <svg class="${styles.classMap.circularSvg}" viewBox="0 0 100 100">
          <!-- Track -->
          <circle
            class="${styles.classMap.circularTrack}"
            cx="50"
            cy="50"
            r="${radius}"
          />
          <!-- Progress -->
          <circle
            class="${styles.classMap.circularFill}"
            cx="50"
            cy="50"
            r="${radius}"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${strokeDashoffset}"
            ${isIndeterminate ? `style="stroke-dasharray: ${circumference * 0.25} ${circumference};"` : ""}
          />
        </svg>
        
        ${label || progressText || showValue ? `
          <div class="${styles.classMap.circularLabel}">
            ${showValue && !isIndeterminate ? `${Math.round(percentage)}%` : label || progressText || ""}
          </div>
        ` : ""}
      </div>
    </div>
    
    <style>
      @keyframes progress-circular {
        0% {
          stroke-dasharray: ${circumference * 0.01} ${circumference};
          stroke-dashoffset: 0;
        }
        50% {
          stroke-dasharray: ${circumference * 0.4} ${circumference};
          stroke-dashoffset: ${-circumference * 0.15};
        }
        100% {
          stroke-dasharray: ${circumference * 0.01} ${circumference};
          stroke-dashoffset: ${-circumference};
        }
      }
    </style>
  `;
}
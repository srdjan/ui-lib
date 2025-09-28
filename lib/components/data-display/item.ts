/**
 * Item Component - Generic reusable item display
 * Can be used for todo items, list items, cards, user cards, etc.
 *
 * Refactored to use modern CSS-in-TS with design tokens and cascade layers
 */

import { css } from "../../css-in-ts.ts";
import { defineComponent } from "../../internal.ts";
import { componentTokens } from "../../themes/component-tokens.ts";
import type { ComponentSize } from "../types.ts";

// Modern CSS-in-TS styles using design tokens
function createItemStyles() {
  return css({
    item: {
      // Layout
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      position: "relative",
      containerType: "inline-size",

      // Spacing & sizing
      padding: componentTokens.spacing[4],
      gap: componentTokens.spacing[3],

      // Visual styling
      backgroundColor: componentTokens.colors.surface.background,
      border: `1px solid ${componentTokens.colors.surface.border}`,
      borderRadius: componentTokens.radius.md,
      boxShadow: componentTokens.shadows.sm,

      // Animation
      transition:
        `all ${componentTokens.animation.duration.normal} ${componentTokens.animation.easing.out}`,

      // Hover state
      "&:hover": {
        backgroundColor: componentTokens.colors.surface.muted,
        borderColor: componentTokens.colors.gray[300],
        boxShadow: componentTokens.shadows.base,
      },

      // Focus state
      "&:focus-within": {
        outline: `2px solid ${componentTokens.colors.primary[300]}`,
        outlineOffset: "2px",
      },

      // Container queries for responsive design
      "@media": {
        "(max-width: 300px)": {
          flexDirection: "column",
          alignItems: "stretch",
          gap: componentTokens.spacing[3],
        },
      },
    },

    // State variants
    completed: {
      opacity: 0.7,
      textDecoration: "line-through",
      backgroundColor: componentTokens.colors.gray[100],
    },

    selected: {
      backgroundColor: componentTokens.colors.primary[50],
      borderColor: componentTokens.colors.primary[300],
    },

    // Priority variants
    priorityHigh: {
      borderInlineStart: `4px solid ${componentTokens.colors.error[500]}`,
    },

    priorityMedium: {
      borderInlineStart: `4px solid ${componentTokens.colors.warning[500]}`,
    },

    priorityLow: {
      borderInlineStart: `4px solid ${componentTokens.colors.success[500]}`,
    },

    // Layout components
    content: {
      display: "flex",
      alignItems: "flex-start",
      gap: componentTokens.spacing[3],
      flex: 1,
      minWidth: 0,

      "@media": {
        "(max-width: 300px)": {
          flexDirection: "column",
          alignItems: "stretch",
          gap: componentTokens.spacing[2],
        },
      },
    },

    icon: {
      flexShrink: 0,
      width: componentTokens.spacing[6],
      height: componentTokens.spacing[6],
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: componentTokens.colors.gray[500],

      "& svg, & img": {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: componentTokens.radius.sm,
      },
    },

    main: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: componentTokens.spacing[1],
    },

    title: {
      fontSize: componentTokens.typography.sizes.base,
      fontWeight: componentTokens.typography.weights.semibold,
      color: componentTokens.colors.surface.foreground,
      lineHeight: componentTokens.typography.lineHeights.tight,
      margin: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },

    description: {
      fontSize: componentTokens.typography.sizes.sm,
      color: componentTokens.colors.gray[600],
      lineHeight: componentTokens.typography.lineHeights.normal,
      margin: 0,
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    },

    metadata: {
      display: "flex",
      alignItems: "center",
      gap: componentTokens.spacing[2],
      marginBlockStart: componentTokens.spacing[2],
      fontSize: componentTokens.typography.sizes.xs,
      color: componentTokens.colors.gray[500],

      "@media": {
        "(max-width: 300px)": {
          flexWrap: "wrap",
          gap: componentTokens.spacing[1],
        },
      },
    },

    badges: {
      display: "flex",
      alignItems: "center",
      gap: componentTokens.spacing[1],
      marginBlockStart: componentTokens.spacing[2],
      flexWrap: "wrap",
    },

    badge: {
      display: "inline-flex",
      alignItems: "center",
      padding: `${componentTokens.spacing[1]} ${componentTokens.spacing[2]}`,
      fontSize: componentTokens.typography.sizes.xs,
      fontWeight: componentTokens.typography.weights.medium,
      borderRadius: componentTokens.radius.sm,
      textTransform: "uppercase",
      letterSpacing: componentTokens.typography.letterSpacing.wide,
    },

    // Badge variants
    badgePrimary: {
      backgroundColor: componentTokens.colors.primary[100],
      color: componentTokens.colors.primary[800],
    },

    badgeSuccess: {
      backgroundColor: componentTokens.colors.success[100],
      color: componentTokens.colors.success[800],
    },

    badgeWarning: {
      backgroundColor: componentTokens.colors.warning[100],
      color: componentTokens.colors.warning[800],
    },

    badgeDanger: {
      backgroundColor: componentTokens.colors.error[100],
      color: componentTokens.colors.error[800],
    },

    badgeNeutral: {
      backgroundColor: componentTokens.colors.gray[100],
      color: componentTokens.colors.gray[700],
    },

    // Actions
    actions: {
      display: "flex",
      alignItems: "center",
      gap: componentTokens.spacing[1],
      flexShrink: 0,

      "@media": {
        "(max-width: 300px)": {
          alignSelf: "stretch",
          justifyContent: "space-between",
          marginBlockStart: componentTokens.spacing[2],
        },
      },
    },

    action: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: componentTokens.spacing[2],
      backgroundColor: "transparent",
      color: componentTokens.colors.gray[500],
      border: "none",
      borderRadius: componentTokens.radius.sm,
      cursor: "pointer",
      fontSize: componentTokens.typography.sizes.sm,
      transition:
        `all ${componentTokens.animation.duration.fast} ${componentTokens.animation.easing.out}`,
      minWidth: componentTokens.spacing[8],
      minHeight: componentTokens.spacing[8],

      "&:hover": {
        backgroundColor: componentTokens.colors.surface.muted,
        color: componentTokens.colors.surface.foreground,
      },

      "&:focus-visible": {
        outline: `2px solid ${componentTokens.colors.primary[500]}`,
        outlineOffset: "2px",
      },
    },

    actionDanger: {
      color: componentTokens.colors.error[500],

      "&:hover": {
        backgroundColor: componentTokens.colors.error[50],
        color: componentTokens.colors.error[600],
      },
    },

    actionPrimary: {
      color: componentTokens.colors.primary[500],

      "&:hover": {
        backgroundColor: componentTokens.colors.primary[50],
        color: componentTokens.colors.primary[600],
      },
    },
  });
}

// Props type for the Item component
export type ItemProps = {
  readonly id?: string;
  readonly title?: string;
  readonly description?: string;
  readonly icon?: string;
  readonly timestamp?: string;
  readonly badges?: readonly ItemBadge[];
  readonly actions?: readonly ItemAction[];
  readonly variant?: ItemVariant;
  readonly size?: ComponentSize;
  readonly priority?: ItemPriority;
  readonly completed?: boolean;
  readonly selected?: boolean;
};

// Enhanced props with better typing
export type ItemVariant = "default" | "completed" | "selected" | "priority";
export type ItemPriority = "low" | "medium" | "high";
export type BadgeVariant =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "neutral";
export type ActionVariant = "default" | "primary" | "danger";

export type ItemBadge = {
  readonly text: string;
  readonly variant?: BadgeVariant;
};

export type ItemAction = {
  readonly text: string;
  /** Optional legacy onclick JS handler (kept for backward compatibility) */
  readonly action?: string;
  /** Preferred: raw attribute string (e.g., hx-* attrs) to spread on the button */
  readonly attributes?: string;
  /** Optional friendly confirmation label (library will map to hx-confirm) */
  readonly confirm?: string;
  readonly variant?: ActionVariant;
};

// Define the Item component using the modern defineComponent API
defineComponent<ItemProps>("item", {
  render: (props) => {
    const {
      id = "",
      title = "",
      description = "",
      icon = "",
      timestamp = "",
      badges = [],
      actions = [],
      variant = "default",
      size = "md",
      priority = "",
      completed = false,
      selected = false,
    } = props;

    // Generate CSS styles
    const styles = createItemStyles();

    // Build CSS classes
    const itemClasses = [
      styles.classMap.item,
      (variant === "completed" || completed) && styles.classMap.completed,
      (variant === "selected" || selected) && styles.classMap.selected,
      priority === "high" && styles.classMap.priorityHigh,
      priority === "medium" && styles.classMap.priorityMedium,
      priority === "low" && styles.classMap.priorityLow,
    ].filter(Boolean).join(" ");

    // Helper to get badge class
    const getBadgeClass = (variant?: BadgeVariant) => {
      const baseClass = styles.classMap.badge;
      switch (variant) {
        case "primary":
          return `${baseClass} ${styles.classMap.badgePrimary}`;
        case "success":
          return `${baseClass} ${styles.classMap.badgeSuccess}`;
        case "warning":
          return `${baseClass} ${styles.classMap.badgeWarning}`;
        case "danger":
          return `${baseClass} ${styles.classMap.badgeDanger}`;
        default:
          return `${baseClass} ${styles.classMap.badgeNeutral}`;
      }
    };

    // Helper to get action class
    const getActionClass = (variant?: ActionVariant) => {
      const baseClass = styles.classMap.action;
      switch (variant) {
        case "primary":
          return `${baseClass} ${styles.classMap.actionPrimary}`;
        case "danger":
          return `${baseClass} ${styles.classMap.actionDanger}`;
        default:
          return baseClass;
      }
    };

    // Render icon
    const iconHtml = icon
      ? `
      <div class="${styles.classMap.icon}">
        ${icon}
      </div>
    `
      : "";

    // Render badges
    const badgesHtml = badges.length > 0
      ? `
      <div class="${styles.classMap.badges}">
        ${
        badges.map((badge) => `
          <span class="${getBadgeClass(badge.variant)}">
            ${badge.text}
          </span>
        `).join("")
      }
      </div>
    `
      : "";

    // Render metadata
    const metadataHtml = timestamp
      ? `
      <div class="${styles.classMap.metadata}">
        <span>${timestamp}</span>
      </div>
    `
      : "";

    // Render actions
    const actionsHtml = actions.length > 0
      ? `
      <div class="${styles.classMap.actions}">
        ${
        actions.map((action) => {
          const extra = action.attributes
            ? ` ${action.attributes}`
            : (action.action
              ? ` onclick="${action.action.replace(/"/g, "&quot;")}"`
              : "");
          const confirm = action.confirm
            ? ` hx-confirm="${String(action.confirm).replace(/"/g, "&quot;")}"`
            : "";
          return `
          <button
            type="button"
            class="${getActionClass(action.variant)}"${extra}${confirm}
          >
            ${action.text}
          </button>`;
        }).join("")
      }
      </div>
    `
      : "";

    return `
      <style>${styles.css}</style>
      <div
        ${id ? `id="${id}"` : ""}
        class="${itemClasses}"
        data-component="item"
        data-variant="${variant}"
        data-size="${size}"
        ${priority ? `data-priority="${priority}"` : ""}
        data-completed="${completed.toString()}"
        data-selected="${selected.toString()}"
      >
        <div class="${styles.classMap.content}">
          ${iconHtml}
          <div class="${styles.classMap.main}">
            ${title ? `<h3 class="${styles.classMap.title}">${title}</h3>` : ""}
            ${
      description
        ? `<p class="${styles.classMap.description}">${description}</p>`
        : ""
    }
            ${metadataHtml}
            ${badgesHtml}
          </div>
        </div>
        ${actionsHtml}
      </div>
    `;
  },
});

// Use renderComponent("item", props) to render this component

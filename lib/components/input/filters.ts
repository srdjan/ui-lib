/**
 * Filters Component - Generic reusable filter controls
 * Can be used for todo filters, product filters, search filters, etc.
 */

import { renderComponent } from "../../component-state.ts";
import { defineComponent } from "../../define-component.ts";
import { css, token } from "../../modern-css.ts";

// Create modern CSS styles for the filters component
const filtersStyles = css.responsive("filters", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: token("space", "4"),
    padding: token("space", "6"),
    backgroundColor: token("surface", "background"),
    borderRadius: token("radius", "lg"),
    border: `1px solid ${token("surface", "border")}`,
    marginBlockEnd: token("space", "6"),
    containerType: "inline-size",
  },

  // Variants
  variants: {
    variant: {
      default: {
        backgroundColor: token("surface", "background"),
        border: `1px solid ${token("surface", "border")}`,
      },
      minimal: {
        backgroundColor: "transparent",
        border: "none",
        padding: token("space", "4"),
      },
      card: {
        backgroundColor: token("surface", "background"),
        border: `1px solid ${token("surface", "border")}`,
        boxShadow: token("shadow", "sm"),
      },
    },

    size: {
      sm: {
        gap: token("space", "2"),
        padding: token("space", "4"),
      },
      md: {
        gap: token("space", "4"),
        padding: token("space", "6"),
      },
      lg: {
        gap: token("space", "6"),
        padding: token("space", "8"),
      },
    },
  },

  // Container queries for responsive layout
  "@container": {
    "(max-width: 640px)": {
      flexDirection: "column",
      alignItems: "stretch",
      gap: token("space", "4"),
    },
  },

  // Statistics display
  stats: {
    display: "flex",
    gap: token("space", "4"),
    fontSize: token("typography", "sm-size"),
    color: token("color", "text-secondary"),
    fontVariantNumeric: "tabular-nums",

    "@container": {
      "(max-width: 640px)": {
        justifyContent: "center",
        order: "-1",
      },
    },

    ".stat": {
      display: "flex",
      alignItems: "center",
      gap: token("space", "1"),

      ".label": {
        fontWeight: token("typography", "medium"),
      },

      ".value": {
        color: token("color", "text-primary"),
        fontWeight: token("typography", "semibold"),
      },
    },
  },

  // Filter buttons group
  buttons: {
    display: "flex",
    gap: token("space", "1"),
    backgroundColor: token("surface", "background-subtle"),
    padding: token("space", "1"),
    borderRadius: token("radius", "md"),

    "@container": {
      "(max-width: 640px)": {
        justifyContent: "center",
        flex: "1",
      },
    },
  },

  // Individual filter button
  button: {
    padding: `${token("space", "2")} ${token("space", "4")}`,
    border: "none",
    backgroundColor: "transparent",
    borderRadius: token("radius", "sm"),
    cursor: "pointer",
    fontSize: token("typography", "sm-size"),
    fontWeight: token("typography", "medium"),
    color: token("color", "text-secondary"),
    transition: `all ${token("animation", "fast")} ${
      token("animation", "ease")
    }`,
    position: "relative",

    "&:hover": {
      color: token("color", "text-primary"),
      backgroundColor: token("surface", "background-hover"),
    },

    "&:focus-visible": {
      outline: `2px solid ${token("color", "primary-500")}`,
      outlineOffset: "2px",
    },

    "&[data-active='true']": {
      backgroundColor: token("surface", "background"),
      color: token("color", "primary-600"),
      boxShadow: token("shadow", "sm"),

      "&::after": {
        content: '""',
        position: "absolute",
        insetBlockEnd: "0",
        insetInlineStart: "50%",
        transform: "translateX(-50%)",
        inlineSize: "24px",
        blockSize: "2px",
        backgroundColor: token("color", "primary-500"),
        borderRadius: "1px 1px 0 0",
      },
    },
  },

  // Secondary filters (dropdowns, inputs, etc.)
  secondaryFilters: {
    display: "flex",
    alignItems: "center",
    gap: token("space", "3"),

    "@container": {
      "(max-width: 640px)": {
        justifyContent: "space-between",
        flex: "1",
      },
    },
  },

  // Select/dropdown styling
  select: {
    padding: `${token("space", "2")} ${token("space", "3")}`,
    fontSize: token("typography", "sm-size"),
    border: `1px solid ${token("surface", "border")}`,
    borderRadius: token("radius", "sm"),
    backgroundColor: token("surface", "background"),
    color: token("color", "text-primary"),
    cursor: "pointer",
    minInlineSize: "120px",

    "&:focus": {
      outline: "none",
      borderColor: token("color", "primary-500"),
      boxShadow: token("shadow", "focus"),
    },

    "&[data-active='true']": {
      borderColor: token("color", "primary-500"),
    },
  },

  // Search input styling
  search: {
    display: "flex",
    alignItems: "center",
    gap: token("space", "2"),
    padding: `${token("space", "2")} ${token("space", "3")}`,
    border: `1px solid ${token("surface", "border")}`,
    borderRadius: token("radius", "sm"),
    backgroundColor: token("surface", "background"),
    minInlineSize: "200px",

    "&:focus-within": {
      borderColor: token("color", "primary-500"),
      boxShadow: token("shadow", "focus"),
    },

    "input": {
      border: "none",
      background: "none",
      outline: "none",
      fontSize: token("typography", "sm-size"),
      color: token("color", "text-primary"),
      flex: "1",

      "&::placeholder": {
        color: token("color", "text-tertiary"),
      },
    },

    ".icon": {
      inlineSize: token("size", "4"),
      blockSize: token("size", "4"),
      color: token("color", "text-tertiary"),
      flexShrink: "0",
    },

    "@container": {
      "(max-width: 640px)": {
        minInlineSize: "auto",
        flex: "1",
      },
    },
  },

  // Actions (clear, reset, etc.)
  actions: {
    display: "flex",
    alignItems: "center",
    gap: token("space", "2"),

    ".action": {
      padding: `${token("space", "1")} ${token("space", "3")}`,
      backgroundColor: "transparent",
      color: token("color", "text-secondary"),
      border: `1px solid ${token("surface", "border")}`,
      borderRadius: token("radius", "sm"),
      fontSize: token("typography", "xs-size"),
      fontWeight: token("typography", "medium"),
      cursor: "pointer",
      transition: `all ${token("animation", "fast")} ${
        token("animation", "ease")
      }`,

      "&:hover": {
        backgroundColor: token("surface", "background-hover"),
        color: token("color", "text-primary"),
      },

      "&:focus-visible": {
        outline: `2px solid ${token("color", "primary-500")}`,
        outlineOffset: "2px",
      },
    },
  },
});

defineComponent("filters", {
  styles: filtersStyles.css,
  render: (attrs: Record<string, string>) => {
    const {
      buttons = "[]",
      activeButton = "",
      stats = "[]",
      secondaryFilters = "[]",
      search = "",
      searchPlaceholder = "Search...",
      actions = "[]",
      variant = "default",
      size = "md",
      id = "",
    } = attrs;

    const { classMap } = filtersStyles;

    // Parse data from JSON strings
    let parsedButtons: Array<{ key: string; label: string; count?: number }> =
      [];
    let parsedStats: Array<{ label: string; value: string | number }> = [];
    let parsedSecondaryFilters: Array<{
      type: "select" | "input";
      name: string;
      placeholder?: string;
      options?: Array<{ value: string; label: string }>;
      value?: string;
    }> = [];
    let parsedActions: Array<{ label: string; action: string }> = [];

    try {
      if (buttons) parsedButtons = JSON.parse(buttons);
      if (stats) parsedStats = JSON.parse(stats);
      if (secondaryFilters) {
        parsedSecondaryFilters = JSON.parse(secondaryFilters);
      }
      if (actions) parsedActions = JSON.parse(actions);
    } catch {
      // Ignore invalid JSON
    }

    const containerProps = {
      class: [
        classMap.base,
        variant && classMap.variants?.variant?.[variant],
        size && classMap.variants?.size?.[size],
      ].filter(Boolean).join(" "),
      id: id || undefined,
      "data-component": "filters",
      "data-variant": variant,
      "data-size": size,
      style: id ? `container-name: filters-${id}` : undefined,
    };

    // Render statistics
    const statsHtml = parsedStats.length > 0
      ? `
      <div class="${classMap.stats}">
        ${
        parsedStats.map((stat) => `
          <div class="stat">
            <span class="value">${stat.value}</span>
            <span class="label">${stat.label}</span>
          </div>
        `).join("")
      }
      </div>
    `
      : "";

    // Render filter buttons
    const buttonsHtml = parsedButtons.length > 0
      ? `
      <div class="${classMap.buttons}">
        ${
        parsedButtons.map((button) => `
          <button
            type="button"
            class="${classMap.button}"
            data-filter="${button.key}"
            data-active="${button.key === activeButton}"
          >
            ${button.label}${
          button.count !== undefined ? ` (${button.count})` : ""
        }
          </button>
        `).join("")
      }
      </div>
    `
      : "";

    // Render secondary filters
    const secondaryFiltersHtml = (parsedSecondaryFilters.length > 0 || search)
      ? `
      <div class="${classMap.secondaryFilters}">
        ${
        parsedSecondaryFilters.map((filter) => {
          if (filter.type === "select" && filter.options) {
            return `
              <select
                class="${classMap.select}"
                name="${filter.name}"
                data-active="${Boolean(filter.value)}"
              >
                ${
              filter.placeholder
                ? `<option value="">${filter.placeholder}</option>`
                : ""
            }
                ${
              filter.options.map((opt) =>
                `<option value="${opt.value}" ${
                  opt.value === filter.value ? "selected" : ""
                }>${opt.label}</option>`
              ).join("")
            }
              </select>
            `;
          } else if (filter.type === "input") {
            return `
              <div class="${classMap.search}">
                <input
                  type="text"
                  name="${filter.name}"
                  placeholder="${filter.placeholder || ""}"
                  value="${filter.value || ""}"
                />
              </div>
            `;
          }
          return "";
        }).join("")
      }

        ${
        search
          ? `
          <div class="${classMap.search}">
            <svg class="icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
            </svg>
            <input
              type="search"
              name="search"
              placeholder="${searchPlaceholder}"
              value="${search || ""}"
            />
          </div>
        `
          : ""
      }
      </div>
    `
      : "";

    // Render actions
    const actionsHtml = parsedActions.length > 0
      ? `
      <div class="${classMap.actions}">
        ${
        parsedActions.map((action) => `
          <button type="button" class="action" onclick="${action.action}">
            ${action.label}
          </button>
        `).join("")
      }
      </div>
    `
      : "";

    return `
      <div ${
      Object.entries(containerProps).map(([k, v]) => v ? `${k}="${v}"` : "")
        .join(" ")
    }>
        ${statsHtml}
        ${buttonsHtml}
        ${secondaryFiltersHtml}
        ${actionsHtml}
      </div>
    `;
  },
});

// Export convenience function
export const Filters = (props: {
  buttons?: Array<{ key: string; label: string; count?: number }>;
  activeButton?: string;
  stats?: Array<{ label: string; value: string | number }>;
  secondaryFilters?: Array<{
    type: "select" | "input";
    name: string;
    placeholder?: string;
    options?: Array<{ value: string; label: string }>;
    value?: string;
  }>;
  search?: string;
  searchPlaceholder?: string;
  actions?: Array<{ label: string; action: string }>;
  variant?: "default" | "minimal" | "card";
  size?: "sm" | "md" | "lg";
  id?: string;
}) => {
  const attrs: Record<string, string> = {};

  if (props.buttons) attrs.buttons = JSON.stringify(props.buttons);
  if (props.activeButton) attrs.activeButton = props.activeButton;
  if (props.stats) attrs.stats = JSON.stringify(props.stats);
  if (props.secondaryFilters) {
    attrs.secondaryFilters = JSON.stringify(props.secondaryFilters);
  }
  if (props.search) attrs.search = props.search;
  if (props.searchPlaceholder) {
    attrs.searchPlaceholder = props.searchPlaceholder;
  }
  if (props.actions) attrs.actions = JSON.stringify(props.actions);
  if (props.variant) attrs.variant = props.variant;
  if (props.size) attrs.size = props.size;
  if (props.id) attrs.id = props.id;

  return renderComponent("filters", attrs);
};

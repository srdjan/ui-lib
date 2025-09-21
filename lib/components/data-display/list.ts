/**
 * List Component - Generic reusable list container
 * Can display items, todos, cards, etc. with responsive layout
 */

import { css, token } from "../../modern-css.ts";
import { defineComponent } from "../../define-component.ts";
import { renderComponent } from "../../component-state.ts";

// Create modern CSS styles for the list component
const listStyles = css.responsive("list", {
  base: {
    containerType: "inline-size",
    containerName: "list",

    // Base layout
    display: "grid",
    gap: token("space", "4"),
    gridTemplateColumns: "1fr",

    // Modern focus management
    "&:focus-within": {
      outline: "none",
    },
  },

  // Layout variants
  variants: {
    layout: {
      stack: {
        display: "grid",
        gap: token("space", "4"),
        gridTemplateColumns: "1fr",
      },
      grid: {
        display: "grid",
        gap: token("space", "6"),
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      },
      masonry: {
        display: "grid",
        gap: token("space", "4"),
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        alignItems: "start",
      },
      horizontal: {
        display: "flex",
        gap: token("space", "4"),
        overflowX: "auto",
        scrollSnapType: "x mandatory",
        paddingInlineEnd: token("space", "4"),

        "& > *": {
          flexShrink: "0",
          scrollSnapAlign: "start",
        },
      },
    },

    size: {
      sm: {
        gap: token("space", "2"),
      },
      md: {
        gap: token("space", "4"),
      },
      lg: {
        gap: token("space", "6"),
      },
      xl: {
        gap: token("space", "8"),
      },
    },

    // State variants
    empty: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minBlockSize: token("size", "48"),
      padding: token("space", "12"),
      backgroundColor: token("surface", "background-subtle"),
      borderRadius: token("radius", "xl"),
      border: `2px dashed ${token("surface", "border")}`,
    },

    loading: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minBlockSize: token("size", "48"),
      padding: token("space", "12"),
      color: token("color", "text-secondary"),
    },
  },

  // Container queries for responsive layout
  "@container": {
    "(min-width: 600px)": {
      "&[data-layout='grid']": {
        gap: token("space", "8"),
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
      },
    },
    "(min-width: 900px)": {
      "&[data-layout='grid']": {
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
      },
    },
    "(max-width: 500px)": {
      "&[data-layout='horizontal']": {
        "& > *": {
          minInlineSize: "280px",
        },
      },
    },
  },

  // Empty state styling
  emptyState: {
    textAlign: "center",
    maxInlineSize: "400px",

    ".icon": {
      inlineSize: token("size", "16"),
      blockSize: token("size", "16"),
      color: token("color", "text-tertiary"),
      marginBlockEnd: token("space", "4"),
    },

    ".title": {
      fontSize: token("typography", "lg-size"),
      fontWeight: token("typography", "semibold"),
      color: token("color", "text-primary"),
      marginBlockEnd: token("space", "2"),
    },

    ".description": {
      fontSize: token("typography", "sm-size"),
      color: token("color", "text-secondary"),
      lineHeight: token("typography", "relaxed"),
      marginBlockEnd: token("space", "6"),
    },

    ".action": {
      display: "inline-flex",
      alignItems: "center",
      gap: token("space", "2"),
      padding: `${token("space", "3")} ${token("space", "6")}`,
      backgroundColor: token("color", "primary-500"),
      color: token("color", "white"),
      borderRadius: token("radius", "lg"),
      textDecoration: "none",
      fontSize: token("typography", "sm-size"),
      fontWeight: token("typography", "medium"),
      transition: `all ${token("animation", "fast")} ${token("animation", "ease")}`,

      "&:hover": {
        backgroundColor: token("color", "primary-600"),
        transform: "translateY(-1px)",
      },

      "&:focus-visible": {
        outline: `2px solid ${token("color", "primary-300")}`,
        outlineOffset: "2px",
      },
    },
  },

  // Loading spinner
  loadingSpinner: {
    display: "flex",
    alignItems: "center",
    gap: token("space", "3"),

    "&::before": {
      content: '""',
      display: "inline-block",
      inlineSize: token("size", "6"),
      blockSize: token("size", "6"),
      border: `2px solid ${token("surface", "border")}`,
      borderBlockStart: `2px solid ${token("color", "primary-500")}`,
      borderRadius: token("radius", "full"),
      animation: `spin ${token("animation", "normal")} linear infinite`,
    },

    ".text": {
      fontSize: token("typography", "sm-size"),
      color: token("color", "text-secondary"),
    },
  },

  // Header area for title, filters, etc.
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: token("space", "4"),
    marginBlockEnd: token("space", "6"),
    paddingBlockEnd: token("space", "4"),
    borderBlockEnd: `1px solid ${token("surface", "border")}`,

    ".title": {
      fontSize: token("typography", "xl-size"),
      fontWeight: token("typography", "bold"),
      color: token("color", "text-primary"),
      margin: "0",
    },

    ".count": {
      fontSize: token("typography", "sm-size"),
      color: token("color", "text-secondary"),
      fontWeight: token("typography", "medium"),
    },

    ".actions": {
      display: "flex",
      alignItems: "center",
      gap: token("space", "2"),
    },

    // Responsive header
    "@container": {
      "(max-width: 500px)": {
        flexDirection: "column",
        alignItems: "stretch",
        gap: token("space", "3"),

        ".actions": {
          justifyContent: "space-between",
        },
      },
    },
  },
});

// Add keyframes for spinner animation
const spinnerAnimation = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;

defineComponent("list", {
  styles: listStyles.css + spinnerAnimation,
  render: (attrs: Record<string, string>) => {
    const {
      items = "[]",
      layout = "stack",
      size = "md",
      loading = "",
      empty = "",
      emptyTitle = "No items found",
      emptyDescription = "There are no items to display.",
      emptyAction = "",
      emptyActionText = "Add item",
      emptyIcon = "",
      title = "",
      count = "",
      headerActions = "",
      id = "",
    } = attrs;

    const { classMap } = listStyles;
    const isLoading = loading === "true" || loading === "1";
    const isEmpty = empty === "true" || empty === "1";

    // Parse items from JSON string
    let parsedItems: string[] = [];
    if (items && !isLoading && !isEmpty) {
      try {
        parsedItems = JSON.parse(items);
      } catch {
        // Fallback to treating as single item
        parsedItems = [items];
      }
    }

    const containerProps = {
      class: [
        classMap.base,
        layout && classMap.variants?.layout?.[layout],
        size && classMap.variants?.size?.[size],
        isLoading && classMap.variants?.loading,
        isEmpty && classMap.variants?.empty,
      ].filter(Boolean).join(" "),
      id: id || undefined,
      "data-component": "list",
      "data-layout": layout,
      "data-size": size,
      "data-loading": isLoading.toString(),
      "data-empty": isEmpty.toString(),
      role: "region",
      "aria-label": title || "List",
      style: id ? `container-name: ${id}` : undefined,
    };

    // Render header if title or actions are provided
    const header = (title || count || headerActions) ? `
      <div class="${classMap.header}">
        <div>
          ${title ? `<h2 class="title">${title}</h2>` : ""}
          ${count ? `<span class="count">${count}</span>` : ""}
        </div>
        ${headerActions ? `<div class="actions">${headerActions}</div>` : ""}
      </div>
    ` : "";

    // Loading state
    if (isLoading) {
      return `
        <div ${Object.entries(containerProps).map(([k, v]) => v ? `${k}="${v}"` : "").join(" ")}>
          ${header}
          <div class="${classMap.loadingSpinner}">
            <span class="text">Loading items...</span>
          </div>
        </div>
      `;
    }

    // Empty state
    if (isEmpty || parsedItems.length === 0) {
      return `
        <div ${Object.entries(containerProps).map(([k, v]) => v ? `${k}="${v}"` : "").join(" ")}>
          ${header}
          <div class="${classMap.emptyState}">
            ${emptyIcon ? `<div class="icon">${emptyIcon}</div>` : ""}
            <div class="title">${emptyTitle}</div>
            <div class="description">${emptyDescription}</div>
            ${emptyAction ? `<a href="${emptyAction}" class="action">${emptyActionText}</a>` : ""}
          </div>
        </div>
      `;
    }

    // Normal state with items
    return `
      <div ${Object.entries(containerProps).map(([k, v]) => v ? `${k}="${v}"` : "").join(" ")}>
        ${header}
        ${parsedItems.join("")}
      </div>
    `;
  },
});

// Export convenience function
export const List = (props: {
  items?: string[] | string;
  layout?: "stack" | "grid" | "masonry" | "horizontal";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: string;
  emptyActionText?: string;
  emptyIcon?: string;
  title?: string;
  count?: string;
  headerActions?: string;
  id?: string;
}) => {
  const attrs: Record<string, string> = {};

  if (props.items) attrs.items = Array.isArray(props.items) ? JSON.stringify(props.items) : props.items;
  if (props.layout) attrs.layout = props.layout;
  if (props.size) attrs.size = props.size;
  if (props.loading) attrs.loading = "true";
  if (props.empty) attrs.empty = "true";
  if (props.emptyTitle) attrs.emptyTitle = props.emptyTitle;
  if (props.emptyDescription) attrs.emptyDescription = props.emptyDescription;
  if (props.emptyAction) attrs.emptyAction = props.emptyAction;
  if (props.emptyActionText) attrs.emptyActionText = props.emptyActionText;
  if (props.emptyIcon) attrs.emptyIcon = props.emptyIcon;
  if (props.title) attrs.title = props.title;
  if (props.count) attrs.count = props.count;
  if (props.headerActions) attrs.headerActions = props.headerActions;
  if (props.id) attrs.id = props.id;

  return renderComponent("list", attrs);
};

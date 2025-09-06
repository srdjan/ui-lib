// Component composition helpers for building complex UIs easily
// Provides higher-level patterns and building blocks

import { h } from "./jsx-runtime.ts";
import { css } from "./css-in-ts.ts";
export { ButtonGroup } from "./components/button/button-group.ts";

/**
 * Layout composition types
 */
export type LayoutDirection = "horizontal" | "vertical";
export type LayoutAlignment = "start" | "center" | "end" | "stretch";
export type LayoutJustification =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

export interface LayoutProps {
  direction?: LayoutDirection;
  align?: LayoutAlignment;
  justify?: LayoutJustification;
  gap?: string | number;
  wrap?: boolean;
  className?: string;
  children?: unknown[];
}

/**
 * Grid composition types
 */
export interface GridProps {
  columns?: string | number;
  rows?: string | number;
  gap?: string | number;
  areas?: string;
  className?: string;
  children?: unknown[];
}

/**
 * Card composition types
 */
export interface CardProps {
  variant?: "elevated" | "outlined" | "filled";
  padding?: string | number;
  radius?: string | number;
  className?: string;
  header?: string;
  footer?: string;
  children?: unknown[];
}

/**
 * Navigation composition types
 */
export interface NavItem {
  href?: string;
  label: string;
  active?: boolean;
  disabled?: boolean;
  badge?: string;
  icon?: string;
  onClick?: string;
}

export interface NavigationProps {
  items: NavItem[];
  variant?: "tabs" | "pills" | "breadcrumbs" | "sidebar";
  orientation?: "horizontal" | "vertical";
  className?: string;
}

/**
 * Form composition types
 */
export interface FormField {
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio";
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  value?: string;
  checked?: boolean;
}

export interface FormProps {
  fields: FormField[];
  action?: string;
  method?: "GET" | "POST";
  submitText?: string;
  resetText?: string;
  className?: string;
}

/**
 * Layout component - Flexible container with direction, alignment, and spacing
 */
export function Layout(props: LayoutProps): string {
  const {
    direction = "horizontal",
    align = "stretch",
    justify = "start",
    gap = "1rem",
    wrap = false,
    className = "",
    children = [],
  } = props;

  const styles = css({
    layout: {
      display: "flex",
      flexDirection: direction === "vertical" ? "column" : "row",
      alignItems: getAlignValue(align),
      justifyContent: getJustifyValue(justify),
      gap: typeof gap === "number" ? `${gap}px` : gap,
      flexWrap: wrap ? "wrap" : "nowrap",
    },
  });

  return h(
    "div",
    { class: `${styles.classMap.layout} ${className}`.trim() },
    ...children,
  );
}

/**
 * Grid component - CSS Grid container with simplified API
 */
export function Grid(props: GridProps): string {
  const {
    columns = "1fr",
    rows = "auto",
    gap = "1rem",
    areas,
    className = "",
    children = [],
  } = props;

  const gridColumns = typeof columns === "number"
    ? `repeat(${columns}, 1fr)`
    : columns;

  const styles = css({
    grid: {
      display: "grid",
      gridTemplateColumns: gridColumns,
      gridTemplateRows: typeof rows === "number"
        ? `repeat(${rows}, auto)`
        : rows,
      gap: typeof gap === "number" ? `${gap}px` : gap,
      ...(areas && { gridTemplateAreas: areas }),
    },
  });

  return h(
    "div",
    { class: `${styles.classMap.grid} ${className}`.trim() },
    ...children,
  );
}

/**
 * Card component - Flexible content container with variants
 */
export function Card(props: CardProps): string {
  const {
    variant = "elevated",
    padding = "1.5rem",
    radius = "0.5rem",
    className = "",
    header,
    footer,
    children = [],
  } = props;

  const styles = css({
    card: {
      background: "white",
      borderRadius: typeof radius === "number" ? `${radius}px` : radius,
      padding: typeof padding === "number" ? `${padding}px` : padding,
      ...(variant === "elevated" && {
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }),
      ...(variant === "outlined" && {
        border: "1px solid #e5e7eb",
      }),
      ...(variant === "filled" && {
        background: "#f9fafb",
        border: "1px solid #f3f4f6",
      }),
    },
    header: {
      fontWeight: 600,
      fontSize: "1.125rem",
      marginBottom: "1rem",
      paddingBottom: "0.5rem",
      borderBottom: "1px solid #e5e7eb",
    },
    footer: {
      marginTop: "1rem",
      paddingTop: "0.5rem",
      borderTop: "1px solid #e5e7eb",
      fontSize: "0.875rem",
      color: "#6b7280",
    },
  });

  const content = [
    header && h("div", { class: styles.classMap.header }, header),
    h("div", null, ...children),
    footer && h("div", { class: styles.classMap.footer }, footer),
  ].filter(Boolean);

  return h(
    "div",
    { class: `${styles.classMap.card} ${className}`.trim() },
    ...content,
  );
}

/**
 * Navigation component - Renders navigation items with various styles
 */
export function Navigation(props: NavigationProps): string {
  const {
    items,
    variant = "tabs",
    orientation = "horizontal",
    className = "",
  } = props;

  const styles = css({
    nav: {
      display: "flex",
      flexDirection: orientation === "vertical" ? "column" : "row",
      ...(variant === "tabs" && {
        borderBottom: "1px solid #e5e7eb",
        gap: 0,
      }),
      ...(variant === "pills" && {
        gap: "0.5rem",
      }),
      ...(variant === "breadcrumbs" && {
        gap: "0.25rem",
        alignItems: "center",
      }),
      ...(variant === "sidebar" && {
        flexDirection: "column",
        gap: "0.25rem",
      }),
    },
    item: {
      padding: "0.5rem 1rem",
      textDecoration: "none",
      color: "#6b7280",
      cursor: "pointer",
      transition: "all 0.2s ease",

      ...(variant === "tabs" && {
        borderBottom: "2px solid transparent",
        "&:hover": {
          color: "#374151",
          borderBottom: "2px solid #d1d5db",
        },
        "&[data-active]": {
          color: "#2563eb",
          borderBottom: "2px solid #2563eb",
        },
      }),

      ...(variant === "pills" && {
        borderRadius: "0.375rem",
        "&:hover": {
          background: "#f3f4f6",
          color: "#374151",
        },
        "&[data-active]": {
          background: "#2563eb",
          color: "white",
        },
      }),

      ...(variant === "breadcrumbs" && {
        fontSize: "0.875rem",
        "&:not(:last-child):after": {
          content: '"/"',
          marginLeft: "0.5rem",
          color: "#9ca3af",
        },
      }),

      ...(variant === "sidebar" && {
        borderRadius: "0.375rem",
        width: "100%",
        textAlign: "left",
        "&:hover": {
          background: "#f3f4f6",
          color: "#374151",
        },
        "&[data-active]": {
          background: "#dbeafe",
          color: "#1d4ed8",
        },
      }),

      "&[data-disabled]": {
        opacity: 0.5,
        cursor: "not-allowed",
        pointerEvents: "none",
      },
    },
    badge: {
      display: "inline-block",
      marginLeft: "0.5rem",
      padding: "0.125rem 0.5rem",
      background: "#ef4444",
      color: "white",
      borderRadius: "999px",
      fontSize: "0.75rem",
      fontWeight: 600,
    },
  });

  const navItems = items.map((item) => {
    const attributes: Record<string, string> = {
      class: styles.classMap.item,
      ...(item.active && { "data-active": "" }),
      ...(item.disabled && { "data-disabled": "" }),
      ...(item.href && { href: item.href }),
      ...(item.onClick && { onclick: item.onClick }),
    };

    const content = [
      item.icon && `${item.icon} `,
      item.label,
      item.badge && h("span", { class: styles.classMap.badge }, item.badge),
    ].filter(Boolean).join("");

    return item.href
      ? h("a", attributes, content)
      : h("button", { ...attributes, type: "button" }, content);
  });

  return h(
    "nav",
    {
      class: `${styles.classMap.nav} ${className}`.trim(),
      role: "navigation",
    },
    ...navItems,
  );
}

/**
 * Form component - Generates complete forms from field definitions
 */
export function Form(props: FormProps): string {
  const {
    fields,
    action = "#",
    method = "POST",
    submitText = "Submit",
    resetText = "Reset",
    className = "",
  } = props;

  const styles = css({
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    field: {
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",
    },
    label: {
      fontSize: "0.875rem",
      fontWeight: 500,
      color: "#374151",
    },
    input: {
      padding: "0.5rem 0.75rem",
      border: "1px solid #d1d5db",
      borderRadius: "0.375rem",
      fontSize: "0.875rem",
      background: "white",
      color: "#374151",
      cursor: "text",
      transition:
        "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
      "&:focus": {
        outline: "none",
        borderColor: "#2563eb",
        boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.1)",
      },
      "&:hover": {
        borderColor: "#9ca3af",
      },
      "&:disabled": {
        background: "#f9fafb",
        cursor: "not-allowed",
        color: "#9ca3af",
      },
    },
    textarea: {
      padding: "0.5rem 0.75rem",
      border: "1px solid #d1d5db",
      borderRadius: "0.375rem",
      fontSize: "0.875rem",
      minHeight: "4rem",
      resize: "vertical",
      background: "white",
      color: "#374151",
      cursor: "text",
      transition:
        "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
      "&:focus": {
        outline: "none",
        borderColor: "#2563eb",
        boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.1)",
      },
      "&:hover": {
        borderColor: "#9ca3af",
      },
    },
    select: {
      padding: "0.5rem 0.75rem",
      border: "1px solid #d1d5db",
      borderRadius: "0.375rem",
      fontSize: "0.875rem",
      background: "white",
      color: "#374151",
      cursor: "pointer",
      transition:
        "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
      "&:focus": {
        outline: "none",
        borderColor: "#2563eb",
        boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.1)",
      },
      "&:hover": {
        borderColor: "#9ca3af",
      },
    },
    checkboxWrapper: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    checkbox: {
      width: "1rem",
      height: "1rem",
    },
    buttons: {
      display: "flex",
      gap: "0.75rem",
      marginTop: "1rem",
    },
    button: {
      padding: "0.5rem 1rem",
      borderRadius: "0.375rem",
      fontSize: "0.875rem",
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    submitButton: {
      background: "#2563eb",
      color: "white",
      border: "none",
      "&:hover": {
        background: "#1d4ed8",
      },
    },
    resetButton: {
      background: "white",
      color: "#374151",
      border: "1px solid #d1d5db",
      "&:hover": {
        background: "#f9fafb",
      },
    },
  });

  const formFields = fields.map((field) => {
    const fieldId = `field-${field.name}`;
    const commonAttributes = {
      id: fieldId,
      name: field.name,
      ...(field.required && { required: true }),
      ...(field.disabled && { disabled: true }),
      ...(field.value && { value: field.value }),
    };

    let inputElement: string;

    switch (field.type) {
      case "textarea":
        inputElement = h("textarea", {
          ...commonAttributes,
          class: styles.classMap.textarea,
          placeholder: field.placeholder,
        }, field.value || "");
        break;

      case "select":
        const options = (field.options || []).map((option) =>
          h("option", { value: option.value }, option.label)
        );
        inputElement = h("select", {
          ...commonAttributes,
          class: styles.classMap.select,
        }, ...options);
        break;

      case "checkbox":
        return h("div", { class: styles.classMap.field }, [
          h("div", { class: styles.classMap.checkboxWrapper }, [
            h("input", {
              ...commonAttributes,
              type: "checkbox",
              class: styles.classMap.checkbox,
              ...(field.checked && { checked: true }),
            }),
            h(
              "label",
              { for: fieldId, class: styles.classMap.label },
              field.label,
            ),
          ]),
        ]);

      default:
        inputElement = h("input", {
          ...commonAttributes,
          type: field.type,
          class: styles.classMap.input,
          placeholder: field.placeholder,
        });
    }

    return h("div", { class: styles.classMap.field }, [
      h("label", { for: fieldId, class: styles.classMap.label }, field.label),
      inputElement,
    ]);
  });

  const buttons = h("div", { class: styles.classMap.buttons }, [
    h("button", {
      type: "submit",
      class: `${styles.classMap.button} ${styles.classMap.submitButton}`,
    }, submitText),
    h("button", {
      type: "reset",
      class: `${styles.classMap.button} ${styles.classMap.resetButton}`,
    }, resetText),
  ]);

  return h("form", {
    class: `${styles.classMap.form} ${className}`.trim(),
    action,
    method,
  }, [...formFields, buttons]);
}

/**
 * Helper functions
 */
function getAlignValue(
  align: LayoutAlignment,
): "flex-start" | "flex-end" | "center" | "stretch" {
  switch (align) {
    case "start":
      return "flex-start";
    case "end":
      return "flex-end";
    case "center":
      return "center";
    case "stretch":
      return "stretch";
    default:
      return "stretch";
  }
}

function getJustifyValue(
  justify: LayoutJustification,
):
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly" {
  switch (justify) {
    case "start":
      return "flex-start";
    case "end":
      return "flex-end";
    case "center":
      return "center";
    case "between":
      return "space-between";
    case "around":
      return "space-around";
    case "evenly":
      return "space-evenly";
    default:
      return "flex-start";
  }
}

function getSizeGap(size: "sm" | "md" | "lg"): string {
  switch (size) {
    case "sm":
      return "0.25rem";
    case "md":
      return "0.5rem";
    case "lg":
      return "1rem";
    default:
      return "0.5rem";
  }
}

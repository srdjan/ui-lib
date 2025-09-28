/**
 * Form Component - Generic reusable form with modern CSS
 * Can be used for todo forms, contact forms, login forms, etc.
 */

import { css, token } from "../../modern-css.ts";
import { defineComponent } from "../../internal.ts";
import { renderComponent } from "../../component-state.ts";

// Create modern CSS styles for the form component
const formStyles = css.responsive("form", {
  base: {
    backgroundColor: token("surface", "background"),
    padding: token("space", "8"),
    borderRadius: token("radius", "lg"),
    border: `1px solid ${token("surface", "border")}`,
    marginBlockEnd: token("space", "6"),
    containerType: "inline-size",

    // Focus management
    "&:focus-within": {
      borderColor: token("color", "primary-200"),
      boxShadow: token("shadow", "focus"),
    },
  },

  // Form variants
  variants: {
    variant: {
      default: {
        backgroundColor: token("surface", "background"),
        border: `1px solid ${token("surface", "border")}`,
      },
      card: {
        backgroundColor: token("surface", "background"),
        border: `1px solid ${token("surface", "border")}`,
        boxShadow: token("shadow", "sm"),
      },
      modal: {
        backgroundColor: token("surface", "background"),
        border: "none",
        borderRadius: token("radius", "xl"),
        boxShadow: token("shadow", "lg"),
      },
      inline: {
        backgroundColor: "transparent",
        border: "none",
        padding: "0",
        marginBlockEnd: "0",
      },
    },

    size: {
      sm: {
        padding: token("space", "4"),
      },
      md: {
        padding: token("space", "6"),
      },
      lg: {
        padding: token("space", "8"),
      },
      xl: {
        padding: token("space", "12"),
      },
    },
  },

  // Container queries for responsive layout
  "@container": {
    "(max-width: 400px)": {
      padding: token("space", "4"),
      borderRadius: token("radius", "md"),
    },
    "(min-width: 600px)": {
      padding: token("space", "10"),
    },
  },

  // Form header
  header: {
    marginBlockEnd: token("space", "6"),
    paddingBlockEnd: token("space", "4"),
    borderBlockEnd: `1px solid ${token("surface", "border")}`,

    "&[data-no-border='true']": {
      borderBlockEnd: "none",
      paddingBlockEnd: "0",
    },

    ".title": {
      fontSize: token("typography", "xl-size"),
      fontWeight: token("typography", "bold"),
      color: token("color", "text-primary"),
      marginBlockEnd: token("space", "2"),
      margin: "0",
    },

    ".description": {
      fontSize: token("typography", "sm-size"),
      color: token("color", "text-secondary"),
      lineHeight: token("typography", "relaxed"),
      margin: "0",
    },
  },

  // Form group styling
  group: {
    marginBlockEnd: token("space", "6"),

    "&:last-of-type": {
      marginBlockEnd: "0",
    },
  },

  // Label styling
  label: {
    display: "block",
    fontSize: token("typography", "sm-size"),
    fontWeight: token("typography", "medium"),
    color: token("color", "text-primary"),
    marginBlockEnd: token("space", "2"),

    "&[data-required='true']::after": {
      content: '" *"',
      color: token("color", "danger-500"),
    },
  },

  // Field styling
  field: {
    inlineSize: "100%",
    padding: token("space", "3"),
    fontSize: token("typography", "base-size"),
    lineHeight: token("typography", "base-height"),
    border: `1px solid ${token("surface", "border")}`,
    borderRadius: token("radius", "md"),
    backgroundColor: token("surface", "background"),
    color: token("color", "text-primary"),
    transition: `all ${token("animation", "fast")} ${
      token("animation", "ease")
    }`,

    "&::placeholder": {
      color: token("color", "text-tertiary"),
    },

    "&:focus": {
      outline: "none",
      borderColor: token("color", "primary-500"),
      boxShadow: token("shadow", "focus"),
    },

    "&:disabled": {
      backgroundColor: token("surface", "background-subtle"),
      color: token("color", "text-secondary"),
      cursor: "not-allowed",
    },

    "&[data-error='true']": {
      borderColor: token("color", "danger-500"),
      boxShadow: `0 0 0 3px ${token("color", "danger-100")}`,
    },

    // Textarea specific styling
    "&[data-type='textarea']": {
      minBlockSize: "120px",
      resize: "vertical",
      fontFamily: "inherit",
    },

    // Select specific styling
    "&[data-type='select']": {
      cursor: "pointer",
      backgroundImage: `url("data:image/svg+xml,${
        encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>',
        )
      }")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 8px center",
      backgroundSize: "16px",
      paddingInlineEnd: token("space", "10"),
    },
  },

  // Help text styling
  help: {
    fontSize: token("typography", "xs-size"),
    color: token("color", "text-secondary"),
    marginBlockStart: token("space", "1"),

    "&[data-error='true']": {
      color: token("color", "danger-500"),
    },
  },

  // Actions area
  actions: {
    display: "flex",
    gap: token("space", "3"),
    marginBlockStart: token("space", "8"),
    paddingBlockStart: token("space", "6"),
    borderBlockStart: `1px solid ${token("surface", "border")}`,

    "&[data-no-border='true']": {
      borderBlockStart: "none",
      paddingBlockStart: "0",
    },

    // Responsive actions
    "@container": {
      "(max-width: 400px)": {
        flexDirection: "column",
        gap: token("space", "2"),
      },
    },
  },

  // Primary action button
  primaryAction: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: token("space", "2"),
    padding: `${token("space", "3")} ${token("space", "6")}`,
    backgroundColor: token("color", "primary-500"),
    color: token("color", "white"),
    border: "none",
    borderRadius: token("radius", "md"),
    fontSize: token("typography", "sm-size"),
    fontWeight: token("typography", "medium"),
    cursor: "pointer",
    transition: `all ${token("animation", "fast")} ${
      token("animation", "ease")
    }`,

    "&:hover:not(:disabled)": {
      backgroundColor: token("color", "primary-600"),
      transform: "translateY(-1px)",
    },

    "&:focus-visible": {
      outline: `2px solid ${token("color", "primary-300")}`,
      outlineOffset: "2px",
    },

    "&:disabled": {
      opacity: "0.5",
      cursor: "not-allowed",
      transform: "none",
    },

    // Loading state
    "&[data-loading='true']": {
      cursor: "wait",

      "&::before": {
        content: '""',
        display: "inline-block",
        inlineSize: "16px",
        blockSize: "16px",
        border: "2px solid transparent",
        borderBlockStart: "2px solid currentColor",
        borderRadius: token("radius", "full"),
        animation: `spin ${token("animation", "fast")} linear infinite`,
        marginInlineEnd: token("space", "2"),
      },
    },
  },

  // Secondary action button
  secondaryAction: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: token("space", "2"),
    padding: `${token("space", "3")} ${token("space", "6")}`,
    backgroundColor: "transparent",
    color: token("color", "text-secondary"),
    border: `1px solid ${token("surface", "border")}`,
    borderRadius: token("radius", "md"),
    fontSize: token("typography", "sm-size"),
    fontWeight: token("typography", "medium"),
    cursor: "pointer",
    transition: `all ${token("animation", "fast")} ${
      token("animation", "ease")
    }`,

    "&:hover:not(:disabled)": {
      backgroundColor: token("surface", "background-hover"),
      color: token("color", "text-primary"),
      borderColor: token("surface", "border-hover"),
    },

    "&:focus-visible": {
      outline: `2px solid ${token("color", "primary-300")}`,
      outlineOffset: "2px",
    },

    "&:disabled": {
      opacity: "0.5",
      cursor: "not-allowed",
    },
  },
});

// Add spinner animation
const spinnerAnimation = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;

defineComponent("form", {
  styles: formStyles.css + spinnerAnimation,
  render: (attrs: Record<string, string>) => {
    const {
      title = "",
      description = "",
      fields = "[]",
      primaryAction = "",
      primaryActionText = "Submit",
      secondaryAction = "",
      secondaryActionText = "Cancel",
      variant = "default",
      size = "md",
      loading = "",
      noBorder = "",
      method = "POST",
      action = "",
      id = "",
    } = attrs;

    const { classMap } = formStyles;
    const isLoading = loading === "true" || loading === "1";
    const hasNoBorder = noBorder === "true" || noBorder === "1";

    // Parse fields from JSON string
    let parsedFields: Array<{
      name: string;
      type?: string;
      label?: string;
      placeholder?: string;
      required?: boolean;
      value?: string;
      options?: Array<{ value: string; label: string }>;
      help?: string;
      error?: string;
    }> = [];

    if (fields) {
      try {
        parsedFields = JSON.parse(fields);
      } catch {
        // Ignore invalid JSON
      }
    }

    const containerProps = {
      class: [
        classMap.base,
        variant && classMap.variants?.variant?.[variant],
        size && classMap.variants?.size?.[size],
      ].filter(Boolean).join(" "),
      id: id || undefined,
      "data-component": "form",
      "data-variant": variant,
      "data-size": size,
      "data-loading": isLoading.toString(),
    };

    const formProps = {
      method,
      action: action || undefined,
      style: id ? `container-name: form-${id}` : undefined,
    };

    // Render form header
    const header = (title || description)
      ? `
      <div class="${classMap.header}" data-no-border="${hasNoBorder}">
        ${title ? `<h2 class="title">${title}</h2>` : ""}
        ${description ? `<p class="description">${description}</p>` : ""}
      </div>
    `
      : "";

    // Render form fields
    const fieldsHtml = parsedFields.map((field) => {
      const fieldId = `${id || "form"}-${field.name}`;
      const hasError = Boolean(field.error);

      let fieldInput = "";
      switch (field.type) {
        case "textarea":
          fieldInput = `<textarea
            class="${classMap.field}"
            id="${fieldId}"
            name="${field.name}"
            data-type="textarea"
            data-error="${hasError}"
            placeholder="${field.placeholder || ""}"
            ${field.required ? "required" : ""}
          >${field.value || ""}</textarea>`;
          break;

        case "select":
          const options = field.options || [];
          fieldInput = `<select
            class="${classMap.field}"
            id="${fieldId}"
            name="${field.name}"
            data-type="select"
            data-error="${hasError}"
            ${field.required ? "required" : ""}
          >
            ${
            field.placeholder
              ? `<option value="">${field.placeholder}</option>`
              : ""
          }
            ${
            options.map((opt) =>
              `<option value="${opt.value}" ${
                opt.value === field.value ? "selected" : ""
              }>${opt.label}</option>`
            ).join("")
          }
          </select>`;
          break;

        default:
          fieldInput = `<input
            class="${classMap.field}"
            type="${field.type || "text"}"
            id="${fieldId}"
            name="${field.name}"
            data-error="${hasError}"
            placeholder="${field.placeholder || ""}"
            value="${field.value || ""}"
            ${field.required ? "required" : ""}
          />`;
      }

      return `
        <div class="${classMap.group}">
          ${
        field.label
          ? `<label class="${classMap.label}" for="${fieldId}" data-required="${
            field.required || false
          }">${field.label}</label>`
          : ""
      }
          ${fieldInput}
          ${
        (field.help || field.error)
          ? `<div class="${classMap.help}" data-error="${hasError}">${
            field.error || field.help
          }</div>`
          : ""
      }
        </div>
      `;
    }).join("");

    // Render form actions
    const actions = (primaryAction || secondaryAction)
      ? `
      <div class="${classMap.actions}" data-no-border="${hasNoBorder}">
        ${
        primaryAction
          ? `<button type="submit" class="${classMap.primaryAction}" data-loading="${isLoading}" ${
            isLoading ? "disabled" : ""
          }>${primaryActionText}</button>`
          : ""
      }
        ${
        secondaryAction
          ? `<button type="button" class="${classMap.secondaryAction}" onclick="${secondaryAction}">${secondaryActionText}</button>`
          : ""
      }
      </div>
    `
      : "";

    return `
      <div ${
      Object.entries(containerProps).map(([k, v]) => v ? `${k}="${v}"` : "")
        .join(" ")
    }>
        <form ${
      Object.entries(formProps).map(([k, v]) => v ? `${k}="${v}"` : "").join(
        " ",
      )
    }>
          ${header}
          ${fieldsHtml}
          ${actions}
        </form>
      </div>
    `;
  },
});

// Export convenience function
export const Form = (props: {
  title?: string;
  description?: string;
  fields?: Array<{
    name: string;
    type?: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    value?: string;
    options?: Array<{ value: string; label: string }>;
    help?: string;
    error?: string;
  }>;
  primaryAction?: string;
  primaryActionText?: string;
  secondaryAction?: string;
  secondaryActionText?: string;
  variant?: "default" | "card" | "modal" | "inline";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  noBorder?: boolean;
  method?: string;
  action?: string;
  id?: string;
}) => {
  const attrs: Record<string, string> = {};

  if (props.title) attrs.title = props.title;
  if (props.description) attrs.description = props.description;
  if (props.fields) attrs.fields = JSON.stringify(props.fields);
  if (props.primaryAction) attrs.primaryAction = props.primaryAction;
  if (props.primaryActionText) {
    attrs.primaryActionText = props.primaryActionText;
  }
  if (props.secondaryAction) attrs.secondaryAction = props.secondaryAction;
  if (props.secondaryActionText) {
    attrs.secondaryActionText = props.secondaryActionText;
  }
  if (props.variant) attrs.variant = props.variant;
  if (props.size) attrs.size = props.size;
  if (props.loading) attrs.loading = "true";
  if (props.noBorder) attrs.noBorder = "true";
  if (props.method) attrs.method = props.method;
  if (props.action) attrs.action = props.action;
  if (props.id) attrs.id = props.id;

  return renderComponent("form", attrs);
};

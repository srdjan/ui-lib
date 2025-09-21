/**
 * Stack Component - Vertical layout with consistent spacing
 * Uses CSS logical properties and design tokens
 */

import { defineComponent } from "../../define-component.ts";
import type { StackProps } from "./types.ts";

defineComponent<StackProps>("stack", {
  render: (props) => {
    const {
      spacing = "md",
      align = "stretch",
      dividers = false,
      className = "",
      id = "",
      role = "",
      ariaLabel = "",
    } = props;

    const classes = ["stack"];
    if (dividers) classes.push("stack--dividers");
    if (className) classes.push(className);

    const attributes = [
      `class="${classes.join(' ')}"`,
      `data-spacing="${spacing}"`,
      align !== "stretch" ? `data-align="${align}"` : "",
      id ? `id="${id}"` : "",
      role ? `role="${role}"` : "",
      ariaLabel ? `aria-label="${ariaLabel}"` : "",
    ].filter(Boolean);

    return `<div ${attributes.join(" ")}>{{children}}</div>`;
  },
});

export const Stack = "stack";
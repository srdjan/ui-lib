/**
 * Grid Component - Flexible CSS Grid layout
 * Provides responsive grid layouts with design token integration
 */

import { defineComponent } from "../../define-component.ts";
import type { GridProps } from "./types.ts";

defineComponent<GridProps>("grid", {
  render: (props) => {
    const {
      columns = "auto",
      rows = "",
      areas = "",
      responsive = true,
      minItemWidth = "250px",
      gap = "md",
      className = "",
      id = "",
      role = "",
      ariaLabel = "",
    } = props;

    const classes = ["grid"];

    // Handle predefined column layouts
    if (typeof columns === "number") {
      classes.push(`grid--${columns}`);
    } else if (columns === "auto") {
      classes.push("grid--auto");
    }

    if (className) classes.push(className);

    const attributes = [
      `class="${classes.join(" ")}"`,
      `data-gap="${gap}"`,
      id ? `id="${id}"` : "",
      role ? `role="${role}"` : "",
      ariaLabel ? `aria-label="${ariaLabel}"` : "",
    ].filter(Boolean);

    return `<div ${attributes.join(" ")}>{{children}}</div>`;
  },
});

export const Grid = "grid";

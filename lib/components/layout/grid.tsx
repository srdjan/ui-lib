/** @jsx h */
/**
 * Grid Component - Flexible CSS Grid layout
 * Provides responsive grid layouts with design token integration
 */

import { defineComponent, h } from "../../internal.ts";
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
      children,
    } = props;

    const classes = ["grid"];

    // Handle predefined column layouts
    if (typeof columns === "number") {
      classes.push(`grid--${columns}`);
    } else if (columns === "auto") {
      classes.push("grid--auto");
    }

    if (className) classes.push(className);

    return (
      <div
        class={classes.join(" ")}
        data-gap={gap}
        id={id || undefined}
        role={role || undefined}
        aria-label={ariaLabel || undefined}
      >
        {children}
      </div>
    );
  },
});

export const Grid = "grid";

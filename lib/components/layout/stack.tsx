/** @jsx h */
/**
 * Stack Component - Vertical layout with consistent spacing
 * Uses CSS logical properties and design tokens
 */

import { defineComponent, h } from "../../internal.ts";
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
      children,
    } = props;

    const classes = ["stack"];
    if (dividers) classes.push("stack--dividers");
    if (className) classes.push(className);

    return (
      <div
        class={classes.join(" ")}
        data-spacing={spacing}
        data-align={align !== "stretch" ? align : undefined}
        id={id || undefined}
        role={role || undefined}
        aria-label={ariaLabel || undefined}
        dangerouslySetInnerHTML={{ __html: "{{children}}" }}
      />
    );
  },
});

export const Stack = "stack";

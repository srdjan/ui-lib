/** @jsx h */
/**
 * Page Component - Main page container
 * Provides consistent page structure and centering
 */

import { defineComponent, h } from "../../define-component.ts";
import type { PageProps } from "./types.ts";

defineComponent<PageProps>("page", {
  render: (props) => {
    const {
      maxWidth = "",
      centered = true,
      variant = "constrained",
      className = "",
      padding = "md",
      id = "",
      role = "",
      ariaLabel = "",
      children,
    } = props;

    const classes = ["page"];

    // Add variant classes
    switch (variant) {
      case "fluid":
        classes.push("page--fluid");
        break;
      case "narrow":
        classes.push("page--narrow");
        break;
      case "wide":
        classes.push("page--wide");
        break;
      default:
        classes.push("page--constrained");
    }

    // Add utility classes
    if (centered) classes.push("u-center");
    if (className) classes.push(className);

    // Use JSX to build the element structure, then inject the placeholder
    const element = (
      <div
        class={classes.join(" ")}
        id={id || undefined}
        role={role || undefined}
        aria-label={ariaLabel || undefined}
        dangerouslySetInnerHTML={{ __html: "{{children}}" }}
      />
    );

    return element;
  },
});

export const Page = "page";

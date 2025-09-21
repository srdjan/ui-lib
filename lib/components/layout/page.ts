/**
 * Page Component - Main page container
 * Provides consistent page structure and centering
 */

import { defineComponent } from "../../define-component.ts";
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

    const attributes = [
      `class="${classes.join(' ')}"`,
      id ? `id="${id}"` : "",
      role ? `role="${role}"` : "",
      ariaLabel ? `aria-label="${ariaLabel}"` : "",
    ].filter(Boolean);

    return `<div ${attributes.join(" ")}>{{children}}</div>`;
  },
});

export const Page = "page";
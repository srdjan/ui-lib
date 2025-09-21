/**
 * Header Component - Page/section header with title hierarchy
 * Provides semantic header structure with proper heading levels
 */

import { defineComponent } from "../../define-component.ts";
import type { HeaderProps } from "./types.ts";

defineComponent<HeaderProps>("header", {
  render: (props) => {
    const {
      title,
      subtitle = "",
      description = "",
      level = 1,
      centered = false,
      className = "",
      id = "",
      role = "",
      ariaLabel = "",
    } = props;

    const classes = ["header"];
    if (centered) classes.push("header--centered");
    if (className) classes.push(className);

    const attributes = [
      `class="${classes.join(' ')}"`,
      id ? `id="${id}"` : "",
      role ? `role="${role}"` : "",
      ariaLabel ? `aria-label="${ariaLabel}"` : "",
    ].filter(Boolean);

    return `
      <header ${attributes.join(" ")}>
        <h${level} class="header__title">${title}</h${level}>
        ${subtitle ? `<p class="header__subtitle">${subtitle}</p>` : ""}
        ${description ? `<p class="header__description">${description}</p>` : ""}
      </header>
    `;
  },
});

export const Header = "header";
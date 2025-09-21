/**
 * Card Component - Flexible content container
 * Provides various card styles and interactive states
 */

import { defineComponent } from "../../define-component.ts";
import type { CardProps } from "./types.ts";

defineComponent<CardProps>("card", {
  render: (props) => {
    const {
      title = "",
      subtitle = "",
      variant = "default",
      size = "md",
      interactive = false,
      href = "",
      padding = "",
      className = "",
      id = "",
      role = "",
      ariaLabel = "",
    } = props;

    const classes = ["card"];

    // Add variant classes
    switch (variant) {
      case "elevated":
        classes.push("card--elevated");
        break;
      case "outlined":
        classes.push("card--outlined");
        break;
      case "filled":
        classes.push("card--filled");
        break;
      case "interactive":
        classes.push("card--interactive");
        break;
      default:
        classes.push("card--default");
    }

    // Add size classes
    classes.push(`card--${size}`);

    if (interactive || href) classes.push("card--interactive");
    if (className) classes.push(className);

    const styles = [];
    if (padding) {
      if (padding.startsWith("var(") || padding.includes("px") || padding.includes("rem")) {
        styles.push(`padding: ${padding};`);
      } else {
        styles.push(`padding: var(--space-${padding});`);
      }
    }

    // Generate header if title provided
    const headerHtml = title ? `
      <header class="card__header">
        <h3 class="card__title">${title}</h3>
        ${subtitle ? `<p class="card__subtitle">${subtitle}</p>` : ""}
      </header>
    ` : "";

    const attributes = [
      `class="${classes.join(' ')}"`,
      `data-size="${size}"`,
      styles.length > 0 ? `style="${styles.join(' ')}"` : "",
      id ? `id="${id}"` : "",
      role ? `role="${role}"` : "",
      ariaLabel ? `aria-label="${ariaLabel}"` : "",
    ].filter(Boolean);

    const content = `
      ${headerHtml}
      <div class="card__content">
        {{children}}
      </div>
    `;

    if (href) {
      return `<a href="${href}" ${attributes.join(" ")}>${content}</a>`;
    } else {
      return `<div ${attributes.join(" ")}>${content}</div>`;
    }
  },
});

export const Card = "card";
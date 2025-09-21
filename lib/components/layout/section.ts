/**
 * Section Component - Semantic section with optional header
 * Provides proper semantic structure for content sections
 */

import { defineComponent } from "../../define-component.ts";
import type { SectionProps } from "./types.ts";

defineComponent<SectionProps>("section", {
  render: (props) => {
    const {
      title = "",
      subtitle = "",
      level = 2,
      variant = "default",
      className = "",
      padding = "",
      margin = "",
      id = "",
      role = "",
      ariaLabel = "",
    } = props;

    const classes = ["section"];

    // Add variant classes
    switch (variant) {
      case "contained":
        classes.push("section--contained");
        break;
      case "full-width":
        classes.push("section--full-width");
        break;
      default:
        classes.push("section--default");
    }

    if (className) classes.push(className);

    const styles = [];
    if (padding) {
      if (padding.startsWith("var(") || padding.includes("px") || padding.includes("rem")) {
        styles.push(`padding: ${padding};`);
      } else {
        styles.push(`padding: var(--space-${padding});`);
      }
    }
    if (margin) {
      if (margin.startsWith("var(") || margin.includes("px") || margin.includes("rem")) {
        styles.push(`margin: ${margin};`);
      } else {
        styles.push(`margin: var(--space-${margin});`);
      }
    }

    // Generate header if title provided
    const headerHtml = title ? `
      <header class="section__header">
        <h${level} class="section__title">${title}</h${level}>
        ${subtitle ? `<p class="section__subtitle">${subtitle}</p>` : ""}
      </header>
    ` : "";

    const attributes = [
      `class="${classes.join(' ')}"`,
      styles.length > 0 ? `style="${styles.join(' ')}"` : "",
      id ? `id="${id}"` : "",
      role ? `role="${role}"` : "",
      ariaLabel ? `aria-label="${ariaLabel}"` : "",
    ].filter(Boolean);

    return `
      <section ${attributes.join(" ")}>
        ${headerHtml}
        <div class="section__content">
          {{children}}
        </div>
      </section>
    `;
  },
});

export const Section = "section";
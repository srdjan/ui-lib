/** @jsx h */
/**
 * Section Component - Semantic section with optional header
 * Provides proper semantic structure for content sections
 */

import { defineComponent, h } from "../../define-component.ts";
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
      children,
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

    const styles: Record<string, string> = {};
    if (padding) {
      if (
        padding.startsWith("var(") || padding.includes("px") ||
        padding.includes("rem")
      ) {
        styles.padding = padding;
      } else {
        styles.padding = `var(--space-${padding})`;
      }
    }
    if (margin) {
      if (
        margin.startsWith("var(") || margin.includes("px") ||
        margin.includes("rem")
      ) {
        styles.margin = margin;
      } else {
        styles.margin = `var(--space-${margin})`;
      }
    }

    // Build header content if title is provided
    const headerContent = title
      ? (
        <header class="section__header">
          <div
            class="section__title"
            dangerouslySetInnerHTML={{
              __html: `<h${level}>${title}</h${level}>`,
            }}
          />
          {subtitle && (
            <p
              class="section__subtitle"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          )}
        </header>
      )
      : "";

    return (
      <section
        class={classes.join(" ")}
        style={Object.keys(styles).length > 0 ? styles : undefined}
        id={id || undefined}
        role={role || undefined}
        aria-label={ariaLabel || undefined}
      >
        {headerContent}
        <div
          class="section__content"
          dangerouslySetInnerHTML={{ __html: "{{children}}" }}
        />
      </section>
    );
  },
});

export const Section = "section";

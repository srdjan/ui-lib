/**
 * Container Component - Responsive content container with max-width constraints
 * Provides consistent content spacing and centering across different viewports
 */

import { css, defineComponent } from "../../internal";
import { componentTokens } from "../../themes/component-tokens";
import type { ContainerProps } from "./types";

const containerStyles = css({
  container: {
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    paddingLeft: componentTokens.spacing[4],
    paddingRight: componentTokens.spacing[4],
  },

  "container--fluid": {
    maxWidth: "100%",
  },

  "container--constrained": {
    maxWidth: "1200px",
  },

  "container--narrow": {
    maxWidth: "800px",
  },

  "container--wide": {
    maxWidth: "1400px",
  },

  "container--centered": {
    marginLeft: "auto",
    marginRight: "auto",
  },

  "@media (min-width: 640px)": {
    ".container": {
      paddingLeft: componentTokens.spacing[6],
      paddingRight: componentTokens.spacing[6],
    },
  },

  "@media (min-width: 1024px)": {
    ".container": {
      paddingLeft: componentTokens.spacing[8],
      paddingRight: componentTokens.spacing[8],
    },
  },
});

defineComponent<ContainerProps>("container", {
  render: (props) => {
    const {
      variant = "constrained",
      maxWidth,
      centered = true,
      padding,
      paddingX,
      paddingY,
      className = "",
      id = "",
      role = "",
      ariaLabel = "",
    } = props;

    const classes = [containerStyles.classMap.container];
    classes.push(containerStyles.classMap[`container--${variant}`] || "");
    if (centered) classes.push(containerStyles.classMap["container--centered"]);
    if (className) classes.push(className);

    const styles = [];

    // Custom max-width override
    if (maxWidth) {
      styles.push(`max-width: ${maxWidth};`);
    }

    // Padding utilities
    const addSpacing = (value: string | undefined, property: string) => {
      if (!value) return;
      if (
        value.startsWith("var(") || value.includes("px") ||
        value.includes("rem")
      ) {
        styles.push(`${property}: ${value};`);
      } else {
        styles.push(`${property}: var(--space-${value});`);
      }
    };

    addSpacing(padding, "padding");
    addSpacing(paddingX, "padding-left");
    addSpacing(paddingX, "padding-right");
    addSpacing(paddingY, "padding-top");
    addSpacing(paddingY, "padding-bottom");

    const attributes = [
      `class="${classes.filter(Boolean).join(" ")}"`,
      styles.length > 0 ? `style="${styles.join(" ")}"` : "",
      id ? `id="${id}"` : "",
      role ? `role="${role}"` : "",
      ariaLabel ? `aria-label="${ariaLabel}"` : "",
    ].filter(Boolean);

    return `<div ${attributes.join(" ")}>{{children}}</div>
<style>${containerStyles.css}</style>`;
  },
});

export const Container = "container";

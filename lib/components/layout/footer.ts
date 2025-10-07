/**
 * Footer Component - Site footer with links and copyright
 * Provides consistent footer styling with navigation links and copyright information
 */

import { css, defineComponent } from "../../internal.ts";
import { componentTokens } from "../../themes/component-tokens.ts";
import type { FooterProps } from "./types.ts";

const footerStyles = css({
  footer: {
    width: "100%",
    paddingTop: componentTokens.spacing[8],
    paddingBottom: componentTokens.spacing[8],
    paddingLeft: componentTokens.spacing[4],
    paddingRight: componentTokens.spacing[4],
    backgroundColor: componentTokens.colors.surface.background,
    borderTop: `1px solid ${componentTokens.colors.surface.border}`,
  },

  "footer__content": {
    maxWidth: "1200px",
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    flexDirection: "column",
    gap: componentTokens.spacing[6],
  },

  "footer__links": {
    display: "flex",
    flexWrap: "wrap",
    gap: componentTokens.spacing[4],
    listStyle: "none",
    padding: "0",
    margin: "0",
  },

  "footer__link": {
    color: componentTokens.colors.gray[700],
    textDecoration: "none",
    fontSize: componentTokens.typography.sizes.sm,
    transition: "color 0.2s ease",
  },

  "footer__link:hover": {
    color: componentTokens.colors.primary[600],
  },

  "footer__copyright": {
    fontSize: componentTokens.typography.sizes.sm,
    color: componentTokens.colors.gray[600],
  },

  "footer--sticky": {
    position: "sticky",
    bottom: "0",
  },

  "footer--fixed": {
    position: "fixed",
    bottom: "0",
    left: "0",
    right: "0",
  },
});

defineComponent<FooterProps>("footer", {
  render: (props) => {
    const {
      variant = "default",
      links = [],
      copyright,
      className = "",
      id = "",
      role = "contentinfo",
      ariaLabel = "",
      padding,
      paddingX,
      paddingY,
    } = props;

    const classes = [footerStyles.classMap.footer];
    if (variant !== "default") {
      classes.push(footerStyles.classMap[`footer--${variant}`] || "");
    }
    if (className) classes.push(className);

    const styles: string[] = [];

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

    const linksHtml = links.length > 0
      ? `<ul class="${footerStyles.classMap.footer__links}">
        ${
        links.map((link) =>
          `<li><a href="${link.href}" class="${footerStyles.classMap.footer__link}"${
            link.external ? ' target="_blank" rel="noopener noreferrer"' : ""
          }>${link.text}</a></li>`
        ).join("")
      }
      </ul>`
      : "";

    const copyrightHtml = copyright
      ? `<div class="${footerStyles.classMap.footer__copyright}">${copyright}</div>`
      : "";

    return `<footer ${attributes.join(" ")}>
  <div class="${footerStyles.classMap.footer__content}">
    ${linksHtml}
    ${copyrightHtml}
    {{children}}
  </div>
</footer>
<style>${footerStyles.css}</style>`;
  },
});

export const Footer = "footer";

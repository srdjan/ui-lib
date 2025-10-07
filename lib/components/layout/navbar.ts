/**
 * Navbar Component - Navigation bar with brand and links
 * Provides consistent navigation header
 */

import { css, defineComponent } from "../../internal.ts";
import { componentTokens } from "../../themes/component-tokens.ts";

export interface NavbarProps {
  readonly brand?: string;
  readonly brandHref?: string;
  readonly links?: Array<{
    text: string;
    href: string;
    active?: boolean;
  }>;
  readonly className?: string;
  readonly id?: string;
  readonly role?: string;
  readonly ariaLabel?: string;
}

const navbarStyles = css({
  navbar: {
    width: "100%",
    paddingTop: componentTokens.spacing[4],
    paddingBottom: componentTokens.spacing[4],
    paddingLeft: componentTokens.spacing[4],
    paddingRight: componentTokens.spacing[4],
    backgroundColor: componentTokens.colors.surface.background,
    borderBottom: `1px solid ${componentTokens.colors.surface.border}`,
    position: "sticky",
    top: "0",
    zIndex: "50",
  },

  "navbar__content": {
    maxWidth: "1200px",
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: componentTokens.spacing[4],
  },

  "navbar__brand": {
    fontSize: componentTokens.typography.sizes.xl,
    fontWeight: componentTokens.typography.weights.bold,
    color: componentTokens.colors.gray[900],
    textDecoration: "none",
    transition: "color 0.2s ease",
  },

  "navbar__brand:hover": {
    color: componentTokens.colors.primary[600],
  },

  "navbar__links": {
    display: "flex",
    alignItems: "center",
    gap: componentTokens.spacing[6],
    listStyle: "none",
    padding: "0",
    margin: "0",
  },

  "navbar__link": {
    color: componentTokens.colors.gray[700],
    textDecoration: "none",
    fontSize: componentTokens.typography.sizes.base,
    fontWeight: componentTokens.typography.weights.medium,
    transition: "color 0.2s ease",
  },

  "navbar__link:hover": {
    color: componentTokens.colors.primary[600],
  },

  "navbar__link--active": {
    color: componentTokens.colors.primary[600],
    fontWeight: componentTokens.typography.weights.semibold,
  },
});

defineComponent<NavbarProps>("navbar", {
  render: (props) => {
    const {
      brand,
      brandHref = "/",
      links = [],
      className = "",
      id = "",
      role = "navigation",
      ariaLabel = "",
    } = props;

    const classes = [navbarStyles.classMap.navbar];
    if (className) classes.push(className);

    const attributes = [
      `class="${classes.filter(Boolean).join(" ")}"`,
      id ? `id="${id}"` : "",
      role ? `role="${role}"` : "",
      ariaLabel ? `aria-label="${ariaLabel}"` : "",
    ].filter(Boolean);

    const brandHtml = brand
      ? `<a href="${brandHref}" class="${navbarStyles.classMap.navbar__brand}">${brand}</a>`
      : "";

    const linksHtml = links.length > 0
      ? `<ul class="${navbarStyles.classMap.navbar__links}">
        ${
        links.map((link) => {
          const linkClasses = [navbarStyles.classMap.navbar__link];
          if (link.active) {
            linkClasses.push(navbarStyles.classMap["navbar__link--active"]);
          }
          return `<li><a href="${link.href}" class="${
            linkClasses.join(" ")
          }">${link.text}</a></li>`;
        }).join("")
      }
      </ul>`
      : "";

    return `<nav ${attributes.join(" ")}>
  <div class="${navbarStyles.classMap.navbar__content}">
    ${brandHtml}
    ${linksHtml}
    {{children}}
  </div>
</nav>
<style>${navbarStyles.css}</style>`;
  },
});

export const Navbar = "navbar";

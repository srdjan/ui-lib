/**
 * FeatureCard Component - Feature card with icon, title and description
 * Provides consistent feature presentation
 */

import { css, defineComponent } from "../../internal.ts";
import { componentTokens } from "../../themes/component-tokens.ts";

export interface FeatureCardProps {
  readonly icon?: string;
  readonly title: string;
  readonly description?: string;
  readonly href?: string;
  readonly className?: string;
  readonly id?: string;
  readonly role?: string;
  readonly ariaLabel?: string;
}

const featureCardStyles = css({
  "feature-card": {
    display: "flex",
    flexDirection: "column",
    gap: componentTokens.spacing[4],
    padding: componentTokens.spacing[6],
    backgroundColor: componentTokens.colors.surface.background,
    border: `1px solid ${componentTokens.colors.surface.border}`,
    borderRadius: componentTokens.radius.lg,
    transition: "all 0.2s ease",
  },

  "feature-card:hover": {
    borderColor: componentTokens.colors.primary[500],
    transform: "translateY(-4px)",
    boxShadow: componentTokens.shadows.lg,
  },

  "feature-card__icon": {
    fontSize: componentTokens.typography.sizes["3xl"],
    lineHeight: "1",
    color: componentTokens.colors.primary[600],
  },

  "feature-card__title": {
    fontSize: componentTokens.typography.sizes.xl,
    fontWeight: componentTokens.typography.weights.semibold,
    color: componentTokens.colors.gray[900],
    margin: "0",
  },

  "feature-card__description": {
    fontSize: componentTokens.typography.sizes.base,
    lineHeight: componentTokens.typography.lineHeights.relaxed,
    color: componentTokens.colors.gray[600],
    margin: "0",
  },

  "feature-card--link": {
    cursor: "pointer",
    textDecoration: "none",
  },
});

defineComponent<FeatureCardProps>("feature-card", {
  render: (props) => {
    const {
      icon,
      title,
      description,
      href,
      className = "",
      id = "",
      role = "",
      ariaLabel = "",
    } = props;

    const classes = [featureCardStyles.classMap["feature-card"]];
    if (href) classes.push(featureCardStyles.classMap["feature-card--link"]);
    if (className) classes.push(className);

    const attributes = [
      `class="${classes.filter(Boolean).join(" ")}"`,
      id ? `id="${id}"` : "",
      role ? `role="${role}"` : "",
      ariaLabel ? `aria-label="${ariaLabel}"` : "",
    ].filter(Boolean);

    const iconHtml = icon
      ? `<div class="${
        featureCardStyles.classMap["feature-card__icon"]
      }">${icon}</div>`
      : "";

    const descriptionHtml = description
      ? `<p class="${
        featureCardStyles.classMap["feature-card__description"]
      }">${description}</p>`
      : "";

    const content = `${iconHtml}
    <h3 class="${
      featureCardStyles.classMap["feature-card__title"]
    }">${title}</h3>
    ${descriptionHtml}
    {{children}}`;

    const element = href
      ? `<a href="${href}" ${attributes.join(" ")}>
  ${content}
</a>`
      : `<div ${attributes.join(" ")}>
  ${content}
</div>`;

    return `${element}
<style>${featureCardStyles.css}</style>`;
  },
});

export const FeatureCard = "feature-card";

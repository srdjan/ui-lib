/**
 * Hero Component - Hero section with title, subtitle, description and CTA
 * Provides prominent page header with call-to-action
 */

import { css, defineComponent } from "../../internal.ts";
import { componentTokens } from "../../themes/component-tokens.ts";

export interface HeroProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly description?: string;
  readonly ctaText?: string;
  readonly ctaHref?: string;
  readonly centered?: boolean;
  readonly className?: string;
  readonly id?: string;
  readonly role?: string;
  readonly ariaLabel?: string;
}

const heroStyles = css({
  hero: {
    width: "100%",
    paddingTop: componentTokens.spacing[12],
    paddingBottom: componentTokens.spacing[12],
    paddingLeft: componentTokens.spacing[4],
    paddingRight: componentTokens.spacing[4],
    backgroundColor: componentTokens.colors.surface.background,
  },

  "hero__content": {
    maxWidth: "1200px",
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    flexDirection: "column",
    gap: componentTokens.spacing[6],
  },

  "hero__title": {
    fontSize: componentTokens.typography.sizes["4xl"],
    fontWeight: componentTokens.typography.weights.bold,
    lineHeight: componentTokens.typography.lineHeights.tight,
    color: componentTokens.colors.gray[900],
    margin: "0",
  },

  "hero__subtitle": {
    fontSize: componentTokens.typography.sizes.xl,
    fontWeight: componentTokens.typography.weights.semibold,
    color: componentTokens.colors.primary[600],
    margin: "0",
  },

  "hero__description": {
    fontSize: componentTokens.typography.sizes.lg,
    lineHeight: componentTokens.typography.lineHeights.relaxed,
    color: componentTokens.colors.gray[600],
    margin: "0",
  },

  "hero__cta": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: componentTokens.spacing[3],
    paddingBottom: componentTokens.spacing[3],
    paddingLeft: componentTokens.spacing[6],
    paddingRight: componentTokens.spacing[6],
    backgroundColor: componentTokens.colors.primary[600],
    color: "#ffffff",
    fontSize: componentTokens.typography.sizes.base,
    fontWeight: componentTokens.typography.weights.semibold,
    textDecoration: "none",
    borderRadius: componentTokens.radius.md,
    transition: "all 0.2s ease",
    border: "none",
    cursor: "pointer",
  },

  "hero__cta:hover": {
    backgroundColor: componentTokens.colors.primary[700],
    transform: "translateY(-2px)",
  },

  "hero--centered": {
    textAlign: "center",
  },

  "hero--centered .hero__content": {
    alignItems: "center",
  },
});

defineComponent<HeroProps>("hero", {
  render: (props) => {
    const {
      title,
      subtitle,
      description,
      ctaText,
      ctaHref,
      centered = false,
      className = "",
      id = "",
      role = "",
      ariaLabel = "",
    } = props;

    const classes = [heroStyles.classMap.hero];
    if (centered) classes.push(heroStyles.classMap["hero--centered"]);
    if (className) classes.push(className);

    const attributes = [
      `class="${classes.filter(Boolean).join(" ")}"`,
      id ? `id="${id}"` : "",
      role ? `role="${role}"` : "",
      ariaLabel ? `aria-label="${ariaLabel}"` : "",
    ].filter(Boolean);

    const subtitleHtml = subtitle
      ? `<p class="${heroStyles.classMap.hero__subtitle}">${subtitle}</p>`
      : "";

    const descriptionHtml = description
      ? `<p class="${heroStyles.classMap.hero__description}">${description}</p>`
      : "";

    const ctaHtml = ctaText && ctaHref
      ? `<a href="${ctaHref}" class="${heroStyles.classMap.hero__cta}">${ctaText}</a>`
      : "";

    return `<section ${attributes.join(" ")}>
  <div class="${heroStyles.classMap.hero__content}">
    ${subtitleHtml}
    <h1 class="${heroStyles.classMap.hero__title}">${title}</h1>
    ${descriptionHtml}
    ${ctaHtml}
    {{children}}
  </div>
</section>
<style>${heroStyles.css}</style>`;
  },
});

export const Hero = "hero";

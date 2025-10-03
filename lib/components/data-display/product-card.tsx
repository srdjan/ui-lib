/**
 * Product Card Component
 * ----------------------
 * Commerce-friendly card for merchandising a single product.
 * - Uses design tokens and css-in-ts for styling
 * - All customization happens via CSS custom properties and props
 * - No inline styles; theming controlled by `--product-card-*` tokens
 */

import { css } from "../../css-in-ts.ts";
import { buildAttrs } from "../../dom-helpers.ts";
import {
  array,
  boolean,
  defineComponent,
  object,
  oneOf,
  string,
} from "../../internal.ts";
import { componentTokens } from "../../themes/component-tokens.ts";
import type { ComponentSize } from "../types.ts";

export type ProductBadgeTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger";

export type ProductBadge = {
  readonly label: string;
  readonly tone?: ProductBadgeTone;
};

export type ProductAction = {
  readonly label: string;
  readonly icon?: string;
  readonly variant?: "primary" | "secondary" | "ghost";
  readonly disabled?: boolean;
  readonly fullWidth?: boolean;
  readonly attributes?: Readonly<Record<string, string | number | boolean>>;
};

export type ProductMeta = {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly imageUrl: string;
  readonly price: number;
  readonly currency?: string;
  readonly originalPrice?: number;
  readonly rating?: number;
  readonly reviewCount?: number;
  readonly badges?: readonly ProductBadge[];
  readonly featured?: boolean;
  readonly availability?:
    | "in_stock"
    | "low_stock"
    | "out_of_stock"
    | "preorder";
};

export type ProductCardProps = {
  readonly product: ProductMeta;
  readonly size?: ComponentSize;
  readonly appearance?: "default" | "elevated" | "outlined";
  readonly layout?: "vertical" | "horizontal";
  readonly highlightSale?: boolean;
  readonly showDescription?: boolean;
  readonly showRating?: boolean;
  readonly primaryAction?: ProductAction;
  readonly secondaryAction?: ProductAction;
  readonly quickActions?: readonly ProductAction[];
  readonly className?: string;
};

type ProductCardInternalProps = ProductCardProps & {
  readonly salePercentage?: number;
};

type RenderContext = {
  readonly size: ComponentSize;
  readonly appearance: "default" | "elevated" | "outlined";
  readonly layout: "vertical" | "horizontal";
  readonly availability:
    | Exclude<ProductMeta["availability"], undefined>
    | "in_stock";
  readonly featured: boolean;
};

const toneMap: Record<ProductBadgeTone, { bg: string; fg: string }> = {
  neutral: {
    bg: componentTokens.colors.gray[100],
    fg: componentTokens.colors.gray[700],
  },
  info: {
    bg: componentTokens.colors.primary[100],
    fg: componentTokens.colors.primary[700],
  },
  success: {
    bg: componentTokens.colors.success[100],
    fg: componentTokens.colors.success[700],
  },
  warning: {
    bg: componentTokens.colors.warning[100],
    fg: componentTokens.colors.warning[700],
  },
  danger: {
    bg: componentTokens.colors.error[100],
    fg: componentTokens.colors.error[700],
  },
};

const baseStyles = css({
  card: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: componentTokens.spacing[4],
    padding: "var(--product-card-padding, 1.25rem)",
    backgroundColor: "var(--product-card-bg, var(--surface-card, " +
      componentTokens.colors.surface.background +
      "))",
    color: "var(--product-card-fg, " +
      componentTokens.colors.surface.foreground +
      ")",
    borderRadius: "var(--product-card-radius, " +
      componentTokens.radius.xl +
      ")",
    border: "1px solid var(--product-card-border, " +
      componentTokens.colors.surface.border +
      ")",
    boxShadow: "var(--product-card-shadow, " + componentTokens.shadows.sm + ")",
    textDecoration: "none",
    overflow: "hidden",
    transition:
      `transform ${componentTokens.animation.duration.normal} ${componentTokens.animation.easing.out}, box-shadow ${componentTokens.animation.duration.normal} ${componentTokens.animation.easing.out}`,

    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: componentTokens.shadows.lg,
    },
  },

  featured: {
    borderColor: componentTokens.colors.primary[300],
    boxShadow: componentTokens.shadows.lg,
  },

  layoutHorizontal: {
    flexDirection: "row",
    gap: componentTokens.spacing[5],
  },

  media: {
    position: "relative",
    borderRadius: "var(--product-card-media-radius, " +
      componentTokens.radius.lg +
      ")",
    overflow: "hidden",
    backgroundColor: componentTokens.colors.gray[100],
    aspectRatio: "4/3",
  },

  mediaHorizontal: {
    flex: "0 0 240px",
    height: "auto",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  saleBadge: {
    position: "absolute",
    top: componentTokens.spacing[3],
    right: componentTokens.spacing[3],
    padding: `${componentTokens.spacing[1]} ${componentTokens.spacing[3]}`,
    borderRadius: componentTokens.radius.full,
    backgroundColor: "var(--product-card-sale-bg, " +
      componentTokens.colors.error[500] +
      ")",
    color: "var(--product-card-sale-fg, #FFFFFF)",
    fontSize: componentTokens.typography.sizes.xs,
    fontWeight: componentTokens.typography.weights.semibold,
    letterSpacing: componentTokens.typography.letterSpacing.wider,
    textTransform: "uppercase",
  },

  badges: {
    position: "absolute",
    top: componentTokens.spacing[3],
    left: componentTokens.spacing[3],
    display: "flex",
    flexDirection: "column",
    gap: componentTokens.spacing[1],
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: componentTokens.spacing[1],
    padding: `${componentTokens.spacing[1]} ${componentTokens.spacing[3]}`,
    borderRadius: componentTokens.radius.full,
    fontSize: componentTokens.typography.sizes.xs,
    fontWeight: componentTokens.typography.weights.medium,
    letterSpacing: componentTokens.typography.letterSpacing.wide,
    textTransform: "uppercase",
    backgroundColor: componentTokens.colors.gray[100],
    color: componentTokens.colors.gray[700],
  },

  badgeNeutral: {
    backgroundColor: toneMap.neutral.bg,
    color: toneMap.neutral.fg,
  },

  badgeInfo: {
    backgroundColor: toneMap.info.bg,
    color: toneMap.info.fg,
  },

  badgeSuccess: {
    backgroundColor: toneMap.success.bg,
    color: toneMap.success.fg,
  },

  badgeWarning: {
    backgroundColor: toneMap.warning.bg,
    color: toneMap.warning.fg,
  },

  badgeDanger: {
    backgroundColor: toneMap.danger.bg,
    color: toneMap.danger.fg,
  },

  content: {
    display: "flex",
    flexDirection: "column",
    gap: componentTokens.spacing[3],
    flex: 1,
  },

  title: {
    margin: 0,
    fontSize: "var(--product-card-title-size, " +
      componentTokens.typography.sizes.lg +
      ")",
    fontWeight: componentTokens.typography.weights.semibold,
    lineHeight: componentTokens.typography.lineHeights.tight,
  },

  description: {
    margin: 0,
    fontSize: componentTokens.typography.sizes.sm,
    color: componentTokens.colors.gray[600],
    lineHeight: componentTokens.typography.lineHeights.normal,
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  rating: {
    display: "flex",
    alignItems: "center",
    gap: componentTokens.spacing[2],
    fontSize: componentTokens.typography.sizes.sm,
    color: componentTokens.colors.gray[600],
  },

  stars: {
    color: componentTokens.colors.warning[500],
    fontSize: componentTokens.typography.sizes.sm,
    letterSpacing: componentTokens.typography.letterSpacing.wide,
  },

  pricing: {
    display: "flex",
    alignItems: "baseline",
    gap: componentTokens.spacing[3],
  },

  price: {
    fontSize: componentTokens.typography.sizes["2xl"],
    fontWeight: componentTokens.typography.weights.bold,
    color: "var(--product-card-price, " + componentTokens.colors.success[600] +
      ")",
  },

  originalPrice: {
    fontSize: componentTokens.typography.sizes.base,
    color: componentTokens.colors.gray[500],
    textDecoration: "line-through",
  },

  stock: {
    fontSize: componentTokens.typography.sizes.sm,
    color: componentTokens.colors.gray[500],
  },

  actions: {
    display: "flex",
    flexDirection: "column",
    gap: componentTokens.spacing[2],
    marginTop: "auto",
  },

  quickActions: {
    display: "flex",
    gap: componentTokens.spacing[2],
    flexWrap: "wrap",
  },

  actionButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: componentTokens.spacing[2],
    padding: `${componentTokens.spacing[2]} ${componentTokens.spacing[4]}`,
    borderRadius: componentTokens.radius.md,
    border: "1px solid transparent",
    fontWeight: componentTokens.typography.weights.medium,
    fontSize: componentTokens.typography.sizes.sm,
    cursor: "pointer",
    transition:
      `all ${componentTokens.animation.duration.normal} ${componentTokens.animation.easing.out}`,
    textDecoration: "none",
  },

  actionPrimary: {
    backgroundColor: "var(--product-card-action-primary-bg, " +
      componentTokens.colors.primary[500] +
      ")",
    color: "var(--product-card-action-primary-fg, #FFFFFF)",

    "&:hover": {
      backgroundColor: "var(--product-card-action-primary-hover, " +
        componentTokens.colors.primary[600] +
        ")",
    },
  },

  actionSecondary: {
    backgroundColor: "var(--product-card-action-secondary-bg, " +
      componentTokens.colors.gray[100] +
      ")",
    color: "var(--product-card-action-secondary-fg, " +
      componentTokens.colors.gray[800] +
      ")",
    borderColor: "var(--product-card-action-secondary-border, " +
      componentTokens.colors.gray[300] +
      ")",

    "&:hover": {
      backgroundColor: "var(--product-card-action-secondary-hover, " +
        componentTokens.colors.gray[200] +
        ")",
    },
  },

  actionGhost: {
    backgroundColor: "transparent",
    color: "var(--product-card-action-ghost-fg, " +
      componentTokens.colors.gray[700] +
      ")",
    borderColor: "transparent",

    "&:hover": {
      backgroundColor: componentTokens.colors.gray[100],
    },
  },

  actionDisabled: {
    cursor: "not-allowed",
    opacity: 0.6,
  },

  actionFullWidth: {
    width: "100%",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--product-card-overlay, rgba(255,255,255,0.75))",
    color: componentTokens.colors.gray[600],
    fontWeight: componentTokens.typography.weights.semibold,
    letterSpacing: componentTokens.typography.letterSpacing.wide,
    textTransform: "uppercase",
  },
});

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function renderBadge(badge: ProductBadge): string {
  const classes = [baseStyles.classMap.badge];
  switch (badge.tone ?? "neutral") {
    case "info":
      classes.push(baseStyles.classMap.badgeInfo);
      break;
    case "success":
      classes.push(baseStyles.classMap.badgeSuccess);
      break;
    case "warning":
      classes.push(baseStyles.classMap.badgeWarning);
      break;
    case "danger":
      classes.push(baseStyles.classMap.badgeDanger);
      break;
    default:
      classes.push(baseStyles.classMap.badgeNeutral);
      break;
  }

  return `<span class="${classes.join(" ")}">${badge.label}</span>`;
}

function computeSalePercentage(
  price: number,
  originalPrice?: number,
): number | undefined {
  if (!originalPrice || originalPrice <= price) return undefined;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);
  const stars = `${"★".repeat(full)}${hasHalf ? "⯨" : ""}${"☆".repeat(empty)}`;
  return `<span class="${baseStyles.classMap.stars}" aria-hidden="true">${stars}</span>`;
}

function resolveActionClass(action?: ProductAction): string {
  const classes = [baseStyles.classMap.actionButton];
  if (!action) return classes.join(" ");
  switch (action.variant ?? "primary") {
    case "ghost":
      classes.push(baseStyles.classMap.actionGhost);
      break;
    case "secondary":
      classes.push(baseStyles.classMap.actionSecondary);
      break;
    default:
      classes.push(baseStyles.classMap.actionPrimary);
      break;
  }
  if (action.disabled) classes.push(baseStyles.classMap.actionDisabled);
  if (action.fullWidth) classes.push(baseStyles.classMap.actionFullWidth);
  return classes.join(" ");
}

function resolveContext(props: ProductCardInternalProps): RenderContext {
  return {
    size: props.size ?? "md",
    appearance: props.appearance ?? "default",
    layout: props.layout ?? "vertical",
    availability: props.product.availability ?? "in_stock",
    featured: Boolean(props.product.featured),
  };
}

function renderQuickAction(action: ProductAction): string {
  const classes = [
    baseStyles.classMap.actionButton,
    baseStyles.classMap.actionGhost,
  ]
    .join(" ");
  const attrString = buildAttrs(action.attributes as Record<string, unknown>);
  return `<button type=\"button\" class=\"${classes}\" ${attrString}>${
    action.icon ?? ""
  }<span>${action.label}</span></button>`;
}

defineComponent<ProductCardProps>("product-card", {
  props: (attrs) => {
    const source = attrs as Record<string, unknown>;
    const rawProduct = source.product ?? source["product"];
    const parsedProduct = typeof rawProduct === "string"
      ? object<ProductMeta>().parse(attrs, "product")
      : rawProduct as ProductMeta;
    const size = string("md").parse(attrs, "size") as ComponentSize;
    const appearance = oneOf(
      [
        "default",
        "elevated",
        "outlined",
      ] as const,
      "default",
    ).parse(attrs, "appearance") as
      | "default"
      | "elevated"
      | "outlined";
    const layout = oneOf(["vertical", "horizontal"] as const, "vertical").parse(
      attrs,
      "layout",
    ) as "vertical" | "horizontal";
    const showDescription = boolean(true).parse(attrs, "showDescription");
    const showRating = boolean(true).parse(attrs, "showRating");
    const highlightSale = boolean(true).parse(attrs, "highlightSale");

    const rawPrimary = source.primaryAction ?? source["primary-action"];
    const primaryAction = typeof rawPrimary === "string"
      ? object<ProductAction>().parse(attrs, "primaryAction")
      : rawPrimary as ProductAction | undefined;

    const rawSecondary = source.secondaryAction ?? source["secondary-action"];
    const secondaryAction = typeof rawSecondary === "string"
      ? object<ProductAction>().parse(attrs, "secondaryAction")
      : rawSecondary as ProductAction | undefined;

    const rawQuick = source.quickActions ?? source["quick-actions"];
    const quickActions = typeof rawQuick === "string"
      ? array<ProductAction>().parse(attrs, "quickActions")
      : rawQuick as readonly ProductAction[] | undefined;

    return {
      product: parsedProduct,
      size,
      appearance,
      layout,
      showDescription,
      showRating,
      highlightSale,
      primaryAction,
      secondaryAction,
      quickActions,
      className: typeof source.className === "string"
        ? source.className as string
        : typeof source["class"] === "string"
        ? source["class"] as string
        : "",
    } satisfies ProductCardProps;
  },

  render: (props) => {
    const salePercentage = computeSalePercentage(
      props.product.price,
      props.highlightSale ? props.product.originalPrice : undefined,
    );

    const context = resolveContext({ ...props, salePercentage });

    const cardClasses = [baseStyles.classMap.card];
    if (context.featured) cardClasses.push(baseStyles.classMap.featured);
    if (context.layout === "horizontal") {
      cardClasses.push(baseStyles.classMap.layoutHorizontal);
    }
    if (props.className) cardClasses.push(props.className);

    const mediaClasses = [baseStyles.classMap.media];
    if (context.layout === "horizontal") {
      mediaClasses.push(baseStyles.classMap.mediaHorizontal);
    }

    const badgesHtml = props.product.badges?.length
      ? `<div class="${baseStyles.classMap.badges}">${
        props.product.badges.map(renderBadge).join("")
      }</div>`
      : "";

    const saleBadgeHtml = salePercentage !== undefined
      ? `<span class="${baseStyles.classMap.saleBadge}" aria-label="${salePercentage}% off">-${salePercentage}%</span>`
      : "";

    const ratingHtml =
      props.showRating && typeof props.product.rating === "number"
        ? `<div class="${baseStyles.classMap.rating}">${
          renderStars(props.product.rating)
        }<span>${props.product.rating.toFixed(1)} • ${
          props.product.reviewCount ?? 0
        } reviews</span></div>`
        : "";

    const originalPriceHtml = props.product.originalPrice &&
        props.product.originalPrice > props.product.price
      ? `<span class="${baseStyles.classMap.originalPrice}">${
        formatCurrency(
          props.product.originalPrice,
          props.product.currency ?? "USD",
        )
      }</span>`
      : "";

    const availabilityLabel = (() => {
      switch (context.availability) {
        case "out_of_stock":
          return "Out of stock";
        case "preorder":
          return "Preorder";
        case "low_stock":
          return "Low stock";
        default:
          return "";
      }
    })();

    const overlayHtml = availabilityLabel && context.availability !== "in_stock"
      ? `<div class="${baseStyles.classMap.overlay}">${availabilityLabel}</div>`
      : "";

    const primaryActionHtml = props.primaryAction
      ? `<button type=\"button\" class=\"${
        resolveActionClass(props.primaryAction)
      }\" ${
        buildAttrs(props.primaryAction.attributes as Record<string, unknown>)
      } ${props.primaryAction?.disabled ? "disabled" : ""}>${
        props.primaryAction.icon ?? ""
      }<span>${props.primaryAction.label}</span></button>`
      : "";

    const secondaryActionHtml = props.secondaryAction
      ? `<button type=\"button\" class=\"${
        resolveActionClass(props.secondaryAction)
      }\" ${
        buildAttrs(props.secondaryAction.attributes as Record<string, unknown>)
      } ${props.secondaryAction?.disabled ? "disabled" : ""}>${
        props.secondaryAction.icon ?? ""
      }<span>${props.secondaryAction.label}</span></button>`
      : "";

    const quickActionsHtml = props.quickActions?.length
      ? `<div class="${baseStyles.classMap.quickActions}">${
        props.quickActions.map(renderQuickAction).join("")
      }</div>`
      : "";

    const descriptionHtml = props.showDescription && props.product.description
      ? `<p class="${baseStyles.classMap.description}">${props.product.description}</p>`
      : "";

    return `
      <article class="${
      cardClasses.join(" ")
    }" data-component="product-card" data-product-id="${props.product.id}">
        <div class="${mediaClasses.join(" ")}">
          <img src="${props.product.imageUrl}" alt="${props.product.name}" loading="lazy" class="${baseStyles.classMap.image}" />
          ${badgesHtml}
          ${saleBadgeHtml}
          ${overlayHtml}
        </div>
        <div class="${baseStyles.classMap.content}">
          <h3 class="${baseStyles.classMap.title}">${props.product.name}</h3>
          ${descriptionHtml}
          ${ratingHtml}
          <div class="${baseStyles.classMap.pricing}">
            <span class="${baseStyles.classMap.price}">${
      formatCurrency(props.product.price, props.product.currency ?? "USD")
    }</span>
            ${originalPriceHtml}
          </div>
          <div class="${baseStyles.classMap.stock}">
            ${
      availabilityLabel && context.availability !== "out_of_stock"
        ? availabilityLabel
        : ""
    }
          </div>
          <div class="${baseStyles.classMap.actions}">
            ${primaryActionHtml}
            ${secondaryActionHtml}
            ${quickActionsHtml}
          </div>
        </div>
      </article>
    `;
  },
});

export const ProductCard = "product-card";

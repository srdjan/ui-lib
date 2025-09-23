/** @jsx h */
/**
 * ProductCard Component - Token-Based Sealed Component
 *
 * Demonstrates the new token-based component system where:
 * - Component is completely sealed (no internal access)
 * - Customization only through CSS variables (tokens)
 * - Type-safe token interface with IntelliSense
 * - Performance via CSS variables (instant theming)
 */

import { h } from "jsx";
import { createTokenComponent } from "../../../lib/tokens/component-factory.ts";
import type { ComponentTokens } from "../../../lib/tokens/component-tokens.ts";
import type { Product } from "../api/types.ts";

// ============================================================
// Token Contract Definition
// ============================================================

export type ProductCardTokens = ComponentTokens<{
  // Base layout and spacing
  base: {
    width: string;
    padding: string;
    borderRadius: string;
    borderWidth: string;
    borderStyle: string;
    borderColor: string;
    background: string;
    shadow: string;
    transitionDuration: string;
    transitionTiming: string;
  };

  // Image container
  image: {
    aspectRatio: string;
    borderRadius: string;
    objectFit: string;
    background: string;
  };

  // Content area
  content: {
    padding: string;
    gap: string;
  };

  // Product title
  title: {
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    color: string;
    marginBottom: string;
  };

  // Description text
  description: {
    fontSize: string;
    lineHeight: string;
    color: string;
    marginBottom: string;
  };

  // Price display
  price: {
    fontSize: string;
    fontWeight: string;
    color: string;
    marginBottom: string;
  };

  // Original price (crossed out)
  originalPrice: {
    fontSize: string;
    fontWeight: string;
    color: string;
    textDecoration: string;
    marginRight: string;
  };

  // Sale badge
  saleBadge: {
    background: string;
    color: string;
    fontSize: string;
    fontWeight: string;
    padding: string;
    borderRadius: string;
    position: string;
    top: string;
    right: string;
  };

  // Rating stars
  rating: {
    fontSize: string;
    color: string;
    marginRight: string;
  };

  // Review count
  reviewCount: {
    fontSize: string;
    color: string;
  };

  // Action buttons
  button: {
    width: string;
    padding: string;
    fontSize: string;
    fontWeight: string;
    borderRadius: string;
    border: string;
    cursor: string;
    transitionDuration: string;
  };

  // Primary button (Add to Cart)
  buttonPrimary: {
    background: string;
    backgroundHover: string;
    color: string;
    colorHover: string;
  };

  // Secondary button (Wishlist)
  buttonSecondary: {
    background: string;
    backgroundHover: string;
    color: string;
    colorHover: string;
    borderColor: string;
  };

  // Hover state
  hover: {
    shadow: string;
    transform: string;
    borderColor: string;
  };

  // Out of stock state
  outOfStock: {
    opacity: string;
    background: string;
    color: string;
  };

  // Featured variant
  featured: {
    borderColor: string;
    borderWidth: string;
    shadow: string;
  };

  // Compact size
  compact: {
    padding: string;
    titleFontSize: string;
    descriptionFontSize: string;
  };

  // Large size
  large: {
    padding: string;
    titleFontSize: string;
    priceFontSize: string;
  };
}>;

// ============================================================
// Default Token Values
// ============================================================

const defaultProductCardTokens: ProductCardTokens = {
  base: {
    width: "100%",
    padding: "1rem",
    borderRadius: "0.5rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    background: "#FFFFFF",
    shadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    transitionDuration: "200ms",
    transitionTiming: "ease-out",
  },

  image: {
    aspectRatio: "4/3",
    borderRadius: "0.25rem",
    objectFit: "cover",
    background: "#F3F4F6",
  },

  content: {
    padding: "1rem 0 0 0",
    gap: "0.5rem",
  },

  title: {
    fontSize: "1rem",
    fontWeight: "600",
    lineHeight: "1.25",
    color: "#1F2937",
    marginBottom: "0.25rem",
  },

  description: {
    fontSize: "0.875rem",
    lineHeight: "1.5",
    color: "#6B7280",
    marginBottom: "0.75rem",
  },

  price: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#059669",
    marginBottom: "0.5rem",
  },

  originalPrice: {
    fontSize: "1rem",
    fontWeight: "500",
    color: "#9CA3AF",
    textDecoration: "line-through",
    marginRight: "0.5rem",
  },

  saleBadge: {
    background: "#DC2626",
    color: "#FFFFFF",
    fontSize: "0.75rem",
    fontWeight: "600",
    padding: "0.25rem 0.5rem",
    borderRadius: "0.25rem",
    position: "absolute",
    top: "0.5rem",
    right: "0.5rem",
  },

  rating: {
    fontSize: "0.875rem",
    color: "#FBBF24",
    marginRight: "0.25rem",
  },

  reviewCount: {
    fontSize: "0.875rem",
    color: "#6B7280",
  },

  button: {
    width: "100%",
    padding: "0.75rem 1rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    borderRadius: "0.375rem",
    border: "none",
    cursor: "pointer",
    transitionDuration: "150ms",
  },

  buttonPrimary: {
    background: "#3B82F6",
    backgroundHover: "#2563EB",
    color: "#FFFFFF",
    colorHover: "#FFFFFF",
  },

  buttonSecondary: {
    background: "transparent",
    backgroundHover: "#F3F4F6",
    color: "#374151",
    colorHover: "#1F2937",
    borderColor: "#D1D5DB",
  },

  hover: {
    shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    transform: "translateY(-1px)",
    borderColor: "#C5C5C5",
  },

  outOfStock: {
    opacity: "0.6",
    background: "#F9FAFB",
    color: "#9CA3AF",
  },

  featured: {
    borderColor: "#3B82F6",
    borderWidth: "2px",
    shadow: "0 4px 6px -1px rgba(59, 130, 246, 0.1)",
  },

  compact: {
    padding: "0.75rem",
    titleFontSize: "0.875rem",
    descriptionFontSize: "0.75rem",
  },

  large: {
    padding: "1.5rem",
    titleFontSize: "1.25rem",
    priceFontSize: "1.5rem",
  },
};

// ============================================================
// Component Props Interface
// ============================================================

export type ProductCardProps = {
  readonly product: Product;
  readonly size?: "compact" | "default" | "large";
  readonly variant?: "default" | "featured";
  readonly showQuickAdd?: boolean;
  readonly showWishlist?: boolean;
  readonly showDescription?: boolean;
  readonly onAddToCart?: (productId: string) => void;
  readonly onAddToWishlist?: (productId: string) => void;
  readonly className?: string;
};

// ============================================================
// Helper Functions
// ============================================================

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function renderStars(rating: number): string {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return [
    "★".repeat(fullStars),
    hasHalfStar ? "☆" : "",
    "☆".repeat(emptyStars),
  ].join("");
}

function calculateSalePercentage(original: number, current: number): number {
  return Math.round(((original - current) / original) * 100);
}

// ============================================================
// Sealed ProductCard Component
// ============================================================

export const ProductCard = createTokenComponent<
  ProductCardTokens,
  ProductCardProps
>({
  name: "product-card",
  tokens: defaultProductCardTokens,

  styles: (cssVars) => `
    .ui-product-card {
      /* Base styles */
      position: relative;
      width: ${cssVars.base.width};
      padding: ${cssVars.base.padding};
      border-radius: ${cssVars.base.borderRadius};
      border: ${cssVars.base.borderWidth} ${cssVars.base.borderStyle} ${cssVars.base.borderColor};
      background: ${cssVars.base.background};
      box-shadow: ${cssVars.base.shadow};
      transition: all ${cssVars.base.transitionDuration} ${cssVars.base.transitionTiming};
      cursor: pointer;
      overflow: hidden;
    }

    .ui-product-card:hover {
      box-shadow: ${cssVars.hover.shadow};
      transform: ${cssVars.hover.transform};
      border-color: ${cssVars.hover.borderColor};
    }

    .ui-product-card--featured {
      border-color: ${cssVars.featured.borderColor};
      border-width: ${cssVars.featured.borderWidth};
      box-shadow: ${cssVars.featured.shadow};
    }

    .ui-product-card--compact {
      padding: ${cssVars.compact.padding};
    }

    .ui-product-card--large {
      padding: ${cssVars.large.padding};
    }

    .ui-product-card--out-of-stock {
      opacity: ${cssVars.outOfStock.opacity};
      background: ${cssVars.outOfStock.background};
    }

    .ui-product-card__image {
      width: 100%;
      aspect-ratio: ${cssVars.image.aspectRatio};
      border-radius: ${cssVars.image.borderRadius};
      object-fit: ${cssVars.image.objectFit};
      background: ${cssVars.image.background};
      display: block;
    }

    .ui-product-card__content {
      padding: ${cssVars.content.padding};
      display: flex;
      flex-direction: column;
      gap: ${cssVars.content.gap};
    }

    .ui-product-card__title {
      font-size: ${cssVars.title.fontSize};
      font-weight: ${cssVars.title.fontWeight};
      line-height: ${cssVars.title.lineHeight};
      color: ${cssVars.title.color};
      margin: 0 0 ${cssVars.title.marginBottom} 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .ui-product-card--compact .ui-product-card__title {
      font-size: ${cssVars.compact.titleFontSize};
    }

    .ui-product-card--large .ui-product-card__title {
      font-size: ${cssVars.large.titleFontSize};
    }

    .ui-product-card__description {
      font-size: ${cssVars.description.fontSize};
      line-height: ${cssVars.description.lineHeight};
      color: ${cssVars.description.color};
      margin: 0 0 ${cssVars.description.marginBottom} 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .ui-product-card--compact .ui-product-card__description {
      font-size: ${cssVars.compact.descriptionFontSize};
      -webkit-line-clamp: 2;
    }

    .ui-product-card__price-container {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      margin-bottom: ${cssVars.price.marginBottom};
    }

    .ui-product-card__price {
      font-size: ${cssVars.price.fontSize};
      font-weight: ${cssVars.price.fontWeight};
      color: ${cssVars.price.color};
      margin: 0;
    }

    .ui-product-card--large .ui-product-card__price {
      font-size: ${cssVars.large.priceFontSize};
    }

    .ui-product-card__original-price {
      font-size: ${cssVars.originalPrice.fontSize};
      font-weight: ${cssVars.originalPrice.fontWeight};
      color: ${cssVars.originalPrice.color};
      text-decoration: ${cssVars.originalPrice.textDecoration};
      margin: 0;
    }

    .ui-product-card__sale-badge {
      position: ${cssVars.saleBadge.position};
      top: ${cssVars.saleBadge.top};
      right: ${cssVars.saleBadge.right};
      background: ${cssVars.saleBadge.background};
      color: ${cssVars.saleBadge.color};
      font-size: ${cssVars.saleBadge.fontSize};
      font-weight: ${cssVars.saleBadge.fontWeight};
      padding: ${cssVars.saleBadge.padding};
      border-radius: ${cssVars.saleBadge.borderRadius};
      z-index: 1;
    }

    .ui-product-card__rating {
      display: flex;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .ui-product-card__stars {
      font-size: ${cssVars.rating.fontSize};
      color: ${cssVars.rating.color};
      margin-right: ${cssVars.rating.marginRight};
    }

    .ui-product-card__review-count {
      font-size: ${cssVars.reviewCount.fontSize};
      color: ${cssVars.reviewCount.color};
    }

    .ui-product-card__actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: auto;
    }

    .ui-product-card__button {
      width: ${cssVars.button.width};
      padding: ${cssVars.button.padding};
      font-size: ${cssVars.button.fontSize};
      font-weight: ${cssVars.button.fontWeight};
      border-radius: ${cssVars.button.borderRadius};
      border: ${cssVars.button.border};
      cursor: ${cssVars.button.cursor};
      transition: all ${cssVars.button.transitionDuration} ease;
      text-align: center;
      text-decoration: none;
    }

    .ui-product-card__button--primary {
      background: ${cssVars.buttonPrimary.background};
      color: ${cssVars.buttonPrimary.color};
    }

    .ui-product-card__button--primary:hover:not(:disabled) {
      background: ${cssVars.buttonPrimary.backgroundHover};
      color: ${cssVars.buttonPrimary.colorHover};
    }

    .ui-product-card__button--secondary {
      background: ${cssVars.buttonSecondary.background};
      color: ${cssVars.buttonSecondary.color};
      border: 1px solid ${cssVars.buttonSecondary.borderColor};
    }

    .ui-product-card__button--secondary:hover:not(:disabled) {
      background: ${cssVars.buttonSecondary.backgroundHover};
      color: ${cssVars.buttonSecondary.colorHover};
    }

    .ui-product-card__button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .ui-product-card__out-of-stock-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: ${cssVars.outOfStock.color};
      z-index: 2;
    }
  `,

  render: (props) => {
    const {
      product,
      size = "default",
      variant = "default",
      showQuickAdd = true,
      showWishlist = false,
      showDescription = true,
      onAddToCart,
      onAddToWishlist,
      className = "",
    } = props;

    const isOnSale = product.originalPrice &&
      product.originalPrice > product.price;
    const salePercentage = isOnSale
      ? calculateSalePercentage(product.originalPrice!, product.price)
      : 0;

    const classes = [
      "ui-product-card",
      `ui-product-card--${variant}`,
      size !== "default" && `ui-product-card--${size}`,
      !product.inStock && "ui-product-card--out-of-stock",
      className,
    ].filter(Boolean).join(" ");

    const addToCartHandler = onAddToCart
      ? `onclick="(${onAddToCart.toString()})('${product.id}')"`
      : "";

    const wishlistHandler = onAddToWishlist
      ? `onclick="(${onAddToWishlist.toString()})('${product.id}')"`
      : "";

    return `
      <div class="${classes}" data-product-id="${product.id}">
        ${
      isOnSale
        ? `<div class="ui-product-card__sale-badge">${salePercentage}% OFF</div>`
        : ""
    }

        <img
          class="ui-product-card__image"
          src="${product.imageUrl}"
          alt="${product.name}"
          loading="lazy"
        />

        <div class="ui-product-card__content">
          <h3 class="ui-product-card__title">${product.name}</h3>

          ${
      showDescription
        ? `
            <p class="ui-product-card__description">${product.description}</p>
          `
        : ""
    }

          <div class="ui-product-card__rating">
            <span class="ui-product-card__stars">${
      renderStars(product.rating)
    }</span>
            <span class="ui-product-card__review-count">(${product.reviewCount})</span>
          </div>

          <div class="ui-product-card__price-container">
            <span class="ui-product-card__price">${
      formatPrice(product.price)
    }</span>
            ${
      isOnSale
        ? `
              <span class="ui-product-card__original-price">${
          formatPrice(product.originalPrice!)
        }</span>
            `
        : ""
    }
          </div>

          ${
      (showQuickAdd || showWishlist)
        ? `
            <div class="ui-product-card__actions">
              ${
          showQuickAdd
            ? `
                <button
                  class="ui-product-card__button ui-product-card__button--primary"
                  ${!product.inStock ? "disabled" : ""}
                  ${addToCartHandler}
                >
                  ${product.inStock ? "Add to Cart" : "Out of Stock"}
                </button>
              `
            : ""
        }

              ${
          showWishlist
            ? `
                <button
                  class="ui-product-card__button ui-product-card__button--secondary"
                  ${wishlistHandler}
                >
                  ♡ Wishlist
                </button>
              `
            : ""
        }
            </div>
          `
        : ""
    }
        </div>

        ${
      !product.inStock
        ? `
          <div class="ui-product-card__out-of-stock-overlay">
            Out of Stock
          </div>
        `
        : ""
    }
      </div>
    `.trim();
  },
});

// Export the token type for customization
export type { ProductCardTokens };

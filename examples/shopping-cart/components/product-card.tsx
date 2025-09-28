// deno-lint-ignore-file verbatim-module-syntax

/** @jsx h */
/**
 * ProductCard Component - Library Component Composition
 *
 * Demonstrates composition-only pattern using library components:
 * - Card for container with variants
 * - Stack for layout organization
 * - Badge for sale indicators
 * - Button for actions
 * - No custom CSS - only library component variants
 */

import { h } from "jsx";
import { defineComponent } from "../../../mod.ts";
import type { Product } from "../api/types.ts";

export type ProductCardProps = {
  readonly product: Product;
  readonly size?: "sm" | "md" | "lg";
  readonly variant?: "default" | "elevated" | "outlined";
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
// Product Card Component - Composition-Only
// ============================================================

defineComponent<ProductCardProps>("product-card", {
  render: (props) => {
    const {
      product,
      size = "md",
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


    // Determine card variant - featured products get elevated styling
    const cardVariant = variant === "default" ? (product.featured ? "elevated" : "default") : variant;

    return (
      <card
        variant={cardVariant}
        size={size}
        class={className}
        data-product-id={product.id}
        style={{
          position: "relative",
          ...(product.inStock ? {} : { opacity: "0.6" }),
        }}
      >
        {isOnSale && (
          <badge
            variant="danger"
            style={{
              position: "absolute",
              top: "0.5rem",
              right: "0.5rem",
              zIndex: "1"
            }}
          >
            {salePercentage}% OFF
          </badge>
        )}

        <stack direction="vertical" gap="sm">
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            style={{
              width: "100%",
              aspectRatio: "4/3",
              objectFit: "cover",
              borderRadius: "0.25rem"
            }}
          />

          <stack direction="vertical" gap="xs">
            <h3 style={{
              margin: "0",
              fontSize: "1rem",
              fontWeight: "600",
              lineHeight: "1.25",
              color: "#1F2937",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical"
            }}>
              {product.name}
            </h3>

            {showDescription && (
              <p style={{
                margin: "0",
                fontSize: "0.875rem",
                lineHeight: "1.5",
                color: "#6B7280",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: "3",
                WebkitBoxOrient: "vertical"
              }}>
                {product.description}
              </p>
            )}

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              margin: "0.5rem 0"
            }}>
              <span style={{color: "#FBBF24", fontSize: "0.875rem"}}>
                {renderStars(product.rating)}
              </span>
              <span style={{fontSize: "0.875rem", color: "#6B7280"}}>
                ({product.reviewCount})
              </span>
            </div>

            <div style={{
              display: "flex",
              alignItems: "baseline",
              gap: "0.5rem",
              marginBottom: "0.5rem"
            }}>
              <span style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                color: "#059669"
              }}>
                {formatPrice(product.price)}
              </span>
              {isOnSale && (
                <span style={{
                  fontSize: "1rem",
                  fontWeight: "500",
                  color: "#9CA3AF",
                  textDecoration: "line-through"
                }}>
                  {formatPrice(product.originalPrice!)}
                </span>
              )}
            </div>

            {(showQuickAdd || showWishlist) && (
              <stack direction="vertical" gap="xs">
                {showQuickAdd && (
                  <button
                    variant={!product.inStock ? "disabled" : "primary"}
                    size={size}
                    disabled={!product.inStock}
                    onclick={onAddToCart ? `(${onAddToCart.toString()})('${product.id}')` : undefined}
                  >
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </button>
                )}

                {showWishlist && (
                  <button
                    variant="secondary"
                    size={size}
                    onclick={onAddToWishlist ? `(${onAddToWishlist.toString()})('${product.id}')` : undefined}
                  >
                    ♡ Wishlist
                  </button>
                )}
              </stack>
            )}
          </stack>
        </stack>

        {!product.inStock && (
          <div style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            background: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "600",
            color: "#9CA3AF",
            zIndex: "2"
          }}>
            Out of Stock
          </div>
        )}
      </card>
    );
  },
});

// Export the component string for use in templates
export const ProductCard = "product-card";

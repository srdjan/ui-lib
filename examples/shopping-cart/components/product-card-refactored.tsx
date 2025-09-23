/** @jsx h */
/**
 * Product Card Component - Proper ui-lib Component
 *
 * Following ui-lib principles:
 * - JSX only
 * - CSS-in-TS for styles
 * - Component variants via props
 * - Collocated API handlers
 * - DOM-based state management
 */

import { h } from "../../../lib/jsx-runtime.ts";
import { defineComponent } from "../../../lib/define-component.ts";
import { composeStyles, css } from "../../../lib/css-in-ts.ts";
import { html, json } from "../../../lib/response.ts";
import type { Product } from "../api/types.ts";
import { getRepository } from "../api/repository.ts";

// Component styles using CSS-in-TS
const styles = {
  base: css({
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    transition: "transform 200ms ease, box-shadow 200ms ease",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
    },
  }),

  compact: css({
    "& .product-content": {
      padding: "0.75rem",
    },
    "& .product-title": {
      fontSize: "0.875rem",
    },
    "& .product-description": {
      display: "none",
    },
  }),

  featured: css({
    border: "2px solid #6366f1",
    boxShadow: "0 0 0 4px rgba(99, 102, 241, 0.1)",
  }),

  image: css({
    position: "relative",
    width: "100%",
    paddingBottom: "100%",
    overflow: "hidden",
    background: "#f5f5f5",
  }),

  imageImg: css({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  }),

  badge: css({
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "#ef4444",
    color: "white",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase",
  }),

  content: css({
    padding: "1rem",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  }),

  title: css({
    fontSize: "1rem",
    fontWeight: "600",
    color: "#1f2937",
    margin: "0 0 0.5rem 0",
    lineHeight: 1.3,
  }),

  description: css({
    fontSize: "0.875rem",
    color: "#6b7280",
    margin: "0 0 0.75rem 0",
    lineHeight: 1.4,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  }),

  rating: css({
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    marginBottom: "0.75rem",
    fontSize: "0.875rem",
  }),

  stars: css({
    color: "#fbbf24",
  }),

  reviews: css({
    color: "#6b7280",
    fontSize: "0.75rem",
  }),

  pricing: css({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1rem",
    marginTop: "auto",
  }),

  price: css({
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#059669",
  }),

  originalPrice: css({
    fontSize: "1rem",
    color: "#9ca3af",
    textDecoration: "line-through",
  }),

  actions: css({
    marginTop: "auto",
  }),

  button: css({
    width: "100%",
    padding: "0.75rem",
    background: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 200ms ease",
    "&:hover:not(:disabled)": {
      background: "#4f46e5",
    },
    "&:disabled": {
      background: "#d1d5db",
      color: "#6b7280",
      cursor: "not-allowed",
    },
  }),

  outOfStock: css({
    opacity: 0.6,
    "& .product-image": {
      filter: "grayscale(1)",
    },
  }),
};

// Define the component
defineComponent("product-card", {
  props: (attrs) => ({
    product: JSON.parse(attrs["data-product"] || "{}") as Product,
    variant: (attrs["data-variant"] || "default") as
      | "default"
      | "compact"
      | "featured",
    sessionId: attrs["data-session"] || "default",
    showDescription: attrs["data-show-description"] !== "false",
    showRating: attrs["data-show-rating"] !== "false",
  }),

  styles: styles,

  api: {
    addToCart: ["POST", "/api/cart/add", async (req) => {
      try {
        const body = await req.json();
        const { productId, quantity = 1, sessionId } = body;

        const repository = getRepository();
        const result = await repository.addToCart(sessionId, {
          productId,
          quantity,
        });

        if (!result.ok) {
          return json({ error: result.error.message }, { status: 400 });
        }

        // Return HTML fragment for cart count update
        const acceptsHtml = req.headers.get("accept")?.includes("text/html") ||
          req.headers.get("hx-request") === "true";

        if (acceptsHtml) {
          const cart = result.value;
          return html(`
            <div class="cart-feedback success" role="alert">
              ✓ Added to cart (${cart.itemCount} items)
              <script>
                // Update cart count in header
                const cartBadge = document.querySelector('[data-cart-count]');
                if (cartBadge) {
                  cartBadge.textContent = '${cart.itemCount}';
                  cartBadge.setAttribute('data-cart-count', '${cart.itemCount}');
                  cartBadge.style.display = '${
            cart.itemCount > 0 ? "inline-flex" : "none"
          }';
                }

                // Update all cart total elements
                const cartTotals = document.querySelectorAll('[data-cart-total]');
                cartTotals.forEach(el => {
                  el.textContent = '$${cart.total.toFixed(2)}';
                });

                // Update cart subtotal (in sidebar)
                const cartSubtotals = document.querySelectorAll('[data-cart-subtotal]');
                cartSubtotals.forEach(el => {
                  el.textContent = '$${cart.total.toFixed(2)}';
                });

                // Trigger HTMX event to reload cart sidebar
                htmx.trigger(document.body, 'cart-updated');

                // Also trigger custom event for any additional listeners
                document.body.dispatchEvent(new CustomEvent('cart-updated', {
                  detail: { count: ${cart.itemCount}, total: ${cart.total} }
                }));
              </script>
            </div>
          `);
        }

        return json({ success: true, cart: result.value });
      } catch (err) {
        return json({ error: "Failed to add to cart" }, { status: 500 });
      }
    }],
  },

  render: (props, api, classes) => {
    const { product, variant, sessionId, showDescription, showRating } = props;
    const isOnSale = product.originalPrice &&
      product.originalPrice > product.price;
    const inStock = product.inStock && (product.stockCount || 0) > 0;

    // Compose styles based on variant
    const cardClass = variant === "compact"
      ? composeStyles(styles.base, styles.compact)
      : variant === "featured"
      ? composeStyles(styles.base, styles.featured)
      : styles.base;

    const finalClass = !inStock
      ? composeStyles(cardClass, styles.outOfStock)
      : cardClass;

    // Generate rating stars
    const stars = "★".repeat(Math.floor(product.rating || 4)) +
      "☆".repeat(5 - Math.floor(product.rating || 4));

    return (
      <div
        class={finalClass}
        data-product-id={product.id}
        data-in-stock={inStock ? "true" : "false"}
      >
        <div class={`product-image ${styles.image}`}>
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            class={styles.imageImg}
          />
          {isOnSale && <span class={styles.badge}>Sale</span>}
        </div>

        <div class={`product-content ${styles.content}`}>
          <h3 class={`product-title ${styles.title}`}>
            {product.name}
          </h3>

          {showDescription && (
            <p class={`product-description ${styles.description}`}>
              {product.description}
            </p>
          )}

          {showRating && product.rating && (
            <div class={styles.rating}>
              <span class={styles.stars}>{stars}</span>
              <span class={styles.reviews}>({product.reviewCount})</span>
            </div>
          )}

          <div class={styles.pricing}>
            <span class={styles.price}>
              ${product.price.toFixed(2)}
            </span>
            {isOnSale && product.originalPrice && (
              <span class={styles.originalPrice}>
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div class={styles.actions}>
            <button
              class={styles.button}
              disabled={!inStock}
              {...api.addToCart({
                productId: product.id,
                quantity: 1,
                sessionId,
              })}
              data-product-id={product.id}
              data-cart-action="add"
              hx-trigger="click"
              hx-target="#cart-feedback"
              hx-swap="innerHTML"
              hx-indicator="#cart-indicator"
            >
              {inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>
    );
  },
});

// Export for use in other components
export { styles as productCardStyles };

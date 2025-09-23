/** @jsx h */
/**
 * Cart Item Component
 *
 * Following ui-lib principles:
 * - JSX only
 * - CSS-in-TS for styles
 * - Component variants via props
 * - Collocated API handlers for cart operations
 * - DOM-based state management
 */

import { h } from "../../../lib/jsx-runtime.ts";
import { defineComponent } from "../../../lib/define-component.ts";
import { composeStyles, css } from "../../../lib/css-in-ts.ts";
import { html, json } from "../../../lib/response.ts";
import type { CartItem } from "../api/types.ts";
import { getRepository } from "../api/repository.ts";

// Component styles
const styles = {
  base: css({
    display: "flex",
    gap: "1rem",
    padding: "1rem 0",
    borderBottom: "1px solid #e5e7eb",
    "&:last-child": {
      borderBottom: "none",
    },
  }),

  compact: css({
    padding: "0.5rem 0",
    gap: "0.5rem",
  }),

  image: css({
    width: "60px",
    height: "60px",
    borderRadius: "8px",
    overflow: "hidden",
    flexShrink: 0,
    background: "#f5f5f5",
  }),

  imageImg: css({
    width: "100%",
    height: "100%",
    objectFit: "cover",
  }),

  details: css({
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  }),

  name: css({
    fontWeight: "600",
    color: "#1f2937",
    fontSize: "0.875rem",
    lineHeight: 1.3,
    margin: 0,
  }),

  price: css({
    color: "#059669",
    fontWeight: "600",
    fontSize: "0.875rem",
  }),

  quantity: css({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginTop: "0.25rem",
  }),

  quantityBtn: css({
    width: "24px",
    height: "24px",
    border: "1px solid #d1d5db",
    background: "white",
    borderRadius: "4px",
    fontSize: "0.875rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 200ms ease",
    "&:hover:not(:disabled)": {
      borderColor: "#6366f1",
      background: "#f0f9ff",
    },
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  }),

  quantityValue: css({
    minWidth: "24px",
    textAlign: "center",
    fontWeight: "500",
    fontSize: "0.875rem",
  }),

  removeBtn: css({
    width: "24px",
    height: "24px",
    border: "none",
    background: "#fee2e2",
    color: "#dc2626",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 200ms ease",
    flexShrink: 0,
    alignSelf: "flex-start",
    "&:hover": {
      background: "#fecaca",
    },
  }),

  total: css({
    fontWeight: "600",
    fontSize: "0.875rem",
    color: "#374151",
  }),
};

// Define the component
defineComponent("cart-item", {
  props: (attrs) => ({
    item: JSON.parse(attrs["data-item"] || "{}") as CartItem,
    variant: (attrs["data-variant"] || "default") as "default" | "compact",
    sessionId: attrs["data-session"] || "default",
    showImage: attrs["data-show-image"] !== "false",
  }),

  styles: styles,

  api: {
    updateQuantity: ["PATCH", "/api/cart/items/:id", async (req, params) => {
      try {
        const { quantity } = await req.json();
        const itemId = params.id;
        const sessionId = req.headers.get("x-session-id") || "default";

        const repository = getRepository();
        const result = await repository.updateCartItem(sessionId, itemId, {
          quantity,
        });

        if (!result.ok) {
          return json({ error: result.error.message }, { status: 400 });
        }

        const acceptsHtml = req.headers.get("accept")?.includes("text/html") ||
          req.headers.get("hx-request") === "true";

        if (acceptsHtml) {
          // Return updated cart HTML
          return html(`<div class="cart-update-success">Cart updated</div>`);
        }

        return json({ success: true, cart: result.value });
      } catch (err) {
        return json({ error: "Failed to update quantity" }, { status: 500 });
      }
    }],

    removeItem: ["DELETE", "/api/cart/items/:id", async (req, params) => {
      try {
        const itemId = params.id;
        const sessionId = req.headers.get("x-session-id") || "default";

        const repository = getRepository();
        const result = await repository.removeFromCart(sessionId, itemId);

        if (!result.ok) {
          return json({ error: result.error.message }, { status: 400 });
        }

        const acceptsHtml = req.headers.get("accept")?.includes("text/html") ||
          req.headers.get("hx-request") === "true";

        if (acceptsHtml) {
          // Return empty to remove the item from DOM
          return html("");
        }

        return json({ success: true, cart: result.value });
      } catch (err) {
        return json({ error: "Failed to remove item" }, { status: 500 });
      }
    }],
  },

  render: (props, api, classes) => {
    const { item, variant, sessionId, showImage } = props;
    const itemTotal = item.unitPrice * item.quantity;

    const itemClass = variant === "compact"
      ? composeStyles(styles.base, styles.compact)
      : styles.base;

    return (
      <div
        class={itemClass}
        data-item-id={item.id}
        data-product-id={item.productId}
        data-quantity={item.quantity}
      >
        {showImage && (
          <div class={styles.image}>
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              class={styles.imageImg}
              loading="lazy"
            />
          </div>
        )}

        <div class={styles.details}>
          <h4 class={styles.name}>{item.product.name}</h4>
          <div class={styles.price}>${item.unitPrice.toFixed(2)}</div>

          <div class={styles.quantity}>
            <button
              class={styles.quantityBtn}
              disabled={item.quantity <= 1}
              {...api.updateQuantity({
                id: item.id,
                quantity: Math.max(1, item.quantity - 1),
              })}
              data-action="decrement"
              hx-trigger="click"
              hx-target={`[data-item-id="${item.id}"]`}
              hx-swap="outerHTML"
              hx-headers={`{"x-session-id": "${sessionId}"}`}
            >
              -
            </button>

            <span class={styles.quantityValue}>{item.quantity}</span>

            <button
              class={styles.quantityBtn}
              {...api.updateQuantity({
                id: item.id,
                quantity: item.quantity + 1,
              })}
              data-action="increment"
              hx-trigger="click"
              hx-target={`[data-item-id="${item.id}"]`}
              hx-swap="outerHTML"
              hx-headers={`{"x-session-id": "${sessionId}"}`}
            >
              +
            </button>
          </div>

          <div class={styles.total}>
            Total: ${itemTotal.toFixed(2)}
          </div>
        </div>

        <button
          class={styles.removeBtn}
          title="Remove item"
          {...api.removeItem({ id: item.id })}
          data-action="remove"
          hx-trigger="click"
          hx-target={`[data-item-id="${item.id}"]`}
          hx-swap="outerHTML"
          hx-headers={`{"x-session-id": "${sessionId}"}`}
          hx-confirm="Remove this item from cart?"
        >
          ×
        </button>
      </div>
    );
  },
});

// Export styles for reuse
export { styles as cartItemStyles };

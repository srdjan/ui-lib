/** @jsx h */
/**
 * Cart Sidebar Component
 *
 * Following ui-lib principles:
 * - JSX only
 * - CSS-in-TS for styles
 * - DOM-based state management (open/closed state via classes)
 * - Collocated API handlers
 */

import { h } from "../../../lib/jsx-runtime.ts";
import { defineComponent } from "../../../lib/define-component.ts";
import { composeStyles, css } from "../../../lib/css-in-ts.ts";
import { html } from "../../../lib/response.ts";
import type { Cart } from "../api/types.ts";
import { getRepository } from "../api/repository.ts";

// Component styles
const styles = {
  overlay: css({
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
    opacity: 0,
    visibility: "hidden",
    transition: "opacity 300ms ease, visibility 300ms ease",
    "&.visible": {
      opacity: 1,
      visibility: "visible",
    },
  }),

  sidebar: css({
    position: "fixed",
    top: 0,
    right: 0,
    width: "400px",
    height: "100vh",
    background: "white",
    boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.15)",
    transform: "translateX(100%)",
    transition: "transform 300ms ease-out",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    "&.open": {
      transform: "translateX(0)",
    },
    "@media (max-width: 480px)": {
      width: "100vw",
    },
  }),

  header: css({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1.5rem",
    borderBottom: "1px solid #e5e7eb",
    background: "#f9fafb",
  }),

  title: css({
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#1f2937",
    margin: 0,
  }),

  closeBtn: css({
    width: "32px",
    height: "32px",
    border: "none",
    background: "#e5e7eb",
    borderRadius: "50%",
    fontSize: "1.25rem",
    color: "#6b7280",
    cursor: "pointer",
    transition: "all 200ms ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      background: "#d1d5db",
      color: "#374151",
    },
  }),

  content: css({
    flex: 1,
    overflowY: "auto",
    padding: "1rem",
  }),

  footer: css({
    borderTop: "1px solid #e5e7eb",
    padding: "1.5rem",
    background: "#f9fafb",
  }),

  summary: css({
    marginBottom: "1rem",
  }),

  summaryRow: css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
    fontSize: "0.875rem",
    color: "#6b7280",
  }),

  summaryTotal: css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#1f2937",
    paddingTop: "0.75rem",
    borderTop: "1px solid #e5e7eb",
    marginTop: "0.75rem",
  }),

  totalAmount: css({
    color: "#059669",
  }),

  actions: css({
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  }),

  button: css({
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    fontWeight: "600",
    textAlign: "center",
    textDecoration: "none",
    cursor: "pointer",
    transition: "all 200ms ease",
    border: "none",
    fontSize: "1rem",
  }),

  primaryButton: css({
    background: "#6366f1",
    color: "white",
    "&:hover": {
      background: "#5b21b6",
    },
  }),

  secondaryButton: css({
    background: "white",
    color: "#374151",
    border: "1px solid #d1d5db",
    "&:hover": {
      background: "#f3f4f6",
    },
  }),

  empty: css({
    textAlign: "center",
    padding: "2rem",
    color: "#6b7280",
  }),

  emptyIcon: css({
    fontSize: "3rem",
    marginBottom: "1rem",
    opacity: 0.5,
  }),

  loading: css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    color: "#6b7280",
  }),

  spinner: css({
    width: "32px",
    height: "32px",
    border: "3px solid #e5e7eb",
    borderTop: "3px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "1rem",
    "@keyframes spin": {
      to: { transform: "rotate(360deg)" },
    },
  }),
};

// Define the component
defineComponent("cart-sidebar", {
  props: (attrs) => ({
    sessionId: attrs["data-session"] || "default",
    isOpen: attrs["data-open"] === "true",
  }),

  styles: styles,

  api: {
    loadCart: ["GET", "/api/cart", async (req) => {
      try {
        const url = new URL(req.url);
        const sessionId = url.searchParams.get("session") || "default";
        const repository = getRepository();
        const result = await repository.getCart(sessionId);

        if (!result.ok) {
          return html(`
            <div class="${styles.empty}">
              <div class="${styles.emptyIcon}">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Add some products to get started!</p>
            </div>
          `);
        }

        const cart = result.value;

        if (cart.items.length === 0) {
          return html(`
            <div class="${styles.empty}">
              <div class="${styles.emptyIcon}">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Add some products to get started!</p>
            </div>
          `);
        }

        // Render cart items using the cart-item component
        const itemsHtml = cart.items.map((item) => `
          <cart-item
            data-item='${JSON.stringify(item)}'
            data-variant="default"
            data-session="${sessionId}"
            data-show-image="true"
          ></cart-item>
        `).join("");

        return html(`
          <div data-cart-count="${cart.itemCount}" data-cart-total="${cart.total}">
            ${itemsHtml}
          </div>
        `);
      } catch (err) {
        return html(`<div class="${styles.empty}">Error loading cart</div>`);
      }
    }],

    checkout: ["POST", "/api/checkout/init", async (req) => {
      try {
        const { sessionId } = await req.json();
        const repository = getRepository();
        const cartResult = await repository.getCart(sessionId);

        if (!cartResult.ok || cartResult.value.items.length === 0) {
          return html(`<div class="${styles.empty}">Cart is empty</div>`);
        }

        // Initialize checkout and redirect
        return html(`
          <script>window.location.href = "/checkout";</script>
        `);
      } catch (err) {
        return html(
          `<div class="${styles.empty}">Error starting checkout</div>`,
        );
      }
    }],
  },

  render: (props, api, classes) => {
    const { sessionId, isOpen } = props;

    return (
      <>
        {/* Overlay */}
        <div
          class={`cart-overlay ${styles.overlay}`}
          data-cart-overlay
          onclick="document.querySelector('[data-cart-sidebar]').classList.remove('open'); this.classList.remove('visible');"
        />

        {/* Sidebar */}
        <div
          class={`cart-sidebar ${styles.sidebar}`}
          data-cart-sidebar
          data-open={isOpen}
          role="dialog"
          aria-labelledby="cart-title"
          aria-hidden={!isOpen}
        >
          {/* Header */}
          <div class={styles.header}>
            <h2 id="cart-title" class={styles.title}>Shopping Cart</h2>
            <button
              class={styles.closeBtn}
              aria-label="Close cart"
              onclick="document.querySelector('[data-cart-sidebar]').classList.remove('open'); document.querySelector('[data-cart-overlay]').classList.remove('visible');"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div class={styles.content}>
            <div
              class="cart-items"
              {...api.loadCart()}
              hx-trigger="load, cart-updated from:body"
              hx-get={`/api/cart?session=${sessionId}`}
              hx-swap="innerHTML"
            >
              {/* Loading state */}
              <div class={styles.loading}>
                <div class={styles.spinner} />
                <p>Loading cart...</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div class={styles.footer}>
            {/* Summary */}
            <div class={styles.summary}>
              <div class={styles.summaryRow}>
                <span>Subtotal:</span>
                <span data-cart-subtotal>$0.00</span>
              </div>
              <div class={styles.summaryRow}>
                <span>Tax:</span>
                <span data-cart-tax>$0.00</span>
              </div>
              <div class={styles.summaryRow}>
                <span>Shipping:</span>
                <span data-cart-shipping>FREE</span>
              </div>
              <div class={styles.summaryTotal}>
                <span>Total:</span>
                <span class={styles.totalAmount} data-cart-total>$0.00</span>
              </div>
            </div>

            {/* Actions */}
            <div class={styles.actions}>
              <button
                class={composeStyles(styles.button, styles.secondaryButton)}
                onclick="document.querySelector('[data-cart-sidebar]').classList.remove('open'); document.querySelector('[data-cart-overlay]').classList.remove('visible');"
              >
                Continue Shopping
              </button>
              <button
                class={composeStyles(styles.button, styles.primaryButton)}
                {...api.checkout({ sessionId })}
                hx-trigger="click"
                hx-post="/api/checkout/init"
                hx-vals={`{"sessionId": "${sessionId}"}`}
                data-cart-checkout
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </>
    );
  },
});

// Export helper function to toggle cart
export function toggleCart() {
  const sidebar = document.querySelector("[data-cart-sidebar]");
  const overlay = document.querySelector("[data-cart-overlay]");

  if (sidebar?.classList.contains("open")) {
    sidebar.classList.remove("open");
    overlay?.classList.remove("visible");
    document.body.style.overflow = "";
  } else {
    sidebar?.classList.add("open");
    overlay?.classList.add("visible");
    document.body.style.overflow = "hidden";
  }
}

// Export styles
export { styles as cartSidebarStyles };

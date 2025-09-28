// deno-lint-ignore-file verbatim-module-syntax

/** @jsx h */
/**
 * CartSidebar Component - Library Component Composition
 *
 * Features:
 * - Sliding drawer using library components
 * - DOM-native state integration
 * - HTMX for cart operations
 * - Accessibility support
 * - Library component variants for theming
 * - Progressive enhancement
 */

import { h, Fragment } from "jsx";
import { defineComponent } from "../../../mod.ts";
import type { Cart, CartItem } from "../api/types.ts";

// ============================================================
// Component Props Interface
// ============================================================

export type CartSidebarProps = {
  readonly cart?: Cart;
  readonly isOpen?: boolean;
  readonly loading?: boolean;
  readonly onClose?: () => void;
  readonly onCheckout?: () => void;
  readonly onContinueShopping?: () => void;
  readonly className?: string;
};

// ============================================================
// CartItem Sub-component
// ============================================================

function renderCartItem(item: CartItem): string {
  const total = item.unitPrice * item.quantity;

  return `
    <card variant="outlined" size="sm" data-item-id="${item.id}" data-product-id="${item.productId}">
      <stack direction="horizontal" gap="md">
        <img
          src="${item.product.imageUrl}"
          alt="${item.product.name}"
          loading="lazy"
          style="width: 60px; height: 60px; object-fit: cover; border-radius: 0.375rem; flex-shrink: 0;"
        />

        <stack direction="vertical" gap="xs" style="flex: 1; min-width: 0;">
          <h4 style="margin: 0; font-size: 0.875rem; font-weight: 600; color: #1F2937; line-height: 1.25;">
            ${item.product.name}
          </h4>
          <p style="margin: 0; font-size: 0.75rem; color: #6B7280;">
            $${item.unitPrice.toFixed(2)} each
          </p>

          <stack direction="horizontal" gap="xs" style="align-items: center;">
            <button
              variant="secondary"
              size="sm"
              hx-patch="/api/cart/items/${item.id}"
              hx-vals='{"quantity": ${item.quantity - 1}}'
              hx-target="#cart-sidebar"
              hx-swap="innerHTML"
              ${item.quantity <= 1 ? "disabled" : ""}
              title="Decrease quantity"
              style="width: 24px; height: 24px; padding: 0; font-size: 14px;"
            >
              −
            </button>

            <span style="font-size: 0.875rem; font-weight: 600; color: #1F2937; min-width: 20px; text-align: center;">
              ${item.quantity}
            </span>

            <button
              variant="secondary"
              size="sm"
              hx-patch="/api/cart/items/${item.id}"
              hx-vals='{"quantity": ${item.quantity + 1}}'
              hx-target="#cart-sidebar"
              hx-swap="innerHTML"
              title="Increase quantity"
              style="width: 24px; height: 24px; padding: 0; font-size: 14px;"
            >
              +
            </button>
          </stack>
        </stack>

        <stack direction="vertical" gap="xs" style="align-items: flex-end;">
          <div style="font-size: 0.875rem; font-weight: 600; color: #1F2937;">
            $${total.toFixed(2)}
          </div>

          <button
            variant="danger"
            size="sm"
            hx-delete="/api/cart/items/${item.id}"
            hx-target="#cart-sidebar"
            hx-swap="innerHTML"
            hx-confirm="Remove this item from your cart?"
            title="Remove item"
            style="width: 24px; height: 24px; padding: 0; font-size: 16px;"
          >
            ×
          </button>
        </stack>
      </stack>
    </card>
  `;
}

// ============================================================
// CartSidebar Component - Composition-Only
// ============================================================

defineComponent<CartSidebarProps>("cart-sidebar", {
  render: (props) => {
    const {
      cart,
      isOpen = false,
      loading = false,
      onClose,
      onCheckout,
      onContinueShopping,
      className = "",
    } = props;

    const hasItems = cart && cart.items.length > 0;
    const itemCount = cart?.itemCount || 0;

    return (
      <>
        {/* Cart Overlay */}
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
            zIndex: "1000",
            opacity: isOpen ? "1" : "0",
            visibility: isOpen ? "visible" : "hidden",
            transition: "opacity 300ms ease, visibility 300ms ease"
          }}
          onclick={onClose ? `(${onClose.toString()})()` : "cartState.closeCart()"}
        />

        {/* Cart Sidebar */}
        <section
          class={className}
          id="cart-sidebar"
          role="dialog"
          aria-labelledby="cart-title"
          aria-modal="true"
          style={{
            position: "fixed",
            top: "0",
            right: "0",
            bottom: "0",
            width: "400px",
            background: "white",
            boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.15)",
            zIndex: "1001",
            transform: `translateX(${isOpen ? "0" : "100%"})`,
            transition: "transform 300ms ease-out",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}
        >
          {/* Header */}
          <header
            variant="elevated"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1.5rem",
              borderBottom: "1px solid #E5E7EB",
              background: "#F9FAFB"
            }}
          >
            <h2
              id="cart-title"
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#1F2937",
                margin: "0"
              }}
            >
              Shopping Cart{itemCount > 0 ? ` (${itemCount})` : ""}
            </h2>
            <button
              variant="secondary"
              size="sm"
              onclick={onClose ? `(${onClose.toString()})()` : "cartState.closeCart()"}
              aria-label="Close cart"
              style={{
                background: "transparent",
                border: "none",
                borderRadius: "0.375rem",
                padding: "0.5rem",
                cursor: "pointer",
                fontSize: "1.5rem",
                color: "#6B7280",
                transition: "all 150ms ease"
              }}
            >
              ×
            </button>
          </header>

          {/* Content */}
          <div style={{
            flex: "1",
            overflowY: "auto",
            padding: "1rem",
            minHeight: "200px"
          }}>
            {loading ? (
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
                color: "#6B7280"
              }}>
                <span>Loading cart...</span>
              </div>
            ) : !hasItems ? (
              <card
                variant="outlined"
                style={{
                  textAlign: "center",
                  padding: "3rem 1rem",
                  color: "#6B7280",
                  background: "#F9FAFB",
                  border: "2px dashed #D1D5DB"
                }}
              >
                <stack direction="vertical" gap="md">
                  <h3 style={{margin: "0", fontSize: "1.125rem"}}>
                    Your cart is empty
                  </h3>
                  <p style={{margin: "0"}}>
                    Add some products to get started!
                  </p>
                  <button
                    variant="primary"
                    onclick={onContinueShopping ? `(${onContinueShopping.toString()})()` : "cartState.closeCart()"}
                  >
                    Continue Shopping
                  </button>
                </stack>
              </card>
            ) : (
              <stack direction="vertical" gap="md">
                {cart!.items.map((item) => (
                  <div key={item.id} dangerouslySetInnerHTML={{__html: renderCartItem(item)}} />
                ))}
              </stack>
            )}
          </div>

          {/* Footer with totals and checkout */}
          {hasItems && (
            <section style={{
              padding: "1.5rem",
              borderTop: "1px solid #E5E7EB",
              background: "#F9FAFB",
              marginTop: "auto"
            }}>
              <stack direction="vertical" gap="md">
                {/* Totals */}
                <stack direction="vertical" gap="xs">
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.875rem",
                    color: "#6B7280"
                  }}>
                    <span>Subtotal:</span>
                    <span>${cart!.subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.875rem",
                    color: "#6B7280"
                  }}>
                    <span>Tax:</span>
                    <span>${cart!.tax.toFixed(2)}</span>
                  </div>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.875rem",
                    color: "#6B7280"
                  }}>
                    <span>Shipping:</span>
                    <span>{cart!.shipping > 0 ? `$${cart!.shipping.toFixed(2)}` : "FREE"}</span>
                  </div>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    color: "#1F2937",
                    borderTop: "1px solid #D1D5DB",
                    paddingTop: "0.75rem",
                    marginTop: "0.5rem"
                  }}>
                    <span>Total:</span>
                    <span>${cart!.total.toFixed(2)}</span>
                  </div>
                </stack>

                {/* Actions */}
                <stack direction="vertical" gap="sm">
                  <button
                    variant="primary"
                    size="lg"
                    href="/checkout"
                    onclick={onCheckout ? `(${onCheckout.toString()})()` : undefined}
                    hx-get={!onCheckout ? "/checkout" : undefined}
                    hx-target={!onCheckout ? "#main-content" : undefined}
                    style={{
                      width: "100%",
                      textAlign: "center",
                      textDecoration: "none",
                      display: "block"
                    }}
                  >
                    Proceed to Checkout
                  </button>

                  <button
                    variant="secondary"
                    onclick={onContinueShopping ? `(${onContinueShopping.toString()})()` : "cartState.closeCart()"}
                    style={{
                      textAlign: "center",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      color: "#6B7280",
                      textDecoration: "underline"
                    }}
                  >
                    Continue Shopping
                  </button>
                </stack>
              </stack>
            </section>
          )}
        </section>
      </>
    );
  },
});

// Export the component string for use in templates
export const CartSidebar = "cart-sidebar";

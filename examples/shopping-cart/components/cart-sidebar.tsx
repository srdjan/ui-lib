/** @jsx h */
/**
 * CartSidebar Component - Token-Based Sliding Cart
 *
 * Features:
 * - Sliding drawer from right side
 * - DOM-native state integration
 * - HTMX for cart operations
 * - Accessibility support
 * - Token customization for theming
 * - Progressive enhancement
 */

import { h } from "jsx";
import { createTokenComponent } from "../../../lib/tokens/component-factory.ts";
import type { ComponentTokens } from "../../../lib/tokens/component-tokens.ts";
import type { Cart, CartItem } from "../api/types.ts";

// ============================================================
// Token Contract Definition
// ============================================================

export type CartSidebarTokens = ComponentTokens<{
  // Overlay backdrop
  overlay: {
    background: string;
    backdropFilter: string;
    zIndex: string;
    transitionDuration: string;
  };

  // Sidebar container
  sidebar: {
    width: string;
    background: string;
    boxShadow: string;
    zIndex: string;
    padding: string;
    borderRadius: string;
    transitionDuration: string;
    transitionTiming: string;
  };

  // Header area
  header: {
    padding: string;
    borderBottom: string;
    marginBottom: string;
    background: string;
  };

  // Header title
  title: {
    fontSize: string;
    fontWeight: string;
    color: string;
    margin: string;
  };

  // Close button
  closeButton: {
    background: string;
    border: string;
    borderRadius: string;
    padding: string;
    cursor: string;
    fontSize: string;
    color: string;
    transitionDuration: string;
  };

  closeButtonHover: {
    background: string;
    color: string;
  };

  // Content area
  content: {
    flex: string;
    overflowY: string;
    padding: string;
    minHeight: string;
  };

  // Empty state
  empty: {
    textAlign: string;
    padding: string;
    color: string;
    background: string;
    borderRadius: string;
    border: string;
  };

  // Cart items container
  items: {
    display: string;
    flexDirection: string;
    gap: string;
    marginBottom: string;
  };

  // Footer with totals and checkout
  footer: {
    padding: string;
    borderTop: string;
    background: string;
    marginTop: string;
  };

  // Totals section
  totals: {
    display: string;
    flexDirection: string;
    gap: string;
    marginBottom: string;
  };

  // Total line
  totalLine: {
    display: string;
    justifyContent: string;
    alignItems: string;
    fontSize: string;
    color: string;
  };

  // Final total
  finalTotal: {
    fontSize: string;
    fontWeight: string;
    color: string;
    borderTop: string;
    paddingTop: string;
  };

  // Checkout button
  checkoutButton: {
    width: string;
    padding: string;
    background: string;
    backgroundHover: string;
    color: string;
    border: string;
    borderRadius: string;
    fontSize: string;
    fontWeight: string;
    cursor: string;
    transitionDuration: string;
  };

  // Continue shopping link
  continueLink: {
    display: string;
    justifyContent: string;
    marginTop: string;
    fontSize: string;
    color: string;
    textDecoration: string;
    cursor: string;
  };

  continueLinkHover: {
    color: string;
    textDecoration: string;
  };
}>;

// ============================================================
// Default Token Values
// ============================================================

const defaultCartSidebarTokens: CartSidebarTokens = {
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(4px)",
    zIndex: "1000",
    transitionDuration: "300ms",
  },

  sidebar: {
    width: "400px",
    background: "#FFFFFF",
    boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.15)",
    zIndex: "1001",
    padding: "0",
    borderRadius: "0",
    transitionDuration: "300ms",
    transitionTiming: "ease-out",
  },

  header: {
    padding: "1.5rem",
    borderBottom: "1px solid #E5E7EB",
    marginBottom: "0",
    background: "#F9FAFB",
  },

  title: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#1F2937",
    margin: "0",
  },

  closeButton: {
    background: "transparent",
    border: "none",
    borderRadius: "0.375rem",
    padding: "0.5rem",
    cursor: "pointer",
    fontSize: "1.5rem",
    color: "#6B7280",
    transitionDuration: "150ms",
  },

  closeButtonHover: {
    background: "#F3F4F6",
    color: "#1F2937",
  },

  content: {
    flex: "1",
    overflowY: "auto",
    padding: "1rem",
    minHeight: "200px",
  },

  empty: {
    textAlign: "center",
    padding: "3rem 1rem",
    color: "#6B7280",
    background: "#F9FAFB",
    borderRadius: "0.5rem",
    border: "2px dashed #D1D5DB",
  },

  items: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "1.5rem",
  },

  footer: {
    padding: "1.5rem",
    borderTop: "1px solid #E5E7EB",
    background: "#F9FAFB",
    marginTop: "auto",
  },

  totals: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginBottom: "1.5rem",
  },

  totalLine: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.875rem",
    color: "#6B7280",
  },

  finalTotal: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#1F2937",
    borderTop: "1px solid #D1D5DB",
    paddingTop: "0.75rem",
  },

  checkoutButton: {
    width: "100%",
    padding: "0.75rem 1rem",
    background: "#3B82F6",
    backgroundHover: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transitionDuration: "150ms",
  },

  continueLink: {
    display: "flex",
    justifyContent: "center",
    marginTop: "1rem",
    fontSize: "0.875rem",
    color: "#6B7280",
    textDecoration: "underline",
    cursor: "pointer",
  },

  continueLinkHover: {
    color: "#3B82F6",
    textDecoration: "underline",
  },
};

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
    <div class="cart-item" data-item-id="${item.id}" data-product-id="${item.productId}">
      <div class="cart-item__image">
        <img
          src="${item.product.imageUrl}"
          alt="${item.product.name}"
          loading="lazy"
        />
      </div>

      <div class="cart-item__details">
        <h4 class="cart-item__name">${item.product.name}</h4>
        <p class="cart-item__price">$${item.unitPrice.toFixed(2)} each</p>

        <div class="cart-item__quantity">
          <button
            class="quantity-btn quantity-btn--decrease"
            hx-patch="/api/cart/items/${item.id}"
            hx-vals='{"quantity": ${item.quantity - 1}}'
            hx-target="#cart-sidebar"
            hx-swap="innerHTML"
            ${item.quantity <= 1 ? 'disabled' : ''}
            title="Decrease quantity"
          >
            <span aria-hidden="true">−</span>
          </button>

          <span class="quantity-value" data-quantity="${item.quantity}">
            ${item.quantity}
          </span>

          <button
            class="quantity-btn quantity-btn--increase"
            hx-patch="/api/cart/items/${item.id}"
            hx-vals='{"quantity": ${item.quantity + 1}}'
            hx-target="#cart-sidebar"
            hx-swap="innerHTML"
            title="Increase quantity"
          >
            <span aria-hidden="true">+</span>
          </button>
        </div>
      </div>

      <div class="cart-item__actions">
        <div class="cart-item__total">
          $${total.toFixed(2)}
        </div>

        <button
          class="cart-item__remove"
          hx-delete="/api/cart/items/${item.id}"
          hx-target="#cart-sidebar"
          hx-swap="innerHTML"
          hx-confirm="Remove this item from your cart?"
          title="Remove item"
        >
          <span aria-hidden="true">×</span>
          <span class="sr-only">Remove ${item.product.name}</span>
        </button>
      </div>
    </div>
  `;
}

// ============================================================
// Sealed CartSidebar Component
// ============================================================

export const CartSidebar = createTokenComponent<CartSidebarTokens, CartSidebarProps>({
  name: "cart-sidebar",
  tokens: defaultCartSidebarTokens,

  styles: (cssVars) => `
    /* Overlay */
    .ui-cart-sidebar__overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: ${cssVars.overlay.background};
      backdrop-filter: ${cssVars.overlay.backdropFilter};
      z-index: ${cssVars.overlay.zIndex};
      opacity: 0;
      visibility: hidden;
      transition: opacity ${cssVars.overlay.transitionDuration} ease,
                  visibility ${cssVars.overlay.transitionDuration} ease;
    }

    .ui-cart-sidebar__overlay--visible {
      opacity: 1;
      visibility: visible;
    }

    /* Sidebar */
    .ui-cart-sidebar {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: ${cssVars.sidebar.width};
      background: ${cssVars.sidebar.background};
      box-shadow: ${cssVars.sidebar.boxShadow};
      z-index: ${cssVars.sidebar.zIndex};
      padding: ${cssVars.sidebar.padding};
      transform: translateX(100%);
      transition: transform ${cssVars.sidebar.transitionDuration} ${cssVars.sidebar.transitionTiming};
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .ui-cart-sidebar--open {
      transform: translateX(0);
    }

    /* Header */
    .ui-cart-sidebar__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: ${cssVars.header.padding};
      border-bottom: ${cssVars.header.borderBottom};
      margin-bottom: ${cssVars.header.marginBottom};
      background: ${cssVars.header.background};
    }

    .ui-cart-sidebar__title {
      font-size: ${cssVars.title.fontSize};
      font-weight: ${cssVars.title.fontWeight};
      color: ${cssVars.title.color};
      margin: ${cssVars.title.margin};
    }

    .ui-cart-sidebar__close {
      background: ${cssVars.closeButton.background};
      border: ${cssVars.closeButton.border};
      border-radius: ${cssVars.closeButton.borderRadius};
      padding: ${cssVars.closeButton.padding};
      cursor: ${cssVars.closeButton.cursor};
      font-size: ${cssVars.closeButton.fontSize};
      color: ${cssVars.closeButton.color};
      transition: all ${cssVars.closeButton.transitionDuration} ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ui-cart-sidebar__close:hover {
      background: ${cssVars.closeButtonHover.background};
      color: ${cssVars.closeButtonHover.color};
    }

    /* Content */
    .ui-cart-sidebar__content {
      flex: ${cssVars.content.flex};
      overflow-y: ${cssVars.content.overflowY};
      padding: ${cssVars.content.padding};
      min-height: ${cssVars.content.minHeight};
    }

    /* Empty state */
    .ui-cart-sidebar__empty {
      text-align: ${cssVars.empty.textAlign};
      padding: ${cssVars.empty.padding};
      color: ${cssVars.empty.color};
      background: ${cssVars.empty.background};
      border-radius: ${cssVars.empty.borderRadius};
      border: ${cssVars.empty.border};
    }

    .ui-cart-sidebar__empty h3 {
      margin: 0 0 1rem 0;
      font-size: 1.125rem;
    }

    .ui-cart-sidebar__empty p {
      margin: 0 0 1.5rem 0;
    }

    /* Cart items */
    .ui-cart-sidebar__items {
      display: ${cssVars.items.display};
      flex-direction: ${cssVars.items.flexDirection};
      gap: ${cssVars.items.gap};
      margin-bottom: ${cssVars.items.marginBottom};
    }

    /* Individual cart item */
    .cart-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 0.5rem;
      border: 1px solid #E5E7EB;
      transition: all 150ms ease;
    }

    .cart-item:hover {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .cart-item__image {
      width: 60px;
      height: 60px;
      flex-shrink: 0;
    }

    .cart-item__image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 0.375rem;
    }

    .cart-item__details {
      flex: 1;
      min-width: 0;
    }

    .cart-item__name {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1F2937;
      margin: 0 0 0.25rem 0;
      line-height: 1.25;
    }

    .cart-item__price {
      font-size: 0.75rem;
      color: #6B7280;
      margin: 0 0 0.75rem 0;
    }

    .cart-item__quantity {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .quantity-btn {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #F3F4F6;
      border: 1px solid #D1D5DB;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      transition: all 150ms ease;
    }

    .quantity-btn:hover:not(:disabled) {
      background: #E5E7EB;
      border-color: #9CA3AF;
    }

    .quantity-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .quantity-value {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1F2937;
      min-width: 20px;
      text-align: center;
    }

    .cart-item__actions {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
    }

    .cart-item__total {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1F2937;
    }

    .cart-item__remove {
      background: #FEF2F2;
      border: 1px solid #FECACA;
      border-radius: 0.25rem;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #DC2626;
      font-size: 16px;
      font-weight: 600;
      transition: all 150ms ease;
    }

    .cart-item__remove:hover {
      background: #FEE2E2;
      border-color: #FCA5A5;
    }

    /* Footer */
    .ui-cart-sidebar__footer {
      padding: ${cssVars.footer.padding};
      border-top: ${cssVars.footer.borderTop};
      background: ${cssVars.footer.background};
      margin-top: ${cssVars.footer.marginTop};
    }

    .ui-cart-sidebar__totals {
      display: ${cssVars.totals.display};
      flex-direction: ${cssVars.totals.flexDirection};
      gap: ${cssVars.totals.gap};
      margin-bottom: ${cssVars.totals.marginBottom};
    }

    .ui-cart-sidebar__total-line {
      display: ${cssVars.totalLine.display};
      justify-content: ${cssVars.totalLine.justifyContent};
      align-items: ${cssVars.totalLine.alignItems};
      font-size: ${cssVars.totalLine.fontSize};
      color: ${cssVars.totalLine.color};
    }

    .ui-cart-sidebar__final-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: ${cssVars.finalTotal.fontSize};
      font-weight: ${cssVars.finalTotal.fontWeight};
      color: ${cssVars.finalTotal.color};
      border-top: ${cssVars.finalTotal.borderTop};
      padding-top: ${cssVars.finalTotal.paddingTop};
      margin-top: 0.5rem;
    }

    .ui-cart-sidebar__checkout {
      width: ${cssVars.checkoutButton.width};
      padding: ${cssVars.checkoutButton.padding};
      background: ${cssVars.checkoutButton.background};
      color: ${cssVars.checkoutButton.color};
      border: ${cssVars.checkoutButton.border};
      border-radius: ${cssVars.checkoutButton.borderRadius};
      font-size: ${cssVars.checkoutButton.fontSize};
      font-weight: ${cssVars.checkoutButton.fontWeight};
      cursor: ${cssVars.checkoutButton.cursor};
      transition: all ${cssVars.checkoutButton.transitionDuration} ease;
      text-decoration: none;
      text-align: center;
      display: block;
    }

    .ui-cart-sidebar__checkout:hover {
      background: ${cssVars.checkoutButton.backgroundHover};
    }

    .ui-cart-sidebar__continue {
      display: ${cssVars.continueLink.display};
      justify-content: ${cssVars.continueLink.justifyContent};
      margin-top: ${cssVars.continueLink.marginTop};
      font-size: ${cssVars.continueLink.fontSize};
      color: ${cssVars.continueLink.color};
      text-decoration: ${cssVars.continueLink.textDecoration};
      cursor: ${cssVars.continueLink.cursor};
      background: none;
      border: none;
    }

    .ui-cart-sidebar__continue:hover {
      color: ${cssVars.continueLinkHover.color};
      text-decoration: ${cssVars.continueLinkHover.textDecoration};
    }

    /* Loading state */
    .ui-cart-sidebar__loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      color: #6B7280;
    }

    /* Screen reader only */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    /* Mobile responsive */
    @media (max-width: 640px) {
      .ui-cart-sidebar {
        width: 100vw;
        left: 0;
        right: 0;
      }
    }
  `,

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

    const classes = [
      "ui-cart-sidebar",
      isOpen && "ui-cart-sidebar--open",
      className,
    ].filter(Boolean).join(" ");

    const overlayClasses = [
      "ui-cart-sidebar__overlay",
      isOpen && "ui-cart-sidebar__overlay--visible",
    ].filter(Boolean).join(" ");

    const closeHandler = onClose
      ? `onclick="(${onClose.toString()})()"`
      : 'onclick="cartState.closeCart()"';

    const checkoutHandler = onCheckout
      ? `onclick="(${onCheckout.toString()})()"`
      : 'hx-get="/checkout" hx-target="#main-content"';

    const continueHandler = onContinueShopping
      ? `onclick="(${onContinueShopping.toString()})()"`
      : 'onclick="cartState.closeCart()"';

    return `
      <!-- Cart Overlay -->
      <div class="${overlayClasses}" ${closeHandler}></div>

      <!-- Cart Sidebar -->
      <aside
        class="${classes}"
        id="cart-sidebar"
        role="dialog"
        aria-labelledby="cart-title"
        aria-modal="true"
      >
        <!-- Header -->
        <header class="ui-cart-sidebar__header">
          <h2 class="ui-cart-sidebar__title" id="cart-title">
            Shopping Cart${itemCount > 0 ? ` (${itemCount})` : ""}
          </h2>
          <button
            class="ui-cart-sidebar__close"
            ${closeHandler}
            aria-label="Close cart"
          >
            ×
          </button>
        </header>

        <!-- Content -->
        <div class="ui-cart-sidebar__content">
          ${loading ? `
            <div class="ui-cart-sidebar__loading">
              <span>Loading cart...</span>
            </div>
          ` : !hasItems ? `
            <div class="ui-cart-sidebar__empty">
              <h3>Your cart is empty</h3>
              <p>Add some products to get started!</p>
              <button class="ui-cart-sidebar__continue" ${continueHandler}>
                Continue Shopping
              </button>
            </div>
          ` : `
            <div class="ui-cart-sidebar__items">
              ${cart!.items.map(item => renderCartItem(item)).join("")}
            </div>
          `}
        </div>

        <!-- Footer with totals and checkout -->
        ${hasItems ? `
          <footer class="ui-cart-sidebar__footer">
            <div class="ui-cart-sidebar__totals">
              <div class="ui-cart-sidebar__total-line">
                <span>Subtotal:</span>
                <span>$${cart!.subtotal.toFixed(2)}</span>
              </div>
              <div class="ui-cart-sidebar__total-line">
                <span>Tax:</span>
                <span>$${cart!.tax.toFixed(2)}</span>
              </div>
              <div class="ui-cart-sidebar__total-line">
                <span>Shipping:</span>
                <span>${cart!.shipping > 0 ? `$${cart!.shipping.toFixed(2)}` : "FREE"}</span>
              </div>
              <div class="ui-cart-sidebar__final-total">
                <span>Total:</span>
                <span>$${cart!.total.toFixed(2)}</span>
              </div>
            </div>

            <a
              href="/checkout"
              class="ui-cart-sidebar__checkout"
              ${checkoutHandler}
            >
              Proceed to Checkout
            </a>

            <button class="ui-cart-sidebar__continue" ${continueHandler}>
              Continue Shopping
            </button>
          </footer>
        ` : ""}
      </aside>
    `.trim();
  },
});

// Export the token type for customization
export type { CartSidebarTokens };
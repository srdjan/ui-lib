/**
 * Cart Sidebar Component - Simplified Version
 *
 * Demonstrates:
 * - Sliding sidebar interface
 * - HTMX for cart operations
 * - Accessibility features
 * - Mobile-responsive design
 */

export interface CartSidebarProps {
  sessionId: string;
}

export function CartSidebar({ sessionId }: CartSidebarProps): string {
  return `
    <div class="cart-sidebar" id="cart-sidebar" role="dialog" aria-labelledby="cart-title" aria-hidden="true">
      <!-- Cart Header -->
      <div class="cart-sidebar__header">
        <h2 id="cart-title" class="cart-sidebar__title">Shopping Cart</h2>
        <button
          class="cart-sidebar__close"
          onclick="closeCart()"
          aria-label="Close cart"
        >
          ×
        </button>
      </div>

      <!-- Cart Content -->
      <div class="cart-sidebar__content">
        <div
          class="cart-items"
          hx-get="/api/cart?session=${sessionId}"
          hx-trigger="load, cart-updated from:body"
          hx-swap="innerHTML"
        >
          <!-- Cart items will be loaded here -->
          <div class="cart-loading">
            <div class="loading-spinner"></div>
            <p>Loading cart...</p>
          </div>
        </div>
      </div>

      <!-- Cart Footer -->
      <div class="cart-sidebar__footer">
        <div class="cart-summary">
          <div class="cart-summary__total">
            <span>Total: </span>
            <span class="cart-total" data-cart-total="0.00">$0.00</span>
          </div>
        </div>

        <div class="cart-actions">
          <button
            class="cart-action cart-action--secondary"
            onclick="closeCart()"
          >
            Continue Shopping
          </button>
          <a
            href="/checkout"
            class="cart-action cart-action--primary"
            onclick="closeCart()"
          >
            Checkout
          </a>
        </div>
      </div>
    </div>

    <style>
      .cart-sidebar {
        position: fixed;
        top: 0;
        right: 0;
        width: 400px;
        height: 100vh;
        background: white;
        box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: transform 300ms ease-out;
        z-index: 1000;
        display: flex;
        flex-direction: column;
      }

      .cart-sidebar--open {
        transform: translateX(0);
      }

      .cart-sidebar__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.5rem;
        border-bottom: 1px solid #E5E7EB;
        background: #F9FAFB;
      }

      .cart-sidebar__title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1F2937;
        margin: 0;
      }

      .cart-sidebar__close {
        width: 32px;
        height: 32px;
        border: none;
        background: #E5E7EB;
        border-radius: 50%;
        font-size: 1.25rem;
        color: #6B7280;
        cursor: pointer;
        transition: all 200ms ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .cart-sidebar__close:hover {
        background: #D1D5DB;
        color: #374151;
      }

      .cart-sidebar__content {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
      }

      .cart-sidebar__footer {
        border-top: 1px solid #E5E7EB;
        padding: 1.5rem;
        background: #F9FAFB;
      }

      .cart-summary {
        margin-bottom: 1rem;
      }

      .cart-summary__total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.125rem;
        font-weight: 600;
        color: #1F2937;
      }

      .cart-total {
        color: #059669;
      }

      .cart-actions {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .cart-action {
        padding: 0.75rem 1rem;
        border-radius: 8px;
        font-weight: 600;
        text-align: center;
        text-decoration: none;
        cursor: pointer;
        transition: all 200ms ease;
        border: none;
        font-size: 1rem;
      }

      .cart-action--primary {
        background: #6366F1;
        color: white;
      }

      .cart-action--primary:hover {
        background: #5B21B6;
      }

      .cart-action--secondary {
        background: white;
        color: #374151;
        border: 1px solid #D1D5DB;
      }

      .cart-action--secondary:hover {
        background: #F3F4F6;
      }

      .cart-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        color: #6B7280;
      }

      .loading-spinner {
        width: 32px;
        height: 32px;
        border: 3px solid #E5E7EB;
        border-top: 3px solid #6366F1;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      .cart-empty {
        text-align: center;
        padding: 2rem;
        color: #6B7280;
      }

      .cart-empty__icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.5;
      }

      .cart-item {
        display: flex;
        gap: 1rem;
        padding: 1rem 0;
        border-bottom: 1px solid #E5E7EB;
      }

      .cart-item:last-child {
        border-bottom: none;
      }

      .cart-item__image {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        overflow: hidden;
        flex-shrink: 0;
      }

      .cart-item__image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .cart-item__details {
        flex: 1;
        min-width: 0;
      }

      .cart-item__name {
        font-weight: 600;
        color: #1F2937;
        margin: 0 0 0.25rem 0;
        font-size: 0.875rem;
        line-height: 1.3;
      }

      .cart-item__price {
        color: #059669;
        font-weight: 600;
        font-size: 0.875rem;
      }

      .cart-item__quantity {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }

      .quantity-btn {
        width: 24px;
        height: 24px;
        border: 1px solid #D1D5DB;
        background: white;
        border-radius: 4px;
        font-size: 0.875rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 200ms ease;
      }

      .quantity-btn:hover:not(:disabled) {
        border-color: #6366F1;
        background: #F0F9FF;
      }

      .quantity-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .quantity-value {
        min-width: 24px;
        text-align: center;
        font-weight: 500;
        font-size: 0.875rem;
      }

      .cart-item__remove {
        width: 24px;
        height: 24px;
        border: none;
        background: #FEE2E2;
        color: #DC2626;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 200ms ease;
        flex-shrink: 0;
        align-self: flex-start;
      }

      .cart-item__remove:hover {
        background: #FECACA;
      }

      /* Mobile responsiveness */
      @media (max-width: 480px) {
        .cart-sidebar {
          width: 100vw;
        }

        .cart-sidebar__header {
          padding: 1rem;
        }

        .cart-sidebar__content {
          padding: 0.75rem;
        }

        .cart-sidebar__footer {
          padding: 1rem;
        }
      }

      /* High contrast mode */
      @media (prefers-contrast: high) {
        .cart-sidebar {
          border-left: 2px solid #000;
        }

        .cart-item {
          border-bottom-width: 2px;
        }
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .cart-sidebar {
          transition: none;
        }

        .loading-spinner {
          animation: none;
        }
      }

      /* Focus management */
      .cart-sidebar:focus-within {
        outline: none;
      }

      .cart-sidebar__close:focus-visible {
        outline: 2px solid #6366F1;
        outline-offset: 2px;
      }
    </style>
  `;
}
/** @jsx h */
import { boolean, defineComponent, h, number, string } from "../../../index.ts";
import { showcaseClasses } from "../utilities/showcase-utilities.ts";

/**
 * Shopping Cart Sidebar Component
 * Slide-out cart with items and checkout functionality
 * Uses Open Props animations and styling
 */
defineComponent("showcase-cart-sidebar", {
  render: (props) => {
    const isOpen = props?.isOpen === "true";
    const itemCount = parseInt(props?.itemCount || "0");
    const total = props?.total || "$0.00";

    const sidebarClass = isOpen
      ? `${showcaseClasses.showcaseCartSidebar} showcase-cart-sidebar open`
      : `${showcaseClasses.showcaseCartSidebar} showcase-cart-sidebar`;

    return (
      <div class={sidebarClass} id="shopping-cart-sidebar">
        <div class={`${showcaseClasses.showcaseCartHeader} showcase-cart-header`}>
          <h2 style="font-size: var(--font-size-3); font-weight: var(--font-weight-6); color: var(--text-1); margin: 0;">
            🛒 Shopping Cart (<span class="cart-count">{itemCount}</span>)
          </h2>
          <button
            style={`background: none; border: none; font-size: var(--font-size-4); 
                    cursor: pointer; color: var(--text-2); padding: var(--size-2); 
                    border-radius: var(--radius-round); transition: all var(--animation-fade-in);
                    &:hover { background: var(--surface-3); color: var(--text-1); }`}
            onclick="document.getElementById('shopping-cart-sidebar').classList.remove('open')"
          >
            ✕
          </button>
        </div>

        <div class={`${showcaseClasses.showcaseCartItems} showcase-cart-items`}>
          <div style="color: var(--text-2); text-align: center; padding: var(--size-4);">
            Your cart is empty
          </div>
        </div>

        <div class={`${showcaseClasses.showcaseCartFooter} showcase-cart-footer`}>
          <div
            style={`display: flex; justify-content: space-between; align-items: center; 
                    font-size: var(--font-size-3); font-weight: var(--font-weight-6); 
                    margin-bottom: var(--size-3); color: var(--text-1);`}
          >
            <span>Total:</span>
            <span class="cart-total">{total}</span>
          </div>
          <button
            style="width: 100%; padding: var(--size-3); font-size: var(--font-size-1); background: var(--blue-6); color: var(--gray-0); border: none; border-radius: var(--radius-2); cursor: pointer; font-weight: var(--font-weight-6);"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    );
  },
});

/**
 * Floating Cart Button Component
 * Fixed position button to open cart sidebar
 * Uses Open Props for positioning and styling
 */
defineComponent("showcase-cart-button", {
  render: (props) => {
    const itemCount = parseInt(props?.itemCount || "0");

    return (
      <button
        class={`${showcaseClasses.showcaseFloatingButton} showcase-floating-button`}
        onclick="document.getElementById('shopping-cart-sidebar').classList.add('open')"
      >
        🛒 Cart <span class="cart-count">{itemCount}</span>
      </button>
    );
  },
});

/**
 * Cart System Component
 * Combines both sidebar and floating button
 */
defineComponent("showcase-cart-system", {
  render: (props) => {
    const isOpen = props?.isOpen === "true";
    const itemCount = parseInt(props?.itemCount || "0");
    const total = props?.total || "$0.00";

    return (
      <div>
        <showcase-cart-sidebar
          isOpen={isOpen.toString()}
          itemCount={itemCount.toString()}
          total={total}
        />
        <showcase-cart-button itemCount={itemCount.toString()} />
      </div>
    );
  },
});

/** @jsx h */
// deno-lint-ignore verbatim-module-syntax
import { defineComponent, h, string } from "../index.ts";

/**
 * 📡 Cart Manager - Demonstrates Tier 2: Pub/Sub State Manager
 *
 * Shows how complex application state can be shared between components
 * using topic-based subscriptions.
 */
defineComponent("cart-manager", {
  styles: {
    cartPanel: `{
      background: white;
      border-radius: 12px;
      padding: 2rem;
      border: 1px solid #dee2e6;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }`,

    cartTitle: `{
      font-size: 1.5rem;
      color: #495057;
      margin-bottom: 1rem;
      font-weight: bold;
    }`,

    productGrid: `{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 1.5rem 0;
    }`,

    productCard: `{
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
      transition: transform 0.2s ease;
    }`,

    productName: `{
      font-weight: bold;
      margin-bottom: 0.5rem;
      color: #495057;
    }`,

    productPrice: `{
      color: #28a745;
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }`,

    addButton: `{
      background: #007bff;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s ease;
    }`,

    addButtonHover: `{
      background: #0056b3;
    }`,
  },

  render: (
    {
      storeId = string("demo-store"),
    },
    _api,
    classes,
  ) => {
    const _store = typeof storeId === "string" ? storeId : "demo-store";

    return (
      <div class={classes!.cartPanel}>
        <h3 class={classes!.cartTitle}>📡 Pub/Sub State Manager</h3>
        <p>
          Add items to your cart - other components will automatically update
          via state subscriptions:
        </p>

        <div class={classes!.productGrid}>
          <div class={classes!.productCard}>
            <div class={classes!.productName}>📱 Smartphone</div>
            <div class={classes!.productPrice}>$699</div>
            <button
              type="button"
              class={classes!.addButton}
              onclick="window.addToCart('phone', 'Smartphone', 699, this)"
            >
              Add to Cart
            </button>
          </div>

          <div class={classes!.productCard}>
            <div class={classes!.productName}>💻 Laptop</div>
            <div class={classes!.productPrice}>$1299</div>
            <button
              type="button"
              class={classes!.addButton}
              onclick="window.addToCart('laptop', 'Laptop', 1299, this)"
            >
              Add to Cart
            </button>
          </div>

          <div class={classes!.productCard}>
            <div class={classes!.productName}>🎧 Headphones</div>
            <div class={classes!.productPrice}>$199</div>
            <button
              type="button"
              class={classes!.addButton}
              onclick="window.addToCart('headphones', 'Headphones', 199, this)"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  },
});

/**
 * 🛒 Cart Badge - Shows how components subscribe to state updates
 */
defineComponent("cart-badge", {
  styles: {
    badge: `{
      background: #007bff;
      color: white;
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
      margin-top: 1rem;
      transition: all 0.3s ease;
    }`,

    badgeCount: `{
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }`,

    badgeTotal: `{
      font-size: 1.2rem;
      opacity: 0.9;
    }`,
  },

  render: (
    {
      cartId = string("default"),
    },
    _api,
    classes,
  ) => {
    const id = typeof cartId === "string" ? cartId : "default";

    return (
      <div
        class={`${classes!.badge} cart-badge-reactive`}
        data-cart-id={id}
      >
        <div class={`${classes!.badgeCount} cart-count`}>0 items</div>
        <div class={`${classes!.badgeTotal} cart-total`}>$0.00</div>
        <p style="margin: 0.5rem 0 0; font-size: 0.875rem; opacity: 0.8;">
          🔄 Updates automatically via pub/sub
        </p>
      </div>
    );
  },
});

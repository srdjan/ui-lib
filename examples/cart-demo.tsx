/** @jsx h */
// deno-lint-ignore verbatim-module-syntax
import { createCartAction, defineComponent, h, string } from "../index.ts";

/**
 * 📡 Cart Manager - Demonstrates Tier 2: Pub/Sub State Manager
 *
 * Shows how complex application state can be shared between components
 * using topic-based subscriptions.
 */
defineComponent("cart-manager", {
  styles: {
    cartPanel: `{
      background: var(--surface-1);
      border-radius: var(--radius-3);
      padding: var(--size-4);
      border: 1px solid var(--surface-3);
      box-shadow: var(--shadow-2);
    } @media (max-width: 768px) { .cart-panel { padding: var(--size-3); } }`,

    cartTitle: `{
      font-size: var(--font-size-4);
      color: var(--text-1);
      margin-block-end: var(--size-3);
      font-weight: var(--font-weight-6);
    } @media (max-width: 768px) { .cart-title { font-size: var(--font-size-3); } }`,

    productGrid: `{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr));
      gap: var(--size-3);
      margin-block: var(--size-4);
    } @media (max-width: 768px) { .product-grid { grid-template-columns: 1fr; gap: var(--size-2); } }`,

    productCard: `{
      border: 1px solid var(--surface-3);
      border-radius: var(--radius-2);
      padding: var(--size-3);
      text-align: center;
      transition: transform 0.2s ease;
    } @media (max-width: 768px) { .product-card { padding: var(--size-2); } }`,

    productName: `{
      font-weight: var(--font-weight-6);
      margin-block-end: var(--size-2);
      color: var(--text-1);
    } @media (max-width: 768px) { .product-name { font-size: var(--font-size-1); } }`,

    productPrice: `{
      color: var(--green-6);
      font-size: var(--font-size-3);
      margin-block-end: var(--size-3);
      font-weight: var(--font-weight-5);
    } @media (max-width: 768px) { .product-price { font-size: var(--font-size-2); } }`,

    addButton: `{
      background: var(--blue-6);
      color: white;
      border: none;
      padding: var(--size-2) var(--size-3);
      border-radius: var(--radius-2);
      cursor: pointer;
      transition: background 0.2s ease;
      font-size: var(--font-size-1);
    } @media (max-width: 768px) { .add-button { padding: var(--size-1) var(--size-2); font-size: var(--font-size-0); } }`,

    addButtonHover: `{
      background: var(--blue-7);
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
              onclick={createCartAction(
                "add",
                JSON.stringify({
                  id: "phone",
                  name: "Smartphone",
                  price: 699,
                  quantity: 1,
                }),
              )}
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
              onclick={createCartAction(
                "add",
                JSON.stringify({
                  id: "laptop",
                  name: "Laptop",
                  price: 1299,
                  quantity: 1,
                }),
              )}
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
              onclick={createCartAction(
                "add",
                JSON.stringify({
                  id: "headphones",
                  name: "Headphones",
                  price: 199,
                  quantity: 1,
                }),
              )}
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
      background: var(--blue-6);
      color: white;
      padding: var(--size-3);
      border-radius: var(--radius-2);
      text-align: center;
      margin-block-start: var(--size-3);
      transition: all 0.3s ease;
    } @media (max-width: 768px) { .badge { padding: var(--size-2); } }`,

    badgeCount: `{
      font-size: var(--font-size-4);
      font-weight: var(--font-weight-7);
      margin-block-end: var(--size-2);
    } @media (max-width: 768px) { .badge-count { font-size: var(--font-size-3); } }`,

    badgeTotal: `{
      font-size: var(--font-size-3);
      opacity: 0.9;
    } @media (max-width: 768px) { .badge-total { font-size: var(--font-size-2); } }`,
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
          (function(){
            var el = document.currentScript && document.currentScript.parentElement;
            if (!el || el.getAttribute('data-cart-subscribed')) return;
            el.setAttribute('data-cart-subscribed', 'true');
            
            if (!window.funcwcState) {
              console.warn('❌ Cart badge: window.funcwcState not available');
              return;
            }
            
            console.log('📡 Cart badge subscribed to cart updates');
            window.funcwcState.subscribe('cart', function(cartData){
              console.log('🛒 Cart updated:', cartData);
              try {
                var countEl = el.querySelector('.cart-count');
                var totalEl = el.querySelector('.cart-total');
                if (countEl) { countEl.textContent = (cartData && cartData.count || 0) + ' items'; }
                if (totalEl) { 
                  var t = Number(cartData && cartData.total || 0); 
                  totalEl.textContent = '$' + t.toFixed(2);
                }
                el.style.transform = 'scale(1.05)'; setTimeout(function(){ el.style.transform = 'scale(1)'; }, 200);
              } catch (e) { console.warn('❌ cart-badge update failed', e); }
            }, el);
          })();
        `,
          }}
        >
        </script>
      </div>
    );
  },
});

/** @jsx h */
// deno-lint-ignore verbatim-module-syntax
import { router } from "./router.ts";
import { createCartAction, defineComponent, h, string } from "../index.ts";

/**
 * 📡 Cart Manager - Demonstrates Tier 2: Pub/Sub State Manager
 *
 * Shows how complex application state can be shared between components
 * using topic-based subscriptions.
 */
defineComponent("cart-manager", {
  router,

  render: (
    {
      storeId = string("demo-store"),
    },
    _api,
    _classes,
  ) => {
    const _store = typeof storeId === "string" ? storeId : "demo-store";

    return (
      <div class="u-card u-p-4">
        <h3>📡 Pub/Sub State Manager</h3>
        <p>
          Add items to your cart - other components will automatically update
          via state subscriptions:
        </p>

        <div class="u-grid u-grid-auto-fit-250 u-gap-3 u-my-4">
          <div class="u-card u-p-3 u-text-center">
            <div>📱 Smartphone</div>
            <div class="u-text-brand u-mb-3">$699</div>
            <button
              type="button"
              class="btn btn-brand"
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

          <div class="u-card u-p-3 u-text-center">
            <div>💻 Laptop</div>
            <div class="u-text-brand u-mb-3">$1299</div>
            <button
              type="button"
              class="btn btn-brand"
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

          <div class="u-card u-p-3 u-text-center">
            <div>🎧 Headphones</div>
            <div class="u-text-brand u-mb-3">$199</div>
            <button
              type="button"
              class="btn btn-brand"
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
  router,
  styles: {
    badge: `{
      position: fixed;
      top: var(--size-5);
      right: calc(var(--size-5) + 180px);
      background: var(--blue-6);
      color: white;
      padding: var(--size-3);
      border-radius: var(--radius-3);
      text-align: center;
      min-width: 120px;
      z-index: 1001;
      box-shadow: var(--shadow-3);
      transition: all 0.3s ease;
    } @media (max-width: 768px) { 
      .badge { 
        padding: var(--size-2); 
        top: var(--size-3);
        right: var(--size-3);
        min-width: 100px;
      } 
    }`,

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

/** @jsx h */
import { defineComponent, h, string, number } from "../index.ts";

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
    }`
  },

  render: ({ 
    storeId = string("demo-store") 
  }, api, classes) => {
    const store = typeof storeId === 'string' ? storeId : 'demo-store';
    
    return (
      <div class={classes!.cartPanel}>
        <h3 class={classes!.cartTitle}>📡 Pub/Sub State Manager</h3>
        <p>Add items to your cart - other components will automatically update via state subscriptions:</p>
        
        <div class={classes!.productGrid}>
          <div class={classes!.productCard}>
            <div class={classes!.productName}>📱 Smartphone</div>
            <div class={classes!.productPrice}>$699</div>
            <button
              class={classes!.addButton}
              onclick={`
                const currentCart = window.funcwc?.getState('cart') || { items: [], total: 0, count: 0 };
                const newItem = { id: 'phone', name: 'Smartphone', price: 699 };
                const existingIndex = currentCart.items.findIndex(item => item.id === 'phone');
                
                if (existingIndex >= 0) {
                  currentCart.items[existingIndex].quantity = (currentCart.items[existingIndex].quantity || 1) + 1;
                } else {
                  currentCart.items.push({ ...newItem, quantity: 1 });
                }
                
                currentCart.count = currentCart.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
                currentCart.total = currentCart.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
                
                window.funcwc?.publishState('cart', currentCart);
                
                // Visual feedback
                this.textContent = 'Added!';
                this.style.background = '#28a745';
                setTimeout(() => {
                  this.textContent = 'Add to Cart';
                  this.style.background = '#007bff';
                }, 1000);
              `}
            >
              Add to Cart
            </button>
          </div>
          
          <div class={classes!.productCard}>
            <div class={classes!.productName}>💻 Laptop</div>
            <div class={classes!.productPrice}>$1299</div>
            <button
              class={classes!.addButton}
              onclick={`
                const currentCart = window.funcwc?.getState('cart') || { items: [], total: 0, count: 0 };
                const newItem = { id: 'laptop', name: 'Laptop', price: 1299 };
                const existingIndex = currentCart.items.findIndex(item => item.id === 'laptop');
                
                if (existingIndex >= 0) {
                  currentCart.items[existingIndex].quantity = (currentCart.items[existingIndex].quantity || 1) + 1;
                } else {
                  currentCart.items.push({ ...newItem, quantity: 1 });
                }
                
                currentCart.count = currentCart.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
                currentCart.total = currentCart.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
                
                window.funcwc?.publishState('cart', currentCart);
                
                // Visual feedback
                this.textContent = 'Added!';
                this.style.background = '#28a745';
                setTimeout(() => {
                  this.textContent = 'Add to Cart';
                  this.style.background = '#007bff';
                }, 1000);
              `}
            >
              Add to Cart
            </button>
          </div>
          
          <div class={classes!.productCard}>
            <div class={classes!.productName}>🎧 Headphones</div>
            <div class={classes!.productPrice}>$199</div>
            <button
              class={classes!.addButton}
              onclick={`
                const currentCart = window.funcwc?.getState('cart') || { items: [], total: 0, count: 0 };
                const newItem = { id: 'headphones', name: 'Headphones', price: 199 };
                const existingIndex = currentCart.items.findIndex(item => item.id === 'headphones');
                
                if (existingIndex >= 0) {
                  currentCart.items[existingIndex].quantity = (currentCart.items[existingIndex].quantity || 1) + 1;
                } else {
                  currentCart.items.push({ ...newItem, quantity: 1 });
                }
                
                currentCart.count = currentCart.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
                currentCart.total = currentCart.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
                
                window.funcwc?.publishState('cart', currentCart);
                
                // Visual feedback
                this.textContent = 'Added!';
                this.style.background = '#28a745';
                setTimeout(() => {
                  this.textContent = 'Add to Cart';
                  this.style.background = '#007bff';
                }, 1000);
              `}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }
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
    }`
  },

  render: ({ 
    cartId = string("default") 
  }, api, classes) => {
    const id = typeof cartId === 'string' ? cartId : 'default';
    
    return (
      <div 
        class={classes!.badge}
        data-cart-id={id}
        hx-on="htmx:load: if (window.funcwc) { window.funcwc.subscribeToState('cart', function(cartData) { var countEl = this.querySelector('.badgeCount'); var totalEl = this.querySelector('.badgeTotal'); if (countEl) countEl.textContent = cartData.count + ' items'; if (totalEl) totalEl.textContent = '$' + cartData.total.toFixed(2); this.style.transform = 'scale(1.05)'; var self = this; setTimeout(function() { self.style.transform = 'scale(1)'; }, 200); }.bind(this)); }"
      >
        <div class={`${classes!.badgeCount} badgeCount`}>0 items</div>
        <div class={`${classes!.badgeTotal} badgeTotal`}>$0.00</div>
        <p style="margin: 0.5rem 0 0; font-size: 0.875rem; opacity: 0.8;">
          🔄 Updates automatically via pub/sub
        </p>
      </div>
    );
  }
});
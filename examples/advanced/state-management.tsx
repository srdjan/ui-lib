/** @jsx h */
import { defineComponent, h, string, number, array, object, boolean } from "../../src/index.ts";

// Advanced State Management Patterns

console.log("🚀 Loading Advanced State Management examples...");

// 1. State Synchronizer - Keeps multiple UI elements in sync
defineComponent("state-synchronizer", {
  styles: {
    container: { padding: '2rem', background: 'var(--theme-bg, #ffffff)', border: '2px solid var(--theme-border, #e2e8f0)', borderRadius: '12px', margin: '1rem 0' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' },
    syncPanel: { padding: '1.5rem', background: 'var(--theme-secondary, #f8fafc)', border: '1px solid var(--theme-border, #e2e8f0)', borderRadius: '8px' },
    slider: { width: '100%', margin: '1rem 0' },
    colorPreview: { width: '100%', height: '60px', borderRadius: '6px', border: '1px solid var(--theme-border, #e2e8f0)', transition: 'background-color 0.3s ease' },
    valueDisplay: { fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--theme-primary, #3b82f6)', textAlign: 'center', margin: '0.5rem 0' }
  },
  stateSubscriptions: {
    "sync-red": `this.updateColorValue('red', value);`,
    "sync-green": `this.updateColorValue('green', value);`,
    "sync-blue": `this.updateColorValue('blue', value);`,
    "sync-alpha": `this.updateColorValue('alpha', value);`
  },
  onMount: `
    this.updateColorValue = (channel, value) => {
      const display = this.querySelector(\`#\${channel}-display\`);
      const slider = this.querySelector(\`#\${channel}-slider\`);
      const preview = this.querySelector('.color-preview');
      
      if (display) display.textContent = value;
      if (slider && slider.value != value) slider.value = value;
      
      if (preview) {
        const r = window.StateManager?.getState('sync-red') || 128;
        const g = window.StateManager?.getState('sync-green') || 128;
        const b = window.StateManager?.getState('sync-blue') || 128;
        const a = (window.StateManager?.getState('sync-alpha') || 100) / 100;
        preview.style.backgroundColor = \`rgba(\${r}, \${g}, \${b}, \${a})\`;
      }
    };
    
    // Initialize values
    ['red', 'green', 'blue', 'alpha'].forEach(channel => {
      const value = window.StateManager?.getState(\`sync-\${channel}\`) || (channel === 'alpha' ? 100 : 128);
      this.updateColorValue(channel, value);
    });
  `,
  render: ({}, api: any, classes: any) => (
    h('div', { class: classes!.container },
      h('h3', {}, '🎨 State Synchronizer'),
      h('p', {}, 'Multiple controls stay perfectly synchronized through pub/sub state management.'),
      
      h('div', { class: classes!.colorPreview }),
      
      h('div', { class: classes!.grid },
        ['red', 'green', 'blue'].map(channel => 
          h('div', { class: classes!.syncPanel },
            h('h4', {}, channel.charAt(0).toUpperCase() + channel.slice(1)),
            h('input', {
              type: 'range',
              min: '0',
              max: '255',
              value: '128',
              class: classes!.slider,
              id: `${channel}-slider`,
              oninput: `window.StateManager?.publish('sync-${channel}', parseInt(this.value));`
            }),
            h('div', { class: classes!.valueDisplay, id: `${channel}-display` }, '128')
          )
        ),
        h('div', { class: classes!.syncPanel },
          h('h4', {}, 'Alpha'),
          h('input', {
            type: 'range',
            min: '0',
            max: '100',
            value: '100',
            class: classes!.slider,
            id: 'alpha-slider',
            oninput: `window.StateManager?.publish('sync-alpha', parseInt(this.value));`
          }),
          h('div', { class: classes!.valueDisplay, id: 'alpha-display' }, '100')
        )
      )
    )
  )
} as any);

// 2. Cross-Component Data Flow - Shopping Cart System
defineComponent("cart-manager", {
  styles: {
    container: `{
      padding: 1.5rem;
      background: var(--theme-bg, #ffffff);
      border: 2px solid var(--theme-border, #e2e8f0);
      border-radius: 10px;
      margin: 1rem 0;
    }`,
    header: `{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--theme-border, #e2e8f0);
    }`,
    total: `{
      font-size: 1.3rem;
      font-weight: bold;
      color: var(--theme-primary, #3b82f6);
    }`,
    badge: `{
      background: var(--theme-primary, #3b82f6);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
    }`,
    actions: `{
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }`,
    button: `{
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }`,
    primaryButton: `{
      background: var(--theme-primary, #3b82f6);
      color: white;
    }`,
    secondaryButton: `{
      background: var(--theme-secondary, #f1f5f9);
      color: var(--theme-text, #475569);
      border: 1px solid var(--theme-border, #e2e8f0);
    }`
  },
  stateSubscriptions: {
    "cart-items": `
      const total = Array.isArray(value) ? 
        value.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0;
      const count = Array.isArray(value) ? 
        value.reduce((sum, item) => sum + item.quantity, 0) : 0;
      
      const totalEl = this.querySelector('#cart-total');
      const badgeEl = this.querySelector('#cart-badge');
      
      if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
      if (badgeEl) badgeEl.textContent = count + ' items';
    `
  },
  onMount: `
    // Initialize cart if empty
    const currentCart = window.StateManager?.getState('cart-items') || [];
    if (currentCart.length === 0) {
      window.StateManager?.publish('cart-items', [
        { id: 1, name: 'Widget Pro', price: 29.99, quantity: 1 },
        { id: 2, name: 'Gadget Ultra', price: 49.99, quantity: 2 }
      ]);
    }
  `,
  render: ({}, api: any, classes: any) => (
    h('div', { class: classes!.container },
      h('div', { class: classes!.header },
        h('h3', {}, '🛒 Shopping Cart Manager'),
        h('div', {},
          h('span', { class: classes!.badge, id: 'cart-badge' }, '0 items'),
          h('span', { class: classes!.total, id: 'cart-total', style: 'margin-left: 1rem;' }, '$0.00')
        )
      ),
      h('div', { class: classes!.actions },
        h('button', { 
          class: `${classes!.button} ${classes!.primaryButton}`,
          onclick: `
            const currentCart = window.StateManager?.getState('cart-items') || [];
            const newItem = { 
              id: Date.now(), 
              name: 'New Item', 
              price: Math.random() * 50 + 10, 
              quantity: 1 
            };
            window.StateManager?.publish('cart-items', [...currentCart, newItem]);
          `
        }, 'Add Random Item'),
        h('button', { 
          class: `${classes!.button} ${classes!.secondaryButton}`,
          onclick: `window.StateManager?.publish('cart-items', []);`
        }, 'Clear Cart')
      )
    )
  )
} as any);

// 3. Cart Item Component - Individual cart items that sync with manager
defineComponent("cart-item-reactive", {
  styles: {
    container: `{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: var(--theme-bg, #ffffff);
      border: 1px solid var(--theme-border, #e2e8f0);
      border-radius: 8px;
      margin: 0.5rem 0;
    }`,
    info: `{
      flex: 1;
    }`,
    name: `{
      font-weight: 500;
      color: var(--theme-text, #000000);
    }`,
    price: `{
      color: var(--theme-primary, #3b82f6);
      font-weight: 500;
    }`,
    controls: `{
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }`,
    quantityButton: `{
      width: 30px;
      height: 30px;
      border: none;
      border-radius: 4px;
      background: var(--theme-primary, #3b82f6);
      color: white;
      cursor: pointer;
      font-weight: bold;
    }`,
    quantity: `{
      min-width: 30px;
      text-align: center;
      font-weight: bold;
    }`,
    removeButton: `{
      padding: 0.25rem 0.75rem;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
    }`
  },
  stateSubscriptions: {
    "cart-items": `
      const itemId = parseInt(this.getAttribute('data-item-id'));
      const item = Array.isArray(value) ? value.find(i => i.id === itemId) : null;
      
      if (!item) {
        // Item was removed, hide this component
        this.style.display = 'none';
        return;
      }
      
      this.style.display = 'flex';
      const nameEl = this.querySelector('#item-name-' + itemId);
      const priceEl = this.querySelector('#item-price-' + itemId);
      const quantityEl = this.querySelector('#item-quantity-' + itemId);
      
      if (nameEl) nameEl.textContent = item.name;
      if (priceEl) priceEl.textContent = '$' + item.price.toFixed(2);
      if (quantityEl) quantityEl.textContent = item.quantity.toString();
    `
  },
  render: ({ 
    itemId = number(1), 
    name = string("Item"), 
    price = number(0), 
    quantity = number(1) 
  }: any, api: any, classes: any) => (
    h('div', { 
      class: classes!.container,
      'data-item-id': itemId.toString()
    },
      h('div', { class: classes!.info },
        h('div', { class: classes!.name, id: `item-name-${itemId}` }, name),
        h('div', { class: classes!.price, id: `item-price-${itemId}` }, `$${price.toFixed(2)}`)
      ),
      h('div', { class: classes!.controls },
        h('button', {
          class: classes!.quantityButton,
          onclick: `
            const currentCart = window.StateManager?.getState('cart-items') || [];
            const updatedCart = currentCart.map(item => 
              item.id === ${itemId} && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
            );
            window.StateManager?.publish('cart-items', updatedCart);
          `
        }, '-'),
        h('span', { class: classes!.quantity, id: `item-quantity-${itemId}` }, quantity.toString()),
        h('button', {
          class: classes!.quantityButton,
          onclick: `
            const currentCart = window.StateManager?.getState('cart-items') || [];
            const updatedCart = currentCart.map(item => 
              item.id === ${itemId}
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
            window.StateManager?.publish('cart-items', updatedCart);
          `
        }, '+'),
        h('button', {
          class: classes!.removeButton,
          onclick: `
            const currentCart = window.StateManager?.getState('cart-items') || [];
            const updatedCart = currentCart.filter(item => item.id !== ${itemId});
            window.StateManager?.publish('cart-items', updatedCart);
          `
        }, 'Remove')
      )
    )
  )
} as any);

// 4. Global State Monitor - Visual representation of all state
defineComponent("global-state-monitor", {
  styles: {
    container: `{
      padding: 2rem;
      background: var(--theme-bg, #ffffff);
      border: 2px dashed var(--theme-primary, #3b82f6);
      border-radius: 12px;
      margin: 2rem 0;
      font-family: monospace;
    }`,
    stateItem: `{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      margin: 0.5rem 0;
      background: var(--theme-secondary, #f8fafc);
      border-radius: 6px;
      border-left: 4px solid var(--theme-primary, #3b82f6);
    }`,
    key: `{
      font-weight: bold;
      color: var(--theme-primary, #3b82f6);
    }`,
    value: `{
      color: var(--theme-text, #475569);
      max-width: 60%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }`,
    updateTime: `{
      font-size: 0.8rem;
      color: #64748b;
      text-align: center;
      margin-top: 1rem;
    }`
  },
  stateSubscriptions: {
    "*": `
      // Universal listener for all state changes
      this.updateStateDisplay();
    `
  },
  onMount: `
    this.updateStateDisplay = () => {
      const stateContainer = this.querySelector('#state-display');
      const updateTime = this.querySelector('#update-time');
      
      if (!stateContainer) return;
      
      // Get all current state from StateManager
      const topics = window.StateManager?.getTopics ? window.StateManager.getTopics() : [];
      
      stateContainer.innerHTML = '';
      
      if ((topics?.length || 0) === 0) {
        stateContainer.innerHTML = '<div style="text-align: center; color: #64748b; font-style: italic;">No state data available</div>';
        return;
      }
      
      topics.forEach((key) => {
        const stateItem = document.createElement('div');
        stateItem.className = 'state-item';
        
        const keySpan = document.createElement('span');
        keySpan.className = 'key';
        keySpan.textContent = key;
        
        const valueSpan = document.createElement('span');
        valueSpan.className = 'value';
        
        let displayValue;
        try {
          const value = window.StateManager?.getState ? window.StateManager.getState(key) : undefined;
          displayValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        } catch {
          displayValue = '[Complex Object]';
        }
        
        valueSpan.textContent = displayValue;
        valueSpan.title = displayValue; // Full value on hover
        
        stateItem.appendChild(keySpan);
        stateItem.appendChild(valueSpan);
        stateContainer.appendChild(stateItem);
      });
      
      if (updateTime) {
        updateTime.textContent = 'Last updated: ' + new Date().toLocaleTimeString();
      }
    };
    
    // Initial display
    setTimeout(() => this.updateStateDisplay(), 100);
  `,
  render: ({}, api: any, classes: any) => (
    h('div', { class: classes!.container },
      h('h3', {}, '🔍 Global State Monitor'),
      h('p', {}, 'Real-time view of all application state managed by StateManager.'),
      h('div', { id: 'state-display' },
        h('div', { style: 'text-align: center; color: #64748b; font-style: italic;' }, 'Loading state...')
      ),
      h('div', { class: classes!.updateTime, id: 'update-time' })
    )
  )
} as any);

console.log("✅ Advanced State Management examples loaded - 4 components demonstrating complex state patterns");

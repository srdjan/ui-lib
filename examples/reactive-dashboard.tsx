/** @jsx h */
/// <reference path="../src/lib/jsx.d.ts" />
import {
  defineComponent,
  h,
  string,
  number,
} from "../src/index.ts";
import {
  setCSSProperty,
  publishState,
  dispatchEvent,
  debugReactiveState,
} from "../src/lib/reactive-helpers.ts";

// Main Reactive Dashboard - Showcases all three reactivity approaches
defineComponent("reactive-dashboard", {
  styles: {
    dashboard: { maxWidth: '1400px', margin: '0 auto', padding: '2rem', background: 'var(--theme-bg, white)', color: 'var(--theme-text, #333)', transition: 'all 0.3s ease', minHeight: '100vh' },
    header: { textAlign: 'center', marginBottom: '3rem', padding: '2rem', background: 'var(--theme-card-bg, #f8f9fa)', border: '2px solid var(--theme-border, #ddd)', borderRadius: '16px', position: 'relative', overflow: 'hidden' },
    headerBg: { position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', background: 'linear-gradient(135deg, var(--theme-button-bg, #007bff) 0%, var(--theme-card-bg, #f8f9fa) 100%)', opacity: '0.1', zIndex: '-1' },
    title: { color: 'var(--theme-text, #333)', fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    subtitle: { color: 'var(--theme-text, #666)', fontSize: '1.2rem', opacity: '0.8', marginBottom: '2rem' },
    quickControls: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
    quickBtn: { background: 'var(--theme-button-bg, #007bff)', color: 'var(--theme-button-text, white)', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    section: { marginBottom: '3rem', padding: '2rem', border: '2px solid var(--theme-border, #ddd)', borderRadius: '12px', background: 'var(--theme-card-bg, #f8f9fa)', transition: 'all 0.3s ease' },
    sectionTitle: { color: 'var(--theme-text, #333)', fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '3px solid var(--theme-button-bg, #007bff)', display: 'flex', alignItems: 'center', gap: '0.75rem' },
    sectionDesc: { color: 'var(--theme-text, #666)', marginBottom: '1.5rem', fontSize: '1.1rem', lineHeight: '1.5' },
    demoArea: { background: 'var(--theme-bg, white)', border: '2px dashed var(--theme-border, #ddd)', borderRadius: '8px', padding: '2rem', margin: '1rem 0' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', margin: '1rem 0' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '2rem 0' },
    statCard: { background: 'var(--theme-bg, white)', border: '2px solid var(--theme-border, #ddd)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', transition: 'all 0.3s ease' },
    statNumber: { fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--theme-button-bg, #007bff)', marginBottom: '0.5rem' },
    statLabel: { color: 'var(--theme-text, #666)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' },
    footer: { textAlign: 'center', padding: '2rem', marginTop: '3rem', borderTop: '2px solid var(--theme-border, #ddd)', color: 'var(--theme-text, #666)' }
  },
  render: () => (
    <div class="dashboard">
      <div class="header">
        <div class="header-bg"></div>
        <h1 class="title">🔄 funcwc Reactive System</h1>
        <p class="subtitle">
          The most powerful DOM-native reactivity system ever built
        </p>
        
        <div class="quick-controls">
          <button 
            class="quick-btn"
            hx-on:click={debugReactiveState("Full Dashboard Debug", true, true)}
          >
            <span>🐛</span> Debug All Systems
          </button>
          
          <button 
            class="quick-btn"
            style="background: #28a745;"
            hx-on:click={`
              // Reset everything to defaults
              ${setCSSProperty("theme-mode", "light")}
              ${setCSSProperty("theme-bg", "white")}
              ${setCSSProperty("theme-text", "#333")}
              ${setCSSProperty("theme-border", "#ddd")}
              ${setCSSProperty("theme-card-bg", "#f8f9fa")}
              ${setCSSProperty("theme-button-bg", "#007bff")}
              
              ${publishState("cart", { items: [], count: 0, total: 0, isEmpty: true })}
              
              ${dispatchEvent("show-notification", { 
                message: "🔄 Dashboard reset to defaults!", 
                type: "success", 
                duration: 2000 
              })}
            `}
          >
            <span>🔄</span> Reset All
          </button>
          
          <button 
            class="quick-btn"
            style="background: #6f42c1;"
            hx-on:click={`
              // Demo mode - show off all features
              ${setCSSProperty("theme-mode", "demo")}
              ${setCSSProperty("theme-bg", "linear-gradient(135deg, #667eea 0%, #764ba2 100%)")}
              ${setCSSProperty("theme-text", "white")}
              ${setCSSProperty("theme-border", "#ffffff33")}
              ${setCSSProperty("theme-card-bg", "#ffffff20")}
              ${setCSSProperty("theme-button-bg", "#ff6b6b")}
              
              ${dispatchEvent("show-notification", { 
                message: "🎪 Demo mode activated! Check out this beautiful gradient theme.", 
                type: "info", 
                duration: 4000 
              })}
              
              setTimeout(() => {
                ${publishState("cart", { 
                  items: [
                    { id: "demo-1", name: "Demo Product", price: 99.99, quantity: 2, image: "🎁" }
                  ], 
                  count: 1, 
                  total: 199.98, 
                  isEmpty: false 
                })}
              }, 1000);
              
              setTimeout(() => {
                ${dispatchEvent("open-modal", {
                  modalId: "demo-welcome",
                  title: "Welcome to the Demo!",
                  content: "This dashboard showcases all three reactivity approaches working together harmoniously.",
                  type: "success"
                })}
              }, 2000);
            `}
          >
            <span>🎪</span> Demo Mode
          </button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div class="stats-grid">
        <reactive-stat-card 
          title="CSS Properties" 
          value="⚡" 
          label="Instant Updates"
          description="Zero JavaScript overhead for visual changes"
        ></reactive-stat-card>
        
        <reactive-stat-card 
          title="Pub/Sub State" 
          value="🔄" 
          label="Smart Coordination"
          description="Complex state shared across components"
        ></reactive-stat-card>
        
        <reactive-stat-card 
          title="DOM Events" 
          value="📡" 
          label="Event Communication"
          description="Decoupled component messaging"
        ></reactive-stat-card>
        
        <reactive-stat-card 
          title="Performance" 
          value="🚀" 
          label="Maximum Speed"
          description="Native browser optimizations"
        ></reactive-stat-card>
      </div>

      {/* CSS Property Reactivity Section */}
      <div class="section">
        <h2 class="section-title">
          <span>🎨</span>
          <span>CSS Property Reactivity</span>
        </h2>
        <p class="section-desc">
          Visual coordination through CSS custom properties. Changes propagate 
          instantly via the browser's CSS engine with zero JavaScript overhead.
        </p>
        
        <div class="demo-area">
          <theme-controller></theme-controller>
          <div class="grid">
            <reactive-card 
              title="Instant Theme Updates"
              content="This card automatically adapts to theme changes via CSS custom properties. Notice how smooth the transitions are!"
            ></reactive-card>
            
            <theme-playground></theme-playground>
          </div>
          <themed-nav></themed-nav>
          <theme-status></theme-status>
        </div>
      </div>

      {/* State Manager Section */}
      <div class="section">
        <h2 class="section-title">
          <span>🛒</span>
          <span>Pub/Sub State Manager</span>
        </h2>
        <p class="section-desc">
          Complex application state shared across multiple components. Perfect 
          for shopping carts, user data, and business logic coordination.
        </p>
        
        <div class="demo-area">
          <div class="grid">
            <shopping-cart></shopping-cart>
            <div>
              <cart-badge initial-count="0" initial-total="0"></cart-badge>
              <br /><br />
              <checkout-button enabled="false"></checkout-button>
              <cart-statistics></cart-statistics>
            </div>
          </div>
          <product-grid></product-grid>
          <quick-add-panel></quick-add-panel>
        </div>
      </div>

      {/* DOM Events Section */}
      <div class="section">
        <h2 class="section-title">
          <span>📡</span>
          <span>DOM Event Communication</span>
        </h2>
        <p class="section-desc">
          Components communicate through custom DOM events. Great for modals, 
          notifications, and one-off interactions between components.
        </p>
        
        <div class="demo-area">
          <div class="grid">
            <modal-control-panel></modal-control-panel>
            <notification-sender></notification-sender>
          </div>
          <event-demo></event-demo>
        </div>
      </div>

      {/* Integration Example */}
      <div class="section">
        <h2 class="section-title">
          <span>🔗</span>
          <span>Integrated Example</span>
        </h2>
        <p class="section-desc">
          Watch all three systems work together: CSS themes, cart state, and event notifications.
        </p>
        
        <div class="demo-area">
          <integration-demo></integration-demo>
        </div>
      </div>

      <div class="footer">
        <p>
          <strong>funcwc Reactive System</strong> - The most ergonomic way to build reactive components.<br />
          DOM-native • SSR-first • Zero dependencies • Maximum performance
        </p>
        <p style="margin-top: 1rem; opacity: 0.7;">
          Built with ❤️ for the modern web platform
        </p>
      </div>
      
      {/* Hidden modals */}
      <demo-modals></demo-modals>
      <modal id="demo-welcome"></modal>
      <notification-display></notification-display>
    </div>
  )
});

// Reactive Stat Card - Shows live statistics
defineComponent("reactive-stat-card", {
  styles: {
    card: `{
      background: var(--theme-bg, white);
      border: 2px solid var(--theme-border, #ddd);
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }`,
    cardHover: `{
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      border-color: var(--theme-button-bg, #007bff);
    }`,
    number: `{
      font-size: 2.5rem;
      font-weight: bold;
      color: var(--theme-button-bg, #007bff);
      margin-bottom: 0.5rem;
      display: block;
    }`,
    label: `{
      color: var(--theme-text, #666);
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }`,
    description: `{
      color: var(--theme-text, #666);
      font-size: 0.8rem;
      opacity: 0.8;
      line-height: 1.3;
    }`
  },
  render: ({ 
    title = string("Stat"),
    value = string("0"),
    label = string("Label"),
    description = string("Description")
  }) => (
    <div 
      class="card"
      hx-on:load={`
        // Update stats every 2 seconds
        const updateStats = () => {
          const title = this.querySelector('.stat-label').textContent;
          const valueEl = this.querySelector('.stat-number');
          
          if (title.includes('CSS Properties')) {
            // Count CSS custom properties
            let count = 0;
            for (let prop of document.documentElement.style) {
              if (prop.startsWith('--')) count++;
            }
            valueEl.textContent = count || '⚡';
          } else if (title.includes('State')) {
            // Count state topics
            const topics = window.funcwcState ? window.funcwcState.getTopics().length : 0;
            valueEl.textContent = topics || '🔄';
          } else if (title.includes('Events')) {
            // This is more of a demo - in reality you'd track actual events
            const now = new Date();
            valueEl.textContent = now.getSeconds() % 10 || '📡';
          } else if (title.includes('Performance')) {
            // Show a performance indicator
            const perf = Math.round(performance.now() / 100) % 100;
            valueEl.textContent = perf < 50 ? '🚀' : '⚡';
          }
          
          setTimeout(updateStats, 2000);
        };
        updateStats();
      `}
      hx-on:mouseover="this.classList.add('card-hover')"
      hx-on:mouseout="this.classList.remove('card-hover')"
    >
      <div class="number stat-number">{value}</div>
      <div class="label stat-label">{label}</div>
      <div class="description">{description}</div>
    </div>
  )
});

// Integration Demo - Shows all systems working together
defineComponent("integration-demo", {
  styles: {
    demo: `{
      background: var(--theme-card-bg, #f8f9fa);
      border: 3px solid var(--theme-border, #ddd);
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      position: relative;
      overflow: hidden;
    }`,
    overlay: `{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, 
        var(--theme-button-bg, #007bff)22, 
        transparent 50%);
      z-index: -1;
    }`,
    title: `{
      color: var(--theme-text, #333);
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }`,
    status: `{
      background: var(--theme-bg, white);
      border: 2px solid var(--theme-border, #ddd);
      border-radius: 8px;
      padding: 1rem;
      margin: 1rem 0;
      font-family: monospace;
      color: var(--theme-text, #333);
      font-size: 0.9rem;
    }`,
    actionBtn: `{
      background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      font-size: 1.1rem;
      margin: 0.5rem;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }`,
    actionBtnHover: `{
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    }`
  },
  render: () => (
    <div 
      class="demo"
      hx-on:load={`
        // Initialize integration status
        const statusEl = this.querySelector('.integration-status');
        statusEl.innerHTML = '🔄 Integration demo ready • All systems online';
      `}
    >
      <div class="overlay"></div>
      <h3 class="title">🔗 All Systems Integration</h3>
      <p>This demo coordinates all three reactivity systems simultaneously:</p>
      
      <div class="status integration-status">
        Loading integration status...
      </div>
      
      <button 
        class="action-btn integration-action"
        hx-on:click={`
          const currentCart = window.funcwcState?.getState('cart') || { items: [], isEmpty: true };
          
          if (currentCart.isEmpty) {
            // Add item, change theme, and show notification
            ${publishState("cart", {
              items: [{ id: "integration-1", name: "Integration Demo Item", price: 42.00, quantity: 1, image: "🔗" }],
              count: 1,
              total: 42.00,
              isEmpty: false
            })}
            
            ${setCSSProperty("theme-mode", "integration")}
            ${setCSSProperty("theme-bg", "#f0f8ff")}
            ${setCSSProperty("theme-card-bg", "#e6f3ff")}
            ${setCSSProperty("theme-button-bg", "#ff6b6b")}
            
            ${dispatchEvent("show-notification", {
              message: "🔗 Integration complete! Cart updated, theme changed, notification sent.",
              type: "success",
              duration: 4000
            })}
          } else {
            // Reset everything and show completion
            ${publishState("cart", { items: [], count: 0, total: 0, isEmpty: true })}
            
            ${setCSSProperty("theme-mode", "light")}
            ${setCSSProperty("theme-bg", "white")}
            ${setCSSProperty("theme-card-bg", "#f8f9fa")}
            ${setCSSProperty("theme-button-bg", "#007bff")}
            
            ${dispatchEvent("show-notification", {
              message: "🎉 Checkout complete! All systems reset to default state.",
              type: "success",
              duration: 3000
            })}
            
            // Show completion modal
            setTimeout(() => {
              ${dispatchEvent("open-modal", {
                modalId: "integration-complete",
                title: "Integration Demo Complete!",
                content: "<p>🎊 Congratulations! You've seen all three reactivity systems working together:</p><ul><li>🎨 <strong>CSS Properties:</strong> Theme changed instantly</li><li>🛒 <strong>State Manager:</strong> Cart state synchronized</li><li>📡 <strong>DOM Events:</strong> Notifications and modal triggered</li></ul><p>This is the power of funcwc's hybrid reactivity system!</p>",
                type: "success"
              })}
            }, 1000);
          }
        `}
        hx-on:mouseover="this.classList.add('action-btn-hover')"
        hx-on:mouseout="this.classList.remove('action-btn-hover')"
      >
        🎯 Start Integration Demo
      </button>
      
      <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.8;">
        Watch the status display above to see real-time coordination between all systems!
      </p>
      
      {/* Hidden modal for integration demo */}
      <modal id="integration-complete"></modal>
    </div>
  )
});

console.log("✅ Reactive Dashboard components registered");

/** @jsx h */
import { 
  boolean, 
  createCartAction, 
  createNotification, 
  defineComponent, 
  dispatchEvent, 
  h, 
  number, 
  publishState, 
  setCSSProperty, 
  string, 
  toggleCSSProperty 
} from "../../index.ts";

/**
 * ⚡ Hybrid Reactivity System Showcase
 * 
 * Demonstrates the revolutionary three-tier reactivity system:
 * Tier 1: CSS Property Reactivity (instant visual updates)
 * Tier 2: Pub/Sub State Manager (business logic state)
 * Tier 3: DOM Events (component communication)
 */
defineComponent("showcase-reactivity", {
  styles: {
    showcase: `{
      background: var(--gray-0);
      border-radius: var(--radius-4);
      padding: var(--size-6);
      margin: var(--size-6) 0;
    }`,

    showcaseTitle: `{
      font-size: var(--font-size-4);
      font-weight: var(--font-weight-7);
      color: var(--green-6);
      margin-bottom: var(--size-4);
    }`,

    showcaseSubtitle: `{
      font-size: var(--font-size-1);
      color: var(--gray-7);
      margin-bottom: var(--size-6);
    }`,

    tierGrid: `{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--size-6);
      margin-bottom: var(--size-8);
    }`,

    tierCard: `{
      background: white;
      border: 2px solid var(--gray-3);
      border-radius: var(--radius-4);
      padding: var(--size-5);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }`,

    tierCardTier1: `{
      border-color: var(--blue-4);
      background: linear-gradient(135deg, var(--blue-0) 0%, var(--blue-1) 100%);
    }`,

    tierCardTier2: `{
      border-color: var(--purple-4);
      background: linear-gradient(135deg, var(--purple-0) 0%, var(--purple-1) 100%);
    }`,

    tierCardTier3: `{
      border-color: var(--orange-4);
      background: linear-gradient(135deg, var(--orange-0) 0%, var(--orange-1) 100%);
    }`,

    tierNumber: `{
      position: absolute;
      top: var(--size-3);
      right: var(--size-3);
      background: var(--gray-6);
      color: white;
      border-radius: 50%;
      width: var(--size-5);
      height: var(--size-5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--font-weight-7);
      font-size: var(--font-size-1);
    }`,

    tierTitle: `{
      font-size: var(--font-size-3);
      font-weight: var(--font-weight-6);
      margin-bottom: var(--size-2);
      color: var(--gray-8);
    }`,

    tierSubtitle: `{
      font-size: var(--font-size-0);
      color: var(--gray-6);
      margin-bottom: var(--size-4);
      font-style: italic;
    }`,

    tierDescription: `{
      font-size: var(--font-size-1);
      color: var(--gray-7);
      line-height: 1.5;
      margin-bottom: var(--size-4);
    }`,

    tierDemo: `{
      background: var(--gray-1);
      border: 1px solid var(--gray-3);
      border-radius: var(--radius-3);
      padding: var(--size-3);
      margin-bottom: var(--size-3);
    }`,

    liveDemo: `{
      background: var(--gray-9);
      color: white;
      border-radius: var(--radius-4);
      padding: var(--size-6);
      margin: var(--size-6) 0;
    }`,

    liveDemoTitle: `{
      font-size: var(--font-size-3);
      font-weight: var(--font-weight-6);
      color: white;
      margin-bottom: var(--size-4);
      text-align: center;
    }`,

    demoGrid: `{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--size-4);
    }`,

    benefitsList: `{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--size-4);
      margin: var(--size-6) 0;
    }`,

    benefitCard: `{
      background: white;
      border: 1px solid var(--green-3);
      border-radius: var(--radius-3);
      padding: var(--size-4);
      transition: all 0.3s ease;
    }`,

    benefitIcon: `{
      font-size: var(--font-size-3);
      color: var(--green-6);
      margin-bottom: var(--size-2);
    }`,

    benefitTitle: `{
      font-size: var(--font-size-2);
      font-weight: var(--font-weight-6);
      color: var(--green-8);
      margin-bottom: var(--size-2);
    }`,

    benefitDescription: `{
      font-size: var(--font-size-1);
      color: var(--green-7);
      line-height: 1.5;
    }`,
  },

  render: (
    {
      title = string("Hybrid Reactivity System"),
      showTierComparison = boolean(true),
      showLiveDemo = boolean(true),
    },
    _api,
    classes,
  ) => (
    <section class={classes!.showcase} id="reactivity">
      <h2 class={classes!.showcaseTitle}>{title}</h2>
      <p class={classes!.showcaseSubtitle}>
        Three-tier reactivity system optimized for different use cases: CSS properties for theming, 
        pub/sub for business logic, and DOM events for component communication.
      </p>

      {showTierComparison && (
        <div class={classes!.tierGrid}>
          <div class={`${classes!.tierCard} ${classes!.tierCardTier1}`}>
            <div class={classes!.tierNumber} style="background: var(--blue-6);">1</div>
            <h3 class={classes!.tierTitle}>CSS Property Reactivity</h3>
            <div class={classes!.tierSubtitle}>Visual State • Instant Updates</div>
            <div class={classes!.tierDescription}>
              Perfect for theming, visual coordination, and styling state. Updates happen 
              via the CSS engine with zero JavaScript overhead.
            </div>
            <div class={classes!.tierDemo}>
              <strong>Use Cases:</strong> Theme switching, dark mode, component states, animations
            </div>
            <div class={classes!.tierDemo}>
              <strong>Performance:</strong> Instant (CSS engine) • Zero JS overhead
            </div>
            <css-property-demo />
          </div>

          <div class={`${classes!.tierCard} ${classes!.tierCardTier2}`}>
            <div class={classes!.tierNumber} style="background: var(--purple-6);">2</div>
            <h3 class={classes!.tierTitle}>Pub/Sub State Manager</h3>
            <div class={classes!.tierSubtitle}>Business Logic • Persistent State</div>
            <div class={classes!.tierDescription}>
              Ideal for complex application state like shopping carts, user data, and 
              cross-component business logic that needs persistence.
            </div>
            <div class={classes!.tierDemo}>
              <strong>Use Cases:</strong> Shopping carts, user sessions, form data, dashboards
            </div>
            <div class={classes!.tierDemo}>
              <strong>Performance:</strong> Efficient subscriptions • Automatic cleanup
            </div>
            <pubsub-state-demo />
          </div>

          <div class={`${classes!.tierCard} ${classes!.tierCardTier3}`}>
            <div class={classes!.tierNumber} style="background: var(--orange-6);">3</div>
            <h3 class={classes!.tierTitle}>DOM Events</h3>
            <div class={classes!.tierSubtitle}>Component Communication • Event-Driven</div>
            <div class={classes!.tierDescription}>
              Best for modal systems, notifications, and component-to-component messaging. 
              Leverages native browser event system with structured payloads.
            </div>
            <div class={classes!.tierDemo}>
              <strong>Use Cases:</strong> Modals, notifications, component communication
            </div>
            <div class={classes!.tierDemo}>
              <strong>Performance:</strong> Native browser events • Event bubbling
            </div>
            <dom-events-demo />
          </div>
        </div>
      )}

      {showLiveDemo && (
        <div class={classes!.liveDemo}>
          <h3 class={classes!.liveDemoTitle}>🎮 Interactive Three-Tier Demo</h3>
          <div class={classes!.demoGrid}>
            <reactivity-dashboard />
            <reactivity-controls />
          </div>
        </div>
      )}

      <div class={classes!.benefitsList}>
        <div class={classes!.benefitCard}>
          <div class={classes!.benefitIcon}>🎯</div>
          <div class={classes!.benefitTitle}>Optimized for Use Case</div>
          <div class={classes!.benefitDescription}>
            Each tier is optimized for specific scenarios. Choose the right tool for the right job.
          </div>
        </div>

        <div class={classes!.benefitCard}>
          <div class={classes!.benefitIcon}>⚡</div>
          <div class={classes!.benefitTitle}>Maximum Performance</div>
          <div class={classes!.benefitDescription}>
            CSS updates are instant, pub/sub is efficient, and DOM events leverage native browser optimization.
          </div>
        </div>

        <div class={classes!.benefitCard}>
          <div class={classes!.benefitTitle}>📦 Minimal Bundle</div>
          <div class={classes!.benefitDescription}>
            Only ~2KB total for all reactive features. Most of the work happens via browser APIs.
          </div>
        </div>

        <div class={classes!.benefitCard}>
          <div class={classes!.benefitIcon}>🧠</div>
          <div class={classes!.benefitTitle}>Easy Mental Model</div>
          <div class={classes!.benefitDescription}>
            Three clear tiers with distinct purposes. No complex state management to learn.
          </div>
        </div>
      </div>
    </section>
  ),
});

/**
 * 🎨 CSS Property Reactivity Demo
 * Tier 1: Instant visual updates via CSS custom properties
 */
defineComponent("css-property-demo", {
  styles: {
    demo: `{
      background: white;
      border: 1px solid var(--blue-3);
      border-radius: var(--radius-3);
      padding: var(--size-4);
      margin-top: var(--size-3);
    }`,

    themeableElement: `{
      background: var(--demo-bg, var(--blue-1));
      color: var(--demo-text, var(--blue-8));
      border: 2px solid var(--demo-border, var(--blue-4));
      padding: var(--size-3);
      border-radius: var(--radius-3);
      text-align: center;
      margin: var(--size-3) 0;
      transition: all 0.3s ease;
      font-weight: var(--font-weight-6);
    }`,

    controls: `{
      display: flex;
      gap: var(--size-2);
      flex-wrap: wrap;
      justify-content: center;
    }`,

    themeButton: `{
      background: var(--blue-6);
      color: white;
      border: none;
      padding: var(--size-2) var(--size-3);
      border-radius: var(--radius-2);
      cursor: pointer;
      font-size: var(--font-size-0);
      transition: all 0.2s ease;
    }`,
  },

  render: (
    {
      title = string("CSS Property Demo"),
    },
    _api,
    classes,
  ) => (
    <div class={classes!.demo}>
      <div class={classes!.themeableElement}>
        🎨 This element responds to CSS property changes instantly!
      </div>
      
      <div class={classes!.controls}>
        <button 
          class={classes!.themeButton}
          onclick={`
            ${setCSSProperty("demo-bg", "var(--blue-1)")};
            ${setCSSProperty("demo-text", "var(--blue-8)")};
            ${setCSSProperty("demo-border", "var(--blue-4)")};
          `}
        >
          Blue Theme
        </button>
        
        <button 
          class={classes!.themeButton}
          onclick={`
            ${setCSSProperty("demo-bg", "var(--purple-1)")};
            ${setCSSProperty("demo-text", "var(--purple-8)")};
            ${setCSSProperty("demo-border", "var(--purple-4)")};
          `}
        >
          Purple Theme
        </button>
        
        <button 
          class={classes!.themeButton}
          onclick={`
            ${setCSSProperty("demo-bg", "var(--green-1)")};
            ${setCSSProperty("demo-text", "var(--green-8)")};
            ${setCSSProperty("demo-border", "var(--green-4)")};
          `}
        >
          Green Theme
        </button>

        <button 
          class={classes!.themeButton}
          onclick={toggleCSSProperty("demo-bg", "var(--gray-9)", "var(--gray-1)")}
        >
          Toggle Dark/Light
        </button>
      </div>

      <small style="display: block; margin-top: var(--size-3); text-align: center; color: var(--gray-6);">
        ⚡ Updates happen instantly via CSS engine - zero JavaScript overhead!
      </small>
    </div>
  ),
});

/**
 * 📡 Pub/Sub State Manager Demo  
 * Tier 2: Business logic state with subscriptions
 */
defineComponent("pubsub-state-demo", {
  styles: {
    demo: `{
      background: white;
      border: 1px solid var(--purple-3);
      border-radius: var(--radius-3);
      padding: var(--size-4);
      margin-top: var(--size-3);
    }`,

    cartDisplay: `{
      background: var(--purple-1);
      border: 1px solid var(--purple-3);
      border-radius: var(--radius-2);
      padding: var(--size-3);
      margin: var(--size-3) 0;
      text-align: center;
      font-family: var(--font-mono);
      font-size: var(--font-size-1);
    }`,

    productGrid: `{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: var(--size-2);
      margin: var(--size-3) 0;
    }`,

    product: `{
      background: var(--purple-0);
      border: 1px solid var(--purple-3);
      border-radius: var(--radius-2);
      padding: var(--size-2);
      text-align: center;
    }`,

    addButton: `{
      background: var(--purple-6);
      color: white;
      border: none;
      padding: var(--size-1) var(--size-2);
      border-radius: var(--radius-1);
      cursor: pointer;
      font-size: var(--font-size-0);
      width: 100%;
      margin-top: var(--size-1);
    }`,
  },

  render: (
    {
      title = string("Pub/Sub State Demo"),
    },
    _api,
    classes,
  ) => (
    <div class={classes!.demo}>
      <div class={classes!.cartDisplay} id="cart-display">
        Cart: 0 items ($0.00)
      </div>

      <div class={classes!.productGrid}>
        <div class={classes!.product}>
          <div>📱 Phone</div>
          <div>$699</div>
          <button 
            class={classes!.addButton}
            onclick={createCartAction("add", JSON.stringify({
              id: "phone", 
              name: "Phone", 
              price: 699, 
              quantity: 1
            }))}
          >
            Add to Cart
          </button>
        </div>

        <div class={classes!.product}>
          <div>💻 Laptop</div>
          <div>$1299</div>
          <button 
            class={classes!.addButton}
            onclick={createCartAction("add", JSON.stringify({
              id: "laptop", 
              name: "Laptop", 
              price: 1299, 
              quantity: 1
            }))}
          >
            Add to Cart
          </button>
        </div>

        <div class={classes!.product}>
          <div>🎧 Headphones</div>
          <div>$199</div>
          <button 
            class={classes!.addButton}
            onclick={createCartAction("add", JSON.stringify({
              id: "headphones", 
              name: "Headphones", 
              price: 199, 
              quantity: 1
            }))}
          >
            Add to Cart
          </button>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          (function() {
            var display = document.getElementById('cart-display');
            if (!display || !window.funcwcState) return;
            
            window.funcwcState.subscribe('cart', function(cartData) {
              display.textContent = 'Cart: ' + (cartData.count || 0) + ' items ($' + (cartData.total || 0).toFixed(2) + ')';
              display.style.transform = 'scale(1.05)';
              setTimeout(function() { display.style.transform = 'scale(1)'; }, 200);
            }, display);
          })();
        `
      }}>
      </script>

      <small style="display: block; margin-top: var(--size-3); text-align: center; color: var(--gray-6);">
        📡 State shared between components via pub/sub subscriptions
      </small>
    </div>
  ),
});

/**
 * 📨 DOM Events Demo
 * Tier 3: Component communication via custom DOM events
 */
defineComponent("dom-events-demo", {
  styles: {
    demo: `{
      background: white;
      border: 1px solid var(--orange-3);
      border-radius: var(--radius-3);
      padding: var(--size-4);
      margin-top: var(--size-3);
    }`,

    eventDisplay: `{
      background: var(--orange-1);
      border: 1px solid var(--orange-3);
      border-radius: var(--radius-2);
      padding: var(--size-3);
      margin: var(--size-3) 0;
      font-family: var(--font-mono);
      font-size: var(--font-size-0);
      min-height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }`,

    eventButtons: `{
      display: flex;
      gap: var(--size-2);
      flex-wrap: wrap;
      justify-content: center;
    }`,

    eventButton: `{
      background: var(--orange-6);
      color: white;
      border: none;
      padding: var(--size-2) var(--size-3);
      border-radius: var(--radius-2);
      cursor: pointer;
      font-size: var(--font-size-0);
      transition: all 0.2s ease;
    }`,
  },

  render: (
    {
      title = string("DOM Events Demo"),
    },
    _api,
    classes,
  ) => (
    <div class={classes!.demo}>
      <div class={classes!.eventDisplay} id="event-display">
        Waiting for events...
      </div>

      <div class={classes!.eventButtons}>
        <button 
          class={classes!.eventButton}
          onclick={dispatchEvent("user-action", JSON.stringify({
            type: "notification",
            message: "Hello from DOM events!",
            timestamp: Date.now()
          }))}
        >
          Send Notification
        </button>

        <button 
          class={classes!.eventButton}
          onclick={dispatchEvent("modal-trigger", JSON.stringify({
            type: "info",
            title: "Info Modal",
            content: "This was triggered via DOM events"
          }))}
        >
          Trigger Modal
        </button>

        <button 
          class={classes!.eventButton}
          onclick={createNotification("DOM event notification!", "success", 3000)}
        >
          Show Toast
        </button>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          (function() {
            var display = document.getElementById('event-display');
            if (!display) return;
            
            document.addEventListener('user-action', function(e) {
              var data = e.detail;
              display.innerHTML = '<strong>Event Received:</strong><br/>' + 
                'Type: ' + data.type + '<br/>' +
                'Message: ' + data.message + '<br/>' +
                'Time: ' + new Date(data.timestamp).toLocaleTimeString();
              display.style.background = 'var(--green-1)';
              display.style.borderColor = 'var(--green-3)';
              setTimeout(function() {
                display.style.background = 'var(--orange-1)';
                display.style.borderColor = 'var(--orange-3)';
              }, 2000);
            });
            
            document.addEventListener('modal-trigger', function(e) {
              display.innerHTML = '<strong>Modal Event:</strong><br/>' + 
                'Title: ' + e.detail.title + '<br/>' +
                'Content: ' + e.detail.content;
              display.style.background = 'var(--blue-1)';
              display.style.borderColor = 'var(--blue-3)';
              setTimeout(function() {
                display.style.background = 'var(--orange-1)';
                display.style.borderColor = 'var(--orange-3)';
              }, 2000);
            });
          })();
        `
      }}>
      </script>

      <small style="display: block; margin-top: var(--size-3); text-align: center; color: var(--gray-6);">
        📨 Custom DOM events with structured payloads for component communication
      </small>
    </div>
  ),
});

/**
 * 📊 Reactivity Dashboard  
 * Combined demo showing all three tiers working together
 */
defineComponent("reactivity-dashboard", {
  styles: {
    dashboard: `{
      background: white;
      border: 2px solid var(--indigo-4);
      border-radius: var(--radius-3);
      padding: var(--size-4);
    }`,

    dashboardTitle: `{
      font-size: var(--font-size-2);
      font-weight: var(--font-weight-6);
      color: var(--indigo-7);
      margin-bottom: var(--size-3);
      text-align: center;
    }`,

    statusGrid: `{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--size-3);
      margin-bottom: var(--size-4);
    }`,

    statusCard: `{
      background: var(--indigo-1);
      border: 1px solid var(--indigo-3);
      border-radius: var(--radius-2);
      padding: var(--size-3);
      text-align: center;
      font-family: var(--font-mono);
      font-size: var(--font-size-0);
    }`,

    eventLog: `{
      background: var(--gray-9);
      color: var(--gray-1);
      border-radius: var(--radius-2);
      padding: var(--size-3);
      height: 120px;
      overflow-y: auto;
      font-family: var(--font-mono);
      font-size: var(--font-size-0);
      line-height: 1.4;
    }`,
  },

  render: () => (
    <div class="dashboard">
      <h4 class="dashboardTitle">📊 Reactivity Dashboard</h4>
      
      <div class="statusGrid">
        <div class="statusCard" id="css-status">
          CSS Properties: Ready
        </div>
        <div class="statusCard" id="pubsub-status">
          Pub/Sub State: Active
        </div>
      </div>
      
      <div>
        <strong style="color: var(--indigo-7);">Event Log:</strong>
        <div class="eventLog" id="event-log">
          Dashboard initialized...<br/>
          Waiting for reactive events...
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          (function() {
            var log = document.getElementById('event-log');
            var cssStatus = document.getElementById('css-status');  
            var pubsubStatus = document.getElementById('pubsub-status');
            
            if (!log) return;
            
            function addLogEntry(message, type) {
              var time = new Date().toLocaleTimeString();
              var color = type === 'css' ? '#3b82f6' : type === 'pubsub' ? '#8b5cf6' : '#f59e0b';
              log.innerHTML += '<span style="color: ' + color + '">[' + time + '] ' + message + '</span><br/>';
              log.scrollTop = log.scrollHeight;
            }
            
            // Listen for CSS property changes
            var cssObserver = new MutationObserver(function(mutations) {
              mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                  addLogEntry('CSS property updated', 'css');
                  if (cssStatus) cssStatus.textContent = 'CSS Properties: Updated';
                }
              });
            });
            cssObserver.observe(document.documentElement, { attributes: true });
            
            // Listen for pub/sub state changes
            if (window.funcwcState) {
              window.funcwcState.subscribe('cart', function(data) {
                addLogEntry('Pub/Sub state: Cart updated (count: ' + (data.count || 0) + ')', 'pubsub');
                if (pubsubStatus) pubsubStatus.textContent = 'Pub/Sub State: Updated';
              });
            }
            
            // Listen for DOM events
            document.addEventListener('user-action', function(e) {
              addLogEntry('DOM Event: ' + e.detail.type + ' - ' + e.detail.message, 'event');
            });
            
            document.addEventListener('modal-trigger', function(e) {
              addLogEntry('DOM Event: Modal triggered - ' + e.detail.title, 'event');
            });
          })();
        `
      }}>
      </script>
    </div>
  ),
});

/**
 * 🎮 Reactivity Controls
 * Interactive controls for testing the three-tier system
 */
defineComponent("reactivity-controls", {
  styles: {
    controls: `{
      background: var(--gray-1);
      border: 2px solid var(--gray-3);
      border-radius: var(--radius-3);
      padding: var(--size-4);
    }`,

    controlsTitle: `{
      font-size: var(--font-size-2);
      font-weight: var(--font-weight-6);
      color: var(--gray-8);
      margin-bottom: var(--size-3);
      text-align: center;
    }`,

    controlGroup: `{
      margin-bottom: var(--size-4);
    }`,

    controlGroupTitle: `{
      font-size: var(--font-size-1);
      font-weight: var(--font-weight-6);
      color: var(--gray-7);
      margin-bottom: var(--size-2);
    }`,

    controlButtons: `{
      display: flex;
      gap: var(--size-2);
      flex-wrap: wrap;
    }`,

    controlButton: `{
      padding: var(--size-2) var(--size-3);
      border: none;
      border-radius: var(--radius-2);
      cursor: pointer;
      font-size: var(--font-size-0);
      font-weight: var(--font-weight-5);
      transition: all 0.2s ease;
    }`,

    tier1Button: `{
      background: var(--blue-6);
      color: white;
    }`,

    tier2Button: `{
      background: var(--purple-6);
      color: white;
    }`,

    tier3Button: `{
      background: var(--orange-6);
      color: white;
    }`,
  },

  render: () => (
    <div class="controls">
      <h4 class="controlsTitle">🎮 Test All Three Tiers</h4>
      
      <div class="controlGroup">
        <div class="controlGroupTitle">Tier 1: CSS Properties</div>
        <div class="controlButtons">
          <button 
            class="controlButton tier1Button"
            onclick={setCSSProperty("demo-theme", "blue")}
          >
            Blue Theme
          </button>
          <button 
            class="controlButton tier1Button"
            onclick={setCSSProperty("demo-theme", "purple")}
          >
            Purple Theme
          </button>
          <button 
            class="controlButton tier1Button"
            onclick={toggleCSSProperty("demo-mode", "dark", "light")}
          >
            Toggle Mode
          </button>
        </div>
      </div>

      <div class="controlGroup">
        <div class="controlGroupTitle">Tier 2: Pub/Sub State</div>
        <div class="controlButtons">
          <button 
            class="controlButton tier2Button"
            onclick={publishState("dashboard", JSON.stringify({status: "active", timestamp: Date.now()}))}
          >
            Publish State
          </button>
          <button 
            class="controlButton tier2Button"
            onclick={createCartAction("add", JSON.stringify({id: "test", name: "Test Item", price: 99, quantity: 1}))}
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div class="controlGroup">
        <div class="controlGroupTitle">Tier 3: DOM Events</div>
        <div class="controlButtons">
          <button 
            class="controlButton tier3Button"
            onclick={dispatchEvent("user-action", JSON.stringify({type: "test", message: "DOM event test", timestamp: Date.now()}))}
          >
            Dispatch Event
          </button>
          <button 
            class="controlButton tier3Button"
            onclick={createNotification("Three-tier reactivity rocks! 🎉", "info", 3000)}
          >
            Show Notification
          </button>
        </div>
      </div>

      <small style="display: block; margin-top: var(--size-3); text-align: center; color: var(--gray-6);">
        🎯 Each tier optimized for specific use cases - choose the right tool for the job!
      </small>
    </div>
  ),
});
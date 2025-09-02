/** @jsx h */
// deno-lint-ignore-file verbatim-module-syntax
import {
  boolean,
  defineComponent,
  get,
  h,
  object,
  renderComponent,
  string,
} from "../index.ts";
import type { GeneratedApiMap } from "../index.ts";

// Import demo components to register them
import "./demo-counter.tsx";
import "./theme-controller.tsx";
import "./cart-demo.tsx";
import "./notification-demo.tsx";

/**
 * 🎯 funcwc Layout Component - Showcasing Library Patterns
 *
 * This component demonstrates all the key funcwc features:
 *
 * ✨ Function-Style Props: Zero duplication between props and render params
 *    - currentDemo: string("welcome") - auto-inferred with default
 *    - showBeta: boolean(false) - boolean with presence-based detection
 *    - branding: object({...}) - structured object with type inference
 *
 * 🎨 CSS-Only Format: Write CSS properties, get auto-generated class names
 *    - No CSS-in-JS overhead, just clean CSS with &:hover syntax
 *    - Auto-generated classes: container, header, nav, logo, etc.
 *
 * 🔧 Modern JSX Runtime: Direct HTML string rendering
 *    - h() function converts JSX to HTML strings
 *    - Zero client-side JavaScript dependencies
 *
 * 🔗 Unified API System: Server routes auto-generate HTMX client attributes
 *    - get("/", handler) → {...api.welcome()} with auto-generated HTMX
 *    - No manual HTMX attribute writing required
 *
 * ⚡ CSS Property Reactivity: Theme switching via CSS custom properties
 *    - --theme-bg, --theme-text variables for instant visual updates
 */
defineComponent("app-layout", {
  // 🔗 Unified API System - Server routes auto-generate HTMX attributes!
  api: {
    welcome: get("/demo/welcome", (_req) => {
      // Return partial HTML for HTMX to swap into the main content area
      const classes = {}; // In a real app, classes would be provided by the system
      const content = renderCurrentDemo("welcome", classes);
      return new Response(content, {
        headers: { "Content-Type": "text/html" },
      });
    }),
    basic: get("/demo/basic", (_req) => {
      // Return partial HTML for HTMX to swap into the main content area
      const classes = {}; // In a real app, classes would be provided by the system
      const content = renderCurrentDemo("basic", classes);
      return new Response(content, {
        headers: { "Content-Type": "text/html" },
      });
    }),
    reactive: get("/demo/reactive", (_req) => {
      // Return partial HTML for HTMX to swap into the main content area
      const classes = {}; // In a real app, classes would be provided by the system
      const content = renderCurrentDemo("reactive", classes);
      return new Response(content, {
        headers: { "Content-Type": "text/html" },
      });
    }),
  },

  // ✨ CSS-Only Format - Auto-generated class names!
  styles: {
    container: `{ 
      min-height: 100vh; 
      display: grid; 
      grid-template-rows: auto 1fr; 
      background: var(--theme-bg); 
      color: var(--theme-text); 
    }`,

    header:
      `{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: var(--size-3) var(--size-2); box-shadow: var(--shadow-2); }`,
    nav:
      `{ display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; } @media (max-width: 768px) { .nav { flex-wrap: wrap; gap: var(--size-2); } }`,
    navActions:
      `{ display: flex; align-items: center; gap: var(--size-2); } @media (max-width: 768px) { .nav-actions { flex-wrap: wrap; } }`,
    logo:
      `{ font-size: var(--font-size-4); font-weight: var(--font-weight-7); color: white; text-decoration: none; transition: opacity 0.2s ease; } .logo:hover { opacity: 0.9; }`,
    navMenu:
      `{ display: flex; gap: 2rem; list-style: none; margin: 0; padding: 0; } @media (max-width: 768px) { .nav-menu { flex-direction: column; width: 100%; gap: var(--size-1); } }`,
    navItem:
      `{ color: rgba(255,255,255,0.9); text-decoration: none; padding: var(--size-2) var(--size-3); border-radius: var(--radius-2); transition: all 0.2s ease; cursor: pointer; font-size: var(--font-size-1); } .nav-item:hover { background: rgba(255,255,255,0.1); color: white; } @media (max-width: 768px) { .nav-item { padding: var(--size-1) var(--size-2); font-size: var(--font-size-0); } }`,
    navItemActive: `{ background: rgba(255,255,255,0.2); color: white; }`,
    themeToggle:
      `{ background: rgba(255,255,255,0.2); border: none; color: white; padding: var(--size-2) var(--size-3); border-radius: var(--radius-2); cursor: pointer; transition: all 0.2s ease; font-size: var(--font-size-0); } .theme-toggle:hover { background: rgba(255,255,255,0.3); transform: scale(1.05); } @media (max-width: 768px) { .theme-toggle { padding: var(--size-1) var(--size-2); } }`,
    navCartBadge:
      `{ background: rgba(255,255,255,0.15); color: white; padding: var(--size-1) var(--size-2); border-radius: var(--radius-round); font-size: var(--font-size-0); display: inline-flex; align-items: center; gap: var(--size-1); }`,
    navCartCount: `{ font-weight: var(--font-weight-6); }`,

    main:
      `{ flex: 1; padding: 2rem; max-width: 1200px; margin: 0 auto; width: 100%; box-sizing: border-box; transition: opacity 0.3s ease-in-out; } @media (max-width: 768px) { .main { padding: var(--size-2); } }`,
    welcome:
      `{ width: 100%; padding: 3rem 0; margin: 0 auto; text-align: center; } @media (max-width: 768px) { .welcome { padding: var(--size-3) 0; } }`,
    title:
      `{ font-size: 2.5rem; font-weight: bold; color: var(--theme-accent); margin-bottom: 1rem; text-align: center; } @media (max-width: 768px) { .title { font-size: var(--font-size-5); } }`,
    subtitle:
      `{ font-size: 1.2rem; color: #666; margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto; text-align: center; } @media (max-width: 768px) { .subtitle { font-size: var(--font-size-2); } }`,
    features:
      `{ display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 3rem; } @media (max-width: 768px) { .features { gap: var(--size-3); grid-template-columns: 1fr; } }`,
    feature:
      `{ background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: left; border: 1px solid #eee; transition: transform 0.2s ease, box-shadow 0.2s ease; } .feature:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.15); } @media (max-width: 768px) { .feature { padding: var(--size-3); } }`,
    featureIcon:
      `{ font-size: 2rem; margin-bottom: 1rem; color: var(--theme-accent); } @media (max-width: 768px) { .feature-icon { font-size: var(--font-size-4); } }`,
    featureTitle:
      `{ font-size: 1.2rem; font-weight: bold; margin-bottom: 0.5rem; color: #333; } @media (max-width: 768px) { .feature-title { font-size: var(--font-size-2); } }`,
    featureDesc:
      `{ color: #666; line-height: 1.6; } @media (max-width: 768px) { .feature-desc { font-size: var(--font-size-0); } }`,
  },

  // ✨ Function-Style Props - Zero duplication!
  render: (
    {
      currentDemo = string("welcome"), // Auto-inferred string prop with default
      showBeta = boolean(false), // Boolean prop for beta features
      _branding = object({
        title: "funcwc",
        tagline: "SSR-First Component Library",
      }), // Object prop with structured default (prefixed with _ as unused)
    },
    api: GeneratedApiMap,
    classes?: Record<string, string>,
  ) => {
    const demo: string = typeof currentDemo === "string"
      ? currentDemo
      : "welcome";
    // Use the branding prop (simplified for demo - complex prop handling can be added later)
    const brand = { title: "funcwc", tagline: "SSR-First Component Library" };
    const isBeta = typeof showBeta === "boolean" ? showBeta : false;

    return (
      <div class={classes!.container}>
        <header class={classes!.header}>
          <nav class={classes!.nav}>
            <a href="#" class={classes!.logo}>
              {brand.title}
              {isBeta ? " β" : ""}
            </a>

            <ul class={classes!.navMenu}>
              <li>
                <a
                  class={`${classes!.navItem} ${
                    demo === "welcome" ? classes!.navItemActive : ""
                  }`}
                  {...api.welcome(undefined, {
                    target: "#content-area",
                    swap: "innerHTML",
                  })}
                  hx-on={`click: (function(){
                    const ul = this.closest('ul');
                    if (!ul) return;
                    ul.querySelectorAll('a').forEach(a => a.classList.remove('${
                    classes!.navItemActive
                  }'));
                    this.classList.add('${classes!.navItemActive}');
                  }).call(this)`}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  class={`${classes!.navItem} ${
                    demo === "basic" ? classes!.navItemActive : ""
                  }`}
                  {...api.basic(undefined, {
                    target: "#content-area",
                    swap: "innerHTML",
                  })}
                  hx-on={`click: (function(){
                    const ul = this.closest('ul');
                    if (!ul) return;
                    ul.querySelectorAll('a').forEach(a => a.classList.remove('${
                    classes!.navItemActive
                  }'));
                    this.classList.add('${classes!.navItemActive}');
                  }).call(this)`}
                >
                  Basic Components
                </a>
              </li>
              <li>
                <a
                  class={`${classes!.navItem} ${
                    demo === "reactive" ? classes!.navItemActive : ""
                  }`}
                  {...api.reactive(undefined, {
                    target: "#content-area",
                    swap: "innerHTML",
                  })}
                  hx-on={`click: (function(){
                    const ul = this.closest('ul');
                    if (!ul) return;
                    ul.querySelectorAll('a').forEach(a => a.classList.remove('${
                    classes!.navItemActive
                  }'));
                    this.classList.add('${classes!.navItemActive}');
                  }).call(this)`}
                >
                  Reactivity
                </a>
              </li>
            </ul>

            <div class={classes!.navActions}>
              <div
                class={`${classes!.navCartBadge} cart-badge-reactive`}
                data-cart-id="default"
              >
                🛒{" "}
                <span class={`${classes!.navCartCount} cart-count`}>
                  0 items
                </span>
                <span class="cart-total">$0.00</span>
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                  (function(){
                    var el = document.currentScript && document.currentScript.parentElement;
                    if (!el || el.getAttribute('data-cart-subscribed')) return;
                    el.setAttribute('data-cart-subscribed', 'true');
                    if (!window.funcwcState) return;
                    window.funcwcState.subscribe('cart', function(cartData){
                      try {
                        var countEl = el.querySelector('.cart-count');
                        var totalEl = el.querySelector('.cart-total');
                        if (countEl) {
                          var c = (cartData && cartData.count) || 0;
                          countEl.textContent = c + ' items';
                        }
                        if (totalEl) {
                          var t = Number((cartData && cartData.total) || 0);
                          totalEl.textContent = \"$\" + t.toFixed(2);
                        }
                      } catch (e) { console.warn('nav cart-badge subscribe failed', e); }
                    }, el);
                  })();
                `,
                  }}
                >
                </script>
              </div>
              <button
                type="button"
                class={classes!.themeToggle}
                onclick="document.documentElement.style.setProperty('--theme-bg', document.documentElement.style.getPropertyValue('--theme-bg') === 'white' ? '#1a1a1a' : 'white'); document.documentElement.style.setProperty('--theme-text', document.documentElement.style.getPropertyValue('--theme-text') === '#333' ? '#fff' : '#333');"
              >
                🌓 Theme
              </button>
            </div>
          </nav>
        </header>

        <main class={classes!.main} id="content-area">
          {renderCurrentDemo(demo, classes, { branding: brand })}
        </main>

        {/* Scripts moved into components and server head injection */}
      </div>
    );
  },
});

// Render different demo content based on current demo
export function renderCurrentDemo(
  demo: string,
  classes: Record<string, string> | undefined,
  _props: Record<string, unknown> = {},
): string {
  const c = classes || {};

  switch (demo) {
    case "basic":
      return (
        <div class={c.welcome}>
          <h2 class={c.title}>🧩 Basic Components Demo</h2>
          <p class={c.subtitle}>
            Explore function-style props, CSS-only format, and auto-generated
            class names
          </p>

          <div style="margin: 2rem 0; padding: 2rem; background: #f8f9fa; border-radius: 12px; border-left: 4px solid #007bff;">
            <h3 style="margin-top: 0; color: #007bff;">
              🎯 Interactive Demo: Function-Style Props
            </h3>
            <p style="margin-bottom: 2rem; color: #666;">
              These counters demonstrate function-style props with smart type
              helpers. Each counter shows different prop configurations - notice
              zero duplication between prop definitions and usage!
            </p>

            <div style="display: flex; gap: 2rem; flex-wrap: wrap; justify-content: center;">
              {renderComponent("demo-counter", {
                "initial-count": "5",
                "step": "1",
                "max-value": "10",
                "label": "Basic Counter",
              })}

              {renderComponent("demo-counter", {
                "initial-count": "0",
                "step": "2",
                "max-value": "20",
                "min-value": "-5",
                "theme": "green",
                "label": "Step by 2",
              })}

              {renderComponent("demo-counter", {
                "initial-count": "50",
                "step": "10",
                "max-value": "100",
                "show-controls": "true",
                "theme": "purple",
                "label": "Big Steps",
              })}
            </div>

            <div style="margin-top: 2rem; padding: 1rem; background: white; border-radius: 8px;">
              <p>
                <strong>Component Definition:</strong>
              </p>
              <code style="color: #007bff; font-size: 0.875rem;">
                render: (&#123; initialCount = number(0), step = number(1),
                maxValue = number(10), label = string("Counter") &#125;, api,
                classes) =&gt; &#123; /* JSX */ &#125;
              </code>
            </div>
          </div>

          <div class={c.features}>
            <div class={c.feature}>
              <div class={c.featureIcon}>✨</div>
              <h3 class={c.featureTitle}>Function-Style Props</h3>
              <p class={c.featureDesc}>
                Define props directly in render parameters with zero
                duplication. Types are automatically inferred from smart helpers
                like number(), string(), boolean().
              </p>
            </div>
            <div class={c.feature}>
              <div class={c.featureIcon}>🎨</div>
              <h3 class={c.featureTitle}>CSS-Only Format</h3>
              <p class={c.featureDesc}>
                Write CSS properties, get auto-generated class names. No
                CSS-in-JS overhead. Classes are scoped and collision-free.
              </p>
            </div>
            <div class={c.feature}>
              <div class={c.featureIcon}>🔧</div>
              <h3 class={c.featureTitle}>Smart Type Helpers</h3>
              <p class={c.featureDesc}>
                string(), number(), boolean(), array(), object() helpers with
                defaults and validation. Full TypeScript inference throughout.
              </p>
            </div>
          </div>
        </div>
      );

    case "reactive":
      return (
        <div class={c.welcome}>
          <h2 class={c.title}>⚡ Hybrid Reactivity System</h2>
          <p class={c.subtitle}>
            Interactive demos of funcwc's three-tier reactivity architecture
          </p>

          <div style="margin: 2rem 0; padding: 2rem; background: #f8f9fa; border-radius: 12px; border-left: 4px solid #6f42c1;">
            <h3 style="margin-top: 0; color: #6f42c1;">
              🚀 Interactive Reactivity Demos
            </h3>
            <p style="margin-bottom: 2rem; color: #666;">
              Explore funcwc's revolutionary three-tier hybrid reactivity
              system. Each tier is optimized for different use cases and
              performance characteristics.
            </p>

            {/* Tier 1: CSS Property Reactivity */}
            <div style="margin: 2rem 0;">
              {renderComponent("theme-controller", { "current-theme": "blue" })}
            </div>

            {/* Tier 2: Pub/Sub State Manager */}
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; margin: 2rem 0;">
              {renderComponent("cart-manager", { "store-id": "demo-store" })}
              {renderComponent("cart-badge", { "cart-id": "default" })}
            </div>

            {/* Tier 3: DOM Events */}
            <div style="margin: 2rem 0;">
              {renderComponent("notification-trigger", {
                "channel-id": "notifications",
              })}
            </div>

            <div style="margin-top: 2rem; padding: 1rem; background: white; border-radius: 8px;">
              <h4 style="margin-top: 0; color: #6f42c1;">
                🎯 Architecture Overview
              </h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">
                <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                  <strong style="color: #6f42c1;">⚡ CSS Properties</strong>
                  <p style="margin: 0.5rem 0 0; font-size: 0.875rem; color: #666;">
                    Zero JS overhead. Instant visual updates. Perfect for themes
                    and styling coordination.
                  </p>
                </div>
                <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                  <strong style="color: #6f42c1;">📡 Pub/Sub State</strong>
                  <p style="margin: 0.5rem 0 0; font-size: 0.875rem; color: #666;">
                    Business logic state. Topic-based subscriptions. Automatic
                    cleanup and persistence.
                  </p>
                </div>
                <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                  <strong style="color: #6f42c1;">🔄 DOM Events</strong>
                  <p style="margin: 0.5rem 0 0; font-size: 0.875rem; color: #666;">
                    Component communication. Structured payloads. Native browser
                    event optimization.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class={c.features}>
            <div class={c.feature}>
              <div class={c.featureIcon}>⚡</div>
              <h3 class={c.featureTitle}>Optimal Performance</h3>
              <p class={c.featureDesc}>
                Each reactivity tier is optimized for its specific use case,
                delivering exceptional performance with minimal bundle size
                (~2KB total).
              </p>
            </div>
            <div class={c.feature}>
              <div class={c.featureIcon}>🔧</div>
              <h3 class={c.featureTitle}>Zero Configuration</h3>
              <p class={c.featureDesc}>
                No complex setup or boilerplate. Components automatically get
                reactive capabilities through simple, declarative APIs.
              </p>
            </div>
            <div class={c.feature}>
              <div class={c.featureIcon}>🌊</div>
              <h3 class={c.featureTitle}>DOM-Native</h3>
              <p class={c.featureDesc}>
                Built on web standards. No virtual DOM. The real DOM is your
                single source of truth for maximum compatibility.
              </p>
            </div>
          </div>

          {/* Notification display component */}
          {renderComponent("notification-display", {
            "max-notifications": "3",
          })}
        </div>
      );

    default: { // welcome
      const brand = { title: "funcwc", tagline: "SSR-First Component Library" };
      return (
        <div class={c.welcome}>
          <h1 class={c.title}>Welcome to {brand.title}</h1>
          <p class={c.subtitle}>
            The revolutionary SSR-first component library with zero client
            dependencies, function-style props, and a three-tier hybrid
            reactivity system.
          </p>
          <div class={c.features}>
            <div class={c.feature}>
              <div class={c.featureIcon}>🚀</div>
              <h3 class={c.featureTitle}>SSR-First</h3>
              <p class={c.featureDesc}>
                Components render to HTML strings on the server with zero
                client-side JavaScript required.
              </p>
            </div>
            <div class={c.feature}>
              <div class={c.featureIcon}>✨</div>
              <h3 class={c.featureTitle}>Function-Style Props</h3>
              <p class={c.featureDesc}>
                Zero duplication between prop definitions and render parameters.
                Auto-generated type inference.
              </p>
            </div>
            <div class={c.feature}>
              <div class={c.featureIcon}>🎨</div>
              <h3 class={c.featureTitle}>CSS-Only Format</h3>
              <p class={c.featureDesc}>
                Auto-generated class names from CSS properties. No CSS-in-JS
                overhead.
              </p>
            </div>
            <div class={c.feature}>
              <div class={c.featureIcon}>⚡</div>
              <h3 class={c.featureTitle}>Hybrid Reactivity</h3>
              <p class={c.featureDesc}>
                Three-tier system: CSS properties, pub/sub state, and DOM events
                for optimal performance.
              </p>
            </div>
            <div class={c.feature}>
              <div class={c.featureIcon}>🔗</div>
              <h3 class={c.featureTitle}>Unified API</h3>
              <p class={c.featureDesc}>
                Server route definitions automatically generate HTMX client
                attributes.
              </p>
            </div>
            <div class={c.feature}>
              <div class={c.featureIcon}>🛡️</div>
              <h3 class={c.featureTitle}>Type Safe</h3>
              <p class={c.featureDesc}>
                Full TypeScript inference throughout the system with zero
                runtime type checks.
              </p>
            </div>
          </div>
        </div>
      );
    }
  }
}

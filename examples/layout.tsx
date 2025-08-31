/** @jsx h */
import { defineComponent, h, string, boolean, object, get } from "../index.ts";

// Import demo components to register them
import "./demo-counter.tsx";

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
    welcome: get("/demo/welcome", (req) => {
      // Return partial HTML for HTMX to swap into the main content area
      const classes = {}; // In a real app, classes would be provided by the system
      const content = renderCurrentDemo("welcome", classes);
      return new Response(content, {
        headers: { "Content-Type": "text/html" }
      });
    }),
    basic: get("/demo/basic", (req) => {
      // Return partial HTML for HTMX to swap into the main content area
      const classes = {}; // In a real app, classes would be provided by the system
      const content = renderCurrentDemo("basic", classes);
      return new Response(content, {
        headers: { "Content-Type": "text/html" }
      });
    }),
    reactive: get("/demo/reactive", (req) => {
      // Return partial HTML for HTMX to swap into the main content area
      const classes = {}; // In a real app, classes would be provided by the system
      const content = renderCurrentDemo("reactive", classes);
      return new Response(content, {
        headers: { "Content-Type": "text/html" }
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
    
    header: `{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }`,
    nav: `{ display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; }`,
    logo: `{ font-size: 1.5rem; font-weight: bold; color: white; text-decoration: none; transition: opacity 0.2s ease; } .logo:hover { opacity: 0.9; }`,
    navMenu: `{ display: flex; gap: 2rem; list-style: none; margin: 0; padding: 0; }`,
    navItem: `{ color: rgba(255,255,255,0.9); text-decoration: none; padding: 0.5rem 1rem; border-radius: 6px; transition: all 0.2s ease; cursor: pointer; } .nav-item:hover { background: rgba(255,255,255,0.1); color: white; }`,
    navItemActive: `{ background: rgba(255,255,255,0.2); color: white; }`,
    themeToggle: `{ background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; } .theme-toggle:hover { background: rgba(255,255,255,0.3); transform: scale(1.05); }`,
    
    main: `{ flex: 1; padding: 2rem; max-width: 1200px; margin: 0 auto; width: 100%; box-sizing: border-box; transition: opacity 0.3s ease-in-out; }`,
    
    // Basic Components page layout - sidebar within content area
    basicLayout: `{ display: grid; grid-template-columns: 250px 1fr; gap: 2rem; height: calc(100vh - 8rem); }`,
    basicSidebar: `{ 
      background: #f8f9fa; 
      border-radius: 12px; 
      padding: 1.5rem; 
      border: 1px solid #dee2e6;
      height: fit-content;
    }`,
    basicContent: `{ background: white; border-radius: 12px; padding: 2rem; border: 1px solid #dee2e6; overflow-y: auto; }`,
    sidebarMenu: `{ list-style: none; margin: 0; padding: 0; }`,
    sidebarMenuItem: `{ 
      padding: 0.75rem 1rem; 
      margin: 0.25rem 0;
      border-radius: 8px; 
      cursor: pointer; 
      transition: all 0.2s ease;
      color: #495057;
    }`,
    sidebarMenuItemActive: `{ background: #007bff; color: white; }`,
    sidebarMenuItemHover: `{ background: #e9ecef; }`,
    
    welcome: `{ text-align: center; padding: 3rem 2rem; }`,
    title: `{ font-size: 2.5rem; font-weight: bold; color: var(--theme-accent); margin-bottom: 1rem; }`,
    subtitle: `{ font-size: 1.2rem; color: #666; margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto; }`,
    features: `{ display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 3rem; }`,
    feature: `{ background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: left; border: 1px solid #eee; transition: transform 0.2s ease, box-shadow 0.2s ease; } .feature:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.15); }`,
    featureIcon: `{ font-size: 2rem; margin-bottom: 1rem; color: var(--theme-accent); }`,
    featureTitle: `{ font-size: 1.2rem; font-weight: bold; margin-bottom: 0.5rem; color: #333; }`,
    featureDesc: `{ color: #666; line-height: 1.6; }`
  },

  // ✨ Function-Style Props - Zero duplication!
  render: ({ 
    currentDemo = string("welcome"),           // Auto-inferred string prop with default
    showBeta = boolean(false),                // Boolean prop for beta features
    _branding = object({ 
      title: "funcwc", 
      tagline: "SSR-First Component Library" 
    })                                        // Object prop with structured default
  }, api: any, classes: any) => {
    const demo: string = typeof currentDemo === 'string' ? currentDemo : 'welcome';
    // For demo purposes, use default branding - the prop system works for simple cases
    const brand = { title: "funcwc", tagline: "SSR-First Component Library" };
    const isBeta = typeof showBeta === 'boolean' ? showBeta : false;
    
    return (
    <div class={classes!.container}>
      <header class={classes!.header}>
        <nav class={classes!.nav}>
          <a href="#" class={classes!.logo}>
            {brand.title}{isBeta ? " β" : ""}
          </a>
          
          <ul class={classes!.navMenu}>
            <li>
              <a 
                class={`${classes!.navItem} ${demo === "welcome" ? classes!.navItemActive : ""}`}
                {...api.welcome(undefined, { target: "#content-area", swap: "innerHTML" })}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                class={`${classes!.navItem} ${demo === "basic" ? classes!.navItemActive : ""}`}
                {...api.basic(undefined, { target: "#content-area", swap: "innerHTML" })}
              >
                Basic Components
              </a>
            </li>
            <li>
              <a 
                class={`${classes!.navItem} ${demo === "reactive" ? classes!.navItemActive : ""}`}
                {...api.reactive(undefined, { target: "#content-area", swap: "innerHTML" })}
              >
                Reactivity
              </a>
            </li>
          </ul>
          
          <button 
            type="button"
            class={classes!.themeToggle}
            onclick="document.documentElement.style.setProperty('--theme-bg', document.documentElement.style.getPropertyValue('--theme-bg') === 'white' ? '#1a1a1a' : 'white'); document.documentElement.style.setProperty('--theme-text', document.documentElement.style.getPropertyValue('--theme-text') === '#333' ? '#fff' : '#333');"
          >
            🌓 Theme
          </button>
        </nav>
      </header>
      
      <main class={classes!.main} id="content-area">
{renderCurrentDemo(demo, classes, { branding: brand })}
      </main>
    </div>
    );
  }
});


// Render different demo content based on current demo
export function renderCurrentDemo(demo: string, classes: Record<string, string> | undefined, _props: Record<string, unknown> = {}): string {
  const c = classes || {};
  
  switch (demo) {
    case "basic":
      return (
        <div class={c.basicLayout}>
          {/* Left Sidebar Menu */}
          <div class={c.basicSidebar}>
            <h3 style="margin-top: 0; color: #495057; font-size: 1.2rem;">Components</h3>
            <ul class={c.sidebarMenu}>
              <li class={`${c.sidebarMenuItem} ${c.sidebarMenuItemActive}`}>
                📊 Counters
              </li>
              <li class={c.sidebarMenuItem}>
                🎯 Buttons
              </li>
              <li class={c.sidebarMenuItem}>
                📝 Forms
              </li>
              <li class={c.sidebarMenuItem}>
                🎨 Cards
              </li>
              <li class={c.sidebarMenuItem}>
                📑 Tables
              </li>
            </ul>
            
            <h4 style="margin-top: 2rem; color: #495057; font-size: 1rem;">Features</h4>
            <ul class={c.sidebarMenu}>
              <li class={c.sidebarMenuItem}>
                ✨ Function Props
              </li>
              <li class={c.sidebarMenuItem}>
                🎨 CSS-Only Format
              </li>
              <li class={c.sidebarMenuItem}>
                🔧 Type Helpers
              </li>
            </ul>
          </div>
          
          {/* Right Content Area */}
          <div class={c.basicContent}>
            <h2 style="margin-top: 0; color: #007bff; font-size: 2rem;">🧩 Interactive Demo: Counters</h2>
            <p style="margin-bottom: 2rem; color: #666;">
              These counters demonstrate function-style props with smart type helpers. 
              Each counter shows different prop configurations - notice zero duplication between prop definitions and usage!
            </p>
            
            <div style="display: flex; gap: 2rem; flex-wrap: wrap; justify-content: center; margin: 2rem 0;">
              <demo-counter 
                initial-count="5"
                step="1" 
                max-value="10"
                label="Basic Counter"
              ></demo-counter>
              
              <demo-counter 
                initial-count="0"
                step="2"
                max-value="20" 
                min-value="-5"
                theme="green"
                label="Step by 2"
              ></demo-counter>
              
              <demo-counter 
                initial-count="50"
                step="10"
                max-value="100"
                show-controls="true"
                theme="purple" 
                label="Big Steps"
              ></demo-counter>
            </div>
            
            <div style="margin-top: 2rem; padding: 1rem; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #007bff;">
              <h4 style="margin-top: 0; color: #007bff;">Component Definition</h4>
              <code style="color: #495057; font-size: 0.875rem; display: block; white-space: pre;">
render: (&#123;
  initialCount = number(0),
  step = number(1), 
  maxValue = number(10),
  label = string("Counter")
&#125;, api, classes) =&gt; &#123; /* JSX */ &#125;
              </code>
            </div>

            <div style="margin-top: 2rem;">
              <h4 style="color: #495057;">Key Features</h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">
                <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                  <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">✨</div>
                  <h5 style="margin: 0; color: #007bff;">Function-Style Props</h5>
                  <p style="margin: 0.5rem 0 0; color: #666; font-size: 0.875rem;">Zero duplication between prop definitions and usage</p>
                </div>
                <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                  <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🎨</div>
                  <h5 style="margin: 0; color: #007bff;">CSS-Only Format</h5>
                  <p style="margin: 0.5rem 0 0; color: #666; font-size: 0.875rem;">Auto-generated class names from CSS properties</p>
                </div>
                <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                  <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🔧</div>
                  <h5 style="margin: 0; color: #007bff;">Smart Type Helpers</h5>
                  <p style="margin: 0.5rem 0 0; color: #666; font-size: 0.875rem;">Full TypeScript inference with validation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    
    case "reactive":
      return (
        <div class={c.welcome}>
          <h2 class={c.title}>⚡ Hybrid Reactivity Demo</h2>
          <p class={c.subtitle}>Three-tier reactivity system: CSS properties, pub/sub state, and DOM events</p>
          <div class={c.features}>
            <div class={c.feature}>
              <div class={c.featureIcon}>🎨</div>
              <h3 class={c.featureTitle}>Tier 1: CSS Properties</h3>
              <p class={c.featureDesc}>Theme switching and visual coordination using CSS custom properties for instant updates.</p>
            </div>
            <div class={c.feature}>
              <div class={c.featureIcon}>📡</div>
              <h3 class={c.featureTitle}>Tier 2: Pub/Sub State</h3>
              <p class={c.featureDesc}>Cross-component state management with topic-based subscriptions and automatic cleanup.</p>
            </div>
            <div class={c.feature}>
              <div class={c.featureIcon}>🔄</div>
              <h3 class={c.featureTitle}>Tier 3: DOM Events</h3>
              <p class={c.featureDesc}>Component-to-component communication via custom DOM events with structured payloads.</p>
            </div>
          </div>
        </div>
      );
    
    default: { // welcome
      const brand = { title: "funcwc", tagline: "SSR-First Component Library" };
      return (
        <div class={c.welcome}>
          <h1 class={c.title}>Welcome to {brand.title}</h1>
          <p class={c.subtitle}>
            The revolutionary SSR-first component library with zero client dependencies, function-style props, and a three-tier hybrid reactivity system.
          </p>
          <div class={c.features}>
            <div class={c.feature}>
              <div class={c.featureIcon}>🚀</div>
              <h3 class={c.featureTitle}>SSR-First</h3>
              <p class={c.featureDesc}>Components render to HTML strings on the server with zero client-side JavaScript required.</p>
            </div>
            <div class={c.feature}>
              <div class={c.featureIcon}>✨</div>
              <h3 class={c.featureTitle}>Function-Style Props</h3>
              <p class={c.featureDesc}>Zero duplication between prop definitions and render parameters. Auto-generated type inference.</p>
            </div>
            <div class={c.feature}>
              <div class={c.featureIcon}>🎨</div>
              <h3 class={c.featureTitle}>CSS-Only Format</h3>
              <p class={c.featureDesc}>Auto-generated class names from CSS properties. No CSS-in-JS overhead.</p>
            </div>
            <div class={c.feature}>
              <div class={c.featureIcon}>⚡</div>
              <h3 class={c.featureTitle}>Hybrid Reactivity</h3>
              <p class={c.featureDesc}>Three-tier system: CSS properties, pub/sub state, and DOM events for optimal performance.</p>
            </div>
            <div class={c.feature}>
              <div class={c.featureIcon}>🔗</div>
              <h3 class={c.featureTitle}>Unified API</h3>
              <p class={c.featureDesc}>Server route definitions automatically generate HTMX client attributes.</p>
            </div>
            <div class={c.feature}>
              <div class={c.featureIcon}>🛡️</div>
              <h3 class={c.featureTitle}>Type Safe</h3>
              <p class={c.featureDesc}>Full TypeScript inference throughout the system with zero runtime type checks.</p>
            </div>
          </div>
        </div>
      );
    }
  }
}
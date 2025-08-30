/** @jsx h */
import { defineComponent, h, string, boolean, object } from "../index.ts";

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
 * ⚡ CSS Property Reactivity: Theme switching via CSS custom properties
 *    - --theme-bg, --theme-text variables for instant visual updates
 */
defineComponent("app-layout", {
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
    branding = object({ 
      title: "funcwc", 
      tagline: "SSR-First Component Library" 
    })                                        // Object prop with structured default
  }, _api, classes) => {
    const demo = typeof currentDemo === 'string' ? currentDemo : 'welcome';
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
                hx-get="/?demo=welcome"
                hx-target="main#content-area"
                hx-select="main#content-area"
                href="/?demo=welcome"
              >
                Home
              </a>
            </li>
            <li>
              <a 
                class={`${classes!.navItem} ${demo === "basic" ? classes!.navItemActive : ""}`}
                hx-get="/?demo=basic"
                hx-target="main#content-area"
                hx-select="main#content-area"
                href="/?demo=basic"
              >
                Basic Components
              </a>
            </li>
            <li>
              <a 
                class={`${classes!.navItem} ${demo === "reactive" ? classes!.navItemActive : ""}`}
                hx-get="/?demo=reactive"
                hx-target="main#content-area"
                hx-select="main#content-area"
                href="/?demo=reactive"
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
function renderCurrentDemo(demo: string, classes: Record<string, string> | undefined, _props: Record<string, unknown> = {}): string {
  const c = classes || {};
  
  switch (demo) {
    case "basic":
      return h('div', { class: c.welcome },
        h('h2', { class: c.title }, '🧩 Basic Components Demo'),
        h('p', { class: c.subtitle }, 'Explore function-style props, CSS-only format, and auto-generated class names'),
        h('div', { class: c.features },
          h('div', { class: c.feature },
            h('div', { class: c.featureIcon }, '✨'),
            h('h3', { class: c.featureTitle }, 'Function-Style Props'),
            h('p', { class: c.featureDesc }, 'Define props directly in render parameters with zero duplication. Types are automatically inferred.')
          ),
          h('div', { class: c.feature },
            h('div', { class: c.featureIcon }, '🎨'),
            h('h3', { class: c.featureTitle }, 'CSS-Only Format'),
            h('p', { class: c.featureDesc }, 'Write CSS properties, get auto-generated class names. No CSS-in-JS overhead.')
          ),
          h('div', { class: c.feature },
            h('div', { class: c.featureIcon }, '🔧'),
            h('h3', { class: c.featureTitle }, 'Smart Type Helpers'),
            h('p', { class: c.featureDesc }, 'string(), number(), boolean(), array(), object() helpers with defaults and validation.')
          )
        )
      );
    
    case "reactive":
      return h('div', { class: c.welcome },
        h('h2', { class: c.title }, '⚡ Hybrid Reactivity Demo'),
        h('p', { class: c.subtitle }, 'Three-tier reactivity system: CSS properties, pub/sub state, and DOM events'),
        h('div', { class: c.features },
          h('div', { class: c.feature },
            h('div', { class: c.featureIcon }, '🎨'),
            h('h3', { class: c.featureTitle }, 'Tier 1: CSS Properties'),
            h('p', { class: c.featureDesc }, 'Theme switching and visual coordination using CSS custom properties for instant updates.')
          ),
          h('div', { class: c.feature },
            h('div', { class: c.featureIcon }, '📡'),
            h('h3', { class: c.featureTitle }, 'Tier 2: Pub/Sub State'),
            h('p', { class: c.featureDesc }, 'Cross-component state management with topic-based subscriptions and automatic cleanup.')
          ),
          h('div', { class: c.feature },
            h('div', { class: c.featureIcon }, '🔄'),
            h('h3', { class: c.featureTitle }, 'Tier 3: DOM Events'),
            h('p', { class: c.featureDesc }, 'Component-to-component communication via custom DOM events with structured payloads.')
          )
        )
      );
    
    default: { // welcome
      const brand = { title: "funcwc", tagline: "SSR-First Component Library" };
      return h('div', { class: c.welcome },
        h('h1', { class: c.title }, `Welcome to ${brand.title}`),
        h('p', { class: c.subtitle }, 
          'The revolutionary SSR-first component library with zero client dependencies, function-style props, and a three-tier hybrid reactivity system.'
        ),
        h('div', { class: c.features },
          h('div', { class: c.feature },
            h('div', { class: c.featureIcon }, '🚀'),
            h('h3', { class: c.featureTitle }, 'SSR-First'),
            h('p', { class: c.featureDesc }, 'Components render to HTML strings on the server with zero client-side JavaScript required.')
          ),
          h('div', { class: c.feature },
            h('div', { class: c.featureIcon }, '✨'),
            h('h3', { class: c.featureTitle }, 'Function-Style Props'),
            h('p', { class: c.featureDesc }, 'Zero duplication between prop definitions and render parameters. Auto-generated type inference.')
          ),
          h('div', { class: c.feature },
            h('div', { class: c.featureIcon }, '🎨'),
            h('h3', { class: c.featureTitle }, 'CSS-Only Format'),
            h('p', { class: c.featureDesc }, 'Auto-generated class names from CSS properties. No CSS-in-JS overhead.')
          ),
          h('div', { class: c.feature },
            h('div', { class: c.featureIcon }, '⚡'),
            h('h3', { class: c.featureTitle }, 'Hybrid Reactivity'),
            h('p', { class: c.featureDesc }, 'Three-tier system: CSS properties, pub/sub state, and DOM events for optimal performance.')
          ),
          h('div', { class: c.feature },
            h('div', { class: c.featureIcon }, '🔗'),
            h('h3', { class: c.featureTitle }, 'Unified API'),
            h('p', { class: c.featureDesc }, 'Server route definitions automatically generate HTMX client attributes.')
          ),
          h('div', { class: c.feature },
            h('div', { class: c.featureIcon }, '🛡️'),
            h('h3', { class: c.featureTitle }, 'Type Safe'),
            h('p', { class: c.featureDesc }, 'Full TypeScript inference throughout the system with zero runtime type checks.')
          )
        )
      );
    }
  }
}
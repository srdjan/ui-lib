/** @jsx h */
import { defineComponent, h, string } from "../index.ts";

defineComponent("app-layout", {
  styles: {
    // Layout container
    container: `{
      min-height: 100vh;
      display: grid;
      grid-template-rows: auto 1fr;
      background: var(--theme-bg);
      color: var(--theme-text);
    }`,
    
    // Header/Navbar
    header: `{
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }`,
    
    nav: `{
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }`,
    
    logo: `{
      font-size: 1.5rem;
      font-weight: bold;
      color: white;
      text-decoration: none;
    }`,
    
    navMenu: `{
      display: flex;
      gap: 2rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }`,
    
    navItem: `{
      color: rgba(255,255,255,0.9);
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      transition: all 0.2s ease;
      cursor: pointer;
    }`,
    
    navItemActive: `{
      background: rgba(255,255,255,0.2);
      color: white;
    }`,
    
    themeToggle: `{
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s ease;
    }`,
    
    // Main content area
    main: `{
      flex: 1;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }`,
    
    // Welcome content
    welcome: `{
      text-align: center;
      padding: 3rem 2rem;
    }`,
    
    title: `{
      font-size: 2.5rem;
      font-weight: bold;
      color: var(--theme-accent);
      margin-bottom: 1rem;
    }`,
    
    subtitle: `{
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 2rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }`,
    
    features: `{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-top: 3rem;
    }`,
    
    feature: `{
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      text-align: left;
      border: 1px solid #eee;
    }`,
    
    featureIcon: `{
      font-size: 2rem;
      margin-bottom: 1rem;
      color: var(--theme-accent);
    }`,
    
    featureTitle: `{
      font-size: 1.2rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
      color: #333;
    }`,
    
    featureDesc: `{
      color: #666;
      line-height: 1.6;
    }`
  },

  render: ({ 
    currentDemo = string("welcome") 
  }, _api, classes) => {
    const demo = typeof currentDemo === 'string' ? currentDemo : 'welcome';
    return (
    <div class={classes!.container}>
      <header class={classes!.header}>
        <nav class={classes!.nav}>
          <a href="#" class={classes!.logo}>
            funcwc
          </a>
          
          <ul class={classes!.navMenu}>
            <li>
              <a 
                class={`${classes!.navItem} ${demo === "welcome" ? classes!.navItemActive : ""}`}
                onclick="console.log('Welcome demo clicked')"
              >
                Home
              </a>
            </li>
            <li>
              <a 
                class={`${classes!.navItem} ${demo === "basic" ? classes!.navItemActive : ""}`}
                onclick="console.log('Basic demo clicked')"
              >
                Basic Components
              </a>
            </li>
            <li>
              <a 
                class={`${classes!.navItem} ${demo === "reactive" ? classes!.navItemActive : ""}`}
                onclick="console.log('Reactive demo clicked')"
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
{renderCurrentDemo(demo, classes)}
      </main>
    </div>
    );
  }
});


// Render different demo content based on current demo
function renderCurrentDemo(demo: string, classes: Record<string, string> | undefined): string {
  const c = classes || {};
  
  switch (demo) {
    case "basic":
      return h('div', { class: c.welcome },
        h('h2', { class: c.title }, 'Basic Components Demo'),
        h('p', { class: c.subtitle }, 'Coming soon - Function-style props and CSS-only format examples')
      );
    
    case "reactive":
      return h('div', { class: c.welcome },
        h('h2', { class: c.title }, 'Reactivity Demo'),
        h('p', { class: c.subtitle }, 'Coming soon - CSS properties, state management, and DOM events')
      );
    
    default: // welcome
      return h('div', { class: c.welcome },
        h('h1', { class: c.title }, 'Welcome to funcwc'),
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
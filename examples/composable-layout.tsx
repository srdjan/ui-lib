/** @jsx h */
// Example of the new composable layout system
import { h, defineComponent, string } from "../index.ts";

// Import layout components to register them
import "../lib/layout/index.ts";

/**
 * 🎯 Composable Layout Example
 * 
 * Demonstrates the new composable layout system where components
 * can be nested declaratively:
 * 
 * <app-layout>
 *   <navbar>
 *     <navitem>Home</navitem>
 *     <navitem>Basic</navitem>
 *     <navitem>Reactive</navitem>
 *   </navbar>
 * </app-layout>
 */

// Create a demo component that renders the composable layout
defineComponent("composable-layout-demo", {
  autoProps: true,
  
  styles: {
    demo: `{
      padding: var(--size-4);
      margin: var(--size-4) 0;
      border: 2px solid var(--blue-5);
      border-radius: var(--radius-3);
      background: var(--surface-1);
    }`,
    
    title: `{
      color: var(--blue-7);
      font-size: var(--font-size-3);
      font-weight: var(--font-weight-7);
      margin-bottom: var(--size-3);
      text-align: center;
    }`,
    
    description: `{
      color: var(--text-muted);
      margin-bottom: var(--size-4);
      text-align: center;
    }`,
    
    codeBlock: `{
      background: var(--gray-1);
      padding: var(--size-3);
      border-radius: var(--radius-2);
      font-family: var(--font-mono);
      font-size: var(--font-size-0);
      color: var(--gray-9);
      margin: var(--size-3) 0;
      overflow-x: auto;
      white-space: pre;
    }`,
  },
  
  render: (
    {
      theme = string("system"), // Theme for the layout
    },
    _api,
    classes,
  ) => {
    const layoutTheme = (typeof theme === "string" ? theme : "system") as "light" | "dark" | "system" | "auto";
    
    return (
      <div class={classes!.demo}>
        <h2 class={classes!.title}>🎯 Composable Layout System</h2>
        <p class={classes!.description}>
          The new funcwc layout components support declarative composition!
        </p>
        
        <div class={classes!.codeBlock}>
{`<app-layout theme="system" responsive>
  <navbar position="top" style="primary" sticky>
    <navitem href="/" active>Home</navitem>
    <navitem href="/basic">Basic Components</navitem>
    <navitem href="/reactive" badge="new">Reactivity</navitem>
    <navitem href="/docs">Documentation</navitem>
  </navbar>
  
  <main-content padding="2rem" max-width="1200px" centered>
    <h1>Welcome to funcwc!</h1>
    <p>Your app content goes here...</p>
  </main-content>
  
  <sidebar position="left" mode="overlay" collapsible>
    <nav>
      <h3>Quick Links</h3>
      <ul>
        <li><a href="/getting-started">Getting Started</a></li>
        <li><a href="/examples">Examples</a></li>
        <li><a href="/api-reference">API Reference</a></li>
      </ul>
    </nav>
  </sidebar>
</app-layout>`}
        </div>
        
        {/* Live demo of the composable layout */}
        <div style="margin-top: var(--size-4); border-top: 1px solid var(--surface-3); padding-top: var(--size-4);">
          <h3 style="color: var(--blue-7); margin-bottom: var(--size-3);">🚀 Live Demo:</h3>
          
          <app-layout theme={layoutTheme} responsive>
            <navbar position="top" style="primary" sticky>
              <navitem href="/" active>Home</navitem>
              <navitem href="/basic">Basic</navitem>
              <navitem href="/reactive" badge="new">Reactive</navitem>
              <navitem href="/docs">Docs</navitem>
            </navbar>
            
            <main-content padding="2rem" max-width="800px" centered>
              <div style="text-align: center;">
                <h1 style="color: var(--blue-7); margin-bottom: var(--size-2);">
                  ✨ Composable Layouts Work!
                </h1>
                <p style="color: var(--text-muted); margin-bottom: var(--size-4);">
                  This entire layout is built with composable funcwc components.
                </p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--size-3); margin-top: var(--size-4);">
                  <div style="background: var(--green-1); padding: var(--size-3); border-radius: var(--radius-2); border-left: 4px solid var(--green-5);">
                    <strong style="color: var(--green-7);">🎯 Declarative</strong>
                    <p style="color: var(--green-8); margin: var(--size-1) 0 0 0; font-size: var(--font-size-0);">
                      Nest components naturally with HTML-like syntax
                    </p>
                  </div>
                  
                  <div style="background: var(--blue-1); padding: var(--size-3); border-radius: var(--radius-2); border-left: 4px solid var(--blue-5);">
                    <strong style="color: var(--blue-7);">⚡ Reactive</strong>
                    <p style="color: var(--blue-8); margin: var(--size-1) 0 0 0; font-size: var(--font-size-0);">
                      Built-in theme switching and responsive behavior
                    </p>
                  </div>
                  
                  <div style="background: var(--purple-1); padding: var(--size-3); border-radius: var(--radius-2); border-left: 4px solid var(--purple-5);">
                    <strong style="color: var(--purple-7);">♿ Accessible</strong>
                    <p style="color: var(--purple-8); margin: var(--size-1) 0 0 0; font-size: var(--font-size-0);">
                      ARIA roles, keyboard nav, and screen reader support
                    </p>
                  </div>
                </div>
                
                <button 
                  style="margin-top: var(--size-4); background: var(--blue-5); color: white; border: none; padding: var(--size-2) var(--size-4); border-radius: var(--radius-2); cursor: pointer;"
                  onclick="
                    const layout = this.closest('app-layout');
                    const currentTheme = layout.getAttribute('data-layout-theme') || 'system';
                    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
                    layout.setAttribute('data-layout-theme', nextTheme);
                    layout.setAttribute('theme', nextTheme);
                    this.textContent = '🌓 Switch to ' + (nextTheme === 'light' ? 'Dark' : 'Light') + ' Theme';
                  "
                >
                  🌓 Switch Theme
                </button>
              </div>
            </main-content>
            
            <sidebar position="right" mode="overlay" collapsible>
              <nav role="navigation" aria-label="Secondary navigation">
                <h3 style="color: var(--blue-7); margin: 0 0 var(--size-2) 0;">📚 Resources</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: var(--size-1);">
                    <a href="/getting-started" style="color: inherit; text-decoration: none; padding: var(--size-1); display: block; border-radius: var(--radius-1);">
                      🚀 Getting Started
                    </a>
                  </li>
                  <li style="margin-bottom: var(--size-1);">
                    <a href="/components" style="color: inherit; text-decoration: none; padding: var(--size-1); display: block; border-radius: var(--radius-1);">
                      🧩 Components
                    </a>
                  </li>
                  <li style="margin-bottom: var(--size-1);">
                    <a href="/examples" style="color: inherit; text-decoration: none; padding: var(--size-1); display: block; border-radius: var(--radius-1);">
                      💡 Examples
                    </a>
                  </li>
                  <li style="margin-bottom: var(--size-1);">
                    <a href="/api" style="color: inherit; text-decoration: none; padding: var(--size-1); display: block; border-radius: var(--radius-1);">
                      📖 API Reference
                    </a>
                  </li>
                </ul>
              </nav>
            </sidebar>
          </app-layout>
        </div>
        
        <div style="margin-top: var(--size-4); padding: var(--size-3); background: var(--yellow-1); border-radius: var(--radius-2); border-left: 4px solid var(--yellow-5);">
          <strong style="color: var(--yellow-8);">💡 Pro Tip:</strong>
          <p style="color: var(--yellow-9); margin: var(--size-1) 0 0 0; font-size: var(--font-size-0);">
            All layout components support function-style props and CSS-only styling.
            Try opening the mobile menu or toggling the sidebar!
          </p>
        </div>
      </div>
    );
  },
});
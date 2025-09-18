/** @jsx h */
// ui-lib App Layout Component - Root layout container with child content support
import { boolean, defineComponent, h, string } from "../../index.ts";

/**
 * 🎯 App Layout Component - Composable Root Layout Container
 *
 * Modern, composable alternative to the monolithic layout component.
 * Supports child content for flexible composition:
 *
 * <app-layout theme="system" responsive>
 *   <navbar>...</navbar>
 *   <main-content>...</main-content>
 *   <sidebar>...</sidebar>
 * </app-layout>
 *
 * Features:
 * ✨ Function-style props with smart defaults
 * 🎨 CSS-only theming with custom properties
 * 📱 Responsive design with container queries
 * ♿ Accessibility-first with proper ARIA roles
 * 🔄 Theme switching via CSS properties
 * 👥 Child content composition
 */
defineComponent("app-layout", {

  // CSS-Only Format - Auto-generated class names!
  styles: {
    container: `{
      min-height: 100vh;
      display: grid;
      grid-template-rows: auto 1fr auto;
      grid-template-columns: auto 1fr auto; 
      grid-template-areas:
        "sidebar-left header sidebar-right"
        "sidebar-left main sidebar-right"
        "sidebar-left footer sidebar-right";
      background: var(--layout-bg, var(--theme-bg, var(--gray-0)));
      color: var(--layout-text, var(--theme-text, var(--gray-9)));
      font-family: var(--layout-font, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif);
      transition: background-color 0.3s ease, color 0.3s ease;
    }`,

    // Auto layout variants based on sidebar presence
    layoutMainOnly: `{
      grid-template-columns: 1fr;
      grid-template-areas:
        "header"
        "main"
        "footer";
    }`,

    layoutLeftOnly: `{
      grid-template-columns: auto 1fr;
      grid-template-areas:
        "sidebar-left header"
        "sidebar-left main"
        "sidebar-left footer";
    }`,

    layoutRightOnly: `{
      grid-template-columns: 1fr auto;
      grid-template-areas:
        "header sidebar-right"
        "main sidebar-right"
        "footer sidebar-right";
    }`,

    // Responsive grid adjustments
    containerMobile: `{
      grid-template-rows: auto 1fr;
      grid-template-columns: 1fr;
      grid-template-areas:
        "header"
        "main"
        "footer";
    }`,

    // Theme variations
    themeSystem: `{
      /* CSS custom properties will be set by theme controller */
    }`,

    themeLight: `{
      --layout-bg: var(--gray-0);
      --layout-text: var(--gray-9);
      --layout-accent: var(--indigo-6);
    }`,

    themeDark: `{
      --layout-bg: var(--gray-12);
      --layout-text: var(--gray-1);
      --layout-accent: var(--indigo-4);
    }`,

    // Responsive utilities
    responsive: `{
      container-type: inline-size;
    }`,

    // Content areas
    headerArea: `{ grid-area: header; }`,
    mainArea: `{ grid-area: main; min-height: 0; }`,
    footerArea: `{ grid-area: footer; }`,
    sidebarLeftArea: `{ grid-area: sidebar-left; }`,
    sidebarRightArea: `{ grid-area: sidebar-right; }`,
  },

  // Function-Style Props - Zero duplication!
  render: (
    {
      theme = string("system"), // Theme: light, dark, system, auto
      responsive = boolean(true), // Enable responsive behavior
      padding = string("0"), // Container padding
      maxWidth = string("none"), // Max width constraint
      currentDemo = string("welcome"), // Current demo content to show
    },
    _api,
    classes,
    children?: string,
  ) => {
    const layoutTheme = typeof theme === "string" ? theme : "system";
    const isResponsive = typeof responsive === "boolean" ? responsive : true;
    const containerPadding = typeof padding === "string" ? padding : "0";
    const containerMaxWidth = typeof maxWidth === "string" ? maxWidth : "none";
    const demo = typeof currentDemo === "string" ? currentDemo : "welcome";

    // Theme is expressed via data attribute directly on the container

    // SSR-aware initial layout selection from children (avoid initial 3-col flicker)
    const childMarkup = children || "";
    const hasSidebarTag = childMarkup.includes("<sidebar");
    const hintRight = childMarkup.includes('position="right"');
    const hintLeft = childMarkup.includes('position="left"');
    const initialLayoutClass = !hasSidebarTag
      ? classes!.layoutMainOnly
      : (hintRight && !hintLeft)
      ? classes!.layoutRightOnly
      : (hintLeft && !hintRight)
      ? classes!.layoutLeftOnly
      : "";

    const containerClasses = [
      classes!.container,
      isResponsive ? classes!.responsive : "",
      initialLayoutClass,
      layoutTheme !== "system"
        ? classes![
          `theme${layoutTheme.charAt(0).toUpperCase() + layoutTheme.slice(1)}`
        ]
        : "",
    ].filter(Boolean).join(" ");

    // Inline style override to guarantee correct initial grid without sidebars (prevents right-shift flicker)
    const inlineLayoutStyle = !hasSidebarTag
      ? "grid-template-columns: 1fr; grid-template-areas: 'header' 'main' 'footer';"
      : (hintRight && !hintLeft)
      ? "grid-template-columns: 1fr auto; grid-template-areas: 'header sidebar-right' 'main sidebar-right' 'footer sidebar-right';"
      : (hintLeft && !hintRight)
      ? "grid-template-columns: auto 1fr; grid-template-areas: 'sidebar-left header' 'sidebar-left main' 'sidebar-left footer';"
      : "";

    const containerStyles = [
      containerPadding !== "0" ? `padding: ${containerPadding};` : "",
      containerMaxWidth !== "none"
        ? `max-width: ${containerMaxWidth}; margin: 0 auto;`
        : "",
      inlineLayoutStyle,
    ].filter(Boolean).join(" ");

    // Generate demo-specific content
    const getDemoContent = (demoType: string): string => {
      switch (demoType) {
        case "basic":
          return `
            <h1>🧩 Basic Components Demo</h1>
            <p>Explore function-style props, CSS-only format, and auto-generated class names</p>
            
            <div class="u-card u-my-4 u-p-4">
              <h3>🎯 Interactive Demo: Counter Components</h3>
              <p>These counters demonstrate <strong>pure JSX syntax</strong> with full TypeScript support!</p>
              
              <div class="u-flex u-wrap u-justify-center u-gap-3 u-my-4">
                <demo-counter initial-count="5" step="1" max-value="10" label="Basic Counter"></demo-counter>
                <demo-counter initial-count="0" step="2" max-value="20" min-value="-5" theme="green" label="Step by 2"></demo-counter>
                <demo-counter initial-count="50" step="10" max-value="100" show-controls="true" theme="purple" label="Big Steps"></demo-counter>
              </div>
            </div>

            <div class="u-card u-my-4 u-p-4">
              <h3>✨ Function-Style Props</h3>
              <p>Define props directly in render parameters with zero duplication. Types are automatically inferred from smart helpers like number(), string(), boolean().</p>
            </div>

            <div class="u-card u-my-4 u-p-4">
              <h3>🎨 CSS-Only Format</h3>
              <p>Write CSS properties, get auto-generated class names. No CSS-in-JS overhead. Classes are scoped and collision-free.</p>
            </div>
          `;

        case "reactive":
          return `
            <h1>⚡ Hybrid Reactivity System</h1>
            <p>Interactive demos of funcwc's three-tier reactivity architecture</p>

            <div class="u-card u-my-4 u-p-4">
              <h3>🚀 Interactive Reactivity Demos</h3>
              <p>Explore funcwc's revolutionary three-tier hybrid reactivity system.</p>

              <section class="u-my-4" aria-label="Theme Controller">
                <theme-controller current-theme="blue"></theme-controller>
              </section>

              <section class="u-grid u-grid-2-1 u-gap-4 u-my-4" aria-label="Cart demos">
                <cart-manager store-id="demo-store"></cart-manager>
                <cart-badge cart-id="default"></cart-badge>
              </section>

              <section class="u-my-4" aria-label="DOM Event Communication">
                <notification-trigger></notification-trigger>
                <notification-display></notification-display>
              </section>
            </div>

            <div class="u-card u-my-4 u-p-4">
              <h3>🎯 Three-Tier Architecture</h3>
              <section class="u-grid u-grid-auto-fit-250 u-gap-3" aria-label="Architecture tiers">
                <article class="u-card u-p-3">
                  <strong>⚡ CSS Properties</strong>
                  <p>Zero JS overhead. Instant visual updates. Perfect for themes and styling coordination.</p>
                </article>
                <article class="u-card u-p-3">
                  <strong>📡 Pub/Sub State</strong>
                  <p>Business logic state. Topic-based subscriptions. Automatic cleanup and persistence.</p>
                </article>
                <article class="u-card u-p-3">
                  <strong>🔄 DOM Events</strong>
                  <p>Component communication. Structured payloads. Native browser optimization.</p>
                </article>
              </section>
            </div>
          `;

        case "forms":
          return `
            <h1>🧾 Open Props UI Forms</h1>
            <p>Demonstration of OPUI-styled fields and buttons.</p>

            <div class="u-card u-my-4 u-p-4">
              <form-demo title="Account details"></form-demo>
            </div>
          `;

        case "composition":
          return `
            <h1>🧩 Component Composition Helpers</h1>
            <p>Higher-level building blocks for rapid UI development.</p>

            <div class="u-card u-my-4 u-p-4">
              <demo-composition title="Component Composition Helpers" show-code="true"></demo-composition>
            </div>
          `;

        default: // "welcome"
          return `
            <h1>Welcome to ui-lib</h1>
            <p>The revolutionary SSR-first component library with zero client dependencies, function-style props, and a three-tier hybrid reactivity system.</p>
            
            <div class="u-card u-p-4">
              <h2>🎉 Composable Layout System Active!</h2>
              <p>This page now uses the new composable layout components:</p>
              <ul>
                <li><code>&lt;app-layout&gt;</code> - Root container with theme support</li>
                <li><code>&lt;navbar&gt;</code> - Navigation with responsive design</li>
                <li><code>&lt;navitem&gt;</code> - Individual navigation items</li>
                <li><code>&lt;main-content&gt;</code> - Content area wrapper</li>
              </ul>
              <p>Try the navigation links above to see HTMX in action!</p>
            </div>
          `;
      }
    };

    const scriptContent = `
            (function() {
              // Theme switching support
              const layout = document.currentScript.parentElement;
              if (!layout) return;
              
              // Sidebar-aware layout adjustment
              const adjustLayout = () => {
                const hasLeft = !!layout.querySelector('[data-sidebar-position="left"]');
                const hasRight = !!layout.querySelector('[data-sidebar-position="right"]');
                layout.classList.remove('${classes!.layoutMainOnly}', '${classes!.layoutLeftOnly}', '${classes!.layoutRightOnly}');
                if (hasLeft && hasRight) {
                  // default 3-column
                  layout.style.gridTemplateColumns = 'auto 1fr auto';
                  layout.style.gridTemplateAreas = "'sidebar-left header sidebar-right' 'sidebar-left main sidebar-right' 'sidebar-left footer sidebar-right'";
                } else if (hasLeft) {
                  layout.classList.add('${classes!.layoutLeftOnly}');
                  layout.style.gridTemplateColumns = 'auto 1fr';
                  layout.style.gridTemplateAreas = "'sidebar-left header' 'sidebar-left main' 'sidebar-left footer'";
                } else if (hasRight) {
                  layout.classList.add('${classes!.layoutRightOnly}');
                  layout.style.gridTemplateColumns = '1fr auto';
                  layout.style.gridTemplateAreas = "'header sidebar-right' 'main sidebar-right' 'footer sidebar-right'";
                } else {
                  layout.classList.add('${classes!.layoutMainOnly}');
                  layout.style.gridTemplateColumns = '1fr';
                  layout.style.gridTemplateAreas = "'header' 'main' 'footer'";
                }
              };
              adjustLayout();

              // Observe child list to react if sidebars are added/removed dynamically
              const mo = new MutationObserver(adjustLayout);
              mo.observe(layout, { childList: true, subtree: true });

              // Watch for theme changes via CSS custom properties
              const observer = new MutationObserver(() => {
                const theme = layout.dataset.layoutTheme;
                if (theme === 'system') {
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  layout.classList.toggle('theme-dark', prefersDark);
                  layout.classList.toggle('theme-light', !prefersDark);
                }
              });
              
              observer.observe(layout, { 
                attributes: true, 
                attributeFilter: ['data-layout-theme', 'class'] 
              });

              // System theme change listener
              if (layout.dataset.layoutTheme === 'system') {
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                mediaQuery.addListener(() => {
                  const prefersDark = mediaQuery.matches;
                  layout.classList.toggle('theme-dark', prefersDark);
                  layout.classList.toggle('theme-light', !prefersDark);
                });
                
                // Set initial theme
                const prefersDark = mediaQuery.matches;
                layout.classList.toggle('theme-dark', prefersDark);
                layout.classList.toggle('theme-light', !prefersDark);
              }

              // Responsive behavior
              if (layout.dataset.responsive === 'true') {
                const resizeObserver = new ResizeObserver(entries => {
                  for (const entry of entries) {
                    const width = entry.contentRect.width;
                    layout.classList.toggle('mobile', width < 768);
                    layout.classList.toggle('tablet', width >= 768 && width < 1024);
                    layout.classList.toggle('desktop', width >= 1024);
                  }
                });
                resizeObserver.observe(layout);
              }
            })();`;
    
    const fullHtml = (children || `
      <!-- Default content if no children provided -->
      <header class="${classes!.headerArea}">
        <nav role="navigation">
          <!-- Navigation will be injected here -->
        </nav>
      </header>
      <main class="${classes!.mainArea}" role="main">
        ${getDemoContent(demo)}
      </main>
    `) + `<script>${scriptContent}</script>`;

    return (
      <div
        class={containerClasses}
        style={containerStyles}
        data-layout-theme={layoutTheme}
        data-responsive={isResponsive}
        role="application"
        aria-label="Application layout"
        dangerouslySetInnerHTML={{ __html: fullHtml }}
      />
    );
  },
});

// Export component for explicit imports
export const AppLayout = "app-layout";

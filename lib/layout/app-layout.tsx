/** @jsx h */
// funcwc App Layout Component - Root layout container with child content support
import { defineComponent, h, boolean, string } from "../../index.ts";
import type { AppLayoutProps } from "./layout-types.ts";

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
  autoProps: true,

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
      background: var(--layout-bg, var(--theme-bg, white));
      color: var(--layout-text, var(--theme-text, #333));
      font-family: var(--layout-font, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif);
      transition: background-color 0.3s ease, color 0.3s ease;
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
      --layout-bg: white;
      --layout-text: #333;
      --layout-accent: #007bff;
    }`,
    
    themeDark: `{
      --layout-bg: #1a1a1a;
      --layout-text: #e0e0e0;
      --layout-accent: #4dabf7;
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
    },
    _api,
    classes,
    children?: string,
  ) => {
    const layoutTheme = typeof theme === "string" ? theme : "system";
    const isResponsive = typeof responsive === "boolean" ? responsive : true;
    const containerPadding = typeof padding === "string" ? padding : "0";
    const containerMaxWidth = typeof maxWidth === "string" ? maxWidth : "none";

    // Generate dynamic CSS variables for theme
    const themeVars = layoutTheme === "system" ? "" : `style="--layout-theme: ${layoutTheme};"`;

    const containerClasses = [
      classes!.container,
      isResponsive ? classes!.responsive : "",
      layoutTheme !== "system" ? classes![`theme${layoutTheme.charAt(0).toUpperCase() + layoutTheme.slice(1)}`] : "",
    ].filter(Boolean).join(" ");

    const containerStyles = [
      containerPadding !== "0" ? `padding: ${containerPadding};` : "",
      containerMaxWidth !== "none" ? `max-width: ${containerMaxWidth}; margin: 0 auto;` : "",
    ].filter(Boolean).join(" ");

    return (
      <div 
        class={containerClasses}
        style={containerStyles}
        {...(themeVars ? { dangerouslySetInnerHTML: { __html: themeVars } } : {})}
        data-layout-theme={layoutTheme}
        data-responsive={isResponsive}
        role="application"
        aria-label="Application layout"
      >
        {children || `
          <!-- Default content if no children provided -->
          <header class="${classes!.headerArea}">
            <nav role="navigation">
              <!-- Navigation will be injected here -->
            </nav>
          </header>
          <main class="${classes!.mainArea}" role="main">
            <!-- Main content will be injected here -->
          </main>
        `}

        {/* Inject state manager for theme switching */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Theme switching support
              const layout = document.currentScript.parentElement;
              if (!layout) return;
              
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
            })();
          `
        }}>
        </script>
      </div>
    );
  },
});

// Export component for explicit imports
export const AppLayout = "app-layout";
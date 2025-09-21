/** @jsx h */
// ui-lib MainContent Component - Main content area wrapper
import { boolean, defineComponent, h, string } from "../../index.ts";
import type { MainContentProps } from "./layout-types.ts";

/**
 * 📄 MainContent Component - Content Area Wrapper
 *
 * Semantic main content wrapper with responsive design:
 *
 * <main-content padding="2rem" max-width="1200px" centered>
 *   <h1>Welcome to our app</h1>
 *   <p>This is the main content area...</p>
 * </main-content>
 *
 * Features:
 * ✨ Semantic HTML with proper ARIA roles
 * 📱 Responsive padding and spacing
 * 🎨 Configurable max-width and centering
 * 📜 Optional scrollable content
 * ♿ Accessibility-first design
 * 🔄 Smooth transitions and loading states
 */
defineComponent("main-content", {
  // CSS-Only Format - Auto-generated class names!
  styles: {
    mainContent: `{
      grid-area: main;
      padding: var(--main-padding, var(--size-4));
      max-width: var(--main-max-width, none);
      margin: var(--main-margin, 0 auto);
      min-height: var(--main-min-height, 0);
      background: var(--main-bg, transparent);
      color: var(--main-text, inherit);
      position: relative;
      overflow: auto;
      transition: all 0.3s ease;
    }

    @media (max-width: 768px) {
      .main-content {
        --main-padding: var(--size-3);
      }
    }

    @media (max-width: 480px) {
      .main-content {
        --main-padding: var(--size-2);
      }
    }`,

    // Centered variant
    centered: `{
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }`,

    // Scrollable variant
    scrollable: `{
      overflow-y: auto;
      overflow-x: hidden;
      max-height: 100vh;
    }`,

    // Loading state
    loading: `{
      opacity: 0.7;
      cursor: wait;
      pointer-events: none;
      position: relative;
    }`,

    loadingOverlay: `{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }`,

    loadingSpinner: `{
      width: 2rem;
      height: 2rem;
      border: 3px solid var(--loading-color, var(--gray-3));
      border-top-color: var(--loading-accent, var(--blue-5));
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }`,

    "@keyframes spin": `{
      to { transform: rotate(360deg); }
    }`,

    // Content wrapper
    contentWrapper: `{
      width: 100%;
      max-width: inherit;
      margin: 0 auto;
    }`,

    // Skip link target (for accessibility)
    skipTarget: `{
      position: relative;
    }`,

    "skipTarget::before": `{
      content: '';
      position: absolute;
      top: -1px;
      left: -1px;
      width: 1px;
      height: 1px;
    }`,
  },

  // Function-Style Props - Zero duplication!
  render: (
    {
      padding = string("var(--size-4)"), // Content padding
      maxWidth = string("none"), // Maximum content width
      centered = boolean(false), // Center content alignment
      scrollable = boolean(false), // Enable scrollable content
    },
    _api,
    classes,
    children?: string,
  ) => {
    const contentPadding = typeof padding === "string"
      ? padding
      : "var(--size-4)";
    const contentMaxWidth = typeof maxWidth === "string" ? maxWidth : "none";
    const isCentered = typeof centered === "boolean" ? centered : false;
    const isScrollable = typeof scrollable === "boolean" ? scrollable : false;

    const mainClasses = [
      classes!.mainContent,
      isCentered ? classes!.centered : "",
      isScrollable ? classes!.scrollable : "",
    ].filter(Boolean).join(" ");

    const mainStyles = [
      contentPadding !== "var(--size-4)"
        ? `--main-padding: ${contentPadding};`
        : "",
      contentMaxWidth !== "none" ? `--main-max-width: ${contentMaxWidth};` : "",
    ].filter(Boolean).join(" ");

    return (
      <main
        class={mainClasses}
        style={mainStyles}
        role="main"
        id="main-content"
        tabindex="-1"
        aria-label="Main content"
        data-main-centered={isCentered}
        data-main-scrollable={isScrollable}
      >
        {/* Skip link target for accessibility */}
        <div class={classes!.skipTarget}></div>

        <div
          class={classes!.contentWrapper}
          dangerouslySetInnerHTML={{
            __html: children || `
            <!-- Default content structure -->
            <section>
              <h1>Welcome</h1>
              <p>This is the main content area. Add your application content here.</p>
            </section>
          `,
          }}
        >
        </div>

        {/* Enhanced accessibility and interaction scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              const main = document.currentScript.parentElement;
              if (!main) return;

              // Smooth scroll to main content when hash changes
              const handleHashChange = () => {
                if (window.location.hash === '#main-content') {
                  main.focus({ preventScroll: false });
                  main.scrollIntoView({ behavior: 'smooth' });
                }
              };

              window.addEventListener('hashchange', handleHashChange);
              
              // Initial check on load
              if (window.location.hash === '#main-content') {
                setTimeout(handleHashChange, 100);
              }

              // Loading state management
              let loadingOverlay = null;
              
              const showLoading = () => {
                if (loadingOverlay) return;
                
                main.classList.add('${classes!.loading}');
                
                loadingOverlay = document.createElement('div');
                loadingOverlay.className = '${classes!.loadingOverlay}';
                loadingOverlay.innerHTML = 
                  '<div class="${
              classes!.loadingSpinner
            }" role="status" aria-label="Loading content"></div>';
                
                main.appendChild(loadingOverlay);
                
                // Announce loading to screen readers
                const announcement = document.createElement('div');
                announcement.setAttribute('aria-live', 'polite');
                announcement.setAttribute('aria-atomic', 'true');
                announcement.style.position = 'absolute';
                announcement.style.left = '-10000px';
                announcement.textContent = 'Loading content';
                main.appendChild(announcement);
                
                setTimeout(() => {
                  if (main.contains(announcement)) {
                    main.removeChild(announcement);
                  }
                }, 1000);
              };

              const hideLoading = () => {
                if (!loadingOverlay) return;
                
                main.classList.remove('${classes!.loading}');
                
                if (main.contains(loadingOverlay)) {
                  main.removeChild(loadingOverlay);
                }
                
                loadingOverlay = null;
                
                // Announce completion to screen readers
                const announcement = document.createElement('div');
                announcement.setAttribute('aria-live', 'polite');
                announcement.setAttribute('aria-atomic', 'true');
                announcement.style.position = 'absolute';
                announcement.style.left = '-10000px';
                announcement.textContent = 'Content loaded';
                main.appendChild(announcement);
                
                setTimeout(() => {
                  if (main.contains(announcement)) {
                    main.removeChild(announcement);
                  }
                }, 1000);
              };

              // Expose loading methods globally for use by other components
              window.funcwcMainContent = {
                showLoading,
                hideLoading,
                element: main
              };

              // HTMX integration for loading states
              if (typeof htmx !== 'undefined') {
                main.addEventListener('htmx:beforeRequest', showLoading);
                main.addEventListener('htmx:afterRequest', hideLoading);
                main.addEventListener('htmx:responseError', hideLoading);
                main.addEventListener('htmx:sendError', hideLoading);
                main.addEventListener('htmx:timeout', hideLoading);
              }

              // Intersection observer for scroll indicators (if scrollable)
              if (main.dataset.mainScrollable === 'true') {
                const scrollIndicator = document.createElement('div');
                scrollIndicator.style.cssText = 
                  'position: sticky; top: 0; height: 3px; background: linear-gradient(90deg, var(--blue-5) 0%, var(--blue-5) var(--scroll-progress, 0%), transparent var(--scroll-progress, 0%)); z-index: 100; transition: opacity 0.3s ease;';
                
                main.insertBefore(scrollIndicator, main.firstChild);

                main.addEventListener('scroll', () => {
                  const scrollPercent = (main.scrollTop / (main.scrollHeight - main.clientHeight)) * 100;
                  scrollIndicator.style.setProperty('--scroll-progress', scrollPercent + '%');
                  scrollIndicator.style.opacity = scrollPercent > 0 ? '1' : '0';
                });
              }

              // Focus management for SPA navigation
              const handleSPANavigation = () => {
                // Ensure main content is focusable and focused after content change
                setTimeout(() => {
                  main.focus({ preventScroll: true });
                  
                  // Announce new page to screen readers
                  const pageTitle = document.title || 'Page updated';
                  const announcement = document.createElement('div');
                  announcement.setAttribute('aria-live', 'polite');
                  announcement.setAttribute('aria-atomic', 'true');
                  announcement.style.position = 'absolute';
                  announcement.style.left = '-10000px';
                  announcement.textContent = pageTitle;
                  main.appendChild(announcement);
                  
                  setTimeout(() => {
                    if (main.contains(announcement)) {
                      main.removeChild(announcement);
                    }
                  }, 1000);
                }, 100);
              };

              if (typeof htmx !== 'undefined') {
                main.addEventListener('htmx:afterSettle', handleSPANavigation);
              }
              
              // Also handle regular navigation
              window.addEventListener('popstate', handleSPANavigation);
            })();
          `,
          }}
        >
        </script>
      </main>
    );
  },
});

// Export component for explicit imports
export const MainContent = "main-content";

/** @jsx h */
// ui-lib Sidebar Component - Optional sidebar for layouts
import { boolean, defineComponent, h, string } from "../../index.ts";
import type { SidebarProps } from "./layout-types.ts";

/**
 * 📂 Sidebar Component - Flexible Sidebar Container
 *
 * Responsive sidebar component with multiple display modes:
 *
 * <sidebar position="left" mode="permanent" width="250px">
 *   <nav>
 *     <h3>Categories</h3>
 *     <ul>
 *       <li><a href="/docs">Documentation</a></li>
 *       <li><a href="/guides">Guides</a></li>
 *     </ul>
 *   </nav>
 * </sidebar>
 *
 * Features:
 * ✨ Multiple display modes (permanent, overlay, push)
 * 📱 Mobile responsive with collapsible behavior
 * 🎨 Configurable width and position
 * ♿ Accessibility with proper ARIA roles
 * 🎭 Smooth animations and transitions
 * 🔄 State management for open/closed
 */
defineComponent("sidebar", {
  // CSS-Only Format - Auto-generated class names!
  styles: {
    sidebar: `{
      background: var(--sidebar-bg, var(--surface-1));
      border: var(--sidebar-border, 1px solid var(--surface-3));
      color: var(--sidebar-text, inherit);
      width: var(--sidebar-width, 250px);
      height: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: all 0.3s ease;
      z-index: var(--sidebar-z-index, 50);
    }`,

    // Position variants
    positionLeft: `{
      grid-area: sidebar-left;
      border-right: var(--sidebar-border);
      border-left: none;
      border-top: none;
      border-bottom: none;
    }`,

    positionRight: `{
      grid-area: sidebar-right;
      border-left: var(--sidebar-border);
      border-right: none;
      border-top: none;
      border-bottom: none;
    }`,

    // Mode variants
    modePermanent: `{
      position: static;
    }`,

    modeOverlay: `{
      position: fixed;
      top: 0;
      bottom: 0;
      z-index: var(--sidebar-overlay-z, 1000);
      box-shadow: var(--shadow-4);
    }`,

    modeOverlayLeft: `{
      left: 0;
    }`,

    modeOverlayRight: `{
      right: 0;
    }`,

    modePush: `{
      position: relative;
      transform: translateX(0);
    }`,

    // Collapsed state
    collapsed: `{
      width: var(--sidebar-collapsed-width, 60px);
      overflow: hidden;
    }`,

    collapsedHidden: `{
      transform: translateX(-100%);
    }`,

    collapsedHiddenRight: `{
      transform: translateX(100%);
    }`,

    // Overlay backdrop
    backdrop: `{
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: var(--sidebar-backdrop-z, 999);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }`,

    backdropVisible: `{
      opacity: 1;
      visibility: visible;
    }`,

    // Content area
    sidebarHeader: `{
      padding: var(--sidebar-header-padding, var(--size-4));
      border-bottom: 1px solid var(--surface-3);
      background: var(--sidebar-header-bg, transparent);
      flex-shrink: 0;
    }`,

    sidebarContent: `{
      flex: 1;
      padding: var(--sidebar-content-padding, var(--size-3));
      overflow-y: auto;
      overflow-x: hidden;
    }`,

    sidebarFooter: `{
      padding: var(--sidebar-footer-padding, var(--size-3));
      border-top: 1px solid var(--surface-3);
      background: var(--sidebar-footer-bg, transparent);
      flex-shrink: 0;
    }`,

    // Toggle button
    toggleButton: `{
      position: absolute;
      top: var(--sidebar-toggle-top, var(--size-3));
      right: var(--sidebar-toggle-right, var(--size-2));
      background: var(--sidebar-toggle-bg, var(--surface-2));
      border: 1px solid var(--surface-3);
      color: var(--sidebar-toggle-color, inherit);
      width: 2rem;
      height: 2rem;
      border-radius: var(--radius-2);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      z-index: 1;
    }`,

    toggleButtonHover: `{
      background: var(--sidebar-toggle-hover-bg, var(--surface-3));
      transform: scale(1.05);
    }`,

    // Mobile responsiveness
    "@media (max-width: 768px)": {
      sidebar: `{
        position: fixed;
        z-index: 1000;
      }`,
      modePermanent: `{
        position: fixed;
        transform: translateX(-100%);
      }`,
      modePermanentRight: `{
        transform: translateX(100%);
      }`,
      sidebarVisible: `{
        transform: translateX(0);
      }`,
    },
  },

  // Function-Style Props - Zero duplication!
  render: (
    {
      position = string("left"), // left, right
      mode = string("permanent"), // permanent, overlay, push
      width = string("250px"), // Sidebar width
      collapsible = boolean(true), // Enable collapse/expand
      collapsed = boolean(false), // Initial collapsed state
      id = string(""), // Optional id
      oob = boolean(false), // Unused here; OOB handled by server response wrapping
    },
    _api,
    classes,
    children?: string,
  ) => {
    const sidebarPosition = typeof position === "string" ? position : "left";
    const sidebarMode = typeof mode === "string" ? mode : "permanent";
    const sidebarWidth = typeof width === "string" ? width : "250px";
    const isCollapsible = typeof collapsible === "boolean" ? collapsible : true;
    const isCollapsed = typeof collapsed === "boolean" ? collapsed : false;

    const sidebarClasses = [
      classes!.sidebar,
      classes![
        `position${
          sidebarPosition.charAt(0).toUpperCase() + sidebarPosition.slice(1)
        }`
      ],
      classes![
        `mode${sidebarMode.charAt(0).toUpperCase() + sidebarMode.slice(1)}`
      ],
      sidebarMode === "overlay" && sidebarPosition === "left"
        ? classes!.modeOverlayLeft
        : "",
      sidebarMode === "overlay" && sidebarPosition === "right"
        ? classes!.modeOverlayRight
        : "",
      isCollapsed ? classes!.collapsed : "",
    ].filter(Boolean).join(" ");

    const sidebarStyles = `--sidebar-width: ${sidebarWidth};`;

    return (
      <div>
        {/* Backdrop for overlay mode */}
        {sidebarMode === "overlay" && (
          <div
            class={classes!.backdrop}
            id={`sidebar-backdrop-${sidebarPosition}`}
            onclick={`
              const sidebar = document.querySelector('[data-sidebar-position="${sidebarPosition}"]');
              const backdrop = this;
              if (sidebar && backdrop) {
                sidebar.classList.add('${
              isCollapsed ? classes!.collapsed : classes!.collapsedHidden
            }');
                backdrop.classList.remove('${classes!.backdropVisible}');
                sidebar.setAttribute('aria-hidden', 'true');
              }
            `}
          />
        )}

        <aside
          class={sidebarClasses}
          style={sidebarStyles}
          id={typeof id === "string" && id ? id : undefined}
          role="complementary"
          aria-label={`${sidebarPosition} sidebar`}
          data-sidebar-position={sidebarPosition}
          data-sidebar-mode={sidebarMode}
          data-sidebar-collapsed={isCollapsed}
          aria-hidden={isCollapsed}
        >
          {/* Toggle button for collapsible sidebars */}
          {isCollapsible && (
            <button
              type="button"
              class={classes!.toggleButton}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!isCollapsed}
              onclick={`
                const sidebar = this.closest('aside');
                const backdrop = document.querySelector('#sidebar-backdrop-${sidebarPosition}');
                const isCurrentlyCollapsed = sidebar.getAttribute('data-sidebar-collapsed') === 'true';
                const newCollapsedState = !isCurrentlyCollapsed;
                
                sidebar.setAttribute('data-sidebar-collapsed', newCollapsedState);
                sidebar.setAttribute('aria-hidden', newCollapsedState);
                this.setAttribute('aria-expanded', !newCollapsedState);
                this.setAttribute('aria-label', newCollapsedState ? 'Expand sidebar' : 'Collapse sidebar');
                
                if ('${sidebarMode}' === 'overlay') {
                  if (newCollapsedState) {
                    sidebar.classList.add('${
                classes![
                  `collapsedHidden${sidebarPosition === "right" ? "Right" : ""}`
                ]
              }');
                    if (backdrop) backdrop.classList.remove('${
                classes!.backdropVisible
              }');
                  } else {
                    sidebar.classList.remove('${
                classes![
                  `collapsedHidden${sidebarPosition === "right" ? "Right" : ""}`
                ]
              }');
                    if (backdrop) backdrop.classList.add('${
                classes!.backdropVisible
              }');
                  }
                } else {
                  sidebar.classList.toggle('${
                classes!.collapsed
              }', newCollapsedState);
                }
                
                // Announce state change
                const announcement = document.createElement('div');
                announcement.setAttribute('aria-live', 'polite');
                announcement.setAttribute('aria-atomic', 'true');
                announcement.style.position = 'absolute';
                announcement.style.left = '-10000px';
                announcement.textContent = newCollapsedState ? 'Sidebar collapsed' : 'Sidebar expanded';
                document.body.appendChild(announcement);
                setTimeout(() => document.body.removeChild(announcement), 1000);
              `}
              onmouseover={`this.classList.add('${
                classes!.toggleButtonHover
              }')`}
              onmouseout={`this.classList.remove('${
                classes!.toggleButtonHover
              }')`}
            >
              <span aria-hidden="true">
                {isCollapsed ? "→" : "←"}
              </span>
            </button>
          )}

          {/* Sidebar content */}
          <div class={classes!.sidebarContent}>
            {children || `
              <!-- Default sidebar content -->
              <nav role="navigation" aria-label="Sidebar navigation">
                <h3>Menu</h3>
                <ul>
                  <li><a href="/">Home</a></li>
                  <li><a href="/docs">Documentation</a></li>
                  <li><a href="/about">About</a></li>
                </ul>
              </nav>
            `}
          </div>

          {/* Sidebar interaction and accessibility script */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function() {
                const sidebar = document.currentScript.parentElement;
                if (!sidebar) return;

                // Keyboard navigation support
                sidebar.addEventListener('keydown', function(e) {
                  if (e.key === 'Escape' && sidebar.dataset.sidebarMode === 'overlay') {
                    const toggleButton = sidebar.querySelector('button[aria-label*="Collapse"]');
                    if (toggleButton) {
                      toggleButton.click();
                      toggleButton.focus();
                    }
                  }
                });

                // Focus trap for overlay mode
                if (sidebar.dataset.sidebarMode === 'overlay') {
                  const focusableElements = sidebar.querySelectorAll(
                    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
                  );
                  
                  if (focusableElements.length > 0) {
                    const firstFocusable = focusableElements[0];
                    const lastFocusable = focusableElements[focusableElements.length - 1];

                    sidebar.addEventListener('keydown', function(e) {
                      if (e.key === 'Tab') {
                        if (e.shiftKey) {
                          if (document.activeElement === firstFocusable) {
                            lastFocusable.focus();
                            e.preventDefault();
                          }
                        } else {
                          if (document.activeElement === lastFocusable) {
                            firstFocusable.focus();
                            e.preventDefault();
                          }
                        }
                      }
                    });
                  }
                }

                // Auto-collapse on mobile when clicking links
                const isMobile = () => window.innerWidth <= 768;
                
                sidebar.addEventListener('click', function(e) {
                  if (isMobile() && e.target.tagName === 'A' && sidebar.dataset.sidebarMode === 'overlay') {
                    const toggleButton = sidebar.querySelector('button[aria-expanded="true"]');
                    if (toggleButton) {
                      setTimeout(() => toggleButton.click(), 150);
                    }
                  }
                });

                // Handle resize events
                let resizeTimeout;
                window.addEventListener('resize', function() {
                  clearTimeout(resizeTimeout);
                  resizeTimeout = setTimeout(() => {
                    if (!isMobile() && sidebar.dataset.sidebarMode === 'permanent') {
                      sidebar.classList.remove('${classes!.collapsed}');
                      sidebar.setAttribute('data-sidebar-collapsed', 'false');
                      sidebar.setAttribute('aria-hidden', 'false');
                    }
                  }, 250);
                });
              })();
            `,
            }}
          >
          </script>
        </aside>
      </div>
    );
  },
});

// Export component for explicit imports
export const Sidebar = "sidebar";

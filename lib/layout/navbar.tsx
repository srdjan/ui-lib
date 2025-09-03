/** @jsx h */
// ui-lib Navbar Component - Composable navigation container
import { boolean, defineComponent, h, string } from "../../index.ts";
import type { NavbarProps } from "./layout-types.ts";

/**
 * 🧭 Navbar Component - Composable Navigation Container
 *
 * Modern navigation component that accepts navitem children:
 *
 * <navbar position="top" variant="primary" sticky>
 *   <navitem href="/" active>Home</navitem>
 *   <navitem href="/docs">Documentation</navitem>
 *   <navitem href="/about" badge="new">About</navitem>
 * </navbar>
 *
 * Features:
 * ✨ Composable navitem children support
 * 🎨 Multiple visual styles and positions
 * 📱 Mobile responsive with hamburger menu
 * ♿ Full accessibility with ARIA roles
 * 🔄 Auto-managed active states
 * 🎭 Sticky/fixed positioning options
 */
defineComponent("navbar", {
  autoProps: true,

  // CSS-Only Format - Auto-generated class names!
  styles: {
    navbar: `{
      grid-area: header;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--navbar-padding, var(--size-3) var(--size-4));
      background: var(--navbar-bg, var(--surface-1));
      border: var(--navbar-border, 1px solid var(--surface-3));
      box-shadow: var(--navbar-shadow, var(--shadow-1));
      position: relative;
      z-index: var(--navbar-z-index, 100);
      transition: all 0.3s ease;
    }`,

    // Position variants
    positionTop: `{
      border-bottom: var(--navbar-border, 1px solid var(--surface-3));
      border-top: none;
      border-left: none;
      border-right: none;
    }`,

    positionBottom: `{
      border-top: var(--navbar-border, 1px solid var(--surface-3));
      border-bottom: none;
      border-left: none;
      border-right: none;
    }`,

    positionLeft: `{
      flex-direction: column;
      height: 100vh;
      width: var(--navbar-width, 250px);
      border-right: var(--navbar-border, 1px solid var(--surface-3));
      border-top: none;
      border-bottom: none;
      border-left: none;
    }`,

    positionRight: `{
      flex-direction: column;
      height: 100vh;
      width: var(--navbar-width, 250px);
      border-left: var(--navbar-border, 1px solid var(--surface-3));
      border-top: none;
      border-bottom: none;
      border-right: none;
    }`,

    // Style variants
    stylePrimary: `{
      --navbar-bg: var(--indigo-5);
      --navbar-text: white;
      color: var(--navbar-text);
    }`,

    styleSecondary: `{
      --navbar-bg: var(--gray-1);
      --navbar-text: var(--gray-9);
      color: var(--navbar-text);
    }`,

    styleTransparent: `{
      --navbar-bg: transparent;
      --navbar-border: transparent;
      --navbar-shadow: none;
      backdrop-filter: blur(8px);
    }`,

    styleAccent: `{
      --navbar-bg: var(--accent-5, var(--blue-5));
      --navbar-text: white;
      color: var(--navbar-text);
    }`,

    // Sticky positioning
    sticky: `{
      position: sticky;
      top: 0;
    }`,

    // Navigation content
    navContent: `{
      display: flex;
      align-items: center;
      gap: var(--navbar-gap, var(--size-2));
      flex: 1;
    }`,

    navItems: `{
      display: flex;
      align-items: center;
      gap: var(--navbar-items-gap, var(--size-2));
      list-style: none;
      margin: 0;
      padding: 0;
    }`,

    // Responsive mobile menu
    mobileToggle: `{
      display: none;
      background: none;
      border: none;
      color: inherit;
      font-size: var(--font-size-4);
      cursor: pointer;
      padding: var(--size-2);
      border-radius: var(--radius-2);
      transition: background-color 0.2s ease;
    }`,

    mobileToggleActive: `{
      background: var(--navbar-toggle-bg, rgba(255, 255, 255, 0.1));
    }`,

    // Mobile toggle - responsive display
    mobileToggleResponsive:
      `@media (max-width: 768px) { .mobile-toggle { display: block; } }`,

    // Mobile nav items - hidden by default on mobile
    navItemsMobile: `@media (max-width: 768px) { 
      .nav-items {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--navbar-bg);
        flex-direction: column;
        padding: var(--size-3);
        box-shadow: var(--shadow-3);
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }
    }`,

    // Mobile nav items - open state
    navItemsOpen: `.nav-items-open {
      transform: translateY(0) !important;
      opacity: 1 !important;
      visibility: visible !important;
    }`,

    // Orientation variants
    vertical: `{
      flex-direction: column;
      align-items: stretch;
    }`,

    verticalNavItems: `{
      flex-direction: column;
      align-items: stretch;
      width: 100%;
    }`,
  },

  // Function-Style Props - Zero duplication!
  render: (
    {
      position = string("top"), // top, bottom, left, right
      style = string("primary"), // primary, secondary, transparent, accent
      sticky = boolean(false), // Enable sticky positioning
      collapsible = boolean(true), // Enable mobile collapsible menu
      orientation = string("horizontal"), // horizontal, vertical
    },
    _api,
    classes,
    children?: string,
  ) => {
    const navPosition = typeof position === "string" ? position : "top";
    const navStyle = typeof style === "string" ? style : "primary";
    const isSticky = typeof sticky === "boolean" ? sticky : false;
    const isCollapsible = typeof collapsible === "boolean" ? collapsible : true;
    const navOrientation = typeof orientation === "string"
      ? orientation
      : "horizontal";

    const navbarClasses = [
      classes!.navbar,
      classes![
        `position${navPosition.charAt(0).toUpperCase() + navPosition.slice(1)}`
      ],
      classes![`style${navStyle.charAt(0).toUpperCase() + navStyle.slice(1)}`],
      isSticky ? classes!.sticky : "",
      navOrientation === "vertical" ? classes!.vertical : "",
    ].filter(Boolean).join(" ");

    const navItemsClasses = [
      classes!.navItems,
      navOrientation === "vertical" ? classes!.verticalNavItems : "",
    ].filter(Boolean).join(" ");

    return (
      <nav
        class={navbarClasses}
        role="navigation"
        aria-label="Main navigation"
        data-navbar-position={navPosition}
        data-navbar-style={navStyle}
        data-navbar-orientation={navOrientation}
      >
        <div class={classes!.navContent}>
          {/* Mobile hamburger menu toggle */}
          {isCollapsible && (
            <button
              type="button"
              class={classes!.mobileToggle}
              aria-label="Toggle navigation menu"
              aria-expanded="false"
              aria-controls="navbar-items"
              onclick={`
                const button = this;
                const navbar = button.closest('[role="navigation"]');
                const navItems = navbar.querySelector('[data-navbar-items="true"]');
                const isOpen = button.getAttribute('aria-expanded') === 'true';
                
                button.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
                button.classList.toggle('${
                classes!.mobileToggleActive
              }', !isOpen);
                navItems.classList.toggle('${classes!.navItemsOpen}', !isOpen);
                
                // Announce state change for screen readers
                const announcement = document.createElement('div');
                announcement.setAttribute('aria-live', 'polite');
                announcement.setAttribute('aria-atomic', 'true');
                announcement.style.position = 'absolute';
                announcement.style.left = '-10000px';
                announcement.textContent = isOpen ? 'Navigation menu closed' : 'Navigation menu opened';
                document.body.appendChild(announcement);
                setTimeout(() => document.body.removeChild(announcement), 1000);
              `}
            >
              ☰
            </button>
          )}

          {/* Navigation items container */}
          <ul
            class={navItemsClasses}
            id="navbar-items"
            data-navbar-items="true"
            dangerouslySetInnerHTML={{
              __html: children || `
                <!-- Default navigation items if no children provided -->
                <li><a href="/" class="nav-link">Home</a></li>
                <li><a href="/about" class="nav-link">About</a></li>
              `,
            }}
          >
          </ul>
        </div>

        {/* Auto-generated navigation behavior script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              const navbar = document.currentScript.parentElement;
              if (!navbar) return;
              
              // Auto-manage active states for nav items
              const navItems = navbar.querySelectorAll('[data-nav-item="true"] a');
              const currentPath = window.location.pathname;
              
              navItems.forEach(link => {
                if (link.getAttribute('href') === currentPath) {
                  link.closest('[data-nav-item="true"]').setAttribute('data-nav-active', 'true');
                  link.setAttribute('aria-current', 'page');
                }
                
                // Handle click events for SPA navigation
                link.addEventListener('click', function(e) {
                  // Remove active state from all items
                  navItems.forEach(item => {
                    item.closest('[data-nav-item="true"]').removeAttribute('data-nav-active');
                    item.removeAttribute('aria-current');
                  });
                  
                  // Add active state to clicked item
                  this.closest('[data-nav-item="true"]').setAttribute('data-nav-active', 'true');
                  this.setAttribute('aria-current', 'page');
                });
              });

              // Close mobile menu when clicking outside
              document.addEventListener('click', function(e) {
                const toggle = navbar.querySelector('[aria-controls="navbar-items"]');
                const navItems = navbar.querySelector('#navbar-items');
                
                if (toggle && navItems && !navbar.contains(e.target)) {
                  toggle.setAttribute('aria-expanded', 'false');
                  toggle.classList.remove('${classes!.mobileToggleActive}');
                  navItems.classList.remove('${classes!.navItemsOpen}');
                }
              });

              // Close mobile menu on escape key
              document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                  const toggle = navbar.querySelector('[aria-controls="navbar-items"]');
                  const navItems = navbar.querySelector('#navbar-items');
                  
                  if (toggle && navItems) {
                    toggle.setAttribute('aria-expanded', 'false');
                    toggle.classList.remove('${classes!.mobileToggleActive}');
                    navItems.classList.remove('${classes!.navItemsOpen}');
                    toggle.focus(); // Return focus to toggle button
                  }
                }
              });
            })();
          `,
          }}
        >
        </script>
      </nav>
    );
  },
});

// Export component for explicit imports
export const Navbar = "navbar";

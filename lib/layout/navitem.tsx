/** @jsx h */
// ui-lib NavItem Component - Individual navigation item
import { boolean, defineComponent, get, h, string } from "../../index.ts";
import type { NavItemProps } from "./layout-types.ts";

/**
 * 🔗 NavItem Component - Individual Navigation Item
 *
 * Navigation item component designed to work within navbar:
 *
 * <navitem href="/docs" active>Documentation</navitem>
 * <navitem href="/about" badge="new" icon="🏢">About</navitem>
 * <navitem href="/contact" disabled>Contact</navitem>
 *
 * Features:
 * ✨ Smart active state management
 * 🎨 Visual states (active, disabled, loading)
 * 🏷️ Badge support for notifications
 * 🎭 Icon support with accessible labels
 * ♿ Full ARIA accessibility
 * 🔗 HTMX integration for SPA navigation
 * 🎯 Keyboard navigation support
 */
defineComponent("navitem", {
  autoProps: true,

  // No API needed - using direct HTMX navigation

  // CSS-Only Format - Auto-generated class names!
  styles: {
    navItem: `{
      position: relative;
      display: inline-flex;
      align-items: center;
      list-style: none;
      margin: 0;
    }`,

    link: `{
      display: inline-flex;
      align-items: center;
      gap: var(--navitem-gap, var(--size-2));
      padding: var(--navitem-padding, var(--size-2) var(--size-3));
      color: var(--navitem-text, inherit);
      text-decoration: none;
      border-radius: var(--navitem-radius, var(--radius-2));
      font-weight: var(--navitem-weight, var(--font-weight-5));
      font-size: var(--navitem-size, var(--font-size-1));
      transition: all 0.2s ease;
      cursor: pointer;
      border: 1px solid transparent;
      background: var(--navitem-bg, transparent);
      position: relative;
      outline: none;
    }`,

    // State variants
    linkHover: `{
      background: var(--navitem-hover-bg, rgba(255, 255, 255, 0.1));
      color: var(--navitem-hover-text, inherit);
      transform: translateY(-1px);
    }`,

    linkActive: `{
      background: var(--navitem-active-bg, rgba(255, 255, 255, 0.2));
      color: var(--navitem-active-text, inherit);
      font-weight: var(--navitem-active-weight, var(--font-weight-6));
      box-shadow: var(--navitem-active-shadow, inset 0 -2px 0 currentColor);
    }`,

    linkDisabled: `{
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }`,

    linkFocus: `{
      outline: 2px solid var(--navitem-focus-color, var(--blue-5));
      outline-offset: 2px;
    }`,

    // Icon support
    icon: `{
      font-size: var(--navitem-icon-size, var(--font-size-2));
      line-height: 1;
    }`,

    // Badge support
    badge: `{
      position: absolute;
      top: -0.5rem;
      right: -0.5rem;
      background: var(--navitem-badge-bg, var(--red-5));
      color: var(--navitem-badge-text, white);
      font-size: var(--navitem-badge-size, var(--font-size-0));
      font-weight: var(--font-weight-6);
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-round);
      min-width: 1.5rem;
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-2);
      z-index: 1;
    }`,

    // Loading state
    loading: `{
      position: relative;
      overflow: hidden;
    }`,

    loadingIndicator: `{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, 
        transparent 0%, 
        var(--navitem-loading-color, var(--blue-5)) 50%, 
        transparent 100%
      );
      animation: loading-slide 1.5s infinite;
    }`,

    "@keyframes loading-slide": `{
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }`,

    // Content
    content: `{
      display: flex;
      align-items: center;
      gap: var(--navitem-content-gap, var(--size-1));
    }`,

    text: `{
      line-height: var(--line-height-2);
    }`,
  },

  // Function-Style Props - Zero duplication!
  render: (
    {
      href = string("#"), // Navigation URL
      active = boolean(false), // Active state
      disabled = boolean(false), // Disabled state
      badge = string(""), // Badge text (empty = no badge)
      icon = string(""), // Icon (emoji or text)
      target = string(""), // Link target (_blank, _self, etc.)
    },
    _api,
    classes: any,
    children?: string,
  ) => {
    const itemHref = typeof href === "string" ? href : "#";
    const isActive = typeof active === "boolean" ? active : false;
    const isDisabled = typeof disabled === "boolean" ? disabled : false;
    const badgeText = typeof badge === "string" ? badge : "";
    const iconText = typeof icon === "string" ? icon : "";
    const linkTarget = typeof target === "string" ? target : "";

    const linkClasses = [
      classes!.link,
      isActive ? classes!.linkActive : "",
      isDisabled ? classes!.linkDisabled : "",
    ].filter(Boolean).join(" ");

    // Generate HTMX attributes for SPA navigation to demo endpoints
    const getHtmxAttrs = () => {
      if (isDisabled || (linkTarget && linkTarget !== "_self")) return {};

      // Extract demo parameter from href (e.g., "/?demo=basic" -> "basic")
      const url = new URL(itemHref, "http://localhost");
      const demo = url.searchParams.get("demo");

      if (demo && ["welcome", "basic", "reactive"].includes(demo)) {
        return {
          "hx-get": `/demo/${demo}`,
          "hx-target": "#demo-content",
          "hx-swap": "innerHTML",
          "hx-push-url": itemHref,
        };
      }

      return {};
    };

    const htmxAttrs = getHtmxAttrs();

    return (
      <li
        class={classes!.navItem}
        data-nav-item="true"
        data-nav-active={isActive}
        data-nav-disabled={isDisabled}
        role="none"
      >
        <a
          class={linkClasses}
          href={itemHref}
          role="menuitem"
          aria-current={isActive ? "page" : undefined}
          aria-disabled={isDisabled}
          tabindex={isDisabled ? -1 : 0}
          target={linkTarget || undefined}
          {...htmxAttrs}
          onmouseover={`this.classList.add('${classes!.linkHover}')`}
          onmouseout={`this.classList.remove('${classes!.linkHover}')`}
          onfocus={`this.classList.add('${classes!.linkFocus}')`}
          onblur={`this.classList.remove('${classes!.linkFocus}')`}
        >
          <span class={classes!.content}>
            {iconText && (
              <span
                class={classes!.icon}
                aria-hidden="true"
                role="img"
                aria-label={`${iconText} icon`}
              >
                {iconText}
              </span>
            )}
            <span class={classes!.text}>
              {children || "Nav Item"}
            </span>
          </span>

          {/* Badge */}
          {badgeText && (
            <span
              class={classes!.badge}
              role="status"
              aria-label={`${badgeText} notification`}
            >
              {badgeText}
            </span>
          )}
        </a>

        {/* Loading indicator for async navigation */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              const navItem = document.currentScript.parentElement;
              const link = navItem.querySelector('a');
              if (!navItem || !link) return;

              // Handle loading states for HTMX requests
              if (typeof htmx !== 'undefined') {
                link.addEventListener('htmx:beforeRequest', function() {
                  this.classList.add('${classes!.loading}');
                  
                  // Add loading indicator
                  const indicator = document.createElement('div');
                  indicator.className = '${classes!.loadingIndicator}';
                  this.appendChild(indicator);
                  
                  // Announce loading state
                  this.setAttribute('aria-busy', 'true');
                });

                link.addEventListener('htmx:afterRequest', function() {
                  this.classList.remove('${classes!.loading}');
                  
                  // Remove loading indicator
                  const indicator = this.querySelector('.${
              classes!.loadingIndicator
            }');
                  if (indicator) indicator.remove();
                  
                  // Clear loading state
                  this.removeAttribute('aria-busy');
                });
              }

              // Enhanced keyboard navigation
              link.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (!this.getAttribute('aria-disabled')) {
                    this.click();
                  }
                }
              });

              // Auto-update active state based on current URL
              const updateActiveState = () => {
                const currentPath = window.location.pathname;
                const linkPath = link.getAttribute('href');
                const isCurrentPage = currentPath === linkPath || 
                  (linkPath !== '#' && currentPath.startsWith(linkPath));
                
                navItem.setAttribute('data-nav-active', isCurrentPage);
                link.setAttribute('aria-current', isCurrentPage ? 'page' : 'false');
              };

              // Initial check
              updateActiveState();

              // Listen for navigation changes
              window.addEventListener('popstate', updateActiveState);
              
              // Listen for HTMX navigation
              if (typeof htmx !== 'undefined') {
                document.body.addEventListener('htmx:pushedIntoHistory', updateActiveState);
              }
            })();
          `,
          }}
        >
        </script>
      </li>
    );
  },
});

// Export component for explicit imports
export const NavItem = "navitem";

/**
 * Shopping Cart Demo Server
 *
 * Demonstrates:
 * - Complete SSR application with ui-lib components
 * - Token-based component system
 * - DOM-native state management
 * - Three-tier reactivity system
 * - Progressive enhancement with HTMX
 * - Theme system integration
 * - Comprehensive routing setup
 */

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { Router } from "../../lib/router.ts";
import { html } from "../../lib/response.ts";
import { createRepository } from "./api/repository.ts";

// Import components
import { ProductCard } from "./components/product-card-simple.tsx";
import { ProductGrid } from "./components/product-grid-simple.tsx";
import { CartSidebar } from "./components/cart-sidebar-simple.tsx";
import { CheckoutFlow } from "./components/checkout-flow-simple.tsx";

// Import API handlers
import {
  getProducts,
  searchProducts,
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
} from "./api/handlers.tsx";

import {
  getCheckoutStep,
  submitShipping,
  submitPayment,
  completeCheckout,
  initializeCheckout,
} from "./api/checkout-handlers.tsx";

import type { Product, Cart } from "./api/types.ts";
import { seedData } from "./data/seed.ts";

// ============================================================
// Layout Component
// ============================================================

function Layout({
  title,
  children,
  includeSidebar = true,
  sessionId = 'default'
}: {
  title: string;
  children: string;
  includeSidebar?: boolean;
  sessionId?: string;
}) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - Shopping Cart Demo</title>

      <!-- HTMX for progressive enhancement -->
      <script src="https://unpkg.com/htmx.org@1.9.10" defer></script>
      <script src="https://unpkg.com/htmx.org@1.9.10/dist/ext/json-enc.js" defer></script>

      <!-- Basic theme styles -->
      <style>
        :root {
          --color-primary: #6366F1;
          --color-background: #FFFFFF;
          --color-surface: #F9FAFB;
          --color-text: #1F2937;
          --color-text-secondary: #6B7280;
          --spacing-sm: 0.5rem;
          --spacing-md: 1rem;
          --spacing-lg: 1.5rem;
          --spacing-xl: 2rem;
        }
      </style>

      <!-- Application styles -->
      <style>
        /* Global application styles using theme tokens */
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          font-family: system-ui, -apple-system, sans-serif;
          background-color: var(--color-background);
          color: var(--color-text);
          line-height: 1.5;
        }

        .app-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .app-header {
          background-color: var(--color-surface);
          border-bottom: 1px solid #E5E7EB;
          padding: var(--spacing-md) var(--spacing-lg);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .app-logo {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-primary);
          text-decoration: none;
        }

        .app-nav {
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
        }

        .app-nav a {
          color: var(--color-text);
          text-decoration: none;
          font-weight: 500;
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: 6px;
          transition: all 200ms ease;
        }

        .app-nav a:hover {
          background-color: #F3F4F6;
          color: var(--color-primary);
        }

        .cart-toggle {
          position: relative;
          background: var(--color-primary);
          color: var(--color-on-primary);
          border: none;
          border-radius: var(--layout-border-radius);
          padding: var(--spacing-sm) var(--spacing-md);
          font-weight: var(--typography-weight-medium);
          cursor: pointer;
          transition: all var(--animation-duration-normal) var(--animation-timing-ease-out);
        }

        .cart-toggle:hover {
          background-color: color-mix(in srgb, var(--color-primary) 90%, black);
        }

        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: var(--color-cart-badge);
          color: var(--color-cart-badge-text);
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: var(--typography-text-xs);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--typography-weight-semibold);
        }

        .cart-badge.hidden {
          display: none;
        }

        /* Cart overlay */
        .cart-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          opacity: 0;
          visibility: hidden;
          transition: opacity 300ms ease, visibility 300ms ease;
        }

        .cart-overlay--visible {
          opacity: 1;
          visibility: visible;
        }

        .app-main {
          flex: 1;
          padding: var(--spacing-lg);
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .app-footer {
          background-color: var(--color-surface);
          border-top: var(--layout-border-width) solid var(--color-outline);
          padding: var(--spacing-lg);
          text-align: center;
          color: var(--color-on-surface-variant);
          font-size: var(--typography-text-sm);
        }

        /* Loading states */
        .htmx-indicator {
          opacity: 0;
          transition: opacity var(--animation-duration-normal) var(--animation-timing-ease-out);
        }

        .htmx-request .htmx-indicator {
          opacity: 1;
        }

        .htmx-request.htmx-indicator {
          opacity: 1;
        }

        /* Error states */
        .error-message {
          background-color: color-mix(in srgb, var(--color-error) 10%, transparent);
          color: var(--color-error);
          padding: var(--spacing-md);
          border-radius: var(--layout-border-radius);
          border: var(--layout-border-width) solid var(--color-error);
          margin: var(--spacing-md) 0;
        }

        /* Success states */
        .success-message {
          background-color: color-mix(in srgb, var(--color-success) 10%, transparent);
          color: var(--color-success);
          padding: var(--spacing-md);
          border-radius: var(--layout-border-radius);
          border: var(--layout-border-width) solid var(--color-success);
          margin: var(--spacing-md) 0;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .app-header {
            padding: var(--spacing-sm) var(--spacing-md);
            flex-direction: column;
            gap: var(--spacing-sm);
          }

          .app-nav {
            gap: var(--spacing-md);
          }

          .app-main {
            padding: var(--spacing-md);
          }
        }

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .app-header {
            border-bottom-width: 2px;
          }

          .app-footer {
            border-top-width: 2px;
          }
        }
      </style>
    </head>
    <body>
      <div class="app-container">
        <!-- Header -->
        <header class="app-header">
          <div style="display: flex; align-items: center; gap: var(--spacing-lg);">
            <a href="/" class="app-logo">🛍️ Shopping Demo</a>
            <nav class="app-nav">
              <a href="/">Products</a>
              <a href="/categories">Categories</a>
              <a href="/about">About</a>
            </nav>
          </div>

          <div style="display: flex; align-items: center; gap: var(--spacing-md);">
            <!-- Cart toggle -->
            <button
              class="cart-toggle"
              onclick="toggleCart()"
              aria-label="Open shopping cart"
            >
              🛒 Cart
              <span class="cart-badge hidden" id="cart-count">0</span>
            </button>
          </div>
        </header>

        <!-- Main content -->
        <main class="app-main">
          ${children}
        </main>

        <!-- Footer -->
        <footer class="app-footer">
          <p>Built with ui-lib • Demonstrating token-based components, SSR, and DOM-native state management</p>
        </footer>
      </div>

      ${includeSidebar ? CartSidebar({ sessionId }) : ''}

      <!-- Cart overlay -->
      <div class="cart-overlay" onclick="closeCart()"></div>

      <!-- Scripts -->
      <script>
        // Simple cart state management
        let cartOpen = false;

        function toggleCart() {
          cartOpen = !cartOpen;
          const sidebar = document.getElementById('cart-sidebar');
          const overlay = document.querySelector('.cart-overlay');

          if (cartOpen) {
            sidebar.classList.add('cart-sidebar--open');
            overlay.classList.add('cart-overlay--visible');
            document.body.style.overflow = 'hidden';
          } else {
            sidebar.classList.remove('cart-sidebar--open');
            overlay.classList.remove('cart-overlay--visible');
            document.body.style.overflow = '';
          }
        }

        function closeCart() {
          cartOpen = false;
          const sidebar = document.getElementById('cart-sidebar');
          const overlay = document.querySelector('.cart-overlay');
          sidebar.classList.remove('cart-sidebar--open');
          overlay.classList.remove('cart-overlay--visible');
          document.body.style.overflow = '';
        }

        // HTMX configuration
        document.addEventListener('DOMContentLoaded', () => {
          // Configure HTMX
          if (typeof htmx !== 'undefined') {
            htmx.config.globalViewTransitions = true;
            htmx.config.scrollBehavior = 'smooth';
          }
        });

        // Global functions for components
        window.toggleCart = toggleCart;
        window.closeCart = closeCart;
      </script>
    </body>
    </html>
  `;
}

// ============================================================
// Page Components
// ============================================================

function HomePage(products: Product[], sessionId: string) {
  return Layout({
    title: "Home",
    sessionId,
    children: `
      <div style="margin-bottom: var(--spacing-xl);">
        <h1 style="font-size: var(--typography-text-3xl); font-weight: var(--typography-weight-bold); margin-bottom: var(--spacing-md); color: var(--color-on-background);">
          Welcome to Shopping Demo
        </h1>
        <p style="font-size: var(--typography-text-lg); color: var(--color-on-surface-variant); margin-bottom: var(--spacing-lg);">
          Experience the power of token-based components with DOM-native state management
        </p>

        <div style="display: flex; gap: var(--spacing-md); margin-bottom: var(--spacing-xl);">
          <button
            style="padding: var(--spacing-md) var(--spacing-lg); background: var(--color-primary); color: var(--color-on-primary); border: none; border-radius: var(--layout-border-radius); font-weight: var(--typography-weight-medium); cursor: pointer;"
            hx-get="/api/products?featured=true"
            hx-target="#product-grid"
            hx-swap="innerHTML"
          >
            🌟 Featured Products
          </button>
          <button
            style="padding: var(--spacing-md) var(--spacing-lg); background: var(--color-secondary); color: var(--color-on-secondary); border: none; border-radius: var(--layout-border-radius); font-weight: var(--typography-weight-medium); cursor: pointer;"
            hx-get="/api/products?category=electronics"
            hx-target="#product-grid"
            hx-swap="innerHTML"
          >
            📱 Electronics
          </button>
          <button
            style="padding: var(--spacing-md) var(--spacing-lg); background: var(--color-secondary); color: var(--color-on-secondary); border: none; border-radius: var(--layout-border-radius); font-weight: var(--typography-weight-medium); cursor: pointer;"
            hx-get="/api/products?category=clothing"
            hx-target="#product-grid"
            hx-swap="innerHTML"
          >
            👕 Clothing
          </button>
        </div>
      </div>

      <div id="product-grid">
        ${ProductGrid({
          products,
          sessionId,
          showFilters: true,
          showSearch: true,
          showSort: true
        })}
      </div>

      <!-- Loading indicator -->
      <div class="htmx-indicator" style="text-align: center; padding: var(--spacing-xl);">
        <div style="display: inline-flex; align-items: center; gap: var(--spacing-sm); color: var(--color-on-surface-variant);">
          <div style="width: 16px; height: 16px; border: 2px solid var(--color-primary); border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          Loading products...
        </div>
      </div>

      <style>
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
    `
  });
}

function CheckoutPage(cart: Cart, sessionId: string, step = 1) {
  return Layout({
    title: "Checkout",
    sessionId,
    includeSidebar: false,
    children: `
      <div style="margin-bottom: var(--spacing-lg);">
        <h1 style="font-size: var(--typography-text-2xl); font-weight: var(--typography-weight-bold); margin-bottom: var(--spacing-sm); color: var(--color-on-background);">
          Checkout
        </h1>
        <p style="color: var(--color-on-surface-variant);">
          Complete your purchase securely
        </p>
      </div>

      ${CheckoutFlow({
        cart,
        sessionId,
        currentStep: step
      })}
    `
  });
}

function AboutPage() {
  return Layout({
    title: "About",
    children: `
      <div style="max-width: 800px;">
        <h1 style="font-size: var(--typography-text-3xl); font-weight: var(--typography-weight-bold); margin-bottom: var(--spacing-lg); color: var(--color-on-background);">
          About This Demo
        </h1>

        <div style="background: var(--color-surface); padding: var(--spacing-xl); border-radius: var(--layout-border-radius-lg); margin-bottom: var(--spacing-xl);">
          <h2 style="font-size: var(--typography-text-xl); font-weight: var(--typography-weight-semibold); margin-bottom: var(--spacing-md); color: var(--color-primary);">
            🚀 Features Demonstrated
          </h2>
          <ul style="color: var(--color-on-surface); line-height: 1.8;">
            <li><strong>Token-based Component System:</strong> Completely sealed components with CSS variable interfaces</li>
            <li><strong>DOM-native State Management:</strong> State lives in DOM, not JavaScript memory</li>
            <li><strong>Three-tier Reactivity:</strong> CSS properties, Pub/Sub, and DOM events</li>
            <li><strong>Server-side Rendering:</strong> Components render to HTML strings</li>
            <li><strong>Progressive Enhancement:</strong> HTMX for dynamic interactions</li>
            <li><strong>Theme System:</strong> Light/dark mode with system preference detection</li>
            <li><strong>Type Safety:</strong> End-to-end TypeScript with comprehensive types</li>
            <li><strong>Accessibility:</strong> WCAG AA compliance with proper ARIA labels</li>
            <li><strong>Performance:</strong> Zero hydration, minimal client-side JavaScript</li>
          </ul>
        </div>

        <div style="background: var(--color-surface); padding: var(--spacing-xl); border-radius: var(--layout-border-radius-lg); margin-bottom: var(--spacing-xl);">
          <h2 style="font-size: var(--typography-text-xl); font-weight: var(--typography-weight-semibold); margin-bottom: var(--spacing-md); color: var(--color-primary);">
            🎨 Component Architecture
          </h2>
          <p style="color: var(--color-on-surface); margin-bottom: var(--spacing-md);">
            This shopping cart demonstrates ui-lib's token-based component system where components are completely sealed
            and can only be customized through CSS variables. This approach provides:
          </p>
          <ul style="color: var(--color-on-surface); line-height: 1.8;">
            <li>Superior developer experience with type-safe customization</li>
            <li>Perfect encapsulation - no internal implementation leakage</li>
            <li>Consistent theming across all components</li>
            <li>Easy maintenance and updates</li>
            <li>Excellent performance characteristics</li>
          </ul>
        </div>

        <div style="background: var(--color-surface); padding: var(--spacing-xl); border-radius: var(--layout-border-radius-lg);">
          <h2 style="font-size: var(--typography-text-xl); font-weight: var(--typography-weight-semibold); margin-bottom: var(--spacing-md); color: var(--color-primary);">
            🔧 Technical Stack
          </h2>
          <ul style="color: var(--color-on-surface); line-height: 1.8;">
            <li><strong>Runtime:</strong> Deno with TypeScript</li>
            <li><strong>UI Library:</strong> ui-lib with token-based components</li>
            <li><strong>Database:</strong> Deno KV for persistence</li>
            <li><strong>Enhancement:</strong> HTMX for progressive behavior</li>
            <li><strong>Styling:</strong> CSS-in-TS with theme tokens</li>
            <li><strong>State:</strong> DOM-native with three-tier reactivity</li>
            <li><strong>Routing:</strong> Server-side with type-safe parameters</li>
          </ul>
        </div>
      </div>
    `
  });
}

// ============================================================
// Router Setup
// ============================================================

const router = new Router();

// Initialize repository
const repositoryResult = await createRepository();
if (!repositoryResult.ok) {
  console.error("Failed to initialize repository:", repositoryResult.error);
  Deno.exit(1);
}

// ============================================================
// Page Routes
// ============================================================

router.get("/", async (req) => {
  const sessionId = req.headers.get('X-Session-ID') || 'default';
  const productsResult = await repositoryResult.value.getProducts();
  const products = productsResult.ok ? productsResult.value.items : [];

  return html(HomePage(products, sessionId));
});

router.get("/checkout", async (req) => {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('session') || 'default';
  const step = parseInt(url.searchParams.get('step') || '1');

  const cartResult = await repositoryResult.value.getCart(sessionId);
  if (!cartResult.ok || cartResult.value.items.length === 0) {
    return new Response(null, {
      status: 302,
      headers: { Location: '/' }
    });
  }

  return html(CheckoutPage(cartResult.value, sessionId, step));
});

router.get("/about", () => {
  return html(AboutPage());
});

// ============================================================
// API Routes - Products
// ============================================================

router.get("/api/products", getProducts);
router.get("/api/products/search", searchProducts);

// ============================================================
// API Routes - Cart
// ============================================================

router.post("/api/cart/add", addToCart);
router.get("/api/cart", getCart);
router.patch("/api/cart/items/:itemId", updateCartItem);
router.delete("/api/cart/items/:itemId", removeFromCart);

// ============================================================
// API Routes - Checkout
// ============================================================

router.get("/api/checkout/step/:step", getCheckoutStep);
router.get("/api/checkout/init", initializeCheckout);
router.post("/api/checkout/shipping", submitShipping);
router.post("/api/checkout/payment", submitPayment);
router.post("/api/checkout/complete", completeCheckout);

// ============================================================
// Static File Serving
// ============================================================

router.get("/static/theme-system.js", () => {
  // In a real app, you'd build and serve the actual JavaScript module
  return new Response(
    `// Theme system module would be bundled here
     console.log('Theme system loaded');`,
    { headers: { 'Content-Type': 'application/javascript' } }
  );
});

router.get("/static/cart-state.js", () => {
  // In a real app, you'd build and serve the actual JavaScript module
  return new Response(
    `// Cart state module would be bundled here
     console.log('Cart state loaded');`,
    { headers: { 'Content-Type': 'application/javascript' } }
  );
});

// ============================================================
// Error Handling (handled in main request handler)
// ============================================================

// ============================================================
// Main Request Handler with 404 Support
// ============================================================

async function handleRequest(req: Request): Promise<Response> {
  try {
    console.log(`${req.method} ${req.url}`);
    const match = router.match(req);

    if (match) {
      const response = await match.handler(req, match.params);
      return response;
    }

    // 404 - No route matched
    return html(Layout({
      title: "Page Not Found",
      children: `
        <div style="text-align: center; padding: 3rem;">
          <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 1rem; color: var(--color-text);">
            404 - Page Not Found
          </h1>
          <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">
            The page you're looking for doesn't exist.
          </p>
          <a
            href="/"
            style="display: inline-block; padding: 0.75rem 1.5rem; background: var(--color-primary); color: white; text-decoration: none; border-radius: 6px; font-weight: 500;"
          >
            Go Home
          </a>
        </div>
      `
    }), { status: 404 });

  } catch (error) {
    console.error('Request error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// ============================================================
// Server Startup
// ============================================================

const PORT = parseInt(Deno.env.get("PORT") || "8080");

console.log(`🚀 Shopping Cart Demo starting on port ${PORT}`);
console.log(`📦 Features: Token components, SSR, DOM-native state, 3-tier reactivity`);
console.log(`🎯 Visit: http://localhost:${PORT}`);

await serve(handleRequest, { port: PORT });
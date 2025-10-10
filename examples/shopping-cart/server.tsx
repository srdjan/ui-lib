/**
 * Shopping Cart Demo Server
 *
 * Demonstrates:
 * - Complete SSR application with ui-lib components
 * - Composition-only component system
 * - DOM-native state management
 * - Three-tier reactivity system
 * - Progressive enhancement with HTMX
 * - Library component variants
 * - Comprehensive routing setup
 * - Theme system with light/dark mode toggle
 * - CSS custom properties for theming
 * - System preference detection
 */

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { html } from "../../lib/response.ts";
import { Router } from "../../lib/router.ts";
import {
  createThemeManagerScript,
  getBaseThemeCss,
  lightTheme,
  darkTheme,
  registerComponentApi,
  renderComponent,
} from "../../mod.ts";
import { generateCSS } from "../../lib/styles/css-generator.ts";
import { ensureRepository } from "./api/repository-factory.ts";

// Import application components
import "./components/product-card.tsx";
import "./components/product-filters.tsx";
import "./components/cart-item.tsx";

// Import library components to register them; app composes by props/variants

// Import API handlers for non-component endpoints
import {
  addToCart,
  getCart,
  getProducts,
  searchProducts,
} from "./api/handlers.tsx";

import {
  completeCheckout,
  getCheckoutStep,
  initializeCheckout,
  submitPayment,
  submitShipping,
} from "./api/checkout-handlers.tsx";

import type { Cart, Product } from "./api/types.ts";

// ============================================================
// Layout Component
// ============================================================

function Layout({
  title,
  children,
  includeSidebar = true,
  sessionId = "default",
}: {
  title: string;
  children: string;
  includeSidebar?: boolean;
  sessionId?: string;
}) {
  // Generate base theme CSS for light and dark modes
  const themeCSS = getBaseThemeCss([lightTheme, darkTheme], {
    includeSystemPreference: true,
    defaultTheme: "light",
  });

  // Generate component CSS (card, button, input, etc.)
  const componentCSS = generateCSS();

  // Generate client-side theme manager script
  const themeScript = createThemeManagerScript([lightTheme, darkTheme], {
    defaultTheme: "light",
    persistToLocalStorage: true,
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - Shopping Cart Demo</title>

      <!-- HTMX for progressive enhancement -->
      <script src="https://unpkg.com/htmx.org@2.0.7" defer></script>
      <script src="https://unpkg.com/htmx.org@2.0.7/dist/ext/json-enc.js" defer></script>

      <!-- ui-lib Base Theme System -->
      <style>
${themeCSS}
      </style>

      <!-- ui-lib Component Styles -->
      <style>
${componentCSS}
      </style>

      <!-- Theme Manager Script -->
      <script>
${themeScript}
      </script>

      <!-- Minimal global styles only -->
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
      </style>
    </head>
    <body>
      <div class="app-container">
        <!-- Header -->
        <header class="app-header">
          <div class="app-header-content">
            <div class="flex items-center gap-lg">
              <a href="/" class="app-logo">🛍️ Shopping Demo</a>
              <nav class="app-nav">
                <a href="/">Products</a>
                <a href="/categories">Categories</a>
                <a href="/about">About</a>
              </nav>
            </div>

            <div class="flex items-center gap-md">
              <!-- Theme toggle button -->
              <button
                class="theme-toggle"
                onclick="window.uiLibThemeToggle()"
                aria-label="Toggle dark mode"
                title="Toggle between light and dark theme"
              >
                🌓
              </button>

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
          </div>
        </header>

        <!-- Main content -->
        <main class="app-main">
          ${children}
        </main>

        <!-- Footer -->
        <footer class="app-footer">
          <p>Built with ui-lib • Demonstrating composition-only components, SSR, and DOM-native state management</p>
        </footer>
      </div>

      ${includeSidebar ? `
        <div id="cart-sidebar" class="cart-sidebar"
             hx-get="/api/cart?session=${sessionId}"
             hx-trigger="load, cart-updated from:body"
             hx-target=".cart-items"
             hx-swap="innerHTML">
          <div class="p-md flex items-center justify-between" style="border-bottom: 1px solid var(--surface-border);">
            <h2 class="text-xl">Shopping Cart</h2>
            <button onclick="closeCart()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
          </div>
          <div class="cart-items" style="flex: 1; overflow-y: auto;">
            <!-- Cart items will be loaded here via HTMX -->
          </div>
        </div>
      ` : ""}

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
            sidebar.classList.add('open');
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
          } else {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
            document.body.style.overflow = '';
          }
        }

        function closeCart() {
          cartOpen = false;
          const sidebar = document.getElementById('cart-sidebar');
          const overlay = document.querySelector('.cart-overlay');
          sidebar.classList.remove('open');
          overlay.classList.remove('open');
          document.body.style.overflow = '';
        }

        // HTMX configuration
        const updateCartIndicators = (detail) => {
          if (!detail || typeof detail !== 'object') return;

          const count = typeof detail.count === 'number'
            ? detail.count
            : typeof detail.itemCount === 'number'
            ? detail.itemCount
            : undefined;

          if (typeof count === 'number' && Number.isFinite(count)) {
            const badge = document.getElementById('cart-count');
            if (badge) {
              badge.textContent = String(count);
              if (count > 0) {
                badge.classList.remove('hidden');
              } else {
                badge.classList.add('hidden');
              }
            }

            document.querySelectorAll('[data-cart-count]').forEach((el) => {
              el.setAttribute('data-cart-count', String(count));
              if (el.children.length === 0) {
                el.textContent = String(count);
              }
            });
          }

          const subtotal = typeof detail.subtotal === 'number'
            ? detail.subtotal
            : undefined;
          const total = typeof detail.total === 'number' ? detail.total : subtotal;

          if (typeof total === 'number' && Number.isFinite(total)) {
            const formatted = '$' + total.toFixed(2);
            document.querySelectorAll('[data-cart-total]').forEach((el) => {
              el.setAttribute('data-cart-total', total.toFixed(2));
              el.textContent = formatted;
            });

            document.querySelectorAll('[data-cart-subtotal]').forEach((el) => {
              el.textContent = formatted;
            });
          }
        };

        document.body.addEventListener('cart-updated', (event) => {
          const detail = event && event.detail ? event.detail : {};
          updateCartIndicators(detail);
        });

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

function HomePage(products: readonly Product[], sessionId: string) {
  return Layout({
    title: "Home",
    sessionId,
    children: `
      <div class="page-hero">
        <h1 class="page-hero__title">
          Welcome to Shopping Demo
        </h1>
        <p class="page-hero__subtitle">
          Experience the power of composition-only components with DOM-native state management
        </p>

        ${renderComponent("product-filters", {})}
      </div>

      <div id="product-grid" class="product-grid">
        ${
      products
        .map((product) =>
          renderComponent("shopping-product-card", { product, sessionId })
        )
        .join("")
    }
      </div>

      <!-- Loading indicator -->
      <div class="htmx-indicator loading-indicator">
        <div class="loading-spinner">
          <div class="loading-spinner__icon"></div>
          Loading products...
        </div>
      </div>
    `,
  });
}

function CheckoutPage(cart: Cart, sessionId: string, step = 1) {
  return Layout({
    title: "Checkout",
    sessionId,
    includeSidebar: false,
    children: `
      <div class="page-hero">
        <h1 class="text-2xl mb-sm">
          Checkout
        </h1>
        <p class="text-muted">
          Complete your purchase securely
        </p>
      </div>

      ${
      renderComponent("checkout-flow", {
        cart,
        sessionId,
        currentStep: step,
      })
    }
    `,
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
            <li><strong>Composition-only Component System:</strong> Applications compose pre-styled library components with variants</li>
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
            This shopping cart demonstrates ui-lib's composition-only component system where applications
            compose pre-styled library components with variants. This approach provides:
          </p>
          <ul style="color: var(--color-on-surface); line-height: 1.8;">
            <li>Superior developer experience with pre-styled components</li>
            <li>Perfect component uniformity across applications</li>
            <li>Consistent styling through library-defined variants</li>
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
            <li><strong>UI Library:</strong> ui-lib with composition-only components</li>
            <li><strong>Database:</strong> Deno KV for persistence</li>
            <li><strong>Enhancement:</strong> HTMX for progressive behavior</li>
            <li><strong>Styling:</strong> Library component variants</li>
            <li><strong>State:</strong> DOM-native with three-tier reactivity</li>
            <li><strong>Routing:</strong> Server-side with type-safe parameters</li>
          </ul>
        </div>
      </div>
    `,
  });
}

// ============================================================
// Router Setup
// ============================================================

const router = new Router();

// Initialize repository
console.log("Initializing repository...");
const repositoryResult = await ensureRepository();
if (!repositoryResult.ok) {
  console.error("Failed to initialize repository:", repositoryResult.error);
  Deno.exit(1);
}
console.log("Repository initialized successfully");

// Register component APIs
registerComponentApi("shopping-product-card", router);
registerComponentApi("product-filters", router);
registerComponentApi("cart-item", router);

// ============================================================
// Page Routes
// ============================================================

router.get("/", async (req: Request) => {
  const sessionId = req.headers.get("X-Session-ID") || "default";
  const productsResult = await repositoryResult.value.getProducts();
  const products = productsResult.ok ? productsResult.value.items : [];

  return html(HomePage(products, sessionId));
});

router.get("/checkout", async (req: Request) => {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session") || "default";
  const step = parseInt(url.searchParams.get("step") || "1");

  const cartResult = await repositoryResult.value.getCart(sessionId);
  if (!cartResult.ok || cartResult.value.items.length === 0) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/" },
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

// router.post("/api/cart/add", addToCart); // Handled via shopping-product-card component API
router.get("/api/cart", getCart); // Keep this for direct cart loading
// router.patch("/api/cart/items/:itemId", updateCartItem); // Handled via cart-item component API
// router.delete("/api/cart/items/:itemId", removeFromCart); // Handled via cart-item component API

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

router.get("/static/cart-state.js", () => {
  // In a real app, you'd build and serve the actual JavaScript module
  return new Response(
    `// Cart state module would be bundled here
     console.log('Cart state loaded');`,
    { headers: { "Content-Type": "application/javascript" } },
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
    return html(
      Layout({
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
      `,
      }),
      { status: 404 },
    );
  } catch (error) {
    console.error("Request error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// ============================================================
// Server Startup
// ============================================================

const PORT = parseInt(Deno.env.get("PORT") || "8080");

console.log(`🚀 Shopping Cart Demo starting on port ${PORT}`);
console.log(
  `📦 Features: Composition components, SSR, DOM-native state, 3-tier reactivity`,
);
console.log(`🎯 Visit: http://localhost:${PORT}`);

await serve(handleRequest, { port: PORT });

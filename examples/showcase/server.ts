#!/usr/bin/env deno run --allow-net --allow-read --allow-env

/**
 * ui-lib Minimal Showcase Server
 * Demonstrates idiomatic usage of the library and built-in components
 */

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { Router, html } from "../../mod.ts";
import { createHomePage } from "./pages/home.ts";
import { createComponentsPage } from "./pages/components.ts";
import { createReactivityPage } from "./pages/reactivity.ts";
import { createFormsPage } from "./pages/forms.ts";
import { createLayoutsPage } from "./pages/layouts.ts";

// Initialize router
const router = new Router();

// Serve static CSS with Open Props
router.register("GET", "/css/styles.css", () => {
  const css = `
    @import "https://unpkg.com/open-props";
    @import "https://unpkg.com/open-props/normalize.min.css";
    
    /* Base styles */
    :root {
      --brand: var(--violet-6);
      --text-1: var(--gray-9);
      --text-2: var(--gray-7);
      --surface-1: var(--gray-0);
      --surface-2: var(--gray-2);
      --surface-3: var(--gray-3);
      --surface-4: var(--gray-4);
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
        --brand: var(--violet-5);
        --text-1: var(--gray-1);
        --text-2: var(--gray-4);
        --surface-1: var(--gray-9);
        --surface-2: var(--gray-8);
        --surface-3: var(--gray-7);
        --surface-4: var(--gray-6);
      }
    }
    
    body {
      font-family: var(--font-sans);
      background: var(--surface-1);
      color: var(--text-1);
      line-height: var(--font-lineheight-3);
      margin: 0;
      min-height: 100vh;
    }
    
    .container {
      max-width: var(--size-content-3);
      margin: 0 auto;
      padding: var(--size-4);
    }
    
    /* Navigation */
    nav {
      background: var(--surface-2);
      padding: var(--size-3) var(--size-4);
      border-bottom: 1px solid var(--surface-3);
      position: sticky;
      top: 0;
      z-index: var(--layer-4);
    }
    
    nav ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      gap: var(--size-4);
      align-items: center;
    }
    
    nav a {
      color: var(--text-1);
      text-decoration: none;
      padding: var(--size-2) var(--size-3);
      border-radius: var(--radius-2);
      transition: background var(--animation-fade-in);
    }
    
    nav a:hover {
      background: var(--surface-3);
    }
    
    nav a.active {
      background: var(--brand);
      color: var(--gray-0);
    }
    
    /* Component demos */
    .demo-section {
      margin: var(--size-7) 0;
      padding: var(--size-4);
      background: var(--surface-2);
      border-radius: var(--radius-3);
    }
    
    .demo-section h2 {
      font-size: var(--font-size-4);
      font-weight: var(--font-weight-6);
      margin: 0 0 var(--size-3) 0;
      color: var(--brand);
    }
    
    .demo-grid {
      display: grid;
      gap: var(--size-3);
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }
    
    /* Code blocks */
    pre {
      background: var(--gray-9);
      color: var(--gray-0);
      padding: var(--size-3);
      border-radius: var(--radius-2);
      overflow-x: auto;
      font-size: var(--font-size-0);
    }
    
    /* Utility classes */
    .flex { display: flex; }
    .gap-2 { gap: var(--size-2); }
    .gap-3 { gap: var(--size-3); }
    .gap-4 { gap: var(--size-4); }
    .mt-3 { margin-top: var(--size-3); }
    .mt-4 { margin-top: var(--size-4); }
    .mb-3 { margin-bottom: var(--size-3); }
    .mb-4 { margin-bottom: var(--size-4); }
  `;
  
  return new Response(css, {
    headers: { "Content-Type": "text/css" }
  });
});

// Home page
router.register("GET", "/", () => html(createHomePage()));

// Component gallery
router.register("GET", "/components", () => html(createComponentsPage()));

// Reactivity demos
router.register("GET", "/reactivity", () => html(createReactivityPage()));

// Forms showcase
router.register("GET", "/forms", () => html(createFormsPage()));

// Layout examples
router.register("GET", "/layouts", () => html(createLayoutsPage()));

// API endpoints for demos
router.register("POST", "/api/form-submit", async (req) => {
  const formData = await req.formData();
  const data = Object.fromEntries(formData);
  
  return new Response(
    `<div class="alert success">
      Form submitted successfully!
      <pre>${JSON.stringify(data, null, 2)}</pre>
    </div>`,
    { headers: { "Content-Type": "text/html" } }
  );
});

router.register("POST", "/api/toggle-theme", () => {
  return new Response(
    `<script>
      const root = document.documentElement;
      const currentTheme = root.dataset.theme || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      root.dataset.theme = newTheme;
    </script>`,
    { headers: { "Content-Type": "text/html" } }
  );
});

// Start server
const port = Number(Deno.env.get("PORT")) || 8080;

console.log(`
🚀 ui-lib Showcase Server
📍 http://localhost:${port}

Available pages:
• Home - Overview and getting started
• Components - Built-in component gallery
• Reactivity - Declarative bindings demos
• Forms - Form components and validation
• Layouts - Layout patterns

Press Ctrl+C to stop
`);

serve(async (req) => {
  const match = router.match(req);
  if (match) {
    return await match.handler(req, match.params);
  }
  
  // 404 page
  return html(`
    <div class="container">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/">Go back home</a>
    </div>
  `);
}, { port });
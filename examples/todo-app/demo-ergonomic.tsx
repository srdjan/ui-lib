#!/usr/bin/env -S deno run --allow-net --allow-read --allow-env
/** @jsx h */

// ✨ Minimal Demo of the Three Ergonomic Breakthroughs!
import {
  defineErgonomicComponent,
  defineSimpleComponent,
  string,
  number,
  boolean,
  oneOf,
  h,
  renderToString,
} from "../../mod-ergonomic.ts";

// ✨ BREAKTHROUGH DEMO 1: Simple Component with Function-Style Props
defineSimpleComponent("demo-card",
  // ✨ Breakthrough 1: Function-Style Props (Zero Duplication!)
  ({
    title = string("Default Title"),
    count = number(0),
    active = boolean(false),
    priority = oneOf(["low", "medium", "high"], "medium")
  }, _api, classes = {}) => (
    `<div class="${classes.card || 'demo-card'}">
       <h2 class="${classes.title || 'demo-title'}">${title}</h2>
       <p class="${classes.count || 'demo-count'}">Count: ${count}</p>
       <p class="${classes.priority || 'demo-priority'}">Priority: ${priority}</p>
       ${active ? `<span class="${classes.badge || 'demo-badge'}">Active!</span>` : ""}
     </div>`
  ),
  // ✨ Breakthrough 2: CSS-Only Format (Auto-Generated Classes!)
  {
    card: `{
      background: white;
      padding: 2rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin: 1rem 0;
      border-left: 4px solid #007bff;
    }`,
    title: `{
      color: #333;
      font-size: 1.5rem;
      margin-bottom: 1rem;
      font-weight: bold;
    }`,
    count: `{
      color: #666;
      font-size: 1.1rem;
      margin: 0.5rem 0;
    }`,
    priority: `{
      color: #007bff;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.9rem;
    }`,
    badge: `{
      background: #28a745;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.8rem;
      font-weight: bold;
      margin-left: 1rem;
    }`
  }
);

// ✨ BREAKTHROUGH DEMO 2: Navigation Component
defineSimpleComponent("demo-nav",
  ({
    brand = string("✨ ui-lib"),
    subtitle = string("Ergonomic API Demo")
  }, api, classes = {}) => (
    `<nav class="${classes.nav || 'demo-nav'}">
       <div class="${classes.brand || 'demo-brand'}">
         ${brand}
         <span class="${classes.subtitle || 'demo-subtitle'}">${subtitle}</span>
       </div>
     </nav>`
  ),
  {
    nav: `{
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem 2rem;
      color: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }`,
    brand: `{
      font-size: 1.5rem;
      font-weight: bold;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }`,
    subtitle: `{
      font-size: 0.9rem;
      opacity: 0.8;
      font-weight: normal;
    }`
  }
);

// ✨ Demo Page HTML
function createDemoPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>✨ ui-lib Ergonomic API Demo</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        min-height: 100vh;
        line-height: 1.6;
      }
      
      .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 1rem;
      }
      
      .hero {
        text-align: center;
        margin: 2rem 0;
        padding: 3rem 2rem;
        background: white;
        border-radius: 1rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      }
      
      .hero h1 {
        font-size: 3rem;
        color: #333;
        margin-bottom: 1rem;
      }
      
      .hero p {
        color: #666;
        font-size: 1.2rem;
        margin-bottom: 2rem;
      }
      
      .breakthrough-list {
        text-align: left;
        max-width: 600px;
        margin: 0 auto;
      }
      
      .breakthrough {
        background: #f8f9fa;
        padding: 1.5rem;
        margin: 1rem 0;
        border-radius: 0.5rem;
        border-left: 4px solid #007bff;
      }
      
      .breakthrough h3 {
        color: #007bff;
        margin-bottom: 0.5rem;
      }
      
      .code-example {
        background: #2d3748;
        color: #e2e8f0;
        padding: 1rem;
        border-radius: 0.5rem;
        font-family: 'Monaco', 'Menlo', monospace;
        font-size: 0.9rem;
        overflow-x: auto;
        margin: 1rem 0;
      }
    </style>
  </head>
  <body>
    <!-- ✨ Navigation Component -->
    <demo-nav brand="✨ ui-lib" subtitle="Three Ergonomic Breakthroughs Demo"></demo-nav>
    
    <div class="container">
      <!-- Hero Section -->
      <div class="hero">
        <h1>✨ Ergonomic API</h1>
        <p>Experience the three breakthroughs that make ui-lib unique!</p>
        
        <div class="breakthrough-list">
          <div class="breakthrough">
            <h3>🎯 Breakthrough 1: Function-Style Props</h3>
            <p>Props are auto-inferred from render function parameters. Zero duplication!</p>
            <div class="code-example">
render: ({ title = string("Default"), count = number(0) }, api, classes) => ...
            </div>
          </div>
          
          <div class="breakthrough">
            <h3>🎨 Breakthrough 2: CSS-Only Format</h3>
            <p>Write pure CSS properties. Class names are auto-generated and scoped!</p>
            <div class="code-example">
styles: {
  card: \`{ padding: 2rem; background: white; }\`
}
            </div>
          </div>
          
          <div class="breakthrough">
            <h3>🚀 Breakthrough 3: Unified API System</h3>
            <p>Define server endpoints once. HTMX attributes generated automatically!</p>
            <div class="code-example">
api: {
  save: patch("/api/items/:id", handler)
}
// Usage: &lt;button \${api.save(id)}&gt;Save&lt;/button&gt;
            </div>
          </div>
        </div>
      </div>
      
      <!-- Demo Components -->
      <h2 style="text-align: center; margin: 2rem 0; color: #333;">Live Component Examples</h2>
      
      <!-- ✨ Demo Cards showing Function-Style Props -->
      <demo-card title="Basic Card" count="42" priority="high"></demo-card>
      
      <demo-card title="Active Card" count="100" active priority="medium"></demo-card>
      
      <demo-card title="Low Priority Card" count="7" priority="low"></demo-card>
      
      <!-- Footer -->
      <div style="text-align: center; margin: 3rem 0; padding: 2rem; background: white; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h3>🎉 All Three Breakthroughs Working Together!</h3>
        <p>The components above demonstrate zero duplication, auto-generated classes, and type-safe props.</p>
        <p style="margin-top: 1rem; color: #666;">
          <strong>Next:</strong> Add API integration for the full unified system experience!
        </p>
      </div>
    </div>
  </body>
</html>`;
}

// ✨ Simple Server
const port = 8080;

console.log(`✨ ui-lib Ergonomic API Demo
📍 http://localhost:${port}

🎯 This demonstrates the THREE ERGONOMIC BREAKTHROUGHS:

1️⃣ Function-Style Props (Zero Duplication!)
   • Props auto-inferred from render function parameters
   • No need to define props twice
   • Full TypeScript type safety

2️⃣ CSS-Only Format (Auto-Generated Classes!)
   • Write pure CSS properties in strings
   • Class names auto-generated and scoped
   • No manual class naming required

3️⃣ Unified API System (Ready for HTMX!)
   • Define server endpoints once
   • Client functions with HTMX attributes generated automatically
   • Seamless server-client integration

Press Ctrl+C to stop
`);

Deno.serve({ port }, () => {
  const html = createDemoPage();
  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
});

/** 
 * Demo Server for ui-lib Comprehensive Showcase
 * 
 * Extended server with demo-specific routes and enhanced SSR capabilities
 */

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { join } from "https://deno.land/std@0.224.0/path/mod.ts";

// Import all demo components to register them
// Temporarily commenting out showcase components due to JSX parsing issues
// import "./showcase-hero.tsx";
// import "./showcase-function-props.tsx"; 
// import "./showcase-css-format.tsx";
// import "./showcase-reactivity.tsx";
// import "./showcase-unified-api.tsx";
// import "./real-world-examples.tsx";

// Import working components
import "./test-simple.tsx";
import "../demo-counter.tsx";
import "../cart-demo.tsx";
import "../notification-demo.tsx";
import "../theme-controller.tsx";

import { getRegistry } from "../../lib/registry.ts";
import { renderComponent } from "../../lib/component-state.ts";

// Create a comprehensive router for all demo routes
class DemoRouter {
  private routes: Array<{ pattern: RegExp; handler: (req: Request, match: RegExpMatchArray) => Response | Promise<Response> }> = [];

  add(pattern: string, handler: (req: Request, match: RegExpMatchArray) => Response | Promise<Response>) {
    this.routes.push({
      pattern: new RegExp(`^${pattern.replace(/:\w+/g, '([^/]+)')}$`),
      handler
    });
  }

  async handle(req: Request): Promise<Response | null> {
    const url = new URL(req.url);
    const path = url.pathname;
    
    for (const route of this.routes) {
      const match = path.match(route.pattern);
      if (match) {
        try {
          return await route.handler(req, match);
        } catch (error) {
          console.error(`Route error for ${path}:`, error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    }
    
    return null;
  }
}

const router = new DemoRouter();

// Root route - simple demo page
router.add("^/$", async (req) => {
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>ui-lib Demo</title>
  <style>
    body { font-family: system-ui; margin: 2rem; line-height: 1.5; }
    .demo-section { background: #f5f5f5; padding: 1rem; margin: 1rem 0; border-radius: 8px; }
    .component { border: 1px solid #ddd; padding: 1rem; margin: 1rem 0; border-radius: 4px; }
    a { color: #0066cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>🚀 ui-lib Demo Application</h1>
  <p>Welcome to the comprehensive ui-lib showcase!</p>
  
  <div class="demo-section">
    <h2>✨ Working Components</h2>
    <div class="component">
      <test-simple></test-simple>
    </div>
    <div class="component">
      <demo-counter initial-count="5" step="2"></demo-counter>
    </div>
  </div>
  
  <div class="demo-section">
    <h2>🔗 Demo Links</h2>
    <ul>
      <li><a href="/demo">Full Demo Page</a> (comprehensive showcase)</li>
      <li><a href="/demo/hero">Hero Section</a></li>
      <li><a href="/demo/function-props">Function-Style Props</a></li>
      <li><a href="/demo/css-format">CSS-Only Format</a></li>
      <li><a href="/demo/reactivity">Reactivity System</a></li>
    </ul>
  </div>
  
  <script>
    // Simple state manager for testing
    window.funcwcState = {
      _state: new Map(),
      _subscribers: new Map(),
      publish(topic, data) { console.log('State:', topic, data); },
      subscribe(topic, handler) { console.log('Subscribe:', topic); },
      get(topic) { return this._state.get(topic); }
    };
  </script>
</body>
</html>`;
  
  return new Response(html, {
    headers: { "Content-Type": "text/html" }
  });
});

// Demo API Routes
// E-commerce demo routes
router.add("/demo/products", async (req) => {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const search = url.searchParams.get("search");
  
  // Mock product data
  const products = [
    { id: "1", name: "Smartphone Pro", price: 899, category: "electronics", image: "📱", rating: 4.5, stock: 12 },
    { id: "2", name: "Laptop Ultra", price: 1299, category: "electronics", image: "💻", rating: 4.8, stock: 8 },
    { id: "3", name: "Wireless Headphones", price: 199, category: "electronics", image: "🎧", rating: 4.3, stock: 25 },
    { id: "4", name: "Smart Watch", price: 299, category: "electronics", image: "⌚", rating: 4.1, stock: 15 },
    { id: "5", name: "Coffee Maker", price: 129, category: "home", image: "☕", rating: 4.6, stock: 20 },
    { id: "6", name: "Desk Chair", price: 249, category: "home", image: "🪑", rating: 4.4, stock: 10 },
  ];

  let filtered = products;
  if (category && category !== "all") {
    filtered = filtered.filter(p => p.category === category);
  }
  if (search) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  return new Response(renderComponent("product-grid", { products: JSON.stringify(filtered) }), {
    headers: { "Content-Type": "text/html" }
  });
});

router.add("/demo/cart", async (req) => {
  if (req.method === "POST") {
    const data = await req.json();
    // In a real app, this would update the cart in database/session
    return Response.json({ success: true, item: data });
  }
  return new Response("Method not allowed", { status: 405 });
});

// Unified API demo routes
router.add("/demo/items", async (req) => {
  if (req.method === "POST") {
    const data = await req.json();
    const item = {
      id: crypto.randomUUID(),
      name: data.name || "Unnamed Item",
      description: data.description || "No description",
      created: new Date().toISOString(),
      status: "active"
    };
    return Response.json(item, { status: 201 });
  }
  return new Response("Method not allowed", { status: 405 });
});

router.add("/demo/items/([^/]+)", async (req, match) => {
  const id = match[1];
  
  if (req.method === "GET") {
    const item = {
      id: id,
      name: "Demo Item",
      description: "Retrieved via unified API",
      created: new Date().toISOString(),
      status: "active"
    };
    return Response.json(item);
  }
  
  if (req.method === "PATCH") {
    const data = await req.json();
    const item = {
      id: id,
      name: data.name || "Updated Item",
      description: data.description || "Updated via API",
      modified: new Date().toISOString(),
      status: data.status || "active"
    };
    return Response.json(item);
  }
  
  if (req.method === "DELETE") {
    console.log(`Deleting item ${id}`);
    return new Response(null, { status: 204 });
  }
  
  return new Response("Method not allowed", { status: 405 });
});

// Demo section routes for navigation
router.add("/demo/([^/]+)", async (req, match) => {
  const section = match[1];
  
  try {
    let content = "";
    
    switch (section) {
      case "hero":
        content = renderComponent("showcase-hero", {});
        break;
      case "function-props":
        content = renderComponent("showcase-function-props", {});
        break;
      case "css-format":
        content = renderComponent("showcase-css-format", {});
        break;
      case "reactivity":
        content = renderComponent("showcase-reactivity", {});
        break;
      case "unified-api":
        content = renderComponent("showcase-unified-api", {});
        break;
      case "real-world":
        content = renderComponent("real-world-examples", {});
        break;
      default:
        return new Response("Demo section not found", { status: 404 });
    }
    
    return new Response(content, {
      headers: { "Content-Type": "text/html" }
    });
  } catch (error) {
    console.error(`Error rendering demo section ${section}:`, error);
    return new Response(`Error rendering demo: ${error.message}`, { status: 500 });
  }
});

// File serving with proper MIME types
async function serveFile(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    let filePath = url.pathname;
    
    // Handle root request
    if (filePath === "/" || filePath === "/demo") {
      filePath = "/demo/index.html";
    }
    
    // Security: prevent directory traversal
    if (filePath.includes("..")) {
      return new Response("Forbidden", { status: 403 });
    }
    
    // Determine the file path
    const fullPath = join(Deno.cwd(), "examples", filePath.startsWith("/") ? filePath.slice(1) : filePath);
    
    try {
      const stat = await Deno.stat(fullPath);
      if (!stat.isFile) {
        return new Response("Not Found", { status: 404 });
      }
    } catch {
      return new Response("Not Found", { status: 404 });
    }
    
    const file = await Deno.readFile(fullPath);
    
    // Determine MIME type
    const ext = filePath.split('.').pop()?.toLowerCase();
    let contentType = "application/octet-stream";
    
    switch (ext) {
      case "html":
        contentType = "text/html; charset=utf-8";
        break;
      case "js":
      case "mjs":
        contentType = "application/javascript; charset=utf-8";
        break;
      case "ts":
      case "tsx":
        contentType = "application/typescript; charset=utf-8";
        break;
      case "css":
        contentType = "text/css; charset=utf-8";
        break;
      case "json":
        contentType = "application/json; charset=utf-8";
        break;
      case "svg":
        contentType = "image/svg+xml";
        break;
      case "png":
        contentType = "image/png";
        break;
      case "jpg":
      case "jpeg":
        contentType = "image/jpeg";
        break;
      case "ico":
        contentType = "image/x-icon";
        break;
      case "woff":
        contentType = "font/woff";
        break;
      case "woff2":
        contentType = "font/woff2";
        break;
    }
    
    const headers = new Headers({
      "Content-Type": contentType,
      "Cache-Control": ext === "html" ? "no-cache" : "public, max-age=31536000"
    });
    
    // Handle TypeScript files - serve them as text/plain for development
    if (ext === "ts" || ext === "tsx") {
      headers.set("Content-Type", "text/plain; charset=utf-8");
    }
    
    return new Response(file, { headers });
  } catch (error) {
    console.error("File serving error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// Component SSR handler
async function handleComponentRequest(request: Request): Promise<Response | null> {
  try {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Check if this is a component render request
    if (path.startsWith("/component/")) {
      const componentName = path.split("/component/")[1];
      const registry = getRegistry();
      
      if (registry.has(componentName)) {
        // Extract attributes from query parameters
        const attrs: Record<string, string> = {};
        url.searchParams.forEach((value, key) => {
          attrs[key] = value;
        });
        
        const html = renderComponent(componentName, attrs);
        return new Response(html, {
          headers: { "Content-Type": "text/html; charset=utf-8" }
        });
      }
    }
    
    return null;
  } catch (error) {
    console.error("Component rendering error:", error);
    return new Response(`Component error: ${error.message}`, { status: 500 });
  }
}

// Main request handler
async function handleRequest(request: Request): Promise<Response> {
  try {
    // Add CORS headers for development
    const headers = new Headers({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, hx-request, hx-current-url, hx-target",
    });
    
    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }
    
    // Try demo API routes first
    const apiResponse = await router.handle(request);
    if (apiResponse) {
      // Add CORS headers to API responses
      headers.forEach((value, key) => {
        apiResponse.headers.set(key, value);
      });
      return apiResponse;
    }
    
    // Try component SSR
    const componentResponse = await handleComponentRequest(request);
    if (componentResponse) {
      headers.forEach((value, key) => {
        componentResponse.headers.set(key, value);
      });
      return componentResponse;
    }
    
    // Fallback to file serving
    const fileResponse = await serveFile(request);
    headers.forEach((value, key) => {
      fileResponse.headers.set(key, value);
    });
    
    return fileResponse;
  } catch (error) {
    console.error("Request handling error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// Start the server
const port = Number(Deno.env.get("PORT") ?? "8080");

console.log(`🚀 ui-lib Demo Server starting on http://localhost:${port}`);
console.log(`📊 Demo components registered: ${getRegistry().size}`);
console.log(`🎯 Available sections:`);
console.log(`   • Hero: http://localhost:${port}/demo/hero`);
console.log(`   • Function Props: http://localhost:${port}/demo/function-props`);
console.log(`   • CSS Format: http://localhost:${port}/demo/css-format`);
console.log(`   • Reactivity: http://localhost:${port}/demo/reactivity`);
console.log(`   • Unified API: http://localhost:${port}/demo/unified-api`);
console.log(`   • Real World: http://localhost:${port}/demo/real-world`);
console.log(`🏠 Main demo: http://localhost:${port}/demo`);
console.log(``);

await serve(handleRequest, { port });
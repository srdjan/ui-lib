#!/usr/bin/env deno run --allow-net --allow-read --allow-env

/**
 * Todo App - Idiomatic ui-lib Usage Example  
 * Demonstrates: Full-stack components, HTMX integration, proper architecture
 */

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { Router, html, renderToString, Container } from "../../mod-simple.ts";
import { TodoForm, TodoFilters, TodoList, Todo, TodoFilter } from "./components.tsx";
import { todoAPI, todoDatabase } from "./api.tsx";
import { h } from "../../lib/simple.tsx";

const router = new Router();

// Global styles for the todo app
const styles = `
  * {
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    line-height: 1.6;
    color: #1f2937;
    background: #f9fafb;
    margin: 0;
    padding: 0;
  }
  
  .app-header {
    background: white;
    border-bottom: 1px solid #e5e7eb;
    padding: 1.5rem 0;
    margin-bottom: 2rem;
  }
  
  .app-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
    text-align: center;
  }
  
  .app-subtitle {
    font-size: 1rem;
    color: #6b7280;
    text-align: center;
    margin: 0.5rem 0 0 0;
  }
  
  .main-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .app-footer {
    text-align: center;
    color: #9ca3af;
    font-size: 0.875rem;
    padding: 2rem;
    margin-top: 3rem;
  }
  
  /* HTMX loading states */
  .htmx-request {
    opacity: 0.8;
  }
  
  .htmx-request * {
    cursor: wait;
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .main-content {
      padding: 0 0.75rem;
    }
    
    .app-title {
      font-size: 1.75rem;
    }
  }
`;

// Main application page  
router.register("GET", "/", async () => {
  const todos = todoDatabase.getAll();
  const filter: TodoFilter = { status: "all" };
  const stats = todoDatabase.getStats();

  // Create the full page as pure JSX
  const page = (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Todo App - ui-lib Example</title>
        <style>{styles}</style>
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
        <script dangerouslySetInnerHTML={{__html: `
          window.editTodo = function(id) {
            console.log('Edit todo:', id);
            alert('Edit functionality would open an inline form here');
          };
          
          document.addEventListener('htmx:beforeRequest', function(e) {
            e.target.classList.add('htmx-request');
          });
          
          document.addEventListener('htmx:afterRequest', function(e) {
            e.target.classList.remove('htmx-request');
          });
        `}} />
      </head>
      <body>
        <header class="app-header">
          <h1 class="app-title">Todo App</h1>
          <p class="app-subtitle">Built with ui-lib - Demonstrating idiomatic usage</p>
        </header>

        <main class="main-content">
          <TodoForm />
          <TodoFilters currentFilter={filter} todoCount={stats} />
          <TodoList todos={todos} filter={filter} />
          
          <div style="margin-top: 2rem; text-align: center;">
            <button 
              class="bulk-action-btn"
              hx-post="/api/todos/clear-completed"
              hx-target="#todo-list"
              hx-swap="innerHTML"
              hx-confirm="Are you sure you want to delete all completed todos?"
              style="background: #ef4444; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.875rem;"
            >
              Clear Completed ({stats.completed})
            </button>
          </div>
        </main>

        <footer class="app-footer">
          <p>
            Built with <strong>ui-lib simplified</strong> - 
            <a href="https://github.com" target="_blank" rel="noopener">View Source</a>
          </p>
          <p>
            Features: HTMX integration • Server-side rendering • Type-safe components • 
            Zero hydration • DOM-native state
          </p>
        </footer>
      </body>
    </html>
  );

  // Return the JSX directly - Deno handles the HTML conversion
  return new Response(`<!DOCTYPE html>\n${page}`, {
    headers: { "Content-Type": "text/html" }
  });
});

// API Routes - Full CRUD operations
router.register("GET", "/api/todos", todoAPI.listTodos);
router.register("POST", "/api/todos", todoAPI.createTodo);
router.register("PUT", "/api/todos/:id", todoAPI.updateTodo);
router.register("POST", "/api/todos/:id/toggle", todoAPI.toggleTodo);
router.register("DELETE", "/api/todos/:id", todoAPI.deleteTodo);
router.register("POST", "/api/todos/clear-completed", todoAPI.clearCompleted);
router.register("GET", "/api/todos/stats", todoAPI.getStats);

// Health check endpoint
router.register("GET", "/health", () => {
  return new Response(JSON.stringify({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    todos: todoDatabase.getStats()
  }), {
    headers: { "Content-Type": "application/json" }
  });
});

// API documentation endpoint
router.register("GET", "/api", () => html(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo API Documentation</title>
    <style>${styles}</style>
  </head>
  <body>
    <header class="app-header">
      <h1 class="app-title">Todo API</h1>
      <p class="app-subtitle">RESTful API with HTMX integration</p>
    </header>

    <main class="main-content">
      <div style="background: white; padding: 2rem; border-radius: 8px; border: 1px solid #e5e7eb;">
        <h2>Available Endpoints</h2>
        
        <h3>Todos</h3>
        <ul>
          <li><code>GET /api/todos</code> - List todos (supports ?status=all|active|completed&priority=low|medium|high)</li>
          <li><code>POST /api/todos</code> - Create new todo</li>
          <li><code>PUT /api/todos/:id</code> - Update todo</li>
          <li><code>POST /api/todos/:id/toggle</code> - Toggle todo completion</li>
          <li><code>DELETE /api/todos/:id</code> - Delete todo</li>
          <li><code>POST /api/todos/clear-completed</code> - Delete all completed todos</li>
        </ul>
        
        <h3>Stats</h3>
        <ul>
          <li><code>GET /api/todos/stats</code> - Get todo statistics</li>
          <li><code>GET /health</code> - Health check</li>
        </ul>
        
        <h3>Usage Notes</h3>
        <ul>
          <li>Requests with <code>hx-request</code> header return HTML fragments</li>
          <li>Other requests return JSON</li>
          <li>Form data should be sent as <code>multipart/form-data</code></li>
          <li>All endpoints support CORS for development</li>
        </ul>
        
        <p><a href="/">← Back to Todo App</a></p>
      </div>
    </main>
  </body>
  </html>
`));

// Start server
const port = Number(Deno.env.get("PORT")) || 8080;

console.log(`
🚀 Todo App Server (ui-lib example)
📍 http://localhost:${port}

This demonstrates idiomatic ui-lib usage:
✅ Component composition and reuse
✅ HTMX integration for seamless UX  
✅ Full CRUD operations with validation
✅ Responsive design with mobile support
✅ Error handling and loading states
✅ Type-safe props and data flow

Available endpoints:
• GET / - Main todo application
• GET /api - API documentation
• GET /health - Health check
• Full RESTful API at /api/todos

Press Ctrl+C to stop
`);

serve(async (req) => {
  // Add CORS headers for development
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, hx-request, hx-target, hx-current-url",
  };

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const match = router.match(req);
    if (match) {
      const response = await match.handler(req, match.params);
      
      // Add CORS headers to response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      return response;
    }

    // 404 handler
    return html(`
      <div style="text-align: center; padding: 3rem;">
        <h1>404 - Not Found</h1>
        <p>The requested resource could not be found.</p>
        <a href="/" style="color: #3b82f6;">← Back to Todo App</a>
      </div>
    `, 404);

  } catch (error) {
    console.error("Server error:", error);
    
    return html(`
      <div style="text-align: center; padding: 3rem; color: #dc2626;">
        <h1>500 - Server Error</h1>
        <p>Something went wrong. Please try again later.</p>
        <a href="/" style="color: #3b82f6;">← Back to Todo App</a>
      </div>
    `, 500);
  }
}, { port });
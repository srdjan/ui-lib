#!/usr/bin/env deno run --allow-net --allow-read --allow-env

/** @jsx h */

/**
 * Todo App - Refactored to use ui-lib components consistently
 * Demonstrates: Proper ui-lib usage, component composition, library patterns
 */

import { h } from "../../lib/simple.tsx";
import { Alert, Button, Router } from "../../mod-simple.ts";
import { todoAPI, todoDatabase } from "./api/index.ts";

// Import refactored components
import type { TodoFilter } from "./components-simple.tsx";
import { TodoFilters, TodoForm, TodoList } from "./components-simple.tsx";

void h;

const router = new Router();

// Global styles for the todo app (simplified)
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
    padding: 0;
    margin: 0 0 2rem 0;
  }

  .top-nav {
    display: flex;
    gap: 1rem;
    align-items: center;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e5e7eb;
    background: #ffffff;
  }

  .top-nav a {
    padding: 0.375rem 0.75rem;
    border-radius: 6px;
    text-decoration: none;
    color: #374151;
    border: 1px solid transparent;
  }

  .top-nav a.active {
    background: #eff6ff;
    color: #1d4ed8;
    border-color: #bfdbfe;
  }

  .top-nav a:hover {
    background: #f3f4f6;
  }

  .app-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  .app-subtitle {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
  }

  .main {
    max-width: 900px;
    margin: 1.5rem auto;
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
    .main {
      padding: 0 0.75rem;
    }

    .app-title {
      font-size: 1.125rem;
    }
  }
`;

/**
 * Main application page - Now using ui-lib components throughout
 */
router.register("GET", "/", (req: Request) => {
  const url = new URL(req.url);
  const currentUser = url.searchParams.get("user") ||
    todoDatabase.getUsers()[0];
  const filter: TodoFilter = { status: "all" };
  const stats = todoDatabase.getStats(currentUser);
  const todos = todoDatabase.filter(filter, currentUser);

  // Navigation using simple JSX with ui-lib styling
  const nav = (
    <div class="top-nav">
      <div style="display:flex; flex-direction:column; gap:2px;">
        <div class="app-title">Todo App</div>
        <div class="app-subtitle">Built with ui-lib - SSR + HTMX</div>
      </div>
      <div style="margin-left:auto; display:flex; gap:0.5rem;">
        <a class="active" href="/">Home</a>
        <a href="/users">Users</a>
        <a href="/api">API Docs</a>
      </div>
    </div>
  );

  // Main content using refactored ui-lib components
  const content = (
    <div>
      <TodoForm userId={currentUser} />
      <TodoFilters
        currentFilter={filter}
        todoCount={stats}
        userId={currentUser}
      />
      <TodoList todos={todos} filter={filter} />

      <div style="margin-top: 2rem; text-align: center;">
        <button
          type="button"
          class="clear-completed-btn"
          hx-post={`/api/todos/clear-completed?user=${currentUser}`}
          hx-target="#todo-list"
          hx-swap="innerHTML"
          hx-confirm="Are you sure you want to delete all completed todos?"
          style="background: #ef4444; color: white; border: 1px solid #ef4444; padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: all 0.2s ease;"
        >
          Clear Completed ({String(stats.completed)})
        </button>
      </div>
    </div>
  );

  // Create the full page as pure JSX
  const page = (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Todo App - ui-lib Example</title>
        <style>{styles}</style>
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          window.editTodo = function(id) { alert('Edit UI not implemented in MVP'); };
          document.addEventListener('htmx:beforeRequest', function(e) { e.target.classList.add('htmx-request'); });
          document.addEventListener('htmx:afterRequest', function(e) { e.target.classList.remove('htmx-request'); });
        `,
          }}
        />
      </head>
      <body>
        <header class="app-header">
          {nav}
        </header>

        <main class="main">
          <div id="content">{content}</div>
        </main>

        <footer class="app-footer">
          <p>
            Built with <strong>ui-lib</strong> -{" "}
            <a href="https://github.com" target="_blank" rel="noopener">
              View Source
            </a>
          </p>
          <p>
            Features: HTMX integration • Server-side rendering • Type-safe
            components • Zero hydration • DOM-native state
          </p>
        </footer>
      </body>
    </html>
  );

  // Return the JSX directly - Deno handles the HTML conversion
  return new Response(`<!DOCTYPE html>\n${page}`, {
    headers: { "Content-Type": "text/html" },
  });
});

/**
 * HTMX content route - Returns just the main content for dynamic updates
 */
router.register("GET", "/home", (req: Request) => {
  const url = new URL(req.url);
  const currentUser = url.searchParams.get("user") ||
    todoDatabase.getUsers()[0];
  const filter: TodoFilter = { status: "all" };
  const stats = todoDatabase.getStats(currentUser);
  const todos = todoDatabase.filter(filter, currentUser);

  const fragment = (
    <div>
      <TodoForm userId={currentUser} />
      <TodoFilters
        currentFilter={filter}
        todoCount={stats}
        userId={currentUser}
      />
      <TodoList todos={todos} filter={filter} />

      <div style="margin-top: 2rem; text-align: center;">
        <button
          type="button"
          class="clear-completed-btn"
          hx-post={`/api/todos/clear-completed?user=${currentUser}`}
          hx-target="#todo-list"
          hx-swap="innerHTML"
          hx-confirm="Are you sure you want to delete all completed todos?"
          style="background: #ef4444; color: white; border: 1px solid #ef4444; padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: all 0.2s ease;"
        >
          Clear Completed ({String(stats.completed)})
        </button>
      </div>
    </div>
  );

  return new Response(`${fragment}`, {
    headers: { "Content-Type": "text/html" },
  });
});

/**
 * Users page - Now using ui-lib Button components
 */
router.register("GET", "/users", (req: Request) => {
  const url = new URL(req.url);
  const currentUser = url.searchParams.get("user") ||
    todoDatabase.getUsers()[0];
  const users = todoDatabase.getUsers();

  const fragment = (
    <div>
      <h2 style="margin:0 0 1rem 0;">Users</h2>
      <ul style="list-style:none; padding:0; margin:0; display:grid; gap:0.5rem;">
        {users.map((u) => (
          <li style="display:flex; align-items:center; justify-content:space-between; background:white; padding:0.5rem 0.75rem; border:1px solid #e5e7eb; border-radius:6px;">
            <span>
              {u} {u === currentUser ? "(current)" : ""}
            </span>
            <Button
              variant="outline"
              size="sm"
              hx-get={`/home?user=${u}`}
              hx-target="#content"
              hx-swap="innerHTML"
            >
              {`Switch to ${u}`}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );

  return new Response(`${fragment}`, {
    headers: { "Content-Type": "text/html" },
  });
});

// API routes (unchanged)
router.register("GET", "/api/todos", todoAPI.listTodos);
router.register("POST", "/api/todos", todoAPI.createTodo);
router.register(
  "PUT",
  "/api/todos/:id",
  (req: Request, params: Record<string, string>) =>
    todoAPI.updateTodo(req, params as { id: string }),
);
router.register(
  "POST",
  "/api/todos/:id/toggle",
  (req: Request, params: Record<string, string>) =>
    todoAPI.toggleTodo(req, params as { id: string }),
);
router.register(
  "DELETE",
  "/api/todos/:id",
  (req: Request, params: Record<string, string>) =>
    todoAPI.deleteTodo(req, params as { id: string }),
);
router.register("POST", "/api/todos/clear-completed", todoAPI.clearCompleted);
router.register("GET", "/api/todos/stats", todoAPI.getStats);

// Health check endpoint
router.register("GET", "/health", () => {
  const currentUser = todoDatabase.getUsers()[0];
  return new Response(
    JSON.stringify({
      status: "healthy",
      timestamp: new Date().toISOString(),
      todos: todoDatabase.getStats(currentUser),
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
});

// API documentation page - Now using ui-lib components
router.register("GET", "/api", () => {
  const page = (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Todo API Documentation</title>
        <style>{styles}</style>
      </head>
      <body>
        <header class="app-header">
          <div class="top-nav">
            <div style="display:flex; flex-direction:column; gap:2px;">
              <div class="app-title">Todo API</div>
              <div class="app-subtitle">RESTful API with HTMX integration</div>
            </div>
            <div style="margin-left:auto;">
              <a href="/">← Back to App</a>
            </div>
          </div>
        </header>

        <main class="main">
          <Alert variant="info" title="API Documentation">
            Complete REST API for the Todo application with HTMX support.
          </Alert>

          <div style="background: white; padding: 2rem; border-radius: 8px; border: 1px solid #e5e7eb; margin-top: 1rem;">
            <h2>Available Endpoints</h2>

            <h3>Todos</h3>
            <ul>
              <li>
                <code>GET /api/todos</code>{" "}
                - List todos (supports
                ?status=all|active|completed&priority=low|medium|high)
              </li>
              <li>
                <code>POST /api/todos</code> - Create new todo
              </li>
              <li>
                <code>PUT /api/todos/:id</code> - Update todo
              </li>
              <li>
                <code>POST /api/todos/:id/toggle</code> - Toggle todo completion
              </li>
              <li>
                <code>DELETE /api/todos/:id</code> - Delete todo
              </li>
              <li>
                <code>POST /api/todos/clear-completed</code>{" "}
                - Delete all completed todos
              </li>
            </ul>

            <h3>Stats</h3>
            <ul>
              <li>
                <code>GET /api/todos/stats</code> - Get todo statistics
              </li>
              <li>
                <code>GET /health</code> - Health check
              </li>
            </ul>

            <h3>Usage Notes</h3>
            <ul>
              <li>
                Requests with <code>hx-request</code>{" "}
                header return HTML fragments
              </li>
              <li>Other requests return JSON</li>
              <li>
                Form data should be sent as <code>multipart/form-data</code>
              </li>
              <li>All endpoints support CORS for development</li>
            </ul>
          </div>
        </main>
      </body>
    </html>
  );

  return new Response(`<!DOCTYPE html>\n${page}`, {
    headers: { "Content-Type": "text/html" },
  });
});

// Error handlers using ui-lib components
router.register("GET", "/404", (req: Request) => {
  if (req.url.includes("/api/")) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const errorPage = (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>404 - Not Found</title>
        <style>{styles}</style>
      </head>
      <body>
        <main class="main" style="padding: 3rem 0;">
          <div style="max-width: 768px; margin: 0 auto; padding: 0 1rem;">
            <Alert variant="error" title="404 - Not Found">
              The requested resource could not be found.
            </Alert>
            <div style="text-align: center; margin-top: 1rem;">
              <Button variant="primary" onClick="window.location.href='/'">
                ← Back to Todo App
              </Button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );

  return new Response(`<!DOCTYPE html>\n${errorPage}`, {
    status: 404,
    headers: { "Content-Type": "text/html" },
  });
});

// Start server
const port = Number(Deno.env.get("PORT")) || 8080;

console.log(`
🚀 Todo App Server (Refactored with ui-lib)
📍 http://localhost:${port}

This demonstrates proper ui-lib usage:
✅ Simple JSX functions with ui-lib components
✅ Library components (Button, Badge, Alert, Container)
✅ Consistent styling with design system
✅ HTMX integration preserved
✅ Type-safe props and data flow
✅ Responsive design with component variants

Available endpoints:
• GET / - Main todo application
• GET /api - API documentation
• GET /health - Health check
• Full RESTful API at /api/todos

Press Ctrl+C to stop
`);

Deno.serve({ port }, async (req) => {
  // Add CORS headers for development
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, hx-request, hx-target, hx-current-url",
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

    // 404 handler - fallback if no route matches
    return new Response(
      `<!DOCTYPE html>\n${(
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <title>404 - Not Found</title>
            <style>{styles}</style>
          </head>
          <body>
            <main class="main" style="padding: 3rem 0;">
              <div style="max-width: 768px; margin: 0 auto; padding: 0 1rem; text-align: center;">
                <h1>404 - Not Found</h1>
                <p>The requested resource could not be found.</p>
                <Button variant="primary" onClick="window.location.href='/'">
                  ← Back to Todo App
                </Button>
              </div>
            </main>
          </body>
        </html>
      )}`,
      {
        status: 404,
        headers: { "Content-Type": "text/html", ...corsHeaders },
      },
    );
  } catch (error) {
    console.error("Server error:", error);

    return new Response(
      `<!DOCTYPE html>\n${(
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <title>500 - Server Error</title>
            <style>{styles}</style>
          </head>
          <body>
            <main class="main" style="padding: 3rem 0;">
              <div style="max-width: 768px; margin: 0 auto; padding: 0 1rem; text-align: center; color: #dc2626;">
                <h1>500 - Server Error</h1>
                <p>Something went wrong. Please try again later.</p>
                <Button variant="primary" onClick="window.location.href='/'">
                  ← Back to Todo App
                </Button>
              </div>
            </main>
          </body>
        </html>
      )}`,
      {
        status: 500,
        headers: { "Content-Type": "text/html", ...corsHeaders },
      },
    );
  }
});

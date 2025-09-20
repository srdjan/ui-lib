#!/usr/bin/env deno run --allow-net --allow-read --allow-env

/** @jsx h */

/**
 * Todo App - Modern CSS Architecture Demo
 * Demonstrates the modernized CSS system with side-by-side comparison
 */

import { h } from "../../lib/simple.tsx";
import { html, Router } from "../../mod-simple.ts";
import { registerComponentApi, renderComponent } from "../../mod.ts";
import { css, dev, ModernCSS } from "../../lib/modern-css.ts";
import { todoAPI } from "./api/index.ts";
import type { TodoFilter } from "./api/types.ts";

// Import components to register them
import "./components/index.ts";
import "./components/TodoItem.modern.tsx";
import "./components/TodoList.modern.tsx";

void h;

// Initialize modern CSS system in development mode
dev.init();

const router = new Router();

// Initialize repository
console.log("Initializing repository...");
const repositoryResult = await ensureRepository();
if (!repositoryResult.ok) {
  console.error("Failed to initialize repository:", repositoryResult.error);
  Deno.exit(1);
}
console.log("Repository initialized successfully");

// Register component APIs with the router
registerComponentApi("todo-item", router);
registerComponentApi("todo-item-modern", router);
registerComponentApi("todo-form", router);
registerComponentApi("todo-filters", router);

// Data helpers using functional repository
import { ensureRepository, getRepository } from "./api/index.ts";

const getUsers = async (): Promise<readonly string[]> => {
  const repository = getRepository();
  const r = await repository.getUsers();
  return r.ok ? r.value : [];
};

const firstUser = async (url: URL): Promise<string> => {
  const users = await getUsers();
  return url.searchParams.get("user") || users[0];
};

const getStats = async (userId: string) => {
  const repository = getRepository();
  const r = await repository.getStats(userId);
  return r.ok ? r.value : { total: 0, active: 0, completed: 0 };
};

const getTodos = async (filter: TodoFilter, userId: string) => {
  const repository = getRepository();
  const r = await repository.filter(filter, userId);
  return r.ok ? r.value : [];
};

// Modern CSS architecture demonstration styles
const modernArchitectureStyles = dev.stylesheet();

// Comparison demo styles
const comparisonStyles = css.component("comparison-demo", {
  container: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: css.token("space", "8"),
    padding: css.token("space", "6"),
    containerType: "inline-size",

    "@container": {
      "(max-width: 900px)": {
        gridTemplateColumns: "1fr",
        gap: css.token("space", "6"),
      },
    },
  },

  section: {
    padding: css.token("space", "6"),
    backgroundColor: css.token("surface", "background"),
    border: `1px solid ${css.token("surface", "border")}`,
    borderRadius: css.token("radius", "lg"),
  },

  header: {
    marginBlockEnd: css.token("space", "6"),
    paddingBlockEnd: css.token("space", "4"),
    borderBlockEnd: `1px solid ${css.token("surface", "border")}`,

    h2: {
      fontSize: css.token("typography", "xl-size"),
      fontWeight: css.token("typography", "bold"),
      color: css.token("color", "text-primary"),
      marginBlockEnd: css.token("space", "2"),
    },

    p: {
      fontSize: css.token("typography", "sm-size"),
      color: css.token("color", "text-secondary"),
      lineHeight: css.token("typography", "relaxed"),
    },
  },
});

// Main application page with side-by-side comparison
router.register("GET", "/", async (req: Request) => {
  const url = new URL(req.url);
  const currentUser = await firstUser(url);
  const filter: TodoFilter = { status: "all" };
  const stats = await getStats(currentUser);
  const todos = await getTodos(filter, currentUser);

  const nav = (
    <div class="top-nav">
      <div style="display:flex; flex-direction:column; gap:2px;">
        <div class="app-title">Modern CSS Architecture Demo</div>
        <div class="app-subtitle">Comparing old vs new CSS patterns</div>
      </div>
      <div style="margin-left:auto; display:flex; gap:0.5rem;">
        <a
          class="active"
          hx-get={`/home?user=${currentUser}`}
          hx-target="#content"
          hx-swap="innerHTML"
        >
          Comparison
        </a>
        <a
          hx-get={`/modern-only?user=${currentUser}`}
          hx-target="#content"
          hx-swap="innerHTML"
        >
          Modern Only
        </a>
        <a
          hx-get={`/stats?user=${currentUser}`}
          hx-target="#content"
          hx-swap="innerHTML"
        >
          CSS Stats
        </a>
      </div>
    </div>
  );

  const content = (
    <div class="comparison-demo">
      <section class="legacy-demo">
        <header>
          <h2>Legacy CSS-in-TS</h2>
          <p>Original component styling with inline CSS</p>
        </header>
        <div
          dangerouslySetInnerHTML={{
            __html: renderComponent("todo-form", { userId: currentUser }),
          }}
        />
        <div
          dangerouslySetInnerHTML={{
            __html: renderComponent("todo-filters", {
              currentFilter: JSON.stringify(filter),
              todoCount: JSON.stringify(stats),
              userId: currentUser,
            }),
          }}
        />
        <div
          dangerouslySetInnerHTML={{
            __html: renderComponent("todo-list", {
              todos: JSON.stringify(todos),
              filter: JSON.stringify(filter),
            }),
          }}
        />
      </section>

      <section class="modern-demo">
        <header>
          <h2>Modern CSS Architecture</h2>
          <p>Design tokens, container queries, cascade layers</p>
        </header>
        <div
          dangerouslySetInnerHTML={{
            __html: renderComponent("todo-form", { userId: currentUser }),
          }}
        />
        <div
          dangerouslySetInnerHTML={{
            __html: renderComponent("todo-filters", {
              currentFilter: JSON.stringify(filter),
              todoCount: JSON.stringify(stats),
              userId: currentUser,
            }),
          }}
        />
        <div
          dangerouslySetInnerHTML={{
            __html: renderComponent("todo-list-modern", {
              todos: JSON.stringify(todos),
              filter: JSON.stringify(filter),
            }),
          }}
        />
      </section>
    </div>
  );

  // Create the full page with modern CSS architecture
  const page = (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Modern CSS Architecture Demo - ui-lib</title>
        <style>{modernArchitectureStyles}</style>
        <style>{comparisonStyles.css}</style>
        <style>{`
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
            max-width: 1400px;
            margin: 1.5rem auto;
            padding: 0 1rem;
          }

          .comparison-demo {
            ${comparisonStyles.classMap.container}
          }

          .legacy-demo, .modern-demo {
            ${comparisonStyles.classMap.section}
          }

          .legacy-demo header, .modern-demo header {
            ${comparisonStyles.classMap.header}
          }

          .legacy-demo h2, .modern-demo h2 {
            ${comparisonStyles.classMap.header.h2}
          }

          .legacy-demo p, .modern-demo p {
            ${comparisonStyles.classMap.header.p}
          }
        `}</style>
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
        <script src="https://unpkg.com/htmx.org@1.9.10/dist/ext/json-enc.js">
        </script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          window.editTodo = function(id) { alert('Edit UI not implemented in MVP'); };
          document.addEventListener('htmx:beforeRequest', function(e) { e.target.classList.add('htmx-request'); });
          document.addEventListener('htmx:afterRequest', function(e) { e.target.classList.remove('htmx-request'); });

          // Modern CSS debugging
          ${ModernCSS.enableDevFeatures ? "window.toggleCSSDebug = " + ModernCSS.enableDevFeatures.toString() + ";" : ""}
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

        <footer style="text-align: center; color: #9ca3af; font-size: 0.875rem; padding: 2rem; margin-top: 3rem;">
          <p>
            Modern CSS Architecture Demo - Built with <strong>ui-lib</strong>
          </p>
          <p>
            Features: Design tokens • Container queries • Cascade layers • Modern selectors
          </p>
        </footer>
      </body>
    </html>
  );

  return new Response(`<!DOCTYPE html>\n${page}`, {
    headers: { "Content-Type": "text/html" },
  });
});

// Modern-only view
router.register("GET", "/modern-only", async (req: Request) => {
  const url = new URL(req.url);
  const currentUser = await firstUser(url);
  const filter: TodoFilter = { status: "all" };
  const stats = await getStats(currentUser);
  const todos = await getTodos(filter, currentUser);

  const fragment = (
    <div style="max-width: 800px; margin: 0 auto;">
      <div
        dangerouslySetInnerHTML={{
          __html: renderComponent("todo-form", { userId: currentUser }),
        }}
      />
      <div
        dangerouslySetInnerHTML={{
          __html: renderComponent("todo-filters", {
            currentFilter: JSON.stringify(filter),
            todoCount: JSON.stringify(stats),
            userId: currentUser,
          }),
        }}
      />
      <div
        dangerouslySetInnerHTML={{
          __html: renderComponent("todo-list-modern", {
            todos: JSON.stringify(todos),
            filter: JSON.stringify(filter),
          }),
        }}
      />
    </div>
  );

  return new Response(`${fragment}`, {
    headers: { "Content-Type": "text/html" },
  });
});

// CSS Statistics page
router.register("GET", "/stats", () => {
  const stats = dev.stats();

  const fragment = (
    <div style="max-width: 600px; margin: 0 auto; padding: 2rem; background: white; border-radius: 8px;">
      <h2>CSS Bundle Statistics</h2>
      <div style="display: grid; gap: 1rem;">
        <div>
          <strong>Total Size:</strong> {Math.round(stats.totalSize / 1024 * 100) / 100}KB
        </div>
        <div>
          <strong>Gzipped Size:</strong> {Math.round(stats.gzippedSize / 1024 * 100) / 100}KB
        </div>
        <div>
          <strong>Components:</strong> {stats.components.join(", ")}
        </div>
        <h3>Layer Breakdown:</h3>
        <ul>
          {Object.entries(stats.layers).map(([layer, size]) => (
            <li><strong>{layer}:</strong> {Math.round(size / 1024 * 100) / 100}KB</li>
          )).join("")}
        </ul>
      </div>
    </div>
  );

  return new Response(`${fragment}`, {
    headers: { "Content-Type": "text/html" },
  });
});

// Keep existing API routes
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
router.register("GET", "/health", async () => {
  const users = await getUsers();
  const currentUser = users[0];
  const stats = await getStats(currentUser);
  return new Response(
    JSON.stringify({
      status: "healthy",
      timestamp: new Date().toISOString(),
      todos: stats,
      css: "modern",
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
});

// Start server
const port = Number(Deno.env.get("PORT")) || 8081;

console.log(`
🎨 Modern CSS Architecture Demo
📍 http://localhost:${port}

This demonstrates the modernized CSS system with:
✅ Design tokens and semantic aliases
✅ Container queries for responsive components
✅ Cascade layers for specificity management
✅ Modern CSS features (logical properties, focus-visible)
✅ Component design system with variants
✅ Performance optimization and bundling

Available features:
• Side-by-side comparison: GET /
• Modern components only: GET /modern-only
• CSS bundle statistics: GET /stats
• CSS Debug Mode: Call toggleCSSDebug() in console

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
    console.log(`${req.method} ${req.url}`);
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
    return html(
      `
      <div style="text-align: center; padding: 3rem;">
        <h1>404 - Not Found</h1>
        <p>The requested resource could not be found.</p>
        <a href="/" style="color: #3b82f6;">← Back to Modern CSS Demo</a>
      </div>
    `,
      { status: 404 },
    );
  } catch (error) {
    console.error("Server error:", error);

    return html(
      `
      <div style="text-align: center; padding: 3rem; color: #dc2626;">
        <h1>500 - Server Error</h1>
        <p>Something went wrong. Please try again later.</p>
        <a href="/" style="color: #3b82f6;">← Back to Modern CSS Demo</a>
      </div>
    `,
      { status: 500 },
    );
  }
});
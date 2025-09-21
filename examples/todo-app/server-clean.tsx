#!/usr/bin/env deno run --allow-net --allow-read --allow-env

/**
 * Todo App - Clean Component Architecture
 * Demonstrates clean separation of concerns with no inline CSS
 */

import { html, Router } from "../../mod-simple.ts";

// Import component system
import { renderComponent } from "../../lib/component-state.ts";

// Import all todo components
import "./components/index.ts";

// Import API functionality
import { todoAPI } from "./api/index.ts";
import type { Todo, TodoFilter } from "./api/types.ts";
import { ensureRepository, getRepository } from "./api/index.ts";

const router = new Router();

// Initialize repository
console.log("Initializing repository...");
const repositoryResult = await ensureRepository();
if (!repositoryResult.ok) {
  console.error("Failed to initialize repository:", repositoryResult.error);
  Deno.exit(1);
}
console.log("Repository initialized successfully");

// Data helpers
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

// Main application page
router.register("GET", "/", async (req: Request) => {
  const url = new URL(req.url);
  const currentUser = await firstUser(url);
  const filter: TodoFilter = { status: "all" };
  const stats = await getStats(currentUser);
  const todos = await getTodos(filter, currentUser);

  // Use the clean TodoApp component
  const appHtml = renderComponent("todo-app", {
    todos,
    stats,
  });

  return new Response(appHtml, {
    headers: { "Content-Type": "text/html" },
  });
});

// API Routes - reuse existing API
router.register("POST", "/api/todos", async (req: Request) => {
  const response = await todoAPI.createTodo(req);

  // Redirect to refresh the page for this demo
  if (response.status === 200) {
    return new Response(null, {
      status: 302,
      headers: { "Location": "/" },
    });
  }

  return response;
});

router.register(
  "DELETE",
  "/api/todos/:id",
  async (req: Request, params: Record<string, string>) => {
    await todoAPI.deleteTodo(req, params as { id: string });

    // Return JSON response for AJAX requests
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
);

router.register("GET", "/health", async () => {
  const users = await getUsers();
  const currentUser = users[0];
  const stats = await getStats(currentUser);
  return new Response(
    JSON.stringify({
      status: "healthy",
      timestamp: new Date().toISOString(),
      todos: stats,
      architecture: "clean-components",
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
});

// Start server
const port = Number(Deno.env.get("PORT")) || 8086;

console.log(`
🎯 Todo App - Clean Component Architecture
📍 http://localhost:${port}

This demonstrates a refactored todo application with:
✅ Separated component files
✅ Library layout components
✅ No inline CSS - only library styles
✅ Clean separation of concerns
✅ Reusable component architecture

Benefits:
• Clear component boundaries
• No CSS maintenance overhead
• Consistent design system usage
• Improved testability and maintainability

Press Ctrl+C to stop
`);

Deno.serve({ port }, async (req) => {
  // Add CORS headers for development
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
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
        <a href="/" style="color: #3b82f6;">← Back to Clean Component Demo</a>
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
        <a href="/" style="color: #3b82f6;">← Back to Clean Component Demo</a>
      </div>
    `,
      { status: 500 },
    );
  }
});
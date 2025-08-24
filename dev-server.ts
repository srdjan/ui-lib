#!/usr/bin/env deno run --allow-net --allow-read --allow-env
import { renderComponent } from "./src/index.ts";
import { 
  generateComponentId, 
  initializeComponentState, 
  executeComponentAction, 
  renderComponentWithState 
} from "./src/lib/component-state.ts";

/**
 * Simple development server for SSR TypeScript/JSX files
 * Serves TypeScript files with JavaScript MIME type so browsers can load them as modules
 */

const port = Number(Deno.env.get("PORT") ?? "8080");

// Component state tracking for the demo
const componentInstances = new Map<string, { name: string; props: Record<string, unknown> }>();

// Handle component action API endpoints
async function handleComponentAction(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  
  // Expected path: /api/component/{componentName}/{componentId}/{actionName}
  if (pathParts.length !== 6) {
    return new Response('Invalid API path', { status: 400 });
  }
  
  const [, , , componentName, componentId, actionName] = pathParts;
  
  try {
    // Get action arguments from the request body or URL params
    let args: unknown[] = [];
    if (request.method === 'POST') {
      try {
        const contentType = request.headers.get('content-type');
        if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
          // Handle form data
          const formData = await request.formData();
          if (actionName === 'addTask') {
            const taskText = formData.get('taskText');
            args = [taskText];
          }
        } else {
          // Handle JSON data
          const body = await request.json();
          args = body.args || [];
        }
      } catch {
        // If no valid body, try URL parameters
        const argsParam = url.searchParams.get('args');
        if (argsParam) {
          args = JSON.parse(argsParam);
        }
      }
    }
    
    // Execute the action and get updated state
    const newState = executeComponentAction(componentId, componentName, actionName, args);
    
    if (!newState) {
      return new Response('Component or action not found', { status: 404 });
    }
    
    // Get component props for rendering
    const instance = componentInstances.get(componentId);
    const props = instance?.props || {};
    
    // Render the updated component
    const updatedHtml = renderComponentWithState(componentId, componentName, props);
    
    return new Response(updatedHtml, {
      headers: { 
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    console.error('Action execution error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

console.log(`🚀 SSR Development server starting on http://localhost:${port}`);
console.log("🧩 SSR-only demo server; no client-side JS");

Deno.serve({
  port,
  handler: async (request: Request) => {
    const url = new URL(request.url);

    // Handle favicon
    if (url.pathname === "/favicon.ico") {
      try {
        const favicon = await Deno.readFile("./examples/favicon.ico");
        return new Response(favicon, {
          headers: { "content-type": "image/x-icon" },
        });
      } catch {
        return new Response(null, { status: 404 });
      }
    }

    try {
      const filePath = `./examples${url.pathname}`;

      // Handle component action API endpoints
      if (url.pathname.startsWith("/api/component/")) {
        return await handleComponentAction(request);
      }

      // Handle root path with SSR render
      if (url.pathname === "/") {
        try {
          let html = await Deno.readTextFile("./examples/index.html");
          
          // Load all example modules so they self-register
          const modUrls = [
            "./examples/counter.tsx",
            "./examples/counter-jsx.tsx", 
            "./examples/todo-list.tsx"
          ];
          
          for (const modPath of modUrls) {
            const modUrl = new URL(modPath, `file://${Deno.cwd()}/`).href;
            await import(modUrl);
          }
          
          // Remove client script for SSR-only demo
          html = html.replace(
            /<script[^>]*src=\"\.\/main\.ts\"[^>]*><\/script>/,
            "",
          );
          
          // Replace all component tags with their SSR output using stateful rendering
          
          // Counter 1
          const counter1Id = generateComponentId("f-counter-pipeline");
          componentInstances.set(counter1Id, { name: "f-counter-pipeline", props: { step: 3 } });
          initializeComponentState(counter1Id, "f-counter-pipeline", { step: 3 });
          html = html.replace(
            /<f-counter-pipeline step="3"><\/f-counter-pipeline>/,
            `<div id="${counter1Id}">${renderComponentWithState(counter1Id, "f-counter-pipeline", { step: 3 })}</div>`,
          );
          
          // Counter 2  
          const counter2Id = generateComponentId("f-counter-pipeline");
          componentInstances.set(counter2Id, { name: "f-counter-pipeline", props: { step: 2 } });
          initializeComponentState(counter2Id, "f-counter-pipeline", { step: 2 });
          html = html.replace(
            /<f-counter-pipeline step="2"><\/f-counter-pipeline>/,
            `<div id="${counter2Id}">${renderComponentWithState(counter2Id, "f-counter-pipeline", { step: 2 })}</div>`,
          );
          
          // Styled counter
          const styledCounterId = generateComponentId("f-counter-styled");
          componentInstances.set(styledCounterId, { name: "f-counter-styled", props: { step: 5 } });
          initializeComponentState(styledCounterId, "f-counter-styled", { step: 5 });
          html = html.replace(
            /<f-counter-styled step="5"><\/f-counter-styled>/,
            `<div id="${styledCounterId}">${renderComponentWithState(styledCounterId, "f-counter-styled", { step: 5 })}</div>`,
          );
          
          // Todo list
          const todoId = generateComponentId("f-todo-list");
          componentInstances.set(todoId, { name: "f-todo-list", props: {} });
          initializeComponentState(todoId, "f-todo-list", {});
          html = html.replace(
            /<f-todo-list><\/f-todo-list>/,
            `<div id="${todoId}">${renderComponentWithState(todoId, "f-todo-list", {})}</div>`,
          );
          
          return new Response(html, {
            headers: { "content-type": "text/html; charset=utf-8" },
          });
        } catch (e) {
          console.error("SSR error: ", e?.message ?? e);
          // Fallback: serve original index.html (client script stays)
          const fallback = await Deno.readFile("./examples/index.html");
          return new Response(fallback, {
            headers: { "content-type": "text/html; charset=utf-8" },
          });
        }
      }

      // Block direct serving of TS/TSX to the browser
      if (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) {
        return new Response(
          "/* TS/TSX should not be sent to the browser. Use SSR. */",
          {
            status: 400,
            headers: {
              "content-type": "application/javascript; charset=utf-8",
            },
          },
        );
      }

      // For other files, determine MIME type
      const content = await Deno.readFile(filePath);
      let contentType = "text/plain";

      if (filePath.endsWith(".html")) {
        contentType = "text/html; charset=utf-8";
      } else if (filePath.endsWith(".js")) {
        contentType = "application/javascript; charset=utf-8";
      } else if (filePath.endsWith(".css")) {
        contentType = "text/css; charset=utf-8";
      } else if (filePath.endsWith(".json")) {
        contentType = "application/json; charset=utf-8";
      }

      return new Response(content, {
        headers: {
          "content-type": contentType,
          "cache-control": "no-cache, no-store, must-revalidate",
        },
      });
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        console.log(`404: ${url.pathname}`);
        return new Response("Not found", { status: 404 });
      }
      console.error("Server error:", error);
      return new Response("Server error", { status: 500 });
    }
  },
});

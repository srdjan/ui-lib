#!/usr/bin/env deno run --allow-net --allow-read --allow-env
import { renderComponent } from "./src/index.ts";

/**
 * Simple development server for DOM-native SSR components
 * Serves TypeScript files and renders components server-side
 */

const port = Number(Deno.env.get("PORT") ?? "8080");

console.log(`🚀 DOM-Native SSR Development server starting on http://localhost:${port}`);
console.log("🧩 DOM-native components with SSR");

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

      // Handle root path with SSR render
      if (url.pathname === "/") {
        try {
          let html = await Deno.readTextFile("./examples/index.html");
          
          // Load DOM-native examples to register components
          const modUrl = new URL("./examples/dom-native-examples.tsx", `file://${Deno.cwd()}/`).href;
          await import(modUrl);
          
          // Remove client script for SSR-only demo
          html = html.replace(
            /<script[^>]*src="\.\/main\.ts"[^>]*><\/script>/,
            "",
          );
          
          // Replace component tags with SSR output
          html = html.replace(
            /<f-theme-toggle-dom><\/f-theme-toggle-dom>/g,
            renderComponent("f-theme-toggle-dom")
          );
          
          html = html.replace(
            /<f-counter-dom([^>]*)><\/f-counter-dom>/g,
            (match, attrs) => {
              const props: Record<string, unknown> = {};
              // Parse attributes
              const stepMatch = attrs.match(/step="([^"]*)"/);
              const initialCountMatch = attrs.match(/initialCount="([^"]*)"/)
              
              if (stepMatch) props.step = parseInt(stepMatch[1]);
              if (initialCountMatch) props.initialCount = parseInt(initialCountMatch[1]);
              
              return renderComponent("f-counter-dom", props);
            }
          );
          
          html = html.replace(
            /<f-todo-item-dom([^>]*)><\/f-todo-item-dom>/g,
            (match, attrs) => {
              const props: Record<string, unknown> = {};
              // Parse attributes
              const idMatch = attrs.match(/id="([^"]*)"/);
              const textMatch = attrs.match(/text="([^"]*)"/);
              const doneMatch = attrs.match(/done="([^"]*)")/);
              
              if (idMatch) props.id = idMatch[1];
              if (textMatch) props.text = textMatch[1];
              if (doneMatch) props.done = doneMatch[1] === "true";
              
              return renderComponent("f-todo-item-dom", props);
            }
          );
          
          html = html.replace(
            /<f-accordion-dom([^>]*)><\/f-accordion-dom>/g,
            (match, attrs) => {
              const props: Record<string, unknown> = {};
              // Parse attributes
              const titleMatch = attrs.match(/title="([^"]*)"/);
              const contentMatch = attrs.match(/content="([^"]*)"/);
              const initiallyOpenMatch = attrs.match(/initiallyOpen="([^"]*)")/);
              
              if (titleMatch) props.title = titleMatch[1];
              if (contentMatch) props.content = contentMatch[1];
              if (initiallyOpenMatch) props.initiallyOpen = initiallyOpenMatch[1] === "true";
              
              return renderComponent("f-accordion-dom", props);
            }
          );
          
          html = html.replace(
            /<f-tabs-dom([^>]*)><\/f-tabs-dom>/g,
            (match, attrs) => {
              const props: Record<string, unknown> = {};
              // Parse attributes
              const tabsMatch = attrs.match(/tabs="([^"]*)"/);
              const activeTabMatch = attrs.match(/activeTab="([^"]*)"/);
              
              if (tabsMatch) props.tabs = tabsMatch[1];
              if (activeTabMatch) props.activeTab = activeTabMatch[1];
              
              return renderComponent("f-tabs-dom", props);
            }
          );
          
          return new Response(html, {
            headers: { "content-type": "text/html; charset=utf-8" },
          });
        } catch (e) {
          console.error("SSR error: ", e?.message ?? e);
          // Fallback: serve original index.html
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
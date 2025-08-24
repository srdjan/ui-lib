#!/usr/bin/env deno run --allow-net --allow-read --allow-env
import { renderComponent } from "./src/index.ts";

/**
 * Simple development server for SSR TypeScript/JSX files
 * Serves TypeScript files with JavaScript MIME type so browsers can load them as modules
 */

const port = Number(Deno.env.get("PORT") ?? "8080");

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

      // Handle root path with SSR render
      if (url.pathname === "/") {
        try {
          const html = await Deno.readTextFile("./examples/index.html");
          // Load example module so it self-registers, then render the component
          const modUrl = new URL("./examples/counter.tsx", `file://${Deno.cwd()}/`).href;
          await import(modUrl);
          const ssr = renderComponent("f-counter-pipeline", { step: 3 });
          const withoutClient = html.replace(
            /<script[^>]*src=\"\.\/main\.ts\"[^>]*><\/script>/,
            "",
          );
          const rendered = withoutClient.replace(
            /<f-counter-pipeline[^>]*><\/f-counter-pipeline>/,
            ssr,
          );
          return new Response(rendered, {
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

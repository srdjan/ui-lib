#!/usr/bin/env deno run --allow-net --allow-read --allow-env
import { renderComponent } from "./src/index.ts";
import { getRegistry } from "./src/lib/registry.ts";

/**
 * Simple development server for DOM-native SSR components
 */

const port = Number(Deno.env.get("PORT") ?? "8080");

console.log(`🚀 DOM-Native SSR Development server starting on http://localhost:${port}`);
console.log("🧩 DOM-native components with SSR");

/**
 * Parses attributes from an HTML tag string.
 * @param attrString The string of attributes (e.g., 'key="value" name="test"').
 * @returns An object of key-value pairs.
 */
const parseAttributes = (attrString: string): Record<string, string> => {
  const attrs: Record<string, string> = {};
  const regex = /([a-zA-Z0-9-]+)=["'](.*?)["']/g;
  let match;
  while ((match = regex.exec(attrString)) !== null) {
    attrs[match[1]] = match[2];
  }
  return attrs;
};

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
      // Handle root path with dynamic component rendering
      if (url.pathname === "/") {
        try {
          let html = await Deno.readTextFile("./examples/index.html");

          // Load DOM-native examples to register components
          const modUrl = new URL(`./examples/dom-native-examples.tsx`, `file://${Deno.cwd()}/`).href;
          await import(modUrl);

          const componentRegistry = getRegistry();
          const componentNames = Object.keys(componentRegistry);

          // Regex to find all component tags: <f-component-name ...></f-component-name>
          const componentRegex = new RegExp(`(<(${componentNames.join('|')})([^>]*)>)(</\2>)`, 'g');

          html = html.replace(componentRegex, (match, openTag, tagName, attrString) => {
            console.log(`Rendering component: <${tagName}>`);
            const props = parseAttributes(attrString.trim());
            return renderComponent(tagName, props);
          });

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

      const filePath = `./examples${url.pathname}`;

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

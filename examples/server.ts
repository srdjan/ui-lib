#!/usr/bin/env deno run --allow-net --allow-read --allow-env
import { renderComponent } from "../src/index.ts";
import { getRegistry } from "../src/lib/registry.ts";
import { appRouter } from "../src/lib/router.ts";
import { runWithRequestHeaders } from "../src/lib/request-headers.ts";
import { injectStateManager } from "../src/index.ts";

/**
 * Generic development server with component-defined routes.
 */

const port = Number(Deno.env.get("PORT") ?? "8080");

console.log(
  `🚀 Generic SSR Development server starting on http://localhost:${port}`,
);

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

// Load all examples to register components and their routes
const modUrl = new URL(`./main.ts`, `file://${Deno.cwd()}/`).href;
await import(modUrl);

Deno.serve({
  port,
  handler: async (request: Request) => {
    const url = new URL(request.url);

    // 1. Try to match an API route first
    const apiMatch = appRouter.match(request);
    if (apiMatch) {
      console.log(
        `[Server] Matched API route: ${request.method} ${url.pathname}`,
      );
      return await apiMatch.handler(request, apiMatch.params);
    }

    // 2. If no API route, handle special files like favicon
    if (url.pathname === "/favicon.ico") {
      try {
        const favicon = await Deno.readFile("./favicon.ico");
        return new Response(favicon, {
          headers: { "content-type": "image/x-icon" },
        });
      } catch {
        return new Response(null, { status: 404 });
      }
    }

    try {
      // 3. SSR-render any HTML page (index.html and others)
      if (url.pathname === "/" || url.pathname.endsWith(".html")) {
        const file = url.pathname === "/" ? "./index.html" : `.${url.pathname}`;
        let htmlTemplate = await Deno.readTextFile(file);
        const componentRegistry = getRegistry();
        const componentNames = Object.keys(componentRegistry);
        if (componentNames.length > 0) {
          const componentRegex = new RegExp(
            `(<(${componentNames.join("|")})([^>]*)>)(</\\2>)`,
            "g",
          );
          const csrfToken = crypto.randomUUID();
          const stateManagerScript = injectStateManager(false, { debugMode: true });
          const stateAdapter = `
            <script>
              (function(){
                function ready(fn){
                  if (document.readyState !== 'loading') return fn();
                  document.addEventListener('DOMContentLoaded', fn);
                }
                ready(function(){
                  if (!window.funcwcState) return;
                  const api = window.funcwcState;
                  const adapter = {
                    publish: api.publish.bind(api),
                    subscribe: api.subscribe.bind(api),
                    getState: api.getState.bind(api),
                    getTopics: api.getTopics.bind(api),
                    persistState: function(){
                      try {
                        const topics = ['todos','user-preferences','dashboard-settings','cart'];
                        const data = {};
                        topics.forEach((t)=>{ const v = api.getState(t); if (v !== undefined) data[t] = v; });
                        localStorage.setItem('funcwc-app-state', JSON.stringify(data));
                      } catch (_) { /* ignore */ }
                    },
                    restoreState: function(){
                      try {
                        const saved = localStorage.getItem('funcwc-app-state');
                        if (!saved) return;
                        const data = JSON.parse(saved);
                        Object.entries(data).forEach(([k,v]) => api.publish(k, v));
                      } catch (_) { /* ignore */ }
                    }
                  };
                  window.StateManager = adapter;
                  adapter.restoreState();
                  setInterval(adapter.persistState, 30000);
                });
              })();
            </script>`;
          htmlTemplate = htmlTemplate.replace("</head>", `${stateManagerScript}\n${stateAdapter}\n</head>`);

          const rendered = runWithRequestHeaders({
            "X-CSRF-Token": csrfToken,
          }, () =>
            htmlTemplate.replace(
              componentRegex,
              (_match, _openTag, tagName, attrString) => {
                console.log(`[Server] Rendering component: <${tagName}>`);
                const props = parseAttributes(attrString.trim());
                return renderComponent(tagName, props);
              },
            ));

          return new Response(rendered, {
            headers: { "content-type": "text/html; charset=utf-8" },
          });
        } else {
          return new Response(htmlTemplate, {
            headers: { "content-type": "text/html; charset=utf-8" },
          });
        }
      }

      // 4. If still no match, fall back to serving static files
      let filePath = `.${url.pathname}`;
      
      // Handle directory requests by serving index.html
      if (url.pathname.endsWith('/')) {
        filePath = `${filePath}index.html`;
      }

      const content = await Deno.readFile(filePath);
      let contentType = "text/plain";
      if (filePath.endsWith(".js") || filePath.endsWith(".ts")) {
        contentType = "application/javascript; charset=utf-8";
      } else if (filePath.endsWith(".tsx")) {
        contentType = "application/javascript; charset=utf-8";
      } else if (filePath.endsWith(".css")) {
        contentType = "text/css; charset=utf-8";
      } else if (filePath.endsWith(".html")) {
        contentType = "text/html; charset=utf-8";
      }

      return new Response(content, {
        headers: { "content-type": contentType },
      });
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return new Response("Not found", { status: 404 });
      }
      console.error(
        `[Server] Error processing ${request.method} ${url.pathname}:`,
        error instanceof Error ? error.message : error,
        error instanceof Error && error.stack ? `\nStack: ${error.stack}` : "",
      );
      return new Response("Internal Server Error", { status: 500 });
    }
  },
});

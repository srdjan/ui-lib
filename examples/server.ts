// Development server for funcwc examples
import { renderComponent, injectStateManager } from "../index.ts";
import { runWithRequestHeaders } from "../lib/request-headers.ts";
import { renderCurrentDemo } from "./layout.tsx";

// Import components to register them
import "./layout.tsx";
import "./demo-counter.tsx";
import "./theme-controller.tsx";
import "./cart-demo.tsx";
import "./notification-demo.tsx";

const PORT = 8080;

// Simple in-memory caches with mtime-based invalidation for dev
let indexCache: { content: string; mtime?: number } | null = null;
const demoCache = new Map<string, { content: string; layoutMtime?: number }>();

async function readFileCached(path: string): Promise<string> {
  try {
    const stat = await Deno.stat(path);
    const mtime = stat.mtime?.getTime();
    if (!indexCache || indexCache.mtime !== mtime) {
      const content = await Deno.readTextFile(path);
      indexCache = { content, mtime };
    }
    return indexCache.content;
  } catch (_e) {
    // Fallback to direct read if stat fails
    return await Deno.readTextFile(path);
  }
}

async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const { pathname } = url;

  try {
    // Serve the main HTML file
    if (pathname === "/" || pathname === "/index.html") {
      let htmlContent = await readFileCached("./index.html");

      // Ensure the state manager is injected globally so inline actions can publish/subscribe
      // Inject before </head> to guarantee execution on initial load
      // Use minimal state manager to avoid any debug-script parsing quirks
      const sm = injectStateManager(true);
      if (!htmlContent.includes(sm)) {
        htmlContent = htmlContent.replace("</head>", `${sm}\n</head>`);
      }

      // Get demo parameter from URL
      const demo = url.searchParams.get("demo") || "welcome";

      // Per-request style dedup + header context
      const processedHtml = runWithRequestHeaders(
        {},
        () => processComponentTags(htmlContent, { currentDemo: demo }),
      );

      return new Response(processedHtml, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // Serve static files (assets, TypeScript modules, CSS, JS)
    if (
      pathname.startsWith("/assets/") || pathname.startsWith("/lib/") ||
      pathname.endsWith(".ts") || pathname.endsWith(".tsx")
    ) {
      try {
        // Handle TypeScript files by serving them with correct MIME type
        const filePath = pathname.startsWith("/") ? `.${pathname}` : pathname;
        const content = await Deno.readTextFile(filePath);

        let contentType = "text/plain";
        if (pathname.endsWith(".ts") || pathname.endsWith(".tsx")) {
          contentType = "application/typescript";
        } else if (pathname.endsWith(".css")) {
          contentType = "text/css; charset=utf-8";
        } else if (pathname.endsWith(".js")) {
          contentType = "application/javascript";
        }

        return new Response(content, {
          headers: { "Content-Type": contentType },
        });
      } catch {
        return new Response("File not found", { status: 404 });
      }
    }

    // Demo content endpoints for HTMX partial updates
    if (pathname.startsWith("/demo/")) {
      const demoType = pathname.split("/")[2]; // Extract demo type (welcome, basic, reactive)
      if (["welcome", "basic", "reactive"].includes(demoType)) {
        // Cache partial content per demo based on layout mtime
        let layoutMtime: number | undefined;
        try {
          const st = await Deno.stat("./layout.tsx");
          layoutMtime = st.mtime?.getTime();
        } catch (_) {
          // ignore
        }

        const cached = demoCache.get(demoType);
        if (!cached || cached.layoutMtime !== layoutMtime) {
          // Render full layout once and extract inner <main> content to preserve class names
          const full = runWithRequestHeaders(
            {},
            () => renderComponent("app-layout", { currentDemo: demoType }),
          );
          const start = full.indexOf("<main");
          const end = full.indexOf("</main>");
          let content = "";
          let stylesContent = "";
          if (start !== -1 && end !== -1) {
            const mainEl = full.slice(start, end + 7);
            const innerStart = mainEl.indexOf(">") + 1;
            const innerEnd = mainEl.lastIndexOf("</main>");
            content = mainEl.slice(innerStart, innerEnd);

            // Extract CSS styles from the full layout to include with the content
            const styleMatches = full.match(/<style[^>]*>[\s\S]*?<\/style>/g);
            if (styleMatches) {
              stylesContent = styleMatches.join("");
            }
          } else {
            // As a fallback, render using the helper (without styles)
            content = renderCurrentDemo(demoType, {});
          }
          // Process any nested component tags in the content only (no additional <style> tags)
          const processed = processComponentTags(content);
          const finalOut = stylesContent + processed;
          demoCache.set(demoType, { content: finalOut, layoutMtime });
        }

        const out = demoCache.get(demoType)!.content;
        return new Response(out, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }
    }

    // API endpoints (placeholder for future steps)
    if (pathname.startsWith("/api/")) {
      return new Response(
        JSON.stringify({ message: "API endpoints coming in future steps" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // 404 for other routes
    return new Response("Not Found", { status: 404 });
  } catch (error) {
    console.error("Server error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// Process HTML content and replace component tags with rendered HTML
function processComponentTags(
  html: string,
  extraProps: Record<string, string> = {},
): string {
  let processedHtml = html;

  // Find all custom component tags (e.g., <app-layout></app-layout> or <app-layout/>)
  const componentTagRegex = /<([a-z][a-z0-9-]*)([^>\/]*)(?:\/>|><\/\1>)/g;

  let match;
  while ((match = componentTagRegex.exec(html)) !== null) {
    const [fullMatch, tagName, attributes] = match;

    try {
      // Parse attributes into props object
      const props = parseAttributes(attributes);

      // Merge with extra props (extra props take precedence)
      const finalProps = { ...props, ...extraProps };

      // Render the component
      const renderedHTML = renderComponent(tagName, finalProps);

      // Replace the tag with rendered HTML
      processedHtml = processedHtml.replace(fullMatch, renderedHTML);
    } catch (error) {
      console.error(`Error rendering component ${tagName}:`, error);
      // Leave the original tag if rendering fails
    }
  }

  return processedHtml;
}

// Parse HTML attributes into props object
function parseAttributes(attributeString: string): Record<string, string> {
  const props: Record<string, string> = {};

  if (!attributeString?.trim()) {
    return props;
  }

  // Simple attribute parser (handles basic cases)
  const attributeRegex = /([a-z-]+)=["']([^"']*)["']|([a-z-]+)/g;

  let match;
  while ((match = attributeRegex.exec(attributeString)) !== null) {
    const [, name1, value, name2] = match;
    const name = name1 || name2;

    if (value !== undefined) {
      // Attribute with value
      props[name] = value;
    } else {
      // Boolean attribute
      props[name] = "true";
    }
  }

  return props;
}

console.log(`🚀 funcwc example server starting on http://localhost:${PORT}`);
console.log("📝 Open http://localhost:8080 to view the demo");

Deno.serve({ port: PORT }, handler);

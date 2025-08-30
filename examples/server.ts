// Development server for funcwc examples
import { renderComponent } from "../index.ts";

// Import layout component to register it
import "./layout.tsx";

const PORT = 8080;

async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const { pathname } = url;

  try {
    // Serve the main HTML file
    if (pathname === "/" || pathname === "/index.html") {
      const htmlContent = await Deno.readTextFile("./index.html");
      
      // Replace component tags with rendered HTML
      const processedHtml = processComponentTags(htmlContent);
      
      return new Response(processedHtml, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // Serve static files (TypeScript modules, CSS, JS)
    if (pathname.startsWith("/lib/") || pathname.endsWith(".ts") || pathname.endsWith(".tsx")) {
      try {
        // Handle TypeScript files by serving them with correct MIME type
        const filePath = pathname.startsWith("/") ? `.${pathname}` : pathname;
        const content = await Deno.readTextFile(filePath);
        
        const contentType = pathname.endsWith(".ts") || pathname.endsWith(".tsx")
          ? "application/typescript"
          : "text/plain";
          
        return new Response(content, {
          headers: { "Content-Type": contentType },
        });
      } catch {
        return new Response("File not found", { status: 404 });
      }
    }

    // API endpoints (placeholder for future steps)
    if (pathname.startsWith("/api/")) {
      return new Response(
        JSON.stringify({ message: "API endpoints coming in future steps" }), 
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
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
function processComponentTags(html: string): string {
  let processedHtml = html;
  
  // Find all custom component tags (e.g., <app-layout></app-layout> or <app-layout/>)
  const componentTagRegex = /<([a-z][a-z0-9-]*)([^>\/]*)(?:\/>|><\/\1>)/g;
  
  let match;
  while ((match = componentTagRegex.exec(html)) !== null) {
    const [fullMatch, tagName, attributes] = match;
    
    try {
      // Parse attributes into props object
      const props = parseAttributes(attributes);
      
      // Render the component
      const renderedHTML = renderComponent(tagName, props);
      
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
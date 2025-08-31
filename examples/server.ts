// Development server for funcwc examples
import { renderComponent } from "../index.ts";

// Import components to register them
import "./layout.tsx";
import "./demo-counter.tsx";

const PORT = 8080;

async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const { pathname } = url;

  try {
    // Serve the main HTML file
    if (pathname === "/" || pathname === "/index.html") {
      const htmlContent = await Deno.readTextFile("./index.html");
      
      // Get demo parameter from URL
      const demo = url.searchParams.get("demo") || "welcome";
      
      // Replace component tags with rendered HTML, passing demo parameter
      const processedHtml = processComponentTags(htmlContent, { currentDemo: demo });
      
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

    // Demo content endpoints for HTMX partial updates
    if (pathname.startsWith("/demo/")) {
      const demoType = pathname.split("/")[2]; // Extract demo type (welcome, basic, reactive)
      if (["welcome", "basic", "reactive"].includes(demoType)) {
        // Import and use the renderCurrentDemo function directly
        const layoutModule = await import("./layout.tsx");
        
        // We need to get the CSS classes from the app-layout component
        // For now, render the full layout to get the classes, then extract just the content
        const fullLayoutContent = renderComponent("app-layout", { currentDemo: demoType });
        
        // Extract the content area from the full layout
        const contentStart = fullLayoutContent.indexOf('<main');
        const contentEnd = fullLayoutContent.indexOf('</main>') + 7;
        
        if (contentStart !== -1 && contentEnd !== -1) {
          const mainElement = fullLayoutContent.slice(contentStart, contentEnd);
          // Extract just the inner content (without the main tag wrapper)
          const innerStart = mainElement.indexOf('>') + 1;
          const innerEnd = mainElement.lastIndexOf('</main>');
          const processedContent = mainElement.slice(innerStart, innerEnd);
          
          return new Response(processedContent, {
            headers: { "Content-Type": "text/html; charset=utf-8" },
          });
        } else {
          // Fallback to original approach
          const rawContent = layoutModule.renderCurrentDemo(demoType, {});
          const processedContent = processComponentTags(rawContent);
          
          return new Response(processedContent, {
            headers: { "Content-Type": "text/html; charset=utf-8" },
          });
        }
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
function processComponentTags(html: string, extraProps: Record<string, string> = {}): string {
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
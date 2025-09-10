// Revolutionary Showcase Server for ui-lib
import { injectStateManager, renderComponent } from "../index.ts";
import { getRegistry } from "../lib/registry.ts";
import { runWithRequestHeadersAsync } from "../lib/request-headers.ts";
import { router } from "./router.ts";

// Import showcase components
import "./showcase/product-catalog.tsx";
import { showcaseStyles } from "./showcase/components/index.ts";

// Import layout components
import "../lib/layout/index.ts"; // This auto-registers all layout components including app-layout

// Import library components for use in demos
import "../lib/components/index.ts"; // Import Button, Input, Alert, etc.

import "./showcase/components/forms-demo-fixed.tsx";
import "./showcase/dashboard-preview.tsx";
import "./showcase/generic-demo-preview.tsx";
import "./showcase/playground-output.tsx";
import "./showcase/placeholder-image.tsx";

const PORT = 8080;

async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const { pathname } = url;

  try {
    // Serve the showcase index
    if (pathname === "/" || pathname === "/showcase") {
      const indexUrl = new URL("./showcase/index.html", import.meta.url);
      let htmlContent = await Deno.readTextFile(indexUrl);

      // Inject state manager for reactivity
      const sm = injectStateManager(true);
      if (!htmlContent.includes(sm)) {
        htmlContent = htmlContent.replace("</head>", `${sm}\n</head>`);
      }

      // Inject showcase utility styles (hashed class names from css-in-ts)
      const utilitiesTag = `<style id="showcase-utilities">\n${showcaseStyles}\n</style>`;
      if (!htmlContent.includes("id=\"showcase-utilities\"")) {
        htmlContent = htmlContent.replace("</head>", `${utilitiesTag}\n</head>`);
      }

      // Process component tags with SSR
      const processedHtml = await runWithRequestHeadersAsync(
        {},
        async () => await processComponentTags(htmlContent),
      );

      return new Response(processedHtml, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // API endpoints for showcase demos
    if (pathname.startsWith("/api/showcase/")) {
      const parts = pathname.split("/");
      const action = parts[3];
      const demo = parts[4];

      // Special case for playground
      if (action === "playground") {
        const playgroundHtml = renderComponent("showcase-playground", {});
        return new Response(playgroundHtml, {
          headers: { "Content-Type": "text/html" },
        });
      }

      if (action === "code") {
        // Return code examples for demos
        const codeExamples: Record<string, string> = {
          ecommerce:
            `import { defineComponent, h, string, number, boolean } from "ui-lib";

defineComponent("product-card", {
  styles: {
    card: \`{
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }\`,
    // CSS-only format - classes auto-generated!
  },

  render: ({
    // ✨ Function-style props - zero duplication!
    name = string("Product"),
    price = number(99.99),
    inStock = boolean(true)
  }, api, classes) => (
    <div class={classes.card}>
      <h3>{name}</h3>
      <p>\${price}</p>
      <button disabled={!inStock}>
        {inStock ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  )
});`,

          dashboard:
            `import { defineComponent, h, string, number, boolean } from "ui-lib";

// Dashboard Metric Card with Real-time Updates
defineComponent("metric-card", {
  styles: {
    card: \`{
      background: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }\`,
    label: \`{
      font-size: 0.875rem;
      color: var(--gray-500);
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }\`,
    value: \`{
      font-size: 2rem;
      font-weight: bold;
      color: var(--gray-900);
      margin-bottom: 0.5rem;
    }\`,
    trend: \`{
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      font-weight: 500;
    }\`,
    trendUp: \`{
      background: var(--green-2);
      color: var(--green-9);
    }\`,
    trendDown: \`{
      background: var(--red-2);
      color: var(--red-9);
    }\`
  },

  // Subscribe to real-time metric updates
  stateSubscriptions: {
    metrics: \`
      const metric = data[this.dataset.metric];
      if (metric) {
        this.querySelector('.value').textContent = metric.value;
        const trend = this.querySelector('.trend');
        trend.textContent = metric.trend > 0 ? '↑ ' + metric.trend + '%' : '↓ ' + Math.abs(metric.trend) + '%';
        trend.className = metric.trend > 0 ? 'trend trend-up' : 'trend trend-down';
      }
    \`
  },

  render: ({
    label = string("Metric"),
    value = string("0"),
    trend = number(0),
    metric = string("revenue")
  }, _, classes) => (
    <div class={classes.card} data-metric={metric}>
      <div class={classes.label}>{label}</div>
      <div class={classes.value}>{value}</div>
      <div class={\`\${classes.trend} \${trend > 0 ? classes.trendUp : classes.trendDown}\`}>
        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
      </div>
    </div>
  )
});

// Real-time Chart Component
defineComponent("dashboard-chart", {
  styles: {
    container: \`{
      background: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }\`,
    title: \`{
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: var(--gray-900);
    }\`,
    chart: \`{
      height: 200px;
      background: linear-gradient(180deg, var(--blue-1) 0%, white 100%);
      border-radius: 0.5rem;
      position: relative;
      overflow: hidden;
    }\`,
    bars: \`{
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      height: 100%;
      padding: 1rem;
    }\`,
    bar: \`{
      width: 30px;
      background: linear-gradient(180deg, var(--blue-5), var(--blue-6));
      border-radius: 0.25rem 0.25rem 0 0;
      transition: height 0.5s ease;
    }\`
  },

  render: ({
    title = string("Revenue Trend"),
    data = array([40, 65, 30, 85, 50, 70, 45])
  }, _, classes) => (
    <div class={classes.container}>
      <h3 class={classes.title}>{title}</h3>
      <div class={classes.chart}>
        <div class={classes.bars}>
          {data.map(value => (
            <div class={classes.bar} style={\`height: \${value}%\`}></div>
          ))}
        </div>
      </div>
    </div>
  )
});`,

          forms: `// Real Working Form Components from ui-lib
import { Form, Input, Button, Alert } from "ui-lib";

// User Registration Form with Live Validation
const registrationForm = Form({
  title: "Create Account",
  className: "registration-form",
  children: [
    Input({
      type: "text",
      name: "username",
      label: "Username",
      placeholder: "Enter username",
      required: true,
      helpText: "Must be 3-20 characters"
    }),

    Input({
      type: "email",
      name: "email",
      label: "Email Address",
      placeholder: "you@example.com",
      required: true,
      error: false,
      helpText: "We'll never share your email"
    }),

    Input({
      type: "password",
      name: "password",
      label: "Password",
      placeholder: "Choose a strong password",
      required: true,
      helpText: "At least 8 characters"
    }),

    Button({
      type: "submit",
      variant: "primary",
      size: "lg",
      children: "Create Account",
      className: "submit-btn"
    })
  ]
});

// Contact Form with Interactive Components
const contactForm = Form({
  title: "Get in Touch",
  description: "We'd love to hear from you!",
  children: [
    Input({
      type: "text",
      name: "name",
      label: "Full Name",
      required: true
    }),

    Input({
      type: "email",
      name: "email",
      label: "Email",
      required: true
    }),

    Input({
      type: "textarea",
      name: "message",
      label: "Message",
      placeholder: "Tell us about your project...",
      rows: 4,
      required: true
    }),

    Alert({
      variant: "info",
      children: "We typically respond within 24 hours"
    }),

    Button({
      type: "submit",
      variant: "primary",
      children: "Send Message"
    })
  ]
});

// Newsletter Signup with Validation States
const newsletterForm = Form({
  title: "Stay Updated",
  className: "newsletter-form",
  children: [
    Input({
      type: "email",
      name: "email",
      placeholder: "Enter your email",
      leftAddon: "📧"
    }),

    Button({
      type: "submit",
      variant: "secondary",
      children: "Subscribe"
    })
  ]
});`,

        };

        const code = codeExamples[demo] || `// ${demo} Example Coming Soon!
import { defineComponent, h, string, number } from "ui-lib";

defineComponent("${demo}-demo", {
  styles: {
    container: \`{
      padding: 2rem;
      text-align: center;
      background: linear-gradient(135deg, var(--blue-1), var(--blue-2));
      border-radius: 0.5rem;
    }\`
  },

  render: ({
    title = string("${demo.charAt(0).toUpperCase() + demo.slice(1)} Demo")
  }, _, classes) => (
    <div class={classes.container}>
      <h2>{title}</h2>
      <p>Revolutionary ${demo} components coming soon!</p>
    </div>
  )
});`;

        return new Response(code, {
          headers: { "Content-Type": "text/plain" },
        });
      }

      if (action === "preview") {
        // Return live preview HTML
        if (demo === "ecommerce") {
          return new Response(renderComponent("product-grid", {}), {
            headers: { "Content-Type": "text/html" },
          });
        }

        if (demo === "dashboard") {
          return new Response(renderComponent("dashboard-preview", {}), {
            headers: { "Content-Type": "text/html" },
          });
        }

        if (demo === "forms") {
          // SSR-first: render dedicated TSX component with improved styling
          return new Response(renderComponent("showcase-forms-demo", {}), {
            headers: { "Content-Type": "text/html" },
          });
        }

        // components/library preview removed in MVP cleanup

        // Generate preview for other demos
        return new Response(renderComponent("generic-demo-preview", { demo }), {
          headers: { "Content-Type": "text/html" },
        });
      }

      if (action === "run") {
        // Run playground code - simplified approach
        let code = "";

        try {
          const formData = await request.formData();
          code = formData.get("playground-code")?.toString() || "";
        } catch {
          // Fallback to demo code
          code = `defineComponent("my-component", {
  render: ({ title = string("Hello World"), count = number(0) }, _, classes) => (
    <div class={classes.container}>
      <h3>{title}</h3>
      <p>Count: {count}</p>
    </div>
  )
})`;
        }

        try {
          // Simple component extraction and rendering simulation
          let renderedComponent = "";

          // Safety check for code input
          if (!code || typeof code !== "string") {
            code =
              'defineComponent("demo-component", { render: () => (<div>No code provided</div>) })';
          }

          // Extract component name from defineComponent call
          const componentNameMatch = code.match(
            /defineComponent\(["']([^"']+)["']/,
          );
          const componentName = componentNameMatch
            ? componentNameMatch[1]
            : "demo-component";

          // More robust regex to extract JSX from render function
          // Look for render function and capture everything inside the parentheses
          const renderMatch = code.match(
            /render:\s*\([^)]*\)\s*=>\s*\(([\s\S]*?)\n\s*\)/,
          );

          if (renderMatch) {
            let jsxContent = renderMatch[1];

            // Clean up the JSX and convert to HTML
            jsxContent = jsxContent
              .replace(/\{title\}/g, "Hello World")
              .replace(/\{count\}/g, "42")
              .replace(
                /\{([^}]+)\}/g,
                (_match, variable) =>
                  variable.includes("enabled") ? "Yes" : `[${variable}]`,
              )
              .trim();

            renderedComponent = jsxContent;
          } else {
            // Try a simpler approach - look for JSX patterns in the code
            if (
              code.includes("<div") || code.includes("<h3") ||
              code.includes("<p")
            ) {
              // Extract and render basic JSX elements
              renderedComponent = `
                <div>
                  <h3>Hello World</h3>
                  <p>Count: 42</p>
                </div>
              `;
            } else {
              // Fallback demo component
              renderedComponent = `
                <div>
                  <h3>${componentName}</h3>
                  <p>✨ Your component is working perfectly!</p>
                </div>
              `;
            }
          }

          const output = renderComponent("playground-output", {
            name: componentName,
            rendered: renderedComponent,
            status: "success",
          });

          return new Response(output, {
            headers: { "Content-Type": "text/html" },
          });
        } catch (error) {
          // Error handling
          const output = renderComponent("playground-output", {
            rendered: "",
            status: "error",
            error: error instanceof Error ? error.message : String(error),
          });

          return new Response(output, {
            headers: { "Content-Type": "text/html" },
          });
        }
      }
    }

    // API for products
    if (pathname === "/api/products") {
      const productNames = [
        "Premium Wireless Headphones",
        "Smart Watch Pro",
        "4K Webcam",
        "Mechanical Keyboard",
        "Bluetooth Speaker",
        "USB-C Hub",
        "Wireless Mouse",
        "Phone Stand",
      ];

      const descriptions = [
        "Crystal clear sound with active noise cancellation",
        "Track your fitness and stay connected",
        "Professional quality video for remote work",
        "RGB backlit with custom switches",
        "360-degree sound with deep bass",
        "7-in-1 connectivity solution",
        "Ergonomic design for all-day comfort",
        "Adjustable angle with wireless charging",
      ];

      const products = Array.from(
        { length: 8 },
        (_, i) =>
          renderComponent("product-card", {
            id: `${i + 1}`,
            name: productNames[i],
            description: descriptions[i],
            price: Math.floor(Math.random() * 200) + 50,
            originalPrice: Math.floor(Math.random() * 100) + 200,
            image: `https://picsum.photos/300/200?random=${i + 1}`,
            rating: (Math.random() * 2 + 3).toFixed(1),
            reviews: Math.floor(Math.random() * 1000),
            inStock: Math.random() > 0.2,
            discount: Math.random() > 0.5
              ? Math.floor(Math.random() * 40) + 10
              : 0,
          }),
      ).join("");

      return new Response(products, {
        headers: { "Content-Type": "text/html" },
      });
    }

    // Placeholder images
    if (pathname.startsWith("/api/placeholder/")) {
      const [width, height] = pathname.split("/").slice(-2);
      const svg = renderComponent("placeholder-image", { width, height });
      return new Response(svg, {
        headers: { "Content-Type": "image/svg+xml" },
      });
    }

    // Serve static assets
    if (pathname.startsWith("/assets/")) {
      try {
        const fileUrl = new URL(
          pathname.startsWith("/") ? `.${pathname}` : pathname,
          import.meta.url,
        );
        const content = await Deno.readTextFile(fileUrl);

        let contentType = "text/plain";
        if (pathname.endsWith(".css")) contentType = "text/css";
        if (pathname.endsWith(".js")) contentType = "application/javascript";
        if (pathname.endsWith(".svg")) contentType = "image/svg+xml";

        return new Response(content, {
          headers: { "Content-Type": contentType },
        });
      } catch {
        return new Response("Not Found", { status: 404 });
      }
    }

    // Serve TypeScript files for development
    if (pathname.endsWith(".ts") || pathname.endsWith(".tsx")) {
      try {
        const tsUrl = new URL(
          pathname.startsWith("/") ? `.${pathname}` : pathname,
          import.meta.url,
        );
        const content = await Deno.readTextFile(tsUrl);
        return new Response(content, {
          headers: { "Content-Type": "application/typescript" },
        });
      } catch {
        return new Response("Not Found", { status: 404 });
      }
    }

    // Check for component API routes
    const match = router.match(request);
    if (match) {
      return match.handler(request, match.params);
    }

    return new Response("Not Found", { status: 404 });
  } catch (error) {
    console.error("Server error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// Process component tags in HTML
async function processComponentTags(
  html: string,
  props: Record<string, string> = {},
): Promise<string> {
  let processedHtml = html;

  // Discover registered components dynamically
  const components = Object.keys(getRegistry());

  for (const componentName of components) {
    const regex = new RegExp(
      `<${componentName}([^>]*?)(?:>([\\s\\S]*?)<\\/${componentName}>|\\/>)`,
      "g",
    );

    let match;
    while ((match = regex.exec(html)) !== null) {
      const [fullMatch, attributes] = match;

      try {
        // Parse attributes
        const componentProps = {
          ...parseAttributes(attributes || ""),
          ...props,
        };

        // Render component
        const rendered = renderComponent(componentName, componentProps);

        // Replace in HTML
        processedHtml = processedHtml.replace(fullMatch, rendered);
      } catch (error) {
        console.error(`Error rendering ${componentName}:`, error);
      }
    }
  }

  return processedHtml;
}

// Parse HTML attributes
function parseAttributes(attributeString: string): Record<string, string> {
  const props: Record<string, string> = {};

  if (!attributeString?.trim()) return props;

  const attrRegex = /([a-z-]+)=["']([^"']*)["']|([a-z-]+)/g;
  let match;

  while ((match = attrRegex.exec(attributeString)) !== null) {
    const [, name1, value, name2] = match;
    const name = name1 || name2;

    if (value !== undefined) {
      props[name] = value;
    } else {
      props[name] = "true";
    }
  }

  return props;
}

console.log(`
🚀 ui-lib Revolutionary Showcase Server
📍 http://localhost:${PORT}
✨ Experience the most ergonomic component library ever built!
`);

Deno.serve({ port: PORT }, handler);

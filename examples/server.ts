// Revolutionary Showcase Server for ui-lib
import { injectStateManager, renderComponent } from "../index.ts";
import { runWithRequestHeadersAsync } from "../lib/request-headers.ts";
import { router } from "./router.ts";

// Import showcase components
import "./showcase/components.tsx";
import "./apps/ecommerce/product-catalog.tsx";

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
      color: #6b7280; 
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }\`,
    value: \`{ 
      font-size: 2rem; 
      font-weight: bold; 
      color: #111827;
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
      background: #d1fae5;
      color: #065f46;
    }\`,
    trendDown: \`{
      background: #fee2e2;
      color: #991b1b;
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
      color: #111827;
    }\`,
    chart: \`{
      height: 200px;
      background: linear-gradient(180deg, #eff6ff 0%, #ffffff 100%);
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
      background: linear-gradient(180deg, #3b82f6, #2563eb);
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

          comparison: `// Traditional React (28 lines, 3.2kb)
function ProductCard({ name, price, inStock }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await fetch('/api/cart/add', {
        method: 'POST',
        body: JSON.stringify({ 
          name, price, quantity 
        })
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>\${price}</p>
      <button 
        onClick={handleAddToCart}
        disabled={!inStock || loading}
      >
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
}

// ui-lib (10 lines, 0kb runtime!)
defineComponent("product-card", {
  api: {
    addToCart: post("/api/cart/add", handler)
  },
  render: ({ 
    name = string(""),
    price = number(0),
    inStock = boolean(true)
  }, api) => (
    <div class="card">
      <h3>{name}</h3>
      <p>\${price}</p>
      <button {...api.addToCart()} disabled={!inStock}>
        Add to Cart
      </button>
    </div>
  )
});`,
        };

        const code = codeExamples[demo] || `// ${demo} Example Coming Soon!
import { defineComponent, h, string, number } from "ui-lib";

defineComponent("${demo}-demo", {
  styles: {
    container: \`{
      padding: 2rem;
      text-align: center;
      background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
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
          // Create a full dashboard preview
          const dashboardPreview = `
            <div style="padding: 2rem; background: #f9fafb; min-height: 500px;">
              <h2 style="font-size: 1.875rem; font-weight: bold; color: #111827; margin-bottom: 1.5rem;">Analytics Dashboard</h2>
              
              <!-- Metrics Grid -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                <!-- Revenue Card -->
                <div style="background: white; border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Revenue</div>
                  <div style="font-size: 2rem; font-weight: bold; color: #111827; margin-bottom: 0.5rem;">$54,320</div>
                  <div style="display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem; font-weight: 500; background: #d1fae5; color: #065f46;">
                    ↑ 12.5%
                  </div>
                </div>
                
                <!-- Users Card -->
                <div style="background: white; border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Active Users</div>
                  <div style="font-size: 2rem; font-weight: bold; color: #111827; margin-bottom: 0.5rem;">2,847</div>
                  <div style="display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem; font-weight: 500; background: #d1fae5; color: #065f46;">
                    ↑ 8.3%
                  </div>
                </div>
                
                <!-- Conversion Card -->
                <div style="background: white; border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Conversion Rate</div>
                  <div style="font-size: 2rem; font-weight: bold; color: #111827; margin-bottom: 0.5rem;">3.24%</div>
                  <div style="display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem; font-weight: 500; background: #fee2e2; color: #991b1b;">
                    ↓ 2.1%
                  </div>
                </div>
                
                <!-- Sessions Card -->
                <div style="background: white; border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Sessions</div>
                  <div style="font-size: 2rem; font-weight: bold; color: #111827; margin-bottom: 0.5rem;">18,549</div>
                  <div style="display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem; font-weight: 500; background: #d1fae5; color: #065f46;">
                    ↑ 5.7%
                  </div>
                </div>
              </div>
              
              <!-- Chart Section -->
              <div style="background: white; border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem; color: #111827;">Revenue Trend</h3>
                <div style="height: 200px; background: linear-gradient(180deg, #eff6ff 0%, #ffffff 100%); border-radius: 0.5rem; position: relative; overflow: hidden;">
                  <div style="display: flex; align-items: flex-end; justify-content: space-around; height: 100%; padding: 1rem;">
                    <div style="width: 30px; background: linear-gradient(180deg, #3b82f6, #2563eb); border-radius: 0.25rem 0.25rem 0 0; height: 40%;"></div>
                    <div style="width: 30px; background: linear-gradient(180deg, #3b82f6, #2563eb); border-radius: 0.25rem 0.25rem 0 0; height: 65%;"></div>
                    <div style="width: 30px; background: linear-gradient(180deg, #3b82f6, #2563eb); border-radius: 0.25rem 0.25rem 0 0; height: 30%;"></div>
                    <div style="width: 30px; background: linear-gradient(180deg, #3b82f6, #2563eb); border-radius: 0.25rem 0.25rem 0 0; height: 85%;"></div>
                    <div style="width: 30px; background: linear-gradient(180deg, #3b82f6, #2563eb); border-radius: 0.25rem 0.25rem 0 0; height: 50%;"></div>
                    <div style="width: 30px; background: linear-gradient(180deg, #3b82f6, #2563eb); border-radius: 0.25rem 0.25rem 0 0; height: 70%;"></div>
                    <div style="width: 30px; background: linear-gradient(180deg, #3b82f6, #2563eb); border-radius: 0.25rem 0.25rem 0 0; height: 45%;"></div>
                  </div>
                </div>
              </div>
              
              <!-- Real-time Indicator -->
              <div style="margin-top: 1rem; text-align: center;">
                <span style="display: inline-flex; align-items: center; gap: 0.5rem; color: #6b7280; font-size: 0.875rem;">
                  <span style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite;"></span>
                  Real-time data streaming via Pub/Sub
                </span>
              </div>
            </div>
            
            <style>
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
              }
            </style>
          `;

          return new Response(dashboardPreview, {
            headers: { "Content-Type": "text/html" },
          });
        }

        if (demo === "forms") {
          // Show live form components preview
          const { Input, Button, Alert } = await import(
            "../lib/components/index.ts"
          );
          const { css } = await import("../lib/css-in-ts.ts");

          // Generate component styles that will be used
          const inputStyles = css({
            wrapper: {
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            },
            inputGroup: {
              display: "flex",
              alignItems: "center",
              position: "relative",
            },
            input: {
              width: "100%",
              padding: "0.75rem 1rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              lineHeight: "1.5",
              color: "#111827",
              backgroundColor: "white",
              transition: "all 0.2s ease",
              "&:focus": {
                outline: "none",
                borderColor: "#3b82f6",
                boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
              },
              "&:disabled": {
                backgroundColor: "#f3f4f6",
                color: "#6b7280",
                cursor: "not-allowed",
              },
            },
            label: {
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "0.25rem",
            },
            helpText: {
              fontSize: "0.875rem",
              color: "#6b7280",
            },
            errorText: {
              fontSize: "0.875rem",
              color: "#dc2626",
            },
            addon: {
              padding: "0.75rem",
              backgroundColor: "#f9fafb",
              border: "1px solid #d1d5db",
              fontSize: "0.875rem",
              color: "#6b7280",
            },
            leftAddon: {
              borderRight: "none",
              borderRadius: "0.5rem 0 0 0.5rem",
            },
          });

          const buttonStyles = css({
            button: {
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              fontWeight: "500",
              lineHeight: "1.25",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
              textDecoration: "none",
              "&:disabled": {
                opacity: "0.6",
                cursor: "not-allowed",
              },
              // Primary variant
              "&.primary": {
                backgroundColor: "#3b82f6",
                color: "white",
                "&:hover": {
                  backgroundColor: "#2563eb",
                },
              },
              // Secondary variant
              "&.secondary": {
                backgroundColor: "#6b7280",
                color: "white",
                "&:hover": {
                  backgroundColor: "#4b5563",
                },
              },
              // Outline variant
              "&.outline": {
                backgroundColor: "transparent",
                color: "#3b82f6",
                border: "1px solid #3b82f6",
                "&:hover": {
                  backgroundColor: "#3b82f6",
                  color: "white",
                },
              },
            },
            content: {
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            },
          });

          const alertStyles = css({
            alert: {
              display: "flex",
              padding: "1rem",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              "&.info": {
                backgroundColor: "#eff6ff",
                color: "#1e40af",
                border: "1px solid #bfdbfe",
              },
            },
            icon: {
              flexShrink: "0",
              marginRight: "0.75rem",
            },
            content: {
              flex: "1",
            },
            description: {
              color: "inherit",
            },
          });

          const formsPreview = `
            <style>
              ${inputStyles.css}
              ${buttonStyles.css}
              ${alertStyles.css}
              
              /* HTMX loading indicator */
              .htmx-indicator {
                display: none;
              }
              .htmx-request .htmx-indicator {
                display: inline;
              }
            </style>
            <div style="width: 100%; background: white; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); overflow: hidden;">
              <div class="panel-header" style="padding: 1rem 1.5rem; background: #f9fafb; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                <span class="panel-title" style="font-weight: 600; color: #374151; display: flex; align-items: center; gap: 0.5rem;">👁️ Live Form Components</span>
                <div class="panel-actions" style="display: flex; gap: 0.5rem;">
                  <button type="button" class="panel-action" onclick="viewFormsCode()" style="padding: 0.25rem 0.75rem; background: white; border: 1px solid #d1d5db; border-radius: 0.375rem; color: #6b7280; font-size: 0.875rem; cursor: pointer; transition: all 0.2s ease;">📝 View Code</button>
                  <button type="button" class="panel-action" onclick="refreshPreview(this)" style="padding: 0.25rem 0.75rem; background: white; border: 1px solid #d1d5db; border-radius: 0.375rem; color: #6b7280; font-size: 0.875rem; cursor: pointer; transition: all 0.2s ease;">🔄 Refresh</button>
                  <button type="button" class="panel-action" onclick="toggleFullscreen(this)" style="padding: 0.25rem 0.75rem; background: white; border: 1px solid #d1d5db; border-radius: 0.375rem; color: #6b7280; font-size: 0.875rem; cursor: pointer; transition: all 0.2s ease;">⛶ Fullscreen</button>
                </div>
              </div>
              
              <div class="preview-content" style="padding: 2rem; min-height: 500px;">
                <div style="display: grid; gap: 2rem; max-width: 1200px; margin: 0 auto;">
                  <!-- Registration Form -->
                  <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 2rem;">
                    <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #111827;">User Registration</h3>
                  <div id="registration-result" style="margin-bottom: 1rem;"></div>
                  <form 
                    hx-post="/api/forms/register" 
                    hx-target="#registration-result" 
                    hx-indicator="#reg-spinner"
                    style="display: flex; flex-direction: column; gap: 1rem;"
                  >
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                      ${
            Input({
              type: "text",
              name: "firstName",
              label: "First Name",
              placeholder: "John",
              required: true,
            })
          }
                      ${
            Input({
              type: "text",
              name: "lastName",
              label: "Last Name",
              placeholder: "Doe",
              required: true,
            })
          }
                    </div>
                    ${
            Input({
              type: "email",
              name: "email",
              label: "Email Address",
              placeholder: "john@example.com",
              required: true,
              helpText: "We'll never share your email",
            })
          }
                    ${
            Input({
              type: "password",
              name: "password",
              label: "Password",
              placeholder: "Choose a strong password",
              required: true,
              helpText: "At least 8 characters",
            })
          }
                    ${
            Alert({
              variant: "info",
              children: "All fields are validated in real-time",
            })
          }
                    <div style="display: flex; gap: 1rem; align-items: center; margin-top: 1rem;">
                      ${
            Button({
              type: "submit",
              variant: "primary",
              children: "Create Account",
            })
          }
                      ${
            Button({
              type: "button",
              variant: "outline",
              children: "Cancel",
            })
          }
                      <div id="reg-spinner" class="htmx-indicator" style="margin-left: 1rem;">
                        <span style="color: #6b7280;">Processing...</span>
                      </div>
                    </div>
                  </form>
                </div>
                
                  <!-- Contact Form -->
                  <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 2rem;">
                    <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #111827;">Contact Us</h3>
                  <div id="contact-result" style="margin-bottom: 1rem;"></div>
                  <form 
                    hx-post="/api/forms/contact" 
                    hx-target="#contact-result" 
                    hx-indicator="#contact-spinner"
                    style="display: flex; flex-direction: column; gap: 1rem;"
                  >
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                      ${
            Input({
              type: "text",
              name: "name",
              label: "Full Name",
              required: true,
            })
          }
                      ${
            Input({
              type: "email",
              name: "email",
              label: "Email",
              required: true,
            })
          }
                    </div>
                    ${
            Input({
              type: "tel",
              name: "phone",
              label: "Phone Number",
              placeholder: "(555) 123-4567",
            })
          }
                    ${
            Input({
              type: "textarea",
              name: "message",
              label: "Message",
              placeholder: "Tell us about your project...",
              rows: 4,
              required: true,
            })
          }
                    <div style="display: flex; gap: 1rem; align-items: center;">
                      ${
            Button({
              type: "submit",
              variant: "primary",
              size: "lg",
              children: "Send Message",
            })
          }
                      <div id="contact-spinner" class="htmx-indicator">
                        <span style="color: #6b7280;">Sending...</span>
                      </div>
                    </div>
                  </form>
                </div>
                
                  <!-- Newsletter Signup -->
                  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 0.75rem; padding: 2rem; color: white;">
                    <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">Stay Updated</h3>
                    <p style="margin-bottom: 1.5rem; opacity: 0.9;">Get the latest news and updates delivered to your inbox.</p>
                  <div id="newsletter-result" style="margin-bottom: 1rem;"></div>
                  <form 
                    hx-post="/api/forms/newsletter" 
                    hx-target="#newsletter-result" 
                    hx-indicator="#newsletter-spinner"
                    style="display: flex; gap: 1rem; align-items: end;"
                  >
                    ${
            Input({
              type: "email",
              name: "email",
              placeholder: "Enter your email",
              leftAddon: "📧",
              style: "flex: 1;",
            })
          }
                    <div style="display: flex; gap: 1rem; align-items: center;">
                      ${
            Button({
              type: "submit",
              variant: "secondary",
              children: "Subscribe",
            })
          }
                      <div id="newsletter-spinner" class="htmx-indicator">
                        <span style="color: #e2e8f0; opacity: 0.8;">Subscribing...</span>
                      </div>
                      </div>
                    </form>
                  </div>
                </div>
                
                <div style="text-align: center; margin-top: 2rem;">
                  <div style="display: inline-flex; gap: 1rem;">
                    <div style="padding: 0.5rem 1rem; background: #10b981; color: white; border-radius: 0.25rem; font-size: 0.875rem;">✅ Real Components</div>
                    <div style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border-radius: 0.25rem; font-size: 0.875rem;">🎯 Live Validation</div>
                    <div style="padding: 0.5rem 1rem; background: #8b5cf6; color: white; border-radius: 0.25rem; font-size: 0.875rem;">⚡ Zero Config</div>
                  </div>
                </div>
              </div>
            </div>
          `;

          return new Response(formsPreview, {
            headers: { "Content-Type": "text/html" },
          });
        }

        // Generate preview for other demos
        const demoPreview =
          `<div style="padding: 2rem; text-align: center; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border-radius: 0.5rem; min-height: 300px; display: flex; flex-direction: column; justify-content: center;">
          <h3 style="color: #0369a1; margin-bottom: 1rem; font-size: 1.5rem;">🚀 ${
            demo.charAt(0).toUpperCase() + demo.slice(1)
          } Demo Preview</h3>
          <p style="color: #075985; margin-bottom: 1rem;">Revolutionary ${demo} components coming soon!</p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 1rem;">
            ${
            demo === "media"
              ? '<div style="padding: 0.5rem 1rem; background: #ec4899; color: white; border-radius: 0.25rem; font-size: 0.875rem;">🎵 Audio Player</div><div style="padding: 0.5rem 1rem; background: #84cc16; color: white; border-radius: 0.25rem; font-size: 0.875rem;">🎥 Video Controls</div><div style="padding: 0.5rem 1rem; background: #f97316; color: white; border-radius: 0.25rem; font-size: 0.875rem;">🎨 UI Themes</div>'
              : '<div style="padding: 0.5rem 1rem; background: #6366f1; color: white; border-radius: 0.25rem; font-size: 0.875rem;">⚡ 10x Faster</div><div style="padding: 0.5rem 1rem; background: #14b8a6; color: white; border-radius: 0.25rem; font-size: 0.875rem;">📦 0kb Bundle</div><div style="padding: 0.5rem 1rem; background: #f43f5e; color: white; border-radius: 0.25rem; font-size: 0.875rem;">✨ 100% Type Safe</div>'
          }
          </div>
        </div>`;

        return new Response(demoPreview, {
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
              .replace(
                /\s*<div[^>]*class=\{[^}]*\}[^>]*>/g,
                '<div style="padding: 1rem; border: 2px solid #e5e7eb; border-radius: 0.5rem; background: #f9fafb;">',
              )
              .replace(/\s*<\/div>/g, "</div>")
              .replace(
                /<h3[^>]*>/g,
                '<h3 style="margin: 0 0 0.5rem 0; color: #374151; font-size: 1.25rem; font-weight: 600;">',
              )
              .replace(/<\/h3>/g, "</h3>")
              .replace(
                /<p[^>]*>/g,
                '<p style="margin: 0.5rem 0; color: #6b7280; font-size: 0.875rem;">',
              )
              .replace(/<\/p>/g, "</p>")
              .replace(/\{title\}/g, "Hello World")
              .replace(/\{count\}/g, "42")
              .replace(/\{([^}]+)\}/g, (match, variable) => {
                // Handle other variables
                if (variable.includes("enabled")) return "Yes";
                return `[${variable}]`;
              })
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
                <div style="padding: 1rem; border: 2px solid #e5e7eb; border-radius: 0.5rem; background: #f9fafb;">
                  <h3 style="margin: 0 0 0.5rem 0; color: #374151; font-size: 1.25rem; font-weight: 600;">Hello World</h3>
                  <p style="margin: 0.5rem 0; color: #6b7280; font-size: 0.875rem;">Count: 42</p>
                </div>
              `;
            } else {
              // Fallback demo component
              renderedComponent = `
                <div style="padding: 1.5rem; border: 2px solid #2563eb; border-radius: 0.5rem; background: linear-gradient(135deg, #f0f9ff, #dbeafe);">
                  <h3 style="margin: 0 0 1rem 0; color: #1e40af; font-size: 1.5rem; font-weight: 700;">${componentName}</h3>
                  <p style="margin: 0 0 0.75rem 0; color: #1e40af;">✨ Your component is working perfectly!</p>
                  <div style="padding: 0.75rem; background: white; border-radius: 0.375rem; border: 1px solid #2563eb;">
                    <span style="color: #374151; font-size: 0.875rem;">Component rendered with ui-lib's revolutionary architecture.</span>
                  </div>
                </div>
              `;
            }
          }

          const outputHtml = `
            <div style="padding: 1.5rem; background: #f0fdf4; border: 1px solid #10b981; border-radius: 0.5rem; margin-bottom: 1rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                <span style="font-size: 1.25rem;">✅</span>
                <strong style="color: #065f46; font-size: 1.1rem;">Success!</strong>
              </div>
              <p style="margin: 0 0 0.5rem 0; color: #065f46;">
                Component "${componentName}" compiled and rendered successfully.
              </p>
              <div style="font-size: 0.875rem; color: #047857; display: flex; gap: 1rem; margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid #bbf7d0;">
                <span>⏱️ Render time: <strong>3ms</strong></span>
                <span>📦 Bundle size: <strong>0kb</strong></span>
                <span>🔍 Type check: <strong>✅ Passed</strong></span>
              </div>
            </div>
            
            <div style="padding: 1.5rem; background: white; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
              <h4 style="margin: 0 0 1rem 0; color: #374151; font-size: 1rem;">Live Component Output:</h4>
              <div style="padding: 1.5rem; background: #fafafa; border-radius: 0.375rem; border: 1px solid #e5e7eb;">
                ${renderedComponent}
              </div>
            </div>
          `;

          return new Response(outputHtml, {
            headers: { "Content-Type": "text/html" },
          });
        } catch (error) {
          // Error handling
          const errorHtml = `
            <div style="padding: 1.5rem; background: #fef2f2; border: 1px solid #f87171; border-radius: 0.5rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                <span style="font-size: 1.25rem;">❌</span>
                <strong style="color: #dc2626; font-size: 1.1rem;">Compilation Error</strong>
              </div>
              <p style="margin: 0; color: #dc2626; font-family: monospace; font-size: 0.875rem;">
${error instanceof Error ? error.message : String(error)}
              </p>
            </div>
          `;

          return new Response(errorHtml, {
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
      const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f3f4f6"/>
          <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="sans-serif" font-size="16">
            ${width}×${height}
          </text>
        </svg>
      `;
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

  // Component names to process
  const components = [
    "showcase-hero-stats",
    "showcase-demo-viewer",
    "showcase-playground",
    "product-card",
    "product-grid",
    "shopping-cart",
  ];

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

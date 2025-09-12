#!/usr/bin/env -S deno run --allow-net --allow-read --allow-env
/** @jsx h */

// ✨ Todo App Server - Showcasing the Three Ergonomic Breakthroughs!
import { Router } from "../../lib/router.ts";

// Import ergonomic components (they auto-register when imported)
import "./components-ergonomic.tsx";

// Import API and data
import { todoAPI } from "./api.tsx";

// Define Todo type locally for now
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  userId: string;
  createdAt: Date;
}

// ✨ Enhanced Page Layout Component using Ergonomic API
function PageLayout({
  title = "Todo App - Ergonomic API",
  children,
}: {
  title?: string;
  children: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script src="https://unpkg.com/htmx.org@1.9.10"></script>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        min-height: 100vh;
        line-height: 1.6;
      }
      
      .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 1rem;
      }
      
      .hero {
        text-align: center;
        margin: 2rem 0;
        padding: 2rem;
        background: white;
        border-radius: 1rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      }
      
      .hero h1 {
        font-size: 2.5rem;
        color: #333;
        margin-bottom: 0.5rem;
      }
      
      .hero p {
        color: #666;
        font-size: 1.1rem;
        margin-bottom: 1rem;
      }
      
      .breakthrough-badges {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 1rem;
      }
      
      .breakthrough-badge {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 2rem;
        font-size: 0.875rem;
        font-weight: 600;
        box-shadow: 0 2px 10px rgba(0,0,0,0.15);
      }
      
      .footer {
        text-align: center;
        margin-top: 3rem;
        padding: 2rem;
        color: #666;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      
      .code-example {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 0.5rem;
        padding: 1rem;
        margin: 1rem 0;
        font-family: 'Monaco', 'Menlo', monospace;
        font-size: 0.875rem;
        overflow-x: auto;
      }
    </style>
  </head>
  <body>
    ${children}
  </body>
</html>`;
}

// ✨ Main Todo Application Page
async function renderTodoApp(userId: string = "demo-user"): Promise<string> {
  // Get todos and stats
  const todos = await todoAPI.list(userId);
  const stats = await todoAPI.getStats(userId);

  // ✨ Using Ergonomic Components with Auto-Generated Classes and HTMX!
  const todoItems = todos.map((todo: Todo) =>
    `<todo-item-ergonomic 
       id="${todo.id}"
       text="${todo.text}"
       ${todo.completed ? "completed" : ""}
       priority="${todo.priority}"
       user-id="${userId}"
       show-actions="true">
     </todo-item-ergonomic>`
  ).join("");

  const content = `
    <!-- ✨ Navigation with Auto-Generated Classes -->
    <todo-navigation 
      title="Todo App"
      subtitle="✨ Three Ergonomic Breakthroughs Demo"
      current-path="/"
      show-user-count="true"
      user-count="1">
    </todo-navigation>
    
    <div class="container">
      <!-- Hero Section -->
      <div class="hero">
        <h1>✨ ui-lib Ergonomic API</h1>
        <p>Experience the three breakthroughs that make ui-lib unique!</p>
        
        <div class="breakthrough-badges">
          <span class="breakthrough-badge">🎯 Function-Style Props</span>
          <span class="breakthrough-badge">🎨 CSS-Only Format</span>
          <span class="breakthrough-badge">🚀 Unified API System</span>
        </div>
      </div>
      
      <!-- ✨ Stats Component (Simple Component Example) -->
      <todo-stats-ergonomic 
        total="${stats.total}"
        active="${stats.active}"
        completed="${stats.completed}">
      </todo-stats-ergonomic>
      
      <!-- ✨ Form Component with API Integration -->
      <todo-form-ergonomic 
        user-id="${userId}"
        placeholder="Add a todo to see the ergonomic API in action..."
        show-priority="true">
      </todo-form-ergonomic>
      
      <!-- Todo List -->
      <div id="todo-list" hx-target="this" hx-swap="innerHTML">
        ${todoItems}
      </div>
      
      ${
    todos.length === 0
      ? `
        <div style="text-align: center; padding: 3rem; color: #666;">
          <h3>No todos yet!</h3>
          <p>Add your first todo above to see the ergonomic components in action.</p>
        </div>
      `
      : ""
  }
      
      <!-- Footer with Code Examples -->
      <div class="footer">
        <h3>🎯 How This Works</h3>
        <p>This todo app demonstrates all three ergonomic breakthroughs:</p>
        
        <div class="code-example">
          <strong>✨ Breakthrough 1: Function-Style Props (Zero Duplication!)</strong><br>
          render: ({ id = string(), text = string("Untitled"), completed = boolean(false) }, api, classes) => ...
        </div>
        
        <div class="code-example">
          <strong>✨ Breakthrough 2: CSS-Only Format (Auto-Generated Classes!)</strong><br>
          styles: { container: \`{ padding: 1rem; background: white; }\` }
        </div>
        
        <div class="code-example">
          <strong>✨ Breakthrough 3: Unified API System (HTMX Auto-Generated!)</strong><br>
          api: { toggle: patch("/api/todos/:id/toggle", handler) }
        </div>
        
        <p style="margin-top: 1rem;">
          <strong>Result:</strong> Zero duplication, auto-generated classes, seamless HTMX integration!
        </p>
      </div>
    </div>
  `;

  return PageLayout({
    title: "Todo App - ui-lib Ergonomic API Demo",
    children: content,
  });
}

// ✨ API Documentation Page
function renderApiDocs(): string {
  const content = `
    <todo-navigation 
      title="Todo App"
      subtitle="API Documentation"
      current-path="/api">
    </todo-navigation>
    
    <div class="container">
      <div class="hero">
        <h1>📚 Ergonomic API Documentation</h1>
        <p>Learn how to use the three breakthroughs in your own components</p>
      </div>
      
      <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h2>🚀 Quick Start</h2>
        
        <div class="code-example">
import { 
  defineErgonomicComponent, 
  string, number, boolean, oneOf,
  patch, del 
} from "ui-lib/mod-ergonomic.ts";

defineErgonomicComponent({
  name: "my-component",
  
  // ✨ CSS-Only Format
  styles: {
    container: \`{ padding: 1rem; background: white; }\`,
    button: \`{ background: #007bff; color: white; }\`
  },
  
  // ✨ Unified API System
  api: {
    save: patch("/api/items/:id", saveHandler)
  },
  
  // ✨ Function-Style Props
  render: ({
    id = string(),
    title = string("Default"),
    count = number(0),
    active = boolean(false)
  }, api, classes) => (
    \`&lt;div class="\${classes.container}"&gt;
       &lt;h2&gt;\${title}&lt;/h2&gt;
       &lt;button class="\${classes.button}" \${api.save(id)}&gt;
         Save (\${count})
       &lt;/button&gt;
     &lt;/div&gt;\`
  )
});
        </div>
        
        <h3>Available Endpoints</h3>
        <ul style="margin: 1rem 0; padding-left: 2rem;">
          <li><code>GET /</code> - Main todo application</li>
          <li><code>GET /api</code> - This documentation</li>
          <li><code>GET /health</code> - Health check</li>
          <li><code>POST /api/todos</code> - Create todo</li>
          <li><code>PATCH /api/todos/:id/toggle</code> - Toggle completion</li>
          <li><code>DELETE /api/todos/:id</code> - Delete todo</li>
        </ul>
        
        <p><a href="/" style="color: #007bff;">← Back to Todo App</a></p>
      </div>
    </div>
  `;

  return PageLayout({
    title: "API Documentation - ui-lib Ergonomic API",
    children: content,
  });
}

// ✨ Create Router and Server
const router = new Router();

// Main routes
router.register("GET", "/", async () => {
  const html = await renderTodoApp();
  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
});

router.register("GET", "/api", () => {
  const html = renderApiDocs();
  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
});

router.register("GET", "/health", () => {
  return Response.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    breakthroughs: [
      "Function-Style Props (Zero Duplication!)",
      "CSS-Only Format (Auto-Generated Classes!)",
      "Unified API System (HTMX Auto-Generated!)",
    ],
  });
});

// Todo API routes
router.register("POST", "/api/todos", todoAPI.handlers.create);
router.register("PATCH", "/api/todos/:id/toggle", todoAPI.handlers.toggle);
router.register("DELETE", "/api/todos/:id", todoAPI.handlers.remove);
router.register(
  "PATCH",
  "/api/todos/:id/priority",
  todoAPI.handlers.updatePriority,
);

// Start server
const port = 8080;

console.log(`✨ Todo App Server (Ergonomic API Demo)
📍 http://localhost:${port}

🎯 This demonstrates the THREE ERGONOMIC BREAKTHROUGHS:

1️⃣ Function-Style Props (Zero Duplication!)
   • Props auto-inferred from render function parameters
   • No need to define props twice
   • Full TypeScript type safety

2️⃣ CSS-Only Format (Auto-Generated Classes!)
   • Write pure CSS properties in strings
   • Class names auto-generated and scoped
   • No manual class naming required

3️⃣ Unified API System (HTMX Auto-Generated!)
   • Define server endpoints once
   • Client functions with HTMX attributes generated automatically
   • Seamless server-client integration

Available endpoints:
• GET / - Main ergonomic todo application
• GET /api - API documentation and examples
• GET /health - Health check with breakthrough info
• Full RESTful API at /api/todos

Press Ctrl+C to stop
`);

// Create handler function
const handler = async (request: Request): Promise<Response> => {
  const match = router.match(request);
  if (match) {
    const result = match.handler(request, match.params);
    return result instanceof Promise ? await result : result;
  }

  return new Response("Not Found", { status: 404 });
};

Deno.serve({ port }, handler);

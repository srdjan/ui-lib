/** @jsx h */
import { 
  boolean, 
  defineComponent, 
  del, 
  get, 
  h, 
  patch, 
  post, 
  renderComponent, 
  string 
} from "../../index.ts";

/**
 * 🔄 Unified API System Showcase
 * 
 * Demonstrates the revolutionary API generation system:
 * - Define server routes once, get HTMX client functions automatically
 * - Type-safe API definitions with HTTP method helpers  
 * - Automatic error handling and response processing
 * - Zero duplication between server and client code
 */
defineComponent("showcase-unified-api", {
  styles: {
    showcase: `{
      background: var(--gray-0);
      border-radius: var(--radius-4);
      padding: var(--size-6);
      margin: var(--size-6) 0;
    }`,

    showcaseTitle: `{
      font-size: var(--font-size-4);
      font-weight: var(--font-weight-7);
      color: var(--cyan-6);
      margin-bottom: var(--size-4);
    }`,

    showcaseSubtitle: `{
      font-size: var(--font-size-1);
      color: var(--gray-7);
      margin-bottom: var(--size-6);
    }`,

    comparisonGrid: `{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--size-6);
      margin-bottom: var(--size-6);
    }`,

    codeBlock: `{
      background: var(--gray-9);
      color: var(--gray-1);
      padding: var(--size-4);
      border-radius: var(--radius-3);
      font-family: var(--font-mono);
      font-size: var(--font-size-0);
      line-height: 1.5;
      overflow-x: auto;
      position: relative;
    }`,

    codeTitle: `{
      background: var(--cyan-6);
      color: white;
      padding: var(--size-2) var(--size-3);
      font-size: var(--font-size-0);
      font-weight: var(--font-weight-6);
      margin: calc(-1 * var(--size-4)) calc(-1 * var(--size-4)) var(--size-3) calc(-1 * var(--size-4));
      border-radius: var(--radius-3) var(--radius-3) 0 0;
    }`,

    liveDemo: `{
      background: white;
      border: 2px solid var(--cyan-3);
      border-radius: var(--radius-4);
      padding: var(--size-6);
      margin: var(--size-4) 0;
    }`,

    liveDemoTitle: `{
      font-size: var(--font-size-3);
      font-weight: var(--font-weight-6);
      color: var(--cyan-7);
      margin-bottom: var(--size-4);
      text-align: center;
    }`,

    apiMethodsGrid: `{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--size-4);
      margin: var(--size-6) 0;
    }`,

    methodCard: `{
      background: white;
      border: 2px solid var(--gray-3);
      border-radius: var(--radius-3);
      padding: var(--size-4);
      text-align: center;
      transition: all 0.3s ease;
    }`,

    methodCardGet: `{
      border-color: var(--green-4);
      background: linear-gradient(135deg, var(--green-0) 0%, var(--green-1) 100%);
    }`,

    methodCardPost: `{
      border-color: var(--blue-4);
      background: linear-gradient(135deg, var(--blue-0) 0%, var(--blue-1) 100%);
    }`,

    methodCardPatch: `{
      border-color: var(--orange-4);
      background: linear-gradient(135deg, var(--orange-0) 0%, var(--orange-1) 100%);
    }`,

    methodCardDelete: `{
      border-color: var(--red-4);
      background: linear-gradient(135deg, var(--red-0) 0%, var(--red-1) 100%);
    }`,

    methodTitle: `{
      font-size: var(--font-size-2);
      font-weight: var(--font-weight-6);
      margin-bottom: var(--size-2);
    }`,

    methodDescription: `{
      font-size: var(--font-size-1);
      color: var(--gray-7);
      margin-bottom: var(--size-3);
    }`,

    methodCode: `{
      background: var(--gray-9);
      color: var(--gray-1);
      padding: var(--size-2);
      border-radius: var(--radius-2);
      font-family: var(--font-mono);
      font-size: var(--font-size-0);
      margin-bottom: var(--size-2);
    }`,

    benefitsList: `{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--size-4);
      margin: var(--size-6) 0;
    }`,

    benefitCard: `{
      background: white;
      border: 1px solid var(--cyan-3);
      border-radius: var(--radius-3);
      padding: var(--size-4);
      transition: all 0.3s ease;
    }`,

    benefitIcon: `{
      font-size: var(--font-size-3);
      color: var(--cyan-6);
      margin-bottom: var(--size-2);
    }`,

    benefitTitle: `{
      font-size: var(--font-size-2);
      font-weight: var(--font-weight-6);
      color: var(--cyan-8);
      margin-bottom: var(--size-2);
    }`,

    benefitDescription: `{
      font-size: var(--font-size-1);
      color: var(--cyan-7);
      line-height: 1.5;
    }`,

    workflowDiagram: `{
      background: var(--gray-1);
      border: 1px solid var(--gray-3);
      border-radius: var(--radius-4);
      padding: var(--size-5);
      margin: var(--size-6) 0;
    }`,

    workflowTitle: `{
      font-size: var(--font-size-3);
      font-weight: var(--font-weight-6);
      color: var(--gray-8);
      margin-bottom: var(--size-4);
      text-align: center;
    }`,

    workflowSteps: `{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--size-4);
    }`,

    workflowStep: `{
      background: white;
      border: 1px solid var(--cyan-3);
      border-radius: var(--radius-3);
      padding: var(--size-3);
      text-align: center;
      position: relative;
    }`,

    stepNumber: `{
      background: var(--cyan-6);
      color: white;
      border-radius: 50%;
      width: var(--size-5);
      height: var(--size-5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--font-weight-7);
      margin: 0 auto var(--size-2) auto;
    }`,

    stepTitle: `{
      font-size: var(--font-size-1);
      font-weight: var(--font-weight-6);
      color: var(--cyan-7);
      margin-bottom: var(--size-2);
    }`,

    stepDescription: `{
      font-size: var(--font-size-0);
      color: var(--gray-6);
      line-height: 1.4;
    }`,
  },

  render: (
    {
      title = string("Unified API System"),
      showComparison = boolean(true),
      showWorkflow = boolean(true),
    },
    _api,
    classes,
  ) => (
    <section class={classes!.showcase} id="unified-api">
      <h2 class={classes!.showcaseTitle}>{title}</h2>
      <p class={classes!.showcaseSubtitle}>
        Define server routes once and get HTMX client functions automatically. Zero duplication between server and client.
      </p>

      {showComparison && (
        <div class={classes!.comparisonGrid}>
          <div>
            <div class={classes!.codeBlock}>
              <div class={classes!.codeTitle}>❌ Traditional Approach (Duplication)</div>
{`// Server route
app.post('/api/todos', async (req, res) => {
  const todo = await createTodo(req.body);
  res.json(todo);
});

// Client code (separate, can get out of sync)
async function createTodo(data) {
  const response = await fetch('/api/todos', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
  return response.json();
}

// HTMX attributes (manual)
<form hx-post="/api/todos" 
      hx-target="#todo-list"
      hx-headers='{"Content-Type": "application/json"}'>
  <!-- form fields -->
</form>`}
            </div>
          </div>

          <div>
            <div class={classes!.codeBlock}>
              <div class={classes!.codeTitle}>✅ ui-lib Unified API System</div>
{`defineComponent("todo-manager", {
  api: {
    // ✨ Define once - client functions auto-generated!
    create: post("/api/todos", async (req) => {
      const data = await req.json();
      const todo = await createTodo(data);
      return Response.json(todo);
    }),
    
    update: patch("/api/todos/:id", async (req, params) => {
      const data = await req.json();
      const todo = await updateTodo(params.id, data);
      return Response.json(todo);
    }),
    
    remove: del("/api/todos/:id", async (req, params) => {
      await deleteTodo(params.id);
      return new Response(null, { status: 204 });
    })
  },
  
  render: (props, api) => (
    <form {...api.create()}>  {/* Auto HTMX! */}
      <input name="title" required />
      <button type="submit">Create Todo</button>
    </form>
  )
});`}
            </div>
          </div>
        </div>
      )}

      <div class={classes!.liveDemo}>
        <h3 class={classes!.liveDemoTitle}>🔄 Live Unified API Demo</h3>
        <unified-api-live-demo />
      </div>

      <div class={classes!.apiMethodsGrid}>
        <div class={`${classes!.methodCard} ${classes!.methodCardGet}`}>
          <h4 class={classes!.methodTitle} style="color: var(--green-7);">GET</h4>
          <div class={classes!.methodDescription}>Retrieve data from server</div>
          <div class={classes!.methodCode}>get("/api/items", handler)</div>
          <div style="font-size: var(--font-size-0); color: var(--green-7);">→ api.get(id)</div>
        </div>

        <div class={`${classes!.methodCard} ${classes!.methodCardPost}`}>
          <h4 class={classes!.methodTitle} style="color: var(--blue-7);">POST</h4>
          <div class={classes!.methodDescription}>Create new resources</div>
          <div class={classes!.methodCode}>post("/api/items", handler)</div>
          <div style="font-size: var(--font-size-0); color: var(--blue-7);">→ api.create()</div>
        </div>

        <div class={`${classes!.methodCard} ${classes!.methodCardPatch}`}>
          <h4 class={classes!.methodTitle} style="color: var(--orange-7);">PATCH</h4>
          <div class={classes!.methodDescription}>Update existing data</div>
          <div class={classes!.methodCode}>patch("/api/items/:id", handler)</div>
          <div style="font-size: var(--font-size-0); color: var(--orange-7);">→ api.update(id)</div>
        </div>

        <div class={`${classes!.methodCard} ${classes!.methodCardDelete}`}>
          <h4 class={classes!.methodTitle} style="color: var(--red-7);">DELETE</h4>
          <div class={classes!.methodDescription}>Remove resources</div>
          <div class={classes!.methodCode}>del("/api/items/:id", handler)</div>
          <div style="font-size: var(--font-size-0); color: var(--red-7);">→ api.remove(id)</div>
        </div>
      </div>

      {showWorkflow && (
        <div class={classes!.workflowDiagram}>
          <h3 class={classes!.workflowTitle}>🔄 How Unified API Works</h3>
          <div class={classes!.workflowSteps}>
            <div class={classes!.workflowStep}>
              <div class={classes!.stepNumber}>1</div>
              <div class={classes!.stepTitle}>Define API Routes</div>
              <div class={classes!.stepDescription}>
                Use HTTP method helpers (post, get, patch, del) to define server routes
              </div>
            </div>

            <div class={classes!.workflowStep}>
              <div class={classes!.stepNumber}>2</div>
              <div class={classes!.stepTitle}>Auto-Generate Client</div>
              <div class={classes!.stepDescription}>
                ui-lib generates HTMX client functions with proper attributes and headers
              </div>
            </div>

            <div class={classes!.workflowStep}>
              <div class={classes!.stepNumber}>3</div>
              <div class={classes!.stepTitle}>Register Routes</div>
              <div class={classes!.stepDescription">
                Server routes are automatically registered with the internal router
              </div>
            </div>

            <div class={classes!.workflowStep}>
              <div class={classes!.stepNumber}>4</div>
              <div class={classes!.stepTitle}>Use in Templates</div>
              <div class={classes!.stepDescription">
                Spread generated API functions directly into JSX elements
              </div>
            </div>
          </div>
        </div>
      )}

      <div class={classes!.benefitsList}>
        <div class={classes!.benefitCard}>
          <div class={classes!.benefitIcon}>🔄</div>
          <div class={classes!.benefitTitle}>Zero Duplication</div>
          <div class={classes!.benefitDescription}>
            Define server routes once. Client functions and HTMX attributes generated automatically.
          </div>
        </div>

        <div class={classes!.benefitCard}>
          <div class={classes!.benefitIcon}>🛡️</div>
          <div class={classes!.benefitTitle}>Type Safety</div>
          <div class={classes!.benefitDescription}>
            Full TypeScript support with parameter validation and response typing throughout the stack.
          </div>
        </div>

        <div class={classes!.benefitCard}>
          <div class={classes!.benefitIcon}>⚡</div>
          <div class={classes!.benefitTitle}>Automatic HTMX</div>
          <div class={classes!.benefitDescription}>
            Generated functions include proper HTMX attributes, headers, and error handling out of the box.
          </div>
        </div>

        <div class={classes!.benefitCard}>
          <div class={classes!.benefitIcon}>🎯</div>
          <div class={classes!.benefitTitle}>Always in Sync</div>
          <div class={classes!.benefitDescription">
            Server and client code can never get out of sync. Single source of truth for API definitions.
          </div>
        </div>

        <div class={classes!.benefitCard}>
          <div class={classes!.benefitIcon}>🔧</div>
          <div class={classes!.benefitTitle}>Built-in Error Handling</div>
          <div class={classes!.benefitDescription}>
            Automatic error boundaries, retry logic, and user feedback for failed requests.
          </div>
        </div>

        <div class={classes!.benefitCard}>
          <div class={classes!.benefitIcon}>📦</div>
          <div class={classes!.benefitTitle}>Zero Client Bundle</div>
          <div class={classes!.benefitDescription}>
            No API client library needed. All generation happens at build time with HTMX handling requests.
          </div>
        </div>
      </div>
    </section>
  ),
});

/**
 * 🔄 Live Unified API Demo Component
 * Interactive demonstration of the unified API system
 */
defineComponent("unified-api-live-demo", {
  // Example API definitions that would generate client functions
  api: {
    // POST /demo/items - Create a new demo item
    createItem: post("/demo/items", async (req) => {
      const data = await req.json();
      const item = {
        id: crypto.randomUUID(),
        name: data.name || "Unnamed Item",
        description: data.description || "No description",
        created: new Date().toISOString(),
        status: "active"
      };
      
      // In a real app, this would save to database
      return Response.json(item, { status: 201 });
    }),

    // GET /demo/items/:id - Retrieve a specific item  
    getItem: get("/demo/items/:id", async (req, params) => {
      // Mock item retrieval
      const item = {
        id: params.id,
        name: "Demo Item",
        description: "Retrieved via unified API",
        created: new Date().toISOString(),
        status: "active"
      };
      return Response.json(item);
    }),

    // PATCH /demo/items/:id - Update an existing item
    updateItem: patch("/demo/items/:id", async (req, params) => {
      const data = await req.json();
      const item = {
        id: params.id,
        name: data.name || "Updated Item",
        description: data.description || "Updated via API",
        modified: new Date().toISOString(),
        status: data.status || "active"
      };
      return Response.json(item);
    }),

    // DELETE /demo/items/:id - Remove an item
    deleteItem: del("/demo/items/:id", async (req, params) => {
      // Mock item deletion
      console.log(`Deleting item ${params.id}`);
      return new Response(null, { status: 204 });
    }),
  },

  styles: {
    demo: `{
      background: linear-gradient(135deg, var(--cyan-1) 0%, var(--blue-1) 100%);
      border: 2px solid var(--cyan-4);
      border-radius: var(--radius-4);
      padding: var(--size-5);
      margin: var(--size-3) 0;
    }`,

    demoTitle: `{
      font-size: var(--font-size-3);
      font-weight: var(--font-weight-6);
      color: var(--cyan-8);
      margin-bottom: var(--size-4);
      text-align: center;
    }`,

    apiGrid: `{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--size-3);
      margin-bottom: var(--size-4);
    }`,

    apiCard: `{
      background: white;
      border: 1px solid var(--cyan-3);
      border-radius: var(--radius-3);
      padding: var(--size-3);
      text-align: center;
    }`,

    apiButton: `{
      background: var(--cyan-6);
      color: white;
      border: none;
      padding: var(--size-2) var(--size-3);
      border-radius: var(--radius-2);
      cursor: pointer;
      font-size: var(--font-size-0);
      font-weight: var(--font-weight-5);
      width: 100%;
      margin-top: var(--size-2);
      transition: all 0.2s ease;
    }`,

    responseArea: `{
      background: var(--gray-9);
      color: var(--gray-1);
      border-radius: var(--radius-3);
      padding: var(--size-4);
      font-family: var(--font-mono);
      font-size: var(--font-size-0);
      line-height: 1.5;
      min-height: 120px;
      overflow-x: auto;
    }`,

    codeExample: `{
      background: white;
      border: 1px solid var(--gray-3);
      border-radius: var(--radius-3);
      padding: var(--size-4);
      margin-top: var(--size-4);
    }`,

    codeTitle: `{
      font-size: var(--font-size-1);
      font-weight: var(--font-weight-6);
      color: var(--cyan-7);
      margin-bottom: var(--size-3);
    }`,

    codeBlock: `{
      background: var(--gray-9);
      color: var(--gray-1);
      padding: var(--size-3);
      border-radius: var(--radius-2);
      font-family: var(--font-mono);
      font-size: var(--font-size-0);
      line-height: 1.4;
      overflow-x: auto;
    }`,
  },

  render: (
    {
      title = string("Live API Integration Demo"),
    },
    api,
    classes,
  ) => (
    <div class={classes!.demo}>
      <h4 class={classes!.demoTitle}>{title}</h4>
      
      <div class={classes!.apiGrid}>
        <div class={classes!.apiCard}>
          <div><strong>POST</strong></div>
          <div>Create Item</div>
          <button 
            class={classes!.apiButton}
            {...api.createItem()}
            hx-vals='{"name": "Demo Item", "description": "Created via unified API"}'
            hx-target="#api-response"
            style="background: var(--blue-6);"
          >
            Create Item
          </button>
        </div>

        <div class={classes!.apiCard}>
          <div><strong>GET</strong></div>
          <div>Fetch Item</div>
          <button 
            class={classes!.apiButton}
            {...api.getItem("demo-123")}
            hx-target="#api-response"
            style="background: var(--green-6);"
          >
            Get Item
          </button>
        </div>

        <div class={classes!.apiCard}>
          <div><strong>PATCH</strong></div>
          <div>Update Item</div>
          <button 
            class={classes!.apiButton}
            {...api.updateItem("demo-123")}
            hx-vals='{"name": "Updated Item", "status": "modified"}'
            hx-target="#api-response"
            style="background: var(--orange-6);"
          >
            Update Item
          </button>
        </div>

        <div class={classes!.apiCard}>
          <div><strong>DELETE</strong></div>
          <div>Remove Item</div>
          <button 
            class={classes!.apiButton}
            {...api.deleteItem("demo-123")}
            hx-target="#api-response"
            hx-confirm="Delete this item?"
            style="background: var(--red-6);"
          >
            Delete Item
          </button>
        </div>
      </div>

      <div>
        <strong style="color: var(--cyan-7);">API Response:</strong>
        <div class={classes!.responseArea} id="api-response">
          Click any button above to see the unified API in action...<br/>
          <br/>
          🔄 Routes defined once in component API config<br/>
          ⚡ HTMX attributes generated automatically<br/>
          🛡️ Type-safe request/response handling<br/>
          📦 Zero client-side API library needed
        </div>
      </div>

      <div class={classes!.codeExample}>
        <div class={classes!.codeTitle}>Generated HTMX Attributes:</div>
        <div class={classes!.codeBlock}>
{`// From this API definition:
createItem: post("/demo/items", handler)

// ui-lib generates:
{
  "hx-post": "/demo/items",
  "hx-headers": '{"Content-Type": "application/json"}',
  "hx-ext": "json-enc"
}

// You just use:
<button {...api.createItem()}>Create</button>`}
        </div>
      </div>
    </div>
  ),
});

/**
 * 📊 API Method Comparison Table
 * Shows the mapping from HTTP methods to generated client functions
 */
defineComponent("api-method-comparison", {
  styles: {
    table: `{
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: var(--radius-3);
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      margin: var(--size-4) 0;
    }`,

    tableHeader: `{
      background: var(--cyan-6);
      color: white;
      font-weight: var(--font-weight-6);
      padding: var(--size-3);
      text-align: left;
    }`,

    tableRow: `{
      border-bottom: 1px solid var(--gray-3);
    }`,

    tableCell: `{
      padding: var(--size-3);
      vertical-align: top;
    }`,

    methodBadge: `{
      background: var(--gray-6);
      color: white;
      padding: var(--size-1) var(--size-2);
      border-radius: var(--radius-1);
      font-size: var(--font-size-0);
      font-weight: var(--font-weight-6);
      font-family: var(--font-mono);
    }`,

    getBadge: `{ background: var(--green-6); }`,
    postBadge: `{ background: var(--blue-6); }`,
    patchBadge: `{ background: var(--orange-6); }`,
    deleteBadge: `{ background: var(--red-6); }`,

    codeSnippet: `{
      background: var(--gray-1);
      padding: var(--size-2);
      border-radius: var(--radius-1);
      font-family: var(--font-mono);
      font-size: var(--font-size-0);
      margin: var(--size-1) 0;
    }`,
  },

  render: () => (
    <table class="table">
      <thead>
        <tr>
          <th class="tableHeader">HTTP Method</th>
          <th class="tableHeader">API Helper</th>
          <th class="tableHeader">Generated Function</th>
          <th class="tableHeader">HTMX Attributes</th>
        </tr>
      </thead>
      <tbody>
        <tr class="tableRow">
          <td class="tableCell">
            <span class="methodBadge getBadge">GET</span>
          </td>
          <td class="tableCell">
            <div class="codeSnippet">get("/api/items/:id", handler)</div>
          </td>
          <td class="tableCell">
            <div class="codeSnippet">api.get(id)</div>
          </td>
          <td class="tableCell">
            <div class="codeSnippet">hx-get="/api/items/123"</div>
          </td>
        </tr>
        <tr class="tableRow">
          <td class="tableCell">
            <span class="methodBadge postBadge">POST</span>
          </td>
          <td class="tableCell">
            <div class="codeSnippet">post("/api/items", handler)</div>
          </td>
          <td class="tableCell">
            <div class="codeSnippet">api.create()</div>
          </td>
          <td class="tableCell">
            <div class="codeSnippet">hx-post="/api/items"<br/>hx-ext="json-enc"</div>
          </td>
        </tr>
        <tr class="tableRow">
          <td class="tableCell">
            <span class="methodBadge patchBadge">PATCH</span>
          </td>
          <td class="tableCell">
            <div class="codeSnippet">patch("/api/items/:id", handler)</div>
          </td>
          <td class="tableCell">
            <div class="codeSnippet">api.update(id)</div>
          </td>
          <td class="tableCell">
            <div class="codeSnippet">hx-patch="/api/items/123"<br/>hx-ext="json-enc"</div>
          </td>
        </tr>
        <tr class="tableRow">
          <td class="tableCell">
            <span class="methodBadge deleteBadge">DELETE</span>
          </td>
          <td class="tableCell">
            <div class="codeSnippet">del("/api/items/:id", handler)</div>
          </td>
          <td class="tableCell">
            <div class="codeSnippet">api.remove(id)</div>
          </td>
          <td class="tableCell">
            <div class="codeSnippet">hx-delete="/api/items/123"<br/>hx-confirm="Are you sure?"</div>
          </td>
        </tr>
      </tbody>
    </table>
  ),
});
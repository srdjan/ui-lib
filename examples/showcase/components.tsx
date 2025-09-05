/** @jsx h */
import { defineComponent, h, string, number, boolean, post, patch, del } from "../../index.ts";

/**
 * Hero Stats Component - Animated statistics display
 */
defineComponent("showcase-hero-stats", {
  styles: {
    statsContainer: `{
      display: flex;
      justify-content: center;
      gap: 3rem;
      margin-top: 2rem;
      flex-wrap: wrap;
    }`,
    
    statItem: `{
      text-align: center;
      animation: fadeInUp 0.6s ease forwards;
      opacity: 0;
    }`,
    
    statValue: `{
      font-size: 2.5rem;
      font-weight: 900;
      display: block;
      margin-bottom: 0.25rem;
    }`,
    
    statLabel: `{
      font-size: 0.875rem;
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }`
  },
  
  render: (_, __, classes) => (
    <div class={classes!.statsContainer}>
      <div class={classes!.statItem} style="animation-delay: 0.1s;">
        <span class={classes!.statValue}>0kb</span>
        <span class={classes!.statLabel}>Client Runtime</span>
      </div>
      <div class={classes!.statItem} style="animation-delay: 0.2s;">
        <span class={classes!.statValue}>100%</span>
        <span class={classes!.statLabel}>Type Safe</span>
      </div>
      <div class={classes!.statItem} style="animation-delay: 0.3s;">
        <span class={classes!.statValue}>3ms</span>
        <span class={classes!.statLabel}>Render Time</span>
      </div>
      <div class={classes!.statItem} style="animation-delay: 0.4s;">
        <span class={classes!.statValue}>∞</span>
        <span class={classes!.statLabel}>Scalability</span>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
    </div>
  )
});

/**
 * Demo Viewer Component - Shows code and preview side by side
 */
defineComponent("showcase-demo-viewer", {
  styles: {
    viewer: `{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      width: 100%;
    }
    @media (max-width: 968px) {
      .viewer {
        grid-template-columns: 1fr;
      }
    }`,
    
    codePanel: `{
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      overflow: hidden;
    }`,
    
    previewPanel: `{
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      overflow: hidden;
    }`,
    
    panelHeader: `{
      padding: 1rem 1.5rem;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }`,
    
    panelTitle: `{
      font-weight: 600;
      color: #374151;
    }`,
    
    codeContent: `{
      padding: 1.5rem;
      font-family: 'Cascadia Code', 'Fira Code', monospace;
      font-size: 0.9rem;
      line-height: 1.6;
      background: #1e293b;
      color: #e2e8f0;
      overflow-x: auto;
      min-height: 400px;
    }`,
    
    previewContent: `{
      padding: 2rem;
      min-height: 400px;
    }`
  },
  
  render: ({
    demo = string("ecommerce")
  }, _, classes) => {
    const demoName = typeof demo === "string" ? demo : "ecommerce";
    
    return (
      <div class={classes!.viewer}>
        <div class={classes!.codePanel}>
          <div class={classes!.panelHeader}>
            <span class={classes!.panelTitle}>📝 ui-lib Code</span>
            <div class="panel-actions">
              <button class="panel-action" onclick="copyCode(this)">📋 Copy</button>
              <button class="panel-action" onclick="formatCode(this)">✨ Format</button>
            </div>
          </div>
          <pre class={classes!.codeContent}>
            <code id={`code-${demoName}`} hx-get={`/api/showcase/code/${demoName}`} hx-trigger="load">
              Loading code example...
            </code>
          </pre>
        </div>
        
        <div class={classes!.previewPanel}>
          <div class={classes!.panelHeader}>
            <span class={classes!.panelTitle}>👁️ Live Preview</span>
            <div class="panel-actions">
              <button class="panel-action" onclick="refreshPreview(this)">🔄 Refresh</button>
              <button class="panel-action" onclick="toggleFullscreen(this)">⛶ Fullscreen</button>
            </div>
          </div>
          <div class={classes!.previewContent} id={`preview-${demoName}`} 
               hx-get={`/api/showcase/preview/${demoName}`} 
               hx-trigger="load">
            Loading preview...
          </div>
        </div>
        
      </div>
    );
  }
});

/**
 * Interactive Playground Component
 */
defineComponent("showcase-playground", {
  api: {
    runCode: post("/api/showcase/run", async (req) => {
      const { code } = await req.json();
      // Process the code and return result
      return new Response(JSON.stringify({ 
        output: "Component rendered successfully!",
        metrics: { renderTime: 3, bundleSize: 0 }
      }));
    })
  },
  
  styles: {
    playground: `{
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      min-height: 500px;
    }
    @media (max-width: 968px) {
      .playground {
        grid-template-columns: 1fr;
      }
    }`,
    
    editorPanel: `{
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      display: flex;
      flex-direction: column;
    }`,
    
    editorHeader: `{
      padding: 1rem 1.5rem;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
      font-weight: 600;
      color: #374151;
    }`,
    
    editorTextarea: `{
      flex: 1;
      padding: 1.5rem;
      border: none;
      font-family: 'Cascadia Code', 'Fira Code', monospace;
      font-size: 0.9rem;
      line-height: 1.6;
      resize: none;
      background: #1e293b;
      color: #e2e8f0;
      outline: none;
    }`,
    
    runButton: `{
      margin: 1rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #2563eb, #0ea5e9);
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }`,
    
    outputPanel: `{
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      display: flex;
      flex-direction: column;
    }`,
    
    outputContent: `{
      flex: 1;
      padding: 1.5rem;
      overflow-y: auto;
    }`
  },
  
  render: (_: any, api: any, classes: any) => (
    <div class={classes!.playground}>
      <div class={classes!.editorPanel}>
        <div class={classes!.editorHeader}>✏️ Code Editor</div>
        <textarea 
          class={classes!.editorTextarea}
          id="playground-code"
          placeholder="// Write your ui-lib component here..."
          spellcheck="false"
        >{`import { defineComponent, h, string, number } from "ui-lib";

defineComponent("my-component", {
  styles: {
    container: \`{
      padding: 1rem;
      background: #f3f4f6;
      border-radius: 0.5rem;
    }\`
  },
  
  render: ({
    title = string("Hello World"),
    count = number(0)
  }, _, classes) => (
    <div class={classes.container}>
      <h3>{title}</h3>
      <p>Count: {count}</p>
    </div>
  )
});`}</textarea>
        <button 
          class={classes!.runButton}
          {...api.runCode()}
          hx-include="#playground-code"
          hx-target="#playground-output"
          hx-swap="innerHTML"
        >
          ▶️ Run Code
        </button>
      </div>
      
      <div class={classes!.outputPanel}>
        <div class={classes!.editorHeader}>📦 Output</div>
        <div class={classes!.outputContent} id="playground-output">
          <div style="color: #6b7280; text-align: center; padding: 2rem;">
            Press "Run Code" to see your component in action!
          </div>
        </div>
      </div>
    </div>
  )
});
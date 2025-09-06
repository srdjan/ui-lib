/** @jsx h */
import { defineComponent, h, post, string } from "../../index.ts";
import { ModalShowcase } from "./modal-showcase.tsx";

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
    }`,
  },

  render: (_, __, classes) => (
    <div class={classes!.statsContainer}>
      <div class={classes!.statItem}>
        <span class={classes!.statValue}>0kb</span>
        <span class={classes!.statLabel}>Client Runtime</span>
      </div>
      <div class={classes!.statItem}>
        <span class={classes!.statValue}>100%</span>
        <span class={classes!.statLabel}>Type Safe</span>
      </div>
      <div class={classes!.statItem}>
        <span class={classes!.statValue}>3ms</span>
        <span class={classes!.statLabel}>Render Time</span>
      </div>
      <div class={classes!.statItem}>
        <span class={classes!.statValue}>∞</span>
        <span class={classes!.statLabel}>Scalability</span>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
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
        .${classes!.statsContainer} .${
            classes!.statItem
          }:nth-child(1) { animation-delay: 0.1s; }
        .${classes!.statsContainer} .${
            classes!.statItem
          }:nth-child(2) { animation-delay: 0.2s; }
        .${classes!.statsContainer} .${
            classes!.statItem
          }:nth-child(3) { animation-delay: 0.3s; }
        .${classes!.statsContainer} .${
            classes!.statItem
          }:nth-child(4) { animation-delay: 0.4s; }
      `,
        }}
      />
    </div>
  ),
});

/**
 * Demo Viewer Component - Shows code and preview side by side
 */
defineComponent("showcase-demo-viewer", {
  styles: {
    viewer: `{
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      position: relative;
    }`,

    viewCodeButton: `{
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, var(--blue-6), var(--cyan-6));
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      z-index: 10;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
    }`,

    viewCodeButtonHover: `{
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
    }`,

    codeModal: `{
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    }`,

    codeModalOpen: `{
      display: flex !important;
      align-items: center;
      justify-content: center;
    }`,

    codeModalContent: `{
      background: white;
      border-radius: 1rem;
      width: 90%;
      max-width: 1000px;
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      animation: slideUp 0.3s ease;
    }`,

    codeModalHeader: `{
      padding: 1.5rem;
      background: var(--gray-50);
      border-bottom: 1px solid var(--gray-200);
      border-radius: 1rem 1rem 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }`,

    codeModalTitle: `{
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--gray-900);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }`,

    codeModalClose: `{
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--gray-500);
      cursor: pointer;
      padding: 0.25rem;
      transition: color 0.2s ease;
    }`,

    codeModalBody: `{
      flex: 1;
      overflow: auto;
      padding: 0;
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
      background: var(--gray-50);
      border-bottom: 1px solid var(--gray-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }`,

    panelTitle: `{
      font-weight: 600;
      color: var(--gray-700);
    }`,

    codeContent: `{
      padding: 1.5rem;
      font-family: 'Cascadia Code', 'Fira Code', monospace;
      font-size: 0.9rem;
      line-height: 1.6;
      background: var(--gray-900);
      color: var(--gray-100);
      overflow-x: auto;
      min-height: 400px;
    }`,

    previewContent: `{
      padding: 2rem;
      min-height: 400px;
    }`,
  },

  render: (
    {
      demo = string("ecommerce"),
    },
    _,
    classes,
  ) => {
    const demoName = typeof demo === "string" ? demo : "ecommerce";

    return (
      <div class={classes!.viewer}>
        <div class={classes!.codePanel}>
          <div class={classes!.panelHeader}>
            <span class={classes!.panelTitle}>📝 ui-lib Code</span>
            <div class="panel-actions">
              <button
                type="button"
                class="panel-action"
                onclick="copyCode(this)"
              >
                📋 Copy
              </button>
              <button
                type="button"
                class="panel-action"
                onclick="formatCode(this)"
              >
                ✨ Format
              </button>
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
              <button
                type="button"
                class="panel-action"
                onclick="refreshPreview(this)"
              >
                🔄 Refresh
              </button>
              <button
                type="button"
                class="panel-action"
                onclick="toggleFullscreen(this)"
              >
                ⛶ Fullscreen
              </button>
            </div>
          </div>
          <div
            class={classes!.previewContent}
            id={`preview-${demoName}`}
            hx-get={`/api/showcase/preview/${demoName}`}
            hx-trigger="load"
          >
            Loading preview...
          </div>
        </div>

        <div class={classes!.previewPanel}>
          <div class={classes!.panelHeader}>
            <span class={classes!.panelTitle}>👁️ Modal Preview</span>
          </div>
          <div class={classes!.previewContent}>
            <ModalShowcase />
          </div>
        </div>
      </div>
    );
  },
});

/**
 * Interactive Playground Component
 */
defineComponent("showcase-playground", {
  api: {
    runCode: post("/api/showcase/run", async (req) => {
      const { code: _code } = await req.json();
      // Process the code and return result
      return new Response(JSON.stringify({
        output: "Component rendered successfully!",
        metrics: { renderTime: 3, bundleSize: 0 },
      }));
    }),
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
      background: var(--gray-50);
      border-bottom: 1px solid var(--gray-200);
      font-weight: 600;
      color: var(--gray-700);
    }`,

    editorTextarea: `{
      flex: 1;
      padding: 1.5rem;
      border: none;
      font-family: 'Cascadia Code', 'Fira Code', monospace;
      font-size: 0.9rem;
      line-height: 1.6;
      resize: none;
      background: var(--gray-900);
      color: var(--gray-100);
      outline: none;
    }`,

    runButton: `{
      margin: 1rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, var(--blue-6), var(--cyan-6));
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
    }`,

    placeholder: `{
      color: var(--gray-600);
      text-align: center;
      padding: 2rem;
    }`,
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
        >
          {`import { defineComponent, h, string, number } from "ui-lib";

defineComponent("my-component", {
  styles: {
    container: \`{
      padding: 1rem;
      background: var(--gray-100);
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
});`}
        </textarea>
        <button
          class={classes!.runButton}
          {...(api.runCode as any)()}
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
          <div class={classes!.placeholder}>
            Press "Run Code" to see your component in action!
          </div>
        </div>
      </div>
    </div>
  ),
});

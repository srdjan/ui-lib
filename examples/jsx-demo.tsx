/** @jsx h */
// deno-lint-ignore-file verbatim-module-syntax
import {
  defineComponent,
  get,
  h,
  renderComponent,
} from "../index.ts";

/**
 * 🎯 JSX vs renderComponent Demonstration
 * 
 * This file demonstrates both approaches working seamlessly:
 * 1. Traditional renderComponent() function calls
 * 2. Pure JSX syntax with full type safety
 * 
 * Both approaches produce identical output and performance.
 */

defineComponent("jsx-demo-layout", {
  api: {
    showTraditional: get("/demo/traditional", (_req) => {
      const content = renderTraditionalApproach();
      return new Response(content, {
        headers: { "Content-Type": "text/html" },
      });
    }),
    showJSX: get("/demo/jsx", (_req) => {
      const content = renderJSXApproach();
      return new Response(content, {
        headers: { "Content-Type": "text/html" },
      });
    }),
  },

  styles: {
    container: `{
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }`,
    
    title: `{
      font-size: 2.5rem;
      color: #2563eb;
      margin-bottom: 1rem;
      text-align: center;
    }`,
    
    subtitle: `{
      font-size: 1.2rem;
      color: #6b7280;
      margin-bottom: 3rem;
      text-align: center;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }`,
    
    section: `{
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
      border-left: 4px solid #2563eb;
    }`,
    
    sectionTitle: `{
      font-size: 1.5rem;
      color: #1f2937;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }`,
    
    description: `{
      color: #6b7280;
      margin-bottom: 2rem;
      line-height: 1.6;
    }`,
    
    codeBlock: `{
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 1rem;
      font-family: 'Monaco', 'Cascadia Code', monospace;
      font-size: 0.875rem;
      margin: 1rem 0;
      overflow-x: auto;
    }`,
    
    comparison: `{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin: 2rem 0;
    }`,
    
    comparisonSide: `{
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }`,
    
    benefit: `{
      color: #059669;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }`,
    
    buttonGroup: `{
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin: 2rem 0;
    }`,
    
    button: `{
      background: #2563eb;
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.2s ease;
    }`,
    
    buttonHover: `{ 
      background: #1d4ed8;
      transform: translateY(-1px);
    }`,

    demos: `{
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
      justify-content: center;
      margin: 2rem 0;
    }`,
  },

  render: (props: any, api: any, classes: any) => (
    <div class={classes!.container}>
      <h1 class={classes!.title}>🚀 funcwc JSX Revolution</h1>
      <p class={classes!.subtitle}>
        The same powerful components, now with native JSX support and full TypeScript integration.
        Choose your preferred syntax - both approaches deliver identical performance and functionality.
      </p>

      <div class={classes!.section}>
        <h2 class={classes!.sectionTitle}>
          📊 Side-by-Side Comparison
        </h2>
        <p class={classes!.description}>
          Both approaches render the exact same components with identical performance.
          The choice is purely about developer experience and syntax preference.
        </p>

        <div class={classes!.comparison}>
          <div class={classes!.comparisonSide}>
            <h3 style="color: #7c3aed; margin-bottom: 1rem;">
              🔧 Traditional renderComponent()
            </h3>
            <div class={classes!.codeBlock}>
{`{renderComponent("demo-counter", {
  "initial-count": "5",
  "step": "2", 
  "max-value": "20",
  "theme": "blue",
  "label": "Traditional"
})}`}
            </div>
            <div class={classes!.benefit}>✅ Explicit string props</div>
            <div class={classes!.benefit}>✅ Runtime flexibility</div>
            <div class={classes!.benefit}>✅ Dynamic component names</div>
          </div>

          <div class={classes!.comparisonSide}>
            <h3 style="color: #059669; margin-bottom: 1rem;">
              ✨ Pure JSX Syntax
            </h3>
            <div class={classes!.codeBlock}>
{`<demo-counter
  initial-count={5}
  step={2}
  max-value={20} 
  theme="blue"
  label="JSX"
/>`}
            </div>
            <div class={classes!.benefit}>✅ Native TypeScript support</div>
            <div class={classes!.benefit}>✅ IDE autocompletion</div>
            <div class={classes!.benefit}>✅ Familiar React-like syntax</div>
          </div>
        </div>

        <div class={classes!.buttonGroup}>
          <button 
            class={classes!.button}
            {...api.showTraditional(undefined, {
              target: "#demo-output",
              swap: "innerHTML"
            })}
          >
            🔧 Show Traditional Approach
          </button>
          <button 
            class={classes!.button}
            {...api.showJSX(undefined, {
              target: "#demo-output", 
              swap: "innerHTML"
            })}
          >
            ✨ Show JSX Approach  
          </button>
        </div>
      </div>

      <div class={classes!.section}>
        <h2 class={classes!.sectionTitle}>
          🎯 Live Demo Output
        </h2>
        <div id="demo-output" style="min-height: 200px; padding: 1rem; background: #f8fafc; border-radius: 8px; border: 2px dashed #d1d5db;">
          <p style="color: #6b7280; text-align: center; margin: 2rem 0;">
            Click the buttons above to see both approaches in action! ⬆️
          </p>
        </div>
      </div>

      <div class={classes!.section}>
        <h2 class={classes!.sectionTitle}>
          🔬 Technical Implementation
        </h2>
        <p class={classes!.description}>
          The JSX runtime has been enhanced to automatically detect funcwc components (kebab-case tags)
          and seamlessly route them through the same renderComponent pipeline. This means:
        </p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin: 1rem 0;">
          <div style="padding: 1rem; background: #ecfdf5; border-radius: 8px; border: 1px solid #a7f3d0;">
            <strong style="color: #065f46;">🔄 Zero Performance Impact</strong>
            <p style="color: #047857; margin: 0.5rem 0 0;">
              JSX components use the exact same rendering pipeline as renderComponent()
            </p>
          </div>
          <div style="padding: 1rem; background: #eff6ff; border-radius: 8px; border: 1px solid #93c5fd;">
            <strong style="color: #1e40af;">🛡️ Full Type Safety</strong>
            <p style="color: #1d4ed8; margin: 0.5rem 0 0;">
              Auto-generated TypeScript definitions provide complete prop validation
            </p>
          </div>
          <div style="padding: 1rem; background: #fdf4ff; border-radius: 8px; border: 1px solid #c084fc;">
            <strong style="color: #7c3aed;">🔧 Backward Compatible</strong>
            <p style="color: #8b5cf6; margin: 0.5rem 0 0;">
              Existing renderComponent() code continues to work without changes
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
});

// Traditional approach using renderComponent()
function renderTraditionalApproach(): string {
  const classes = {}; // In real usage, classes would be provided by the system
  
  return `
    <div style="padding: 2rem; background: #f8fafc; border-radius: 8px;">
      <h3 style="color: #7c3aed; margin-bottom: 1.5rem; text-align: center;">
        🔧 Traditional renderComponent() Approach
      </h3>
      
      <div style="display: flex; gap: 2rem; flex-wrap: wrap; justify-content: center;">
        ${renderComponent("demo-counter", {
          "initial-count": "5",
          "step": "1", 
          "max-value": "15",
          "theme": "blue",
          "label": "Traditional Basic"
        })}
        
        ${renderComponent("demo-counter", {
          "initial-count": "10",
          "step": "5",
          "max-value": "50", 
          "theme": "purple",
          "label": "Traditional Advanced",
          "show-controls": "true"
        })}
        
        ${renderComponent("demo-counter", {
          "initial-count": "0",
          "step": "2",
          "max-value": "20",
          "min-value": "-10", 
          "theme": "green",
          "label": "Traditional Range"
        })}
      </div>
      
      <div style="margin-top: 2rem; padding: 1rem; background: white; border-radius: 6px; border-left: 4px solid #7c3aed;">
        <p style="color: #6b7280; margin: 0; font-size: 0.875rem;">
          <strong>✅ Advantages:</strong> Explicit prop handling, runtime flexibility, works with dynamic component names
        </p>
      </div>
    </div>
  `;
}

// JSX approach using native JSX syntax
function renderJSXApproach(): string {
  return (
    <div style="padding: 2rem; background: #f0fdf4; border-radius: 8px;">
      <h3 style="color: #059669; margin-bottom: 1.5rem; text-align: center;">
        ✨ Pure JSX Syntax Approach
      </h3>
      
      <div style="display: flex; gap: 2rem; flex-wrap: wrap; justify-content: center;">
        <demo-counter
          initial-count={5}
          step={1}
          max-value={15}
          theme="blue" 
          label="JSX Basic"
        />
        
        <demo-counter
          initial-count={10}
          step={5}
          max-value={50}
          theme="purple"
          label="JSX Advanced"
          show-controls={true}
        />
        
        <demo-counter
          initial-count={0}
          step={2}
          max-value={20}
          min-value={-10}
          theme="green"
          label="JSX Range"
        />
      </div>
      
      <div style="margin-top: 2rem; padding: 1rem; background: white; border-radius: 6px; border-left: 4px solid #059669;">
        <p style="color: #6b7280; margin: 0; font-size: 0.875rem;">
          <strong>✅ Advantages:</strong> TypeScript integration, IDE autocompletion, familiar React-like syntax, prop type validation
        </p>
      </div>
    </div>
  );
}
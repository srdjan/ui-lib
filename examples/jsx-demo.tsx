/** @jsx h */
// deno-lint-ignore-file verbatim-module-syntax
import {
  defineComponent,
  get,
  h,
} from "../index.ts";

/**
 * 🎯 JSX Component Showcase
 * 
 * This component demonstrates funcwc's native JSX support with:
 * 1. Full TypeScript integration and type safety
 * 2. Modern developer experience with IDE support
 * 3. React-like syntax that developers already know
 * 4. Zero runtime overhead with direct HTML rendering
 */

defineComponent("jsx-demo-layout", {
  api: {
    showBasicDemo: get("/demo/jsx/basic", (_req) => {
      const content = renderBasicJSXDemo();
      return new Response(content, {
        headers: { "Content-Type": "text/html" },
      });
    }),
    showAdvancedDemo: get("/demo/jsx/advanced", (_req) => {
      const content = renderAdvancedJSXDemo();
      return new Response(content, {
        headers: { "Content-Type": "text/html" },
      });
    }),
    showTypeSafetyDemo: get("/demo/jsx/types", (_req) => {
      const content = renderTypeSafetyDemo();
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
      <h1 class={classes!.title}>✨ JSX Component Showcase</h1>
      <p class={classes!.subtitle}>
        Discover funcwc's native JSX support with full TypeScript integration,
        modern IDE features, and zero runtime overhead.
      </p>

      <div class={classes!.section}>
        <h2 class={classes!.sectionTitle}>
          🎯 Interactive JSX Demonstrations
        </h2>
        <p class={classes!.description}>
          Explore different aspects of funcwc's JSX implementation through these interactive demos.
          Each demo showcases different features and capabilities.
        </p>

        <div class={classes!.buttonGroup}>
          <button 
            class={classes!.button}
            {...api.showBasicDemo(undefined, {
              target: "#demo-output",
              swap: "innerHTML"
            })}
          >
            🎨 Basic JSX Demo
          </button>
          <button 
            class={classes!.button}
            {...api.showAdvancedDemo(undefined, {
              target: "#demo-output", 
              swap: "innerHTML"
            })}
          >
            ⚡ Advanced Features
          </button>
          <button 
            class={classes!.button}
            {...api.showTypeSafetyDemo(undefined, {
              target: "#demo-output", 
              swap: "innerHTML"
            })}
          >
            🛡️ Type Safety Demo
          </button>
        </div>
      </div>

      <div class={classes!.section}>
        <h2 class={classes!.sectionTitle}>
          🎯 Live Demo Output
        </h2>
        <div id="demo-output" style="min-height: 300px; padding: 1rem; background: #f8fafc; border-radius: 8px; border: 2px dashed #d1d5db;">
          <div style="text-align: center; padding: 2rem;">
            <h3 style="color: #6b7280; margin-bottom: 1rem;">🚀 Choose a demo above to get started!</h3>
            <p style="color: #9ca3af; margin: 0;">
              Click any of the demo buttons to see funcwc's JSX capabilities in action.
            </p>
          </div>
        </div>
      </div>

      <div class={classes!.section}>
        <h2 class={classes!.sectionTitle}>
          🔬 JSX Features & Benefits
        </h2>
        <p class={classes!.description}>
          funcwc's JSX implementation provides modern developer experience while maintaining
          the library's core philosophy of DOM-native components and zero runtime overhead.
        </p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin: 1rem 0;">
          <div style="padding: 1rem; background: #ecfdf5; border-radius: 8px; border: 1px solid #a7f3d0;">
            <strong style="color: #065f46;">🛡️ TypeScript Integration</strong>
            <p style="color: #047857; margin: 0.5rem 0 0;">
              Full compile-time type checking with automatic prop inference
            </p>
          </div>
          <div style="padding: 1rem; background: #eff6ff; border-radius: 8px; border: 1px solid #93c5fd;">
            <strong style="color: #1e40af;">💡 IDE Support</strong>
            <p style="color: #1d4ed8; margin: 0.5rem 0 0;">
              Complete autocompletion, error highlighting, and go-to-definition
            </p>
          </div>
          <div style="padding: 1rem; background: #fdf4ff; border-radius: 8px; border: 1px solid #c084fc;">
            <strong style="color: #7c3aed;">⚡ Performance</strong>
            <p style="color: #8b5cf6; margin: 0.5rem 0 0;">
              Zero runtime overhead - JSX compiles directly to HTML strings
            </p>
          </div>
          <div style="padding: 1rem; background: #fffbeb; border-radius: 8px; border: 1px solid #fcd34d;">
            <strong style="color: #92400e;">🎯 Familiar Syntax</strong>
            <p style="color: #b45309; margin: 0.5rem 0 0;">
              React-like JSX that developers already know and understand
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
});

// Basic JSX demonstration
function renderBasicJSXDemo(): string {
  return (
    <div style="padding: 2rem; background: #f0fdf4; border-radius: 8px;">
      <h3 style="color: #059669; margin-bottom: 1.5rem; text-align: center;">
        🎨 Basic JSX Components
      </h3>
      <p style="color: #047857; text-align: center; margin-bottom: 2rem;">
        Simple JSX syntax with typed props - notice how clean and familiar it looks!
      </p>
      
      <div style="display: flex; gap: 2rem; flex-wrap: wrap; justify-content: center;">
        <demo-counter
          initial-count={5}
          step={1}
          max-value={15}
          theme="blue" 
          label="Basic JSX"
        />
        
        <demo-counter
          initial-count={10}
          step={2}
          max-value={30}
          theme="green"
          label="Typed Props"
        />
      </div>
      
      <div style="margin-top: 2rem; padding: 1rem; background: white; border-radius: 6px;">
        <h4 style="color: #059669; margin-top: 0;">JSX Source Code:</h4>
        <pre style="background: #f8f9fa; padding: 1rem; border-radius: 4px; overflow-x: auto; margin: 0; font-size: 0.875rem;"><code style="color: #059669;">{`<demo-counter
  initial-count={5}    // number type
  step={1}             // number type  
  theme="blue"         // string type
  label="Basic JSX"    // string type
/>`}</code></pre>
      </div>
    </div>
  );
}

// Advanced JSX features demonstration  
function renderAdvancedJSXDemo(): string {
  return (
    <div style="padding: 2rem; background: #eff6ff; border-radius: 8px;">
      <h3 style="color: #1d4ed8; margin-bottom: 1.5rem; text-align: center;">
        ⚡ Advanced JSX Features
      </h3>
      <p style="color: #1e40af; text-align: center; margin-bottom: 2rem;">
        Complex prop types, boolean attributes, and reactive components working together!
      </p>
      
      <div style="display: grid; gap: 2rem; grid-template-columns: 2fr 1fr; margin-bottom: 2rem;">
        <div>
          <demo-counter
            initial-count={25}
            step={5}
            max-value={100}
            theme="purple"
            label="Advanced Counter"
            show-controls={true}
          />
        </div>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <theme-controller current-theme="purple" />
          <cart-badge cart-id="demo" />
        </div>
      </div>
      
      <div style="margin-top: 2rem; padding: 1rem; background: white; border-radius: 6px;">
        <h4 style="color: #1d4ed8; margin-top: 0;">Advanced JSX Features:</h4>
        <ul style="color: #1e40af; margin: 0;">
          <li><strong>Boolean Props:</strong> <code>show-controls={true}</code></li>
          <li><strong>Complex Types:</strong> Numbers, strings, booleans all properly typed</li>
          <li><strong>Reactive Components:</strong> Theme and cart components with state</li>
          <li><strong>Component Composition:</strong> Multiple components working together</li>
        </ul>
      </div>
    </div>
  );
}

// Type safety demonstration
function renderTypeSafetyDemo(): string {
  return (
    <div style="padding: 2rem; background: #fdf4ff; border-radius: 8px;">
      <h3 style="color: #7c3aed; margin-bottom: 1.5rem; text-align: center;">
        🛡️ TypeScript Integration & Type Safety
      </h3>
      <p style="color: #8b5cf6; text-align: center; margin-bottom: 2rem;">
        See how TypeScript validates props at compile time and provides IDE support!
      </p>
      
      <div style="display: flex; gap: 2rem; flex-wrap: wrap; justify-content: center; margin-bottom: 2rem;">
        <demo-counter
          initial-count={0}
          step={3}
          max-value={21}
          min-value={-6}
          theme="purple"
          label="Type Safe Counter"
          disabled={false}
        />
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <div style="padding: 1rem; background: white; border-radius: 6px; border: 1px solid #a855f7;">
          <h4 style="color: #7c3aed; margin-top: 0;">✅ Valid JSX (TypeScript Happy)</h4>
          <pre style="background: #f3e8ff; padding: 1rem; border-radius: 4px; margin: 0; font-size: 0.75rem;"><code style="color: #7c3aed;">{`<demo-counter
  initial-count={10}  ✅ number
  theme="blue"        ✅ string  
  disabled={true}     ✅ boolean
/>`}</code></pre>
        </div>
        
        <div style="padding: 1rem; background: white; border-radius: 6px; border: 1px solid #ef4444;">
          <h4 style="color: #dc2626; margin-top: 0;">❌ Invalid JSX (TypeScript Errors)</h4>
          <pre style="background: #fef2f2; padding: 1rem; border-radius: 4px; margin: 0; font-size: 0.75rem;"><code style="color: #dc2626;">{`<demo-counter
  initial-count="ten" ❌ string not number
  theme={123}         ❌ number not string  
  invalid-prop="x"    ❌ unknown prop
/>`}</code></pre>
        </div>
      </div>
      
      <div style="margin-top: 2rem; padding: 1rem; background: white; border-radius: 6px;">
        <h4 style="color: #7c3aed; margin-top: 0;">🎯 IDE Integration Benefits:</h4>
        <ul style="color: #8b5cf6; margin: 0;">
          <li><strong>Autocompletion:</strong> All available props show up as you type</li>
          <li><strong>Type Validation:</strong> Invalid prop types highlighted in red</li>
          <li><strong>Go to Definition:</strong> Jump to component definition with Cmd+Click</li>
          <li><strong>Hover Documentation:</strong> See prop types and descriptions on hover</li>
        </ul>
      </div>
    </div>
  );
}
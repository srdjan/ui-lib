/** @jsx h */
import { array, boolean, defineComponent, h, number, object, string } from "../../index.ts";

/**
 * ✨ Function-Style Props Showcase
 * 
 * Demonstrates the revolutionary zero-duplication props system:
 * - Smart type helpers (string, number, boolean, array, object)
 * - Type inference from render function signature
 * - No separate props interface needed
 * - Built-in validation and defaults
 */
defineComponent("showcase-function-props", {
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
      color: var(--indigo-6);
      margin-bottom: var(--size-4);
    }`,

    showcaseSubtitle: `{
      font-size: var(--font-size-1);
      color: var(--gray-7);
      margin-bottom: var(--size-6);
    }`,

    showcaseGrid: `{
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

    codeBlockAlt: `{
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
      background: var(--indigo-6);
      color: white;
      padding: var(--size-2) var(--size-3);
      font-size: var(--font-size-0);
      font-weight: var(--font-weight-6);
      margin: calc(-1 * var(--size-4)) calc(-1 * var(--size-4)) var(--size-3) calc(-1 * var(--size-4));
      border-radius: var(--radius-3) var(--radius-3) 0 0;
    }`,

    output: `{
      background: white;
      border: 2px solid var(--gray-3);
      border-radius: var(--radius-3);
      padding: var(--size-4);
      min-height: 300px;
    }`,

    demoComponent: `{
      background: linear-gradient(135deg, var(--blue-1) 0%, var(--purple-1) 100%);
      border: 2px solid var(--blue-5);
      border-radius: var(--radius-3);
      padding: var(--size-4);
      margin: var(--size-3) 0;
    }`,

    propsDisplay: `{
      background: var(--gray-1);
      border-left: 3px solid var(--green-5);
      padding: var(--size-3);
      margin: var(--size-3) 0;
      font-family: var(--font-mono);
      font-size: var(--font-size-0);
    }`,

    featureList: `{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--size-4);
      margin: var(--size-6) 0;
    }`,

    featureCard: `{
      background: white;
      border: 1px solid var(--gray-3);
      border-radius: var(--radius-3);
      padding: var(--size-4);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }`,

    featureIcon: `{
      font-size: var(--font-size-3);
      margin-bottom: var(--size-2);
      color: var(--indigo-6);
    }`,

    featureTitle: `{
      font-size: var(--font-size-2);
      font-weight: var(--font-weight-6);
      margin-bottom: var(--size-2);
      color: var(--gray-8);
    }`,

    featureDescription: `{
      font-size: var(--font-size-1);
      color: var(--gray-6);
      line-height: 1.5;
    }`,
  },

  render: (
    {
      title = string("Function-Style Props Revolution"),
      showComparison = boolean(true),
    },
    _api,
    classes,
  ) => (
    <section class={classes!.showcase} id="function-props">
      <h2 class={classes!.showcaseTitle}>{title}</h2>
      <p class={classes!.showcaseSubtitle}>
        Zero duplication between props and render parameters. TypeScript infers everything automatically.
      </p>

      {showComparison && (
        <div class={classes!.showcaseGrid}>
          <div>
            <div class={classes!.codeBlock}>
              <div class={classes!.codeTitle}>❌ Traditional Approach (Duplication)</div>
{`interface Props {
  title: string;
  count: number;
  enabled: boolean;
  items: string[];
  config: object;
}

defineComponent("old-way", {
  props: (attrs) => ({
    title: attrs.title || "Default",
    count: parseInt(attrs.count) || 0,
    enabled: attrs.enabled === "true",
    items: JSON.parse(attrs.items || "[]"),
    config: JSON.parse(attrs.config || "{}")
  }),
  render: (props: Props) => (
    <div>{props.title}</div>
  )
});`}
            </div>
          </div>

          <div>
            <div class={classes!.codeBlock}>
              <div class={classes!.codeTitle}>✅ ui-lib Function-Style Props</div>
{`defineComponent("new-way", {
  render: ({
    title = string("Default"),
    count = number(0), 
    enabled = boolean(false),
    items = array([]),
    config = object({})
  }) => (
    <div>{title}</div>
  )
});

// That's it! Zero duplication!`}
            </div>
          </div>
        </div>
      )}

      <div class={classes!.output}>
        <h3>Live Example</h3>
        <function-props-demo 
          title="Smart Component" 
          count="42" 
          enabled="true"
          items='["React", "Vue", "ui-lib"]'
          config='{"theme": "modern"}'
        />
      </div>

      <div class={classes!.featureList}>
        <div class={classes!.featureCard}>
          <div class={classes!.featureIcon}>🎯</div>
          <div class={classes!.featureTitle}>Smart Type Helpers</div>
          <div class={classes!.featureDescription}>
            string(), number(), boolean(), array(), object() handle all parsing and validation automatically.
          </div>
        </div>

        <div class={classes!.featureCard}>
          <div class={classes!.featureIcon}>🔮</div>
          <div class={classes!.featureTitle}>TypeScript Inference</div>
          <div class={classes!.featureDescription}>
            Props are inferred from your render function signature. No separate interface needed.
          </div>
        </div>

        <div class={classes!.featureCard}>
          <div class={classes!.featureIcon}>⚡</div>
          <div class={classes!.featureTitle}>Zero Runtime Overhead</div>
          <div class={classes!.featureDescription}>
            Parsing happens once during SSR. No client-side prop processing required.
          </div>
        </div>

        <div class={classes!.featureCard}>
          <div class={classes!.featureIcon}>🛡️</div>
          <div class={classes!.featureTitle}>Built-in Validation</div>
          <div class={classes!.featureDescription}>
            Type helpers throw meaningful errors for invalid data, with fallback to defaults.
          </div>
        </div>
      </div>
    </section>
  ),
});

/**
 * 🎯 Interactive Function Props Demo
 * Live component showing function-style props in action
 */
defineComponent("function-props-demo", {
  styles: {
    demo: `{
      background: linear-gradient(135deg, var(--blue-1) 0%, var(--purple-1) 100%);
      border: 2px solid var(--blue-5);
      border-radius: var(--radius-3);
      padding: var(--size-4);
      margin: var(--size-3) 0;
    }`,

    demoTitle: `{
      font-size: var(--font-size-3);
      font-weight: var(--font-weight-6);
      color: var(--blue-8);
      margin-bottom: var(--size-3);
    }`,

    propsList: `{
      background: var(--gray-1);
      border-left: 3px solid var(--green-5);
      padding: var(--size-3);
      margin: var(--size-3) 0;
      font-family: var(--font-mono);
      font-size: var(--font-size-0);
      border-radius: var(--radius-2);
    }`,

    propsTitle: `{
      font-weight: var(--font-weight-6);
      color: var(--green-7);
      margin-bottom: var(--size-2);
    }`,

    propItem: `{
      margin: var(--size-1) 0;
      color: var(--gray-7);
    }`,

    propKey: `{
      color: var(--blue-7);
      font-weight: var(--font-weight-5);
    }`,

    propValue: `{
      color: var(--purple-7);
    }`,

    propType: `{
      color: var(--green-6);
      font-style: italic;
    }`,

    interactiveDemo: `{
      background: white;
      border: 1px solid var(--gray-3);
      border-radius: var(--radius-3);
      padding: var(--size-4);
      margin-top: var(--size-4);
    }`,

    controls: `{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--size-3);
      margin-bottom: var(--size-4);
    }`,

    control: `{
      display: flex;
      flex-direction: column;
      gap: var(--size-1);
    }`,

    controlLabel: `{
      font-size: var(--font-size-0);
      font-weight: var(--font-weight-5);
      color: var(--gray-7);
    }`,

    controlInput: `{
      padding: var(--size-2);
      border: 1px solid var(--gray-4);
      border-radius: var(--radius-2);
      font-size: var(--font-size-1);
    }`,

    liveOutput: `{
      background: var(--indigo-1);
      border: 1px solid var(--indigo-3);
      border-radius: var(--radius-3);
      padding: var(--size-3);
      font-family: var(--font-mono);
      font-size: var(--font-size-0);
    }`,
  },

  render: (
    {
      // ✨ Function-style props demonstration - zero duplication!
      title = string("Demo Component"),
      count = number(0),
      enabled = boolean(false),
      items = array(["item1", "item2"]),
      config = object({ theme: "default", version: "1.0" }),
    },
    _api,
    classes,
  ) => (
    <div class={classes!.demo}>
      <h4 class={classes!.demoTitle}>{title}</h4>
      
      <div class={classes!.propsList}>
        <div class={classes!.propsTitle}>Parsed Props (from function signature):</div>
        <div class={classes!.propItem}>
          <span class={classes!.propKey}>title</span>: <span class={classes!.propValue}>"{title}"</span> 
          <span class={classes!.propType}> (string)</span>
        </div>
        <div class={classes!.propItem}>
          <span class={classes!.propKey}>count</span>: <span class={classes!.propValue}>{count}</span> 
          <span class={classes!.propType}> (number)</span>
        </div>
        <div class={classes!.propItem}>
          <span class={classes!.propKey}>enabled</span>: <span class={classes!.propValue}>{enabled ? "true" : "false"}</span> 
          <span class={classes!.propType}> (boolean)</span>
        </div>
        <div class={classes!.propItem}>
          <span class={classes!.propKey}>items</span>: <span class={classes!.propValue}>[{Array.isArray(items) ? items.map((item: string) => `"${item}"`).join(", ") : "[]"}]</span> 
          <span class={classes!.propType}> (array)</span>
        </div>
        <div class={classes!.propItem}>
          <span class={classes!.propKey}>config</span>: <span class={classes!.propValue}>{typeof config === 'object' ? JSON.stringify(config) : "{}"}</span> 
          <span class={classes!.propType}> (object)</span>
        </div>
      </div>

      <div class={classes!.interactiveDemo}>
        <h5>Interactive Component State:</h5>
        <div style={`display: flex; gap: var(--size-4); align-items: center; margin: var(--size-3) 0;`}>
          <div>Status: <strong style={`color: ${enabled ? 'var(--green-6)' : 'var(--gray-6)'}`}>
            {enabled ? 'Enabled' : 'Disabled'}
          </strong></div>
          <div>Count: <strong style="color: var(--blue-6)">{count}</strong></div>
          <div>Items: <strong style="color: var(--purple-6)">{Array.isArray(items) ? items.length : 0}</strong></div>
        </div>

        <div class={classes!.liveOutput}>
          Component rendered with {Object.keys({title, count, enabled, items, config}).length} props
          • All types validated and parsed automatically
          • Zero duplication in component definition
        </div>
      </div>
    </div>
  ),
});

/**
 * 🔍 Type Helper Showcase
 * Demonstrates each smart type helper in detail
 */
defineComponent("type-helpers-showcase", {
  styles: {
    showcase: `{
      background: white;
      border: 1px solid var(--gray-3);
      border-radius: var(--radius-4);
      padding: var(--size-6);
      margin: var(--size-4) 0;
    }`,

    showcaseTitle: `{
      font-size: var(--font-size-3);
      font-weight: var(--font-weight-6);
      color: var(--gray-8);
      margin-bottom: var(--size-4);
      border-bottom: 2px solid var(--indigo-3);
      padding-bottom: var(--size-2);
    }`,

    helpersGrid: `{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--size-4);
    }`,

    helperCard: `{
      background: var(--gray-0);
      border: 1px solid var(--gray-3);
      border-radius: var(--radius-3);
      padding: var(--size-4);
      transition: all 0.3s ease;
    }`,

    helperTitle: `{
      font-size: var(--font-size-2);
      font-weight: var(--font-weight-6);
      color: var(--indigo-6);
      margin-bottom: var(--size-2);
      display: flex;
      align-items: center;
      gap: var(--size-2);
    }`,

    helperCode: `{
      background: var(--gray-9);
      color: var(--gray-1);
      padding: var(--size-3);
      border-radius: var(--radius-2);
      font-family: var(--font-mono);
      font-size: var(--font-size-0);
      margin: var(--size-2) 0;
      overflow-x: auto;
    }`,

    helperDescription: `{
      font-size: var(--font-size-1);
      color: var(--gray-6);
      margin-bottom: var(--size-3);
      line-height: 1.5;
    }`,

    helperExample: `{
      background: var(--blue-0);
      border: 1px solid var(--blue-3);
      border-radius: var(--radius-2);
      padding: var(--size-2);
      font-size: var(--font-size-0);
      color: var(--blue-8);
    }`,
  },

  render: () => (
    <div style="background: white; border: 1px solid var(--gray-3); border-radius: var(--radius-4); padding: var(--size-6); margin: var(--size-4) 0;">
      <h3 style="font-size: var(--font-size-3); font-weight: var(--font-weight-6); color: var(--gray-8); margin-bottom: var(--size-4); border-bottom: 2px solid var(--indigo-3); padding-bottom: var(--size-2);">
        🔧 Smart Type Helper Functions
      </h3>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--size-4);">
        <div style="background: var(--gray-0); border: 1px solid var(--gray-3); border-radius: var(--radius-3); padding: var(--size-4); transition: all 0.3s ease;">
          <h4 style="font-size: var(--font-size-2); font-weight: var(--font-weight-6); color: var(--indigo-6); margin-bottom: var(--size-2); display: flex; align-items: center; gap: var(--size-2);">
            📝 string()
          </h4>
          <div style="background: var(--gray-9); color: var(--gray-1); padding: var(--size-3); border-radius: var(--radius-2); font-family: var(--font-mono); font-size: var(--font-size-0); margin: var(--size-2) 0; overflow-x: auto;">
            name = string("John Doe")
          </div>
          <div style="font-size: var(--font-size-1); color: var(--gray-6); margin-bottom: var(--size-3); line-height: 1.5;">
            Parses string attributes with optional defaults. Handles empty strings and undefined values gracefully.
          </div>
          <div style="background: var(--blue-0); border: 1px solid var(--blue-3); border-radius: var(--radius-2); padding: var(--size-2); font-size: var(--font-size-0); color: var(--blue-8);">
            HTML: name="Alice" → "Alice"<br/>
            HTML: name="" → "John Doe" (default)<br/>
            HTML: (no attr) → "John Doe" (default)
          </div>
        </div>

        <div style="background: var(--gray-0); border: 1px solid var(--gray-3); border-radius: var(--radius-3); padding: var(--size-4); transition: all 0.3s ease;">
          <h4 style="font-size: var(--font-size-2); font-weight: var(--font-weight-6); color: var(--indigo-6); margin-bottom: var(--size-2); display: flex; align-items: center; gap: var(--size-2);">
            🔢 number()
          </h4>
          <div style="background: var(--gray-9); color: var(--gray-1); padding: var(--size-3); border-radius: var(--radius-2); font-family: var(--font-mono); font-size: var(--font-size-0); margin: var(--size-2) 0; overflow-x: auto;">
            count = number(0)
          </div>
          <div style="font-size: var(--font-size-1); color: var(--gray-6); margin-bottom: var(--size-3); line-height: 1.5;">
            Parses numeric attributes with automatic type conversion. Throws on invalid numbers unless default provided.
          </div>
          <div style="background: var(--blue-0); border: 1px solid var(--blue-3); border-radius: var(--radius-2); padding: var(--size-2); font-size: var(--font-size-0); color: var(--blue-8);">
            HTML: count="42" → 42<br/>
            HTML: count="3.14" → 3.14<br/>
            HTML: count="invalid" → 0 (default)<br/>
            HTML: (no attr) → 0 (default)
          </div>
        </div>

        <div style="background: var(--gray-0); border: 1px solid var(--gray-3); border-radius: var(--radius-3); padding: var(--size-4); transition: all 0.3s ease;">
          <h4 style="font-size: var(--font-size-2); font-weight: var(--font-weight-6); color: var(--indigo-6); margin-bottom: var(--size-2); display: flex; align-items: center; gap: var(--size-2);">
            ✅ boolean()
          </h4>
          <div style="background: var(--gray-9); color: var(--gray-1); padding: var(--size-3); border-radius: var(--radius-2); font-family: var(--font-mono); font-size: var(--font-size-0); margin: var(--size-2) 0; overflow-x: auto;">
            enabled = boolean(false)
          </div>
          <div style="font-size: var(--font-size-1); color: var(--gray-6); margin-bottom: var(--size-3); line-height: 1.5;">
            Presence-based boolean parsing. Attribute existence = true, absence = default value.
          </div>
          <div style="background: var(--blue-0); border: 1px solid var(--blue-3); border-radius: var(--radius-2); padding: var(--size-2); font-size: var(--font-size-0); color: var(--blue-8);">
            HTML: enabled → true<br/>
            HTML: enabled="true" → true<br/>
            HTML: enabled="false" → true (presence!)<br/>
            HTML: (no attr) → false (default)
          </div>
        </div>

        <div style="background: var(--gray-0); border: 1px solid var(--gray-3); border-radius: var(--radius-3); padding: var(--size-4); transition: all 0.3s ease;">
          <h4 style="font-size: var(--font-size-2); font-weight: var(--font-weight-6); color: var(--indigo-6); margin-bottom: var(--size-2); display: flex; align-items: center; gap: var(--size-2);">
            📋 array()
          </h4>
          <div style="background: var(--gray-9); color: var(--gray-1); padding: var(--size-3); border-radius: var(--radius-2); font-family: var(--font-mono); font-size: var(--font-size-0); margin: var(--size-2) 0; overflow-x: auto;">
            items = array(["a", "b"])
          </div>
          <div style="font-size: var(--font-size-1); color: var(--gray-6); margin-bottom: var(--size-3); line-height: 1.5;">
            Parses JSON array attributes safely. Falls back to default on invalid JSON.
          </div>
          <div style="background: var(--blue-0); border: 1px solid var(--blue-3); border-radius: var(--radius-2); padding: var(--size-2); font-size: var(--font-size-0); color: var(--blue-8);">
            HTML: items='["x","y","z"]' → ["x","y","z"]<br/>
            HTML: items='invalid' → ["a","b"] (default)<br/>
            HTML: (no attr) → ["a","b"] (default)
          </div>
        </div>

        <div style="background: var(--gray-0); border: 1px solid var(--gray-3); border-radius: var(--radius-3); padding: var(--size-4); transition: all 0.3s ease;">
          <h4 style="font-size: var(--font-size-2); font-weight: var(--font-weight-6); color: var(--indigo-6); margin-bottom: var(--size-2); display: flex; align-items: center; gap: var(--size-2);">
            🎛️ object()
          </h4>
          <div style="background: var(--gray-9); color: var(--gray-1); padding: var(--size-3); border-radius: var(--radius-2); font-family: var(--font-mono); font-size: var(--font-size-0); margin: var(--size-2) 0; overflow-x: auto;">
            config = object({`{theme: "light"}`})
          </div>
          <div style="font-size: var(--font-size-1); color: var(--gray-6); margin-bottom: var(--size-3); line-height: 1.5;">
            Parses JSON object attributes with type safety. Merges with defaults for partial objects.
          </div>
          <div style="background: var(--blue-0); border: 1px solid var(--blue-3); border-radius: var(--radius-2); padding: var(--size-2); font-size: var(--font-size-0); color: var(--blue-8);">
            HTML: config='{`{"theme":"dark"}`}' → {`{theme:"dark"}`}<br/>
            HTML: config='invalid' → {`{theme:"light"}`} (default)<br/>
            HTML: (no attr) → {`{theme:"light"}`} (default)
          </div>
        </div>

        <div style="background: var(--gray-0); border: 1px solid var(--gray-3); border-radius: var(--radius-3); padding: var(--size-4); transition: all 0.3s ease;">
          <h4 style="font-size: var(--font-size-2); font-weight: var(--font-weight-6); color: var(--indigo-6); margin-bottom: var(--size-2); display: flex; align-items: center; gap: var(--size-2);">
            ⚡ Performance
          </h4>
          <div style="font-size: var(--font-size-1); color: var(--gray-6); margin-bottom: var(--size-3); line-height: 1.5;">
            All parsing happens once during SSR. Zero client-side overhead. Type validation ensures runtime safety.
          </div>
          <div style="background: var(--green-0); border: 1px solid var(--green-3); border-radius: var(--radius-2); padding: var(--size-2); font-size: var(--font-size-0); color: var(--green-8);">
            ✓ SSR parsing only<br/>
            ✓ Zero client bundle impact<br/>
            ✓ TypeScript inference<br/>
            ✓ Runtime type safety
          </div>
        </div>
      </div>
    </div>
  ),
});
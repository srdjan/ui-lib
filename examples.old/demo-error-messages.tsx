/** @jsx h */
import { router } from "./router.ts";
import { boolean, defineComponent, h, number, string } from "../index.ts";

/**
 * 💡 Enhanced Error Messages Demo
 *
 * This component demonstrates the improved error messages with helpful suggestions.
 * Try using wrong prop names or invalid values to see the enhanced errors!
 */
defineComponent("error-demo", {
  router,
  autoProps: true,

  styles: {
    container: `{
      padding: 1.5rem;
      border: 2px solid #dc3545;
      border-radius: 8px;
      background: #fff5f5;
    }`,
    title: `{
      color: #dc3545;
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }`,
    code: `{
      background: #f8f9fa;
      padding: 0.5rem;
      border-radius: 4px;
      font-family: monospace;
      display: block;
      margin: 0.5rem 0;
      white-space: pre-wrap;
    }`,
    success: `{
      color: #28a745;
      font-weight: bold;
    }`,
    error: `{
      color: #dc3545;
      font-weight: bold;
    }`,
  },

  render: (
    {
      // These props will provide helpful errors if misused
      userName = string("Anonymous"),
      userAge = number(0),
      isActive = boolean(false),
      maxRetries = number(3),
    },
    _api,
    classes,
  ) => {
    // Enhanced type checking happens automatically
    const age = typeof userAge === "number" ? userAge : 0;
    const name = typeof userName === "string" ? userName : "Anonymous";
    const active = typeof isActive === "boolean" ? isActive : false;
    const retries = typeof maxRetries === "number" ? maxRetries : 3;

    return (
      <div class={classes!.container}>
        <h3 class={classes!.title}>🎯 Enhanced Error Messages Demo</h3>

        <p>This component has enhanced error reporting. Try these:</p>

        <code class={classes!.code}>
          {`<!-- ❌ Wrong: Typo in prop name -->
<error-demo user-nam="John" />
<!-- 💡 Error will suggest: "Did you mean: user-name?" -->

<!-- ❌ Wrong: Invalid number -->  
<error-demo user-age="twenty" />
<!-- 💡 Error: "Invalid number value for prop 'userAge': twenty. 
     Expected a valid number but got 'twenty'." -->

<!-- ❌ Wrong: Wrong casing -->
<error-demo UserName="Jane" />  
<!-- 💡 Error will suggest: "Found 'UserName' - check the casing." -->

<!-- ✅ Correct usage -->
<error-demo 
  user-name="Alice" 
  user-age="25" 
  is-active
  max-retries="5"
/>`}
        </code>

        <div style="margin-top: 1rem; padding: 1rem; background: white; border-radius: 4px;">
          <p class={classes!.success}>✅ Props parsed successfully!</p>
          <ul>
            <li>Name: {name}</li>
            <li>Age: {age}</li>
            <li>Active: {active ? "Yes" : "No"}</li>
            <li>Max Retries: {retries}</li>
          </ul>
        </div>
      </div>
    );
  },
});

/**
 * Test component to demonstrate error recovery
 */
defineComponent("error-test", {
  router,

  styles: {
    grid: `{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      padding: 2rem;
    }`,
    section: `{
      padding: 1rem;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      background: white;
    }`,
    header: `{
      font-weight: bold;
      margin-bottom: 0.5rem;
      color: #495057;
    }`,
  },

  render: (_props, _api, classes) => (
    <div class={classes!.grid}>
      <div class={classes!.section}>
        <h4 class={classes!.header}>Working Example</h4>
        <error-demo
          user-name="Bob"
          user-age="30"
          is-active="true"
          max-retries="10"
        />
      </div>

      <div class={classes!.section}>
        <h4 class={classes!.header}>Example with Defaults</h4>
        <error-demo />
      </div>
    </div>
  ),
});

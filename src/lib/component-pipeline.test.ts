import { assertEquals, assertThrows } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { component } from "./component-pipeline.ts";
import { getRegistry } from "./registry.ts";

Deno.test("Pipeline API - Basic component creation", () => {
  // Clear registry
  const registry = getRegistry();
  delete registry["test-basic"];
  
  // Create a basic component
  component("test-basic")
    .state({ count: 0 })
    .actions({
      increment: (state) => ({ count: (state as { count: number }).count + 1 }),
    })
    .view((state) => `<div>Count: ${(state as { count: number }).count}</div>`);
  
  // Check if component is registered
  const entry = registry["test-basic"];
  assertEquals(typeof entry, "object");
  assertEquals(typeof entry.init, "function");
  assertEquals(typeof entry.render, "function");
  assertEquals(typeof entry.actions, "object");
  
  // Test initial state
  const initialState = entry.init();
  assertEquals(initialState, { count: 0 });
  
  // Test actions
  assertEquals(typeof entry.actions!.increment, "function");
});

Deno.test("Pipeline API - Component with props", () => {
  const registry = getRegistry();
  delete registry["test-props"];
  
  component("test-props")
    .state({ value: 0 })
    .props({ step: "number?", label: "string" })
    .actions({
      add: (state, ...args) => ({ 
        value: (state as { value: number }).value + ((args[0] as number) ?? 1) 
      }),
    })
    .view((state, props) => 
      `<div>${(props as { label?: string }).label}: ${(state as { value: number }).value}</div>`
    );
  
  const entry = registry["test-props"];
  assertEquals(typeof entry.props, "object");
  assertEquals(Object.keys(entry.props!), ["step", "label"]);
  
  // Test prop parsing
  assertEquals(entry.props!.step.parse("5"), 5);
  assertEquals(entry.props!.step.parse(null), undefined);
  assertEquals(entry.props!.label.parse("Hello"), "Hello");
});

Deno.test("Pipeline API - Component with styles", () => {
  const registry = getRegistry();
  delete registry["test-styles"];
  
  const css = ".counter { color: blue; }";
  
  component("test-styles")
    .state({ count: 0 })
    .actions({ inc: (state) => ({ count: (state as { count: number }).count + 1 }) })
    .styles(css)
    .view((state) => `<div class="counter">${(state as { count: number }).count}</div>`);
  
  const entry = registry["test-styles"];
  assertEquals(entry.css, css);
});

Deno.test("Pipeline API - Component with effects (placeholder)", () => {
  const registry = getRegistry();
  delete registry["test-effects"];
  
  component("test-effects")
    .state({ count: 0 })
    .actions({ inc: (state) => ({ count: (state as { count: number }).count + 1 }) })
    .effects({ 
      logCount: (state: unknown) => console.log(`Count: ${(state as { count: number }).count}`) 
    })
    .view((state) => `<div>${(state as { count: number }).count}</div>`);
  
  const entry = registry["test-effects"];
  // Effects are stored but not currently used in the pipeline
  assertEquals(typeof entry, "object");
});

Deno.test("Pipeline API - Missing required configuration throws error", () => {
  assertThrows(
    () => {
      component("test-incomplete")
        .state({ count: 0 })
        // Missing both actions and serverActions
        .view(() => "<div>incomplete</div>");
    },
    Error,
    "must have either actions or serverActions"
  );

  assertThrows(
    () => {
      component("test-no-state")
        .actions({ inc: (state) => ({ count: 1 }) })
        // Missing state
        .view(() => "<div>no state</div>");
    },
    Error,
    "state and view are required"
  );
});

Deno.test("Pipeline API - Action execution", () => {
  const registry = getRegistry();
  delete registry["test-actions"];
  
  component("test-actions")
    .state({ count: 0, name: "test" })
    .actions({
      increment: (state, ...args) => {
        const step = (args[0] as number) ?? 1;
        return { count: (state as { count: number }).count + step };
      },
      setName: (state, ...args) => ({ name: args[0] as string }),
    })
    .view((state) => `<div>${(state as { count: number; name: string }).count}</div>`);
  
  const entry = registry["test-actions"];
  
  // Test increment action
  const state1 = { count: 0, name: "test" };
  const result1 = entry.actions!.increment(state1, 5);
  assertEquals(result1, { count: 5 });
  
  // Test setName action
  const result2 = entry.actions!.setName(state1, "updated");
  assertEquals(result2, { name: "updated" });
});

Deno.test("Pipeline API - View rendering with action creators", () => {
  const registry = getRegistry();
  delete registry["test-render"];
  
  component("test-render")
    .state({ count: 0 })
    .actions({
      inc: (state) => ({ count: (state as { count: number }).count + 1 }),
      dec: (state) => ({ count: (state as { count: number }).count - 1 }),
    })
    .view((state, props, actions) => {
      const count = (state as { count: number }).count;
      const actionCreators = actions as { htmxAction?: (name: string) => string };
      
      if (actionCreators.htmxAction) {
        return `<div><button ${actionCreators.htmxAction("inc")}>+</button><span>${count}</span></div>`;
      }
      return `<div><span>${count}</span></div>`;
    });
  
  const entry = registry["test-render"];
  
  // Test rendering with empty actions
  const html = entry.render({ count: 5 }, {}, {});
  assertEquals(html, "<div><span>5</span></div>");
  
  // Test rendering with htmxAction
  const mockHtmxAction = (name: string) => `data-action="${name}"`;
  const htmlWithActions = entry.render({ count: 3 }, {}, { htmxAction: mockHtmxAction });
  assertEquals(htmlWithActions, '<div><button data-action="inc">+</button><span>3</span></div>');
});

Deno.test("Pipeline API - Chainable interface", () => {
  const registry = getRegistry();
  delete registry["test-chain"];
  
  // Test that all methods return the builder for chaining
  const builder = component("test-chain")
    .state({ value: 1 })
    .props({ multiplier: "number?" })
    .actions({ multiply: (state, ...args) => ({ value: (state as any).value * (args[0] as number || 2) }) })
    .styles("div { color: red; }")
    .effects({ log: () => {} });
  
  // Should be able to call .view() to complete the chain
  builder.view((state) => `<div>${(state as { value: number }).value}</div>`);
  
  // Component should be registered
  const entry = registry["test-chain"];
  assertEquals(typeof entry, "object");
  assertEquals(entry.css, "div { color: red; }");
  assertEquals(typeof entry.props, "object");
  assertEquals(typeof entry.actions, "object");
});

// New tests for enhanced API
Deno.test("Enhanced Pipeline API - Server actions only", () => {
  const registry = getRegistry();
  delete registry["test-server-only"];
  
  component("test-server-only")
    .state({ message: "Hello" })
    .serverActions({
      saveMessage: (...args) => {
        const msg = args[0] as string;
        return {
          "hx-post": `/api/save/${msg}`,
          "hx-target": "#result"
        };
      },
      loadData: () => ({
        "hx-get": "/api/data",
        "hx-trigger": "load"
      })
    })
    .view((state, props, actions, serverActions) => {
      const { message } = state as { message: string };
      return `<div>${message}</div>`;
    });
    
  const entry = registry["test-server-only"];
  assertEquals(typeof entry.serverActions, "object");
  assertEquals(typeof entry.serverActions!.saveMessage, "function");
  assertEquals(typeof entry.serverActions!.loadData, "function");
  
  // Test server action execution
  const result = entry.serverActions!.saveMessage("test");
  assertEquals(result, {
    "hx-post": "/api/save/test",
    "hx-target": "#result"
  });
});

Deno.test("Enhanced Pipeline API - Mixed actions and server actions", () => {
  const registry = getRegistry();
  delete registry["test-mixed"];
  
  component("test-mixed")
    .state({ isOpen: false, data: [] })
    .actions({
      toggle: (state) => ({ isOpen: !(state as { isOpen: boolean }).isOpen })
    })
    .serverActions({
      fetchData: (...args) => {
        const query = args[0] as string;
        return {
          "hx-get": `/api/search?q=${query}`,
          "hx-target": "#results"
        };
      }
    })
    .view((state, props, actions, serverActions) => {
      const { isOpen } = state as { isOpen: boolean };
      return `<div>Open: ${isOpen}</div>`;
    });
    
  const entry = registry["test-mixed"];
  assertEquals(typeof entry.actions, "object");
  assertEquals(typeof entry.serverActions, "object");
  assertEquals(typeof entry.actions!.toggle, "function");
  assertEquals(typeof entry.serverActions!.fetchData, "function");
});

Deno.test("Enhanced Pipeline API - Backward compatibility", () => {
  const registry = getRegistry();
  delete registry["test-compat"];
  
  // Old style component (3-parameter view function)
  component("test-compat")
    .state({ count: 0 })
    .actions({
      inc: (state) => ({ count: (state as { count: number }).count + 1 })
    })
    .view((state, props, actions) => {
      // Should work with 3 parameters (backward compatibility)
      const count = (state as { count: number }).count;
      return `<div>${count}</div>`;
    });
    
  const entry = registry["test-compat"];
  assertEquals(typeof entry, "object");
  assertEquals(typeof entry.actions, "object");
  assertEquals(entry.serverActions, undefined);
});
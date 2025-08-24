import { assertEquals, assertNotEquals, assertRejects } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { 
  generateComponentId, 
  initializeComponentState, 
  getComponentState, 
  updateComponentState, 
  executeComponentAction,
  renderComponentWithState 
} from "./component-state.ts";
import { getRegistry } from "./registry.ts";

Deno.test("Component State - Generate unique component IDs", () => {
  const id1 = generateComponentId("test-component");
  const id2 = generateComponentId("test-component");
  const id3 = generateComponentId("other-component");
  
  // IDs should be unique
  assertNotEquals(id1, id2);
  assertNotEquals(id1, id3);
  
  // IDs should start with component name
  assertEquals(id1.startsWith("test-component-"), true);
  assertEquals(id3.startsWith("other-component-"), true);
  
  // IDs should be valid UUIDs after the component name
  const uuidPart = id1.replace("test-component-", "");
  assertEquals(uuidPart.length, 36); // UUID length
  assertEquals(/^[0-9a-f-]+$/.test(uuidPart), true);
});

Deno.test("Component State - Initialize component state", () => {
  // Register a test component
  const registry = getRegistry();
  registry["test-init"] = {
    init: () => ({ count: 0, name: "test" }),
    render: (state) => `<div>${JSON.stringify(state)}</div>`,
  };
  
  const componentId = "test-init-123";
  const initialState = initializeComponentState(componentId, "test-init");
  
  assertEquals(initialState, { count: 0, name: "test" });
  
  // State should be stored
  const storedState = getComponentState(componentId);
  assertEquals(storedState, { count: 0, name: "test" });
});

Deno.test("Component State - Initialize non-existent component throws error", () => {
  const componentId = "non-existent-123";
  
  try {
    initializeComponentState(componentId, "non-existent-component");
    throw new Error("Should have thrown");
  } catch (error) {
    assertEquals((error as Error).message, "Component non-existent-component not found in registry");
  }
});

Deno.test("Component State - Get and update component state", () => {
  const componentId = "test-update-456";
  
  // Initialize state
  const registry = getRegistry();
  registry["test-update"] = {
    init: () => ({ count: 5, active: true }),
    render: (state) => `<div>${JSON.stringify(state)}</div>`,
  };
  
  initializeComponentState(componentId, "test-update");
  
  // Get initial state
  let state = getComponentState(componentId);
  assertEquals(state, { count: 5, active: true });
  
  // Update state
  const newState = updateComponentState(componentId, { count: 10 });
  assertEquals(newState, { count: 10, active: true });
  
  // Verify state was updated
  state = getComponentState(componentId);
  assertEquals(state, { count: 10, active: true });
});

Deno.test("Component State - Update non-existent component returns null", () => {
  const result = updateComponentState("non-existent-789", { count: 5 });
  assertEquals(result, null);
});

Deno.test("Component State - Get non-existent component returns null", () => {
  const state = getComponentState("non-existent-999");
  assertEquals(state, null);
});

Deno.test("Component State - Execute component actions", () => {
  const componentId = "test-actions-321";
  
  // Register component with actions
  const registry = getRegistry();
  registry["test-exec"] = {
    init: () => ({ count: 0 }),
    actions: {
      increment: (state, ...args) => {
        const step = (args[0] as number) ?? 1;
        return { count: (state as { count: number }).count + step };
      },
      reset: () => ({ count: 0 }),
    },
    render: (state) => `<div>Count: ${(state as { count: number }).count}</div>`,
  };
  
  // Initialize component state
  initializeComponentState(componentId, "test-exec");
  
  // Execute increment action
  let newState = executeComponentAction(componentId, "test-exec", "increment", [5]);
  assertEquals(newState, { count: 5 });
  
  // Execute increment again
  newState = executeComponentAction(componentId, "test-exec", "increment", [3]);
  assertEquals(newState, { count: 8 });
  
  // Execute reset action
  newState = executeComponentAction(componentId, "test-exec", "reset", []);
  assertEquals(newState, { count: 0 });
});

Deno.test("Component State - Execute action on non-existent component returns null", () => {
  const result = executeComponentAction("missing-123", "test-component", "increment", []);
  assertEquals(result, null);
});

Deno.test("Component State - Execute non-existent action returns null", () => {
  const componentId = "test-missing-action";
  
  const registry = getRegistry();
  registry["test-no-action"] = {
    init: () => ({ count: 0 }),
    actions: { increment: (state) => ({ count: (state as any).count + 1 }) },
    render: (state) => `<div>${JSON.stringify(state)}</div>`,
  };
  
  initializeComponentState(componentId, "test-no-action");
  
  const result = executeComponentAction(componentId, "test-no-action", "nonexistent", []);
  assertEquals(result, null);
});

Deno.test("Component State - Execute action on component without actions returns null", () => {
  const componentId = "test-no-actions";
  
  const registry = getRegistry();
  registry["test-no-actions-comp"] = {
    init: () => ({ count: 0 }),
    render: (state) => `<div>${JSON.stringify(state)}</div>`,
  };
  
  initializeComponentState(componentId, "test-no-actions-comp");
  
  const result = executeComponentAction(componentId, "test-no-actions-comp", "increment", []);
  assertEquals(result, null);
});

Deno.test("Component State - Render component with current state", () => {
  const componentId = "test-render-state";
  
  // Register component
  const registry = getRegistry();
  registry["test-render"] = {
    init: () => ({ count: 0, name: "initial" }),
    props: {
      prefix: { attribute: "prefix", parse: (v) => String(v) },
    },
    css: ".counter { color: blue; }",
    render: (state, props, actions) => {
      const { count, name } = state as { count: number; name: string };
      const { prefix } = props as { prefix?: string };
      const actionHelper = actions as { htmxAction?: (action: string) => string };
      
      const prefixStr = prefix ? `${prefix}: ` : "";
      const buttonAttrs = actionHelper?.htmxAction ? actionHelper.htmxAction("increment") : "";
      
      return `<div class="counter">${prefixStr}${name} = ${count} <button ${buttonAttrs}>+</button></div>`;
    },
  };
  
  // Initialize and update state
  initializeComponentState(componentId, "test-render");
  updateComponentState(componentId, { count: 5, name: "updated" });
  
  // Render with props
  const html = renderComponentWithState(componentId, "test-render", { prefix: "Counter" });
  
  // Should include CSS and rendered content
  assertEquals(html.includes('<style>.counter { color: blue; }</style>'), true);
  assertEquals(html.includes('Counter: updated = 5'), true);
  assertEquals(html.includes('<button '), true);
});

Deno.test("Component State - Render non-existent component returns placeholder", () => {
  const html = renderComponentWithState("missing-id", "missing-component", {});
  assertEquals(html, "<!-- component missing-component not found -->");
});

Deno.test("Component State - Render with uninitialized state uses default", () => {
  const registry = getRegistry();
  registry["test-uninit"] = {
    init: () => ({ message: "default" }),
    render: (state) => `<div>${(state as { message: string }).message}</div>`,
  };
  
  // Don't initialize state, should use default from init()
  const html = renderComponentWithState("uninit-id", "test-uninit", {});
  assertEquals(html, "<div>default</div>");
});
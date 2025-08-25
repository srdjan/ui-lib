// Tests for component state and SSR functionality

import {
  assertEquals,
  assertStringIncludes,
  assert,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { generateComponentId, renderComponent } from "./component-state.ts";
import { getRegistry } from "./registry.ts";

// Helper to clear the registry between tests
function clearRegistry() {
  const g = globalThis as Record<string, unknown>;
  g.__FWC_SSR__ = {};
}

// Helper to register a test component
function registerTestComponent(name: string, entry: any) {
  const registry = getRegistry();
  registry[name] = entry;
}

Deno.test("generateComponentId includes component name", () => {
  const id1 = generateComponentId("my-button");
  const id2 = generateComponentId("my-input");
  
  assertStringIncludes(id1, "my-button");
  assertStringIncludes(id2, "my-input");
});

Deno.test("generateComponentId generates unique IDs", () => {
  const id1 = generateComponentId("test-component");
  const id2 = generateComponentId("test-component");
  const id3 = generateComponentId("test-component");
  
  // All IDs should be unique
  assert(id1 !== id2);
  assert(id1 !== id3);
  assert(id2 !== id3);
});

Deno.test("generateComponentId follows UUID format", () => {
  const id = generateComponentId("test");
  const parts = id.split("-");
  
  // Should have component name, then UUID parts (component-uuid)
  assertEquals(parts[0], "test");
  // UUID has 5 parts after the component name, so total 6 parts
  assertEquals(parts.length, 6);
});

Deno.test("renderComponent handles missing component", () => {
  clearRegistry();
  
  const result = renderComponent("nonexistent-component", { foo: "bar" });
  assertEquals(result, '<!-- component "nonexistent-component" not found. Available components: none -->');
});

Deno.test("renderComponent renders simple component without props", () => {
  clearRegistry();
  
  registerTestComponent("simple-button", {
    render: () => "<button>Click me</button>"
  });
  
  const result = renderComponent("simple-button");
  assertEquals(result, "<button>Click me</button>");
});

Deno.test("renderComponent renders component with props and no prop spec", () => {
  clearRegistry();
  
  registerTestComponent("greeting", {
    render: (props: any) => `<div>Hello ${props.name || "World"}!</div>`
  });
  
  const result = renderComponent("greeting", { name: "Alice" });
  assertEquals(result, "<div>Hello Alice!</div>");
  
  const defaultResult = renderComponent("greeting", {});
  assertEquals(defaultResult, "<div>Hello World!</div>");
});

Deno.test("renderComponent handles prop parsing with prop spec", () => {
  clearRegistry();
  
  const propSpec = {
    count: {
      attribute: "count",
      parse: (v: unknown) => Number(v) || 0
    },
    disabled: {
      attribute: "disabled", 
      parse: (v: unknown) => v === "" || v === "true"
    }
  };
  
  registerTestComponent("counter", {
    props: propSpec,
    render: (props: any) => `<button ${props.disabled ? "disabled" : ""}>Count: ${props.count}</button>`
  });
  
  const result = renderComponent("counter", { count: "42", disabled: "true" });
  assertEquals(result, "<button disabled>Count: 42</button>");
  
  const enabledResult = renderComponent("counter", { count: "5", disabled: "false" });
  assertEquals(enabledResult, "<button >Count: 5</button>");
});

Deno.test("renderComponent includes CSS when provided", () => {
  clearRegistry();
  
  registerTestComponent("styled-button", {
    css: ".btn { color: blue; background: white; }",
    render: () => "<button class='btn'>Styled</button>"
  });
  
  const result = renderComponent("styled-button");
  assertEquals(result, "<style>.btn { color: blue; background: white; }</style><button class='btn'>Styled</button>");
});

Deno.test("renderComponent handles component without CSS", () => {
  clearRegistry();
  
  registerTestComponent("plain-button", {
    render: () => "<button>Plain</button>"
  });
  
  const result = renderComponent("plain-button");
  assertEquals(result, "<button>Plain</button>");
});

Deno.test("renderComponent passes API creators to render function", () => {
  clearRegistry();
  
  const apiCreators = {
    increment: () => ({ "hx-post": "/api/increment" }),
    decrement: () => ({ "hx-post": "/api/decrement" })
  };
  
  registerTestComponent("api-counter", {
    api: apiCreators,
    render: (props: any, api: any) => {
      const incAttrs = api?.increment ? Object.entries(api.increment()).map(([k, v]) => `${k}="${v}"`).join(" ") : "";
      return `<button ${incAttrs}>+</button>`;
    }
  });
  
  const result = renderComponent("api-counter");
  assertStringIncludes(result, 'hx-post="/api/increment"');
});

Deno.test("renderComponent handles complex component with all features", () => {
  clearRegistry();
  
  const propSpec = {
    title: {
      attribute: "title",
      parse: (v: unknown) => String(v || "")
    },
    count: {
      attribute: "count", 
      parse: (v: unknown) => Number(v) || 0
    }
  };
  
  const apiCreators = {
    save: () => ({ "hx-post": "/api/save" })
  };
  
  registerTestComponent("complex-widget", {
    props: propSpec,
    css: ".widget { border: 1px solid #ccc; padding: 10px; }",
    api: apiCreators,
    render: (props: any, api: any) => {
      const saveAttrs = api?.save ? Object.entries(api.save()).map(([k, v]) => `${k}="${v}"`).join(" ") : "";
      return `<div class="widget">
        <h3>${props.title}</h3>
        <p>Count: ${props.count}</p>
        <button ${saveAttrs}>Save</button>
      </div>`;
    }
  });
  
  const result = renderComponent("complex-widget", { title: "My Widget", count: "25" });
  
  assertStringIncludes(result, "<style>.widget { border: 1px solid #ccc; padding: 10px; }</style>");
  assertStringIncludes(result, "<h3>My Widget</h3>");
  assertStringIncludes(result, "<p>Count: 25</p>");
  assertStringIncludes(result, 'hx-post="/api/save"');
});

Deno.test("renderComponent handles empty props object", () => {
  clearRegistry();
  
  registerTestComponent("empty-props", {
    render: (props: any) => `<div>Props keys: ${Object.keys(props || {}).length}</div>`
  });
  
  const result = renderComponent("empty-props", {});
  assertEquals(result, "<div>Props keys: 0</div>");
});

Deno.test("renderComponent handles null/undefined props", () => {
  clearRegistry();
  
  const propSpec = {
    name: {
      attribute: "name",
      parse: (v: unknown) => v || "default"
    }
  };
  
  registerTestComponent("null-props", {
    props: propSpec,
    render: (props: any) => `<div>Name: ${props.name}</div>`
  });
  
  const result = renderComponent("null-props", { name: null });
  assertEquals(result, "<div>Name: default</div>");
});

Deno.test("renderComponent preserves prop parsing errors", () => {
  clearRegistry();
  
  const propSpec = {
    count: {
      attribute: "count",
      parse: (v: unknown) => {
        const num = Number(v);
        if (isNaN(num)) throw new Error("Invalid number");
        return num;
      }
    }
  };
  
  registerTestComponent("strict-counter", {
    props: propSpec,
    render: (props: any) => `<div>Count: ${props.count}</div>`
  });
  
  // This should throw during prop parsing
  let errorThrown = false;
  try {
    renderComponent("strict-counter", { count: "not-a-number" });
  } catch (error) {
    errorThrown = true;
    const message = (error as Error).message;
    // Check that the enhanced error message includes the component name, prop name, and original error
    assert(message.includes('Component "strict-counter"'), "Error should include component name");
    assert(message.includes('prop "count"'), "Error should include prop name");
    assert(message.includes("Invalid number"), "Error should include original error message");
    assert(message.includes('"not-a-number"'), "Error should include received value");
  }
  assert(errorThrown, "Expected prop parsing error to be thrown");
});
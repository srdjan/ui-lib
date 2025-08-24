import { assertEquals, assertNotEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { getRegistry, type SSRRegistryEntry } from "./registry.ts";

Deno.test("Registry - Get registry returns global object", () => {
  const registry1 = getRegistry();
  const registry2 = getRegistry();
  
  // Should return the same object
  assertEquals(registry1, registry2);
  assertEquals(typeof registry1, "object");
});

Deno.test("Registry - Registry persists across calls", () => {
  const registry = getRegistry();
  
  // Add an entry
  registry["test-persistence"] = {
    init: () => ({ test: true }),
    render: () => "<div>test</div>",
  };
  
  // Get registry again
  const registry2 = getRegistry();
  assertEquals(registry2["test-persistence"], registry["test-persistence"]);
});

Deno.test("Registry - Can store complete component entries", () => {
  const registry = getRegistry();
  
  const entry: SSRRegistryEntry = {
    init: () => ({ count: 42, name: "test" }),
    props: {
      step: { attribute: "step", parse: (v) => Number(v) || 1 },
      label: { attribute: "label", parse: (v) => String(v) },
    },
    css: ".component { color: blue; }",
    actions: {
      increment: (state, ...args) => {
        const step = (args[0] as number) ?? 1;
        return { count: (state as { count: number }).count + step };
      },
      setName: (state, ...args) => ({ name: args[0] as string }),
    },
    render: (state, props, actions) => {
      const { count, name } = state as { count: number; name: string };
      const { step, label } = props as { step: number; label: string };
      return `<div class="component">${label}: ${name} = ${count} (step: ${step})</div>`;
    },
  };
  
  registry["test-complete"] = entry;
  
  // Verify all parts are stored correctly
  const stored = registry["test-complete"];
  assertEquals(typeof stored.init, "function");
  assertEquals(typeof stored.render, "function");
  assertEquals(typeof stored.props, "object");
  assertEquals(typeof stored.actions, "object");
  assertEquals(stored.css, ".component { color: blue; }");
  
  // Test init function
  const initialState = stored.init();
  assertEquals(initialState, { count: 42, name: "test" });
  
  // Test props parsing
  assertEquals(stored.props!.step.parse("5"), 5);
  assertEquals(stored.props!.label.parse(123), "123");
  
  // Test actions
  const state = { count: 10, name: "current" };
  const incrementResult = stored.actions!.increment(state, 3);
  assertEquals(incrementResult, { count: 13 });
  
  const nameResult = stored.actions!.setName(state, "updated");
  assertEquals(nameResult, { name: "updated" });
});

Deno.test("Registry - Multiple components can coexist", () => {
  const registry = getRegistry();
  
  // Clear any existing entries
  delete registry["comp-1"];
  delete registry["comp-2"];
  
  registry["comp-1"] = {
    init: () => ({ type: "first" }),
    render: (state) => `<div>First: ${(state as { type: string }).type}</div>`,
  };
  
  registry["comp-2"] = {
    init: () => ({ type: "second" }),
    render: (state) => `<span>Second: ${(state as { type: string }).type}</span>`,
  };
  
  // Both should exist independently
  assertEquals(registry["comp-1"].init(), { type: "first" });
  assertEquals(registry["comp-2"].init(), { type: "second" });
  
  const html1 = registry["comp-1"].render({ type: "first" }, {}, {});
  const html2 = registry["comp-2"].render({ type: "second" }, {}, {});
  
  assertEquals(html1, "<div>First: first</div>");
  assertEquals(html2, "<span>Second: second</span>");
});

Deno.test("Registry - Component entries can be minimal", () => {
  const registry = getRegistry();
  
  // Minimal entry with just required fields
  registry["test-minimal"] = {
    init: () => ({ value: "minimal" }),
    render: (state) => `<p>${(state as { value: string }).value}</p>`,
  };
  
  const entry = registry["test-minimal"];
  assertEquals(typeof entry.init, "function");
  assertEquals(typeof entry.render, "function");
  assertEquals(entry.props, undefined);
  assertEquals(entry.css, undefined);
  assertEquals(entry.actions, undefined);
});

Deno.test("Registry - Component entries support optional fields", () => {
  const registry = getRegistry();
  
  // Entry with optional fields
  registry["test-optional-fields"] = {
    init: () => ({ active: false }),
    render: (state) => `<div class="optional">${(state as { active: boolean }).active}</div>`,
    css: ".optional { border: 1px solid #ccc; }",
  };
  
  const entry = registry["test-optional-fields"];
  assertEquals(entry.css, ".optional { border: 1px solid #ccc; }");
  assertEquals(entry.props, undefined);
  assertEquals(entry.actions, undefined);
});

Deno.test("Registry - Global registry isolation", () => {
  const registry = getRegistry();
  
  // Add a test entry
  registry["isolation-test"] = {
    init: () => ({ isolated: true }),
    render: () => "<div>isolated</div>",
  };
  
  // Verify it's in the global scope
  const globalRegistry = (globalThis as any).__FWC_SSR__;
  assertEquals(globalRegistry["isolation-test"], registry["isolation-test"]);
  
  // Modify the entry through the global reference
  globalRegistry["isolation-test"].modified = true;
  
  // Should be reflected in the registry function result
  assertEquals((registry["isolation-test"] as any).modified, true);
});

Deno.test("Registry - Entry overwriting", () => {
  const registry = getRegistry();
  
  // Original entry
  registry["test-overwrite"] = {
    init: () => ({ version: 1 }),
    render: () => "<div>v1</div>",
  };
  
  const original = registry["test-overwrite"];
  
  // Overwrite with new entry
  registry["test-overwrite"] = {
    init: () => ({ version: 2 }),
    render: () => "<div>v2</div>",
  };
  
  // Should be different objects
  assertNotEquals(registry["test-overwrite"], original);
  assertEquals(registry["test-overwrite"].init(), { version: 2 });
});
// Tests for the new defineComponent API
import {
  assertEquals,
  assertExists,
  assertStringIncludes,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { defineComponent } from "./define-component.ts";
import { getRegistry } from "./registry.ts";
import { renderComponent } from "./component-state.ts";
import { h } from "./jsx-runtime.ts";

Deno.test("defineComponent registers component in registry", () => {
  // Clear registry first
  const registry = getRegistry();
  delete registry["test-define"];

  defineComponent("test-define", {
    props: { text: "string" },
    render: ({ text }) => h("div", null, text)
  });

  assertExists(registry["test-define"]);
  assertEquals(typeof registry["test-define"].render, "function");
});

Deno.test("defineComponent with enhanced props (defaults)", () => {
  const registry = getRegistry();
  delete registry["test-defaults"];

  defineComponent("test-defaults", {
    props: {
      name: "string",
      count: { type: "number", default: 42 },
      active: { type: "boolean", default: true }
    },
    render: ({ name, count, active }) => 
      h("div", null, `${name}: ${count}, active: ${active}`)
  });

  const result1 = renderComponent("test-defaults", { name: "test" });
  assertEquals(result1, "<div>test: 42, active: true</div>");

  const result2 = renderComponent("test-defaults", { name: "test", count: "100" });
  assertEquals(result2, "<div>test: 100, active: true</div>");
});

Deno.test("defineComponent with explicit required/optional props", () => {
  const registry = getRegistry();
  delete registry["test-explicit"];

  defineComponent("test-explicit", {
    props: {
      title: { type: "string", required: true },
      subtitle: { type: "string", required: false },
      count: { type: "number", required: false }
    },
    render: ({ title, subtitle, count }) => 
      h("div", null, `${title} ${subtitle || ''} ${count || 0}`)
  });

  const result1 = renderComponent("test-explicit", { title: "Hello" });
  assertStringIncludes(result1, "Hello");
  assertStringIncludes(result1, "0");

  const result2 = renderComponent("test-explicit", { 
    title: "Hello", 
    subtitle: "World", 
    count: "5" 
  });
  assertEquals(result2, "<div>Hello World 5</div>");
});

Deno.test("defineComponent with styles and classes", () => {
  const registry = getRegistry();
  delete registry["test-styled"];

  const css = ".btn { color: red; }";
  defineComponent("test-styled", {
    props: { text: "string" },
    styles: css,
    classes: { button: "btn" },
    render: ({ text }, api, classes) => 
      h("button", { class: classes!.button }, text)
  });

  const entry = registry["test-styled"];
  assertEquals(entry.css, css);
  
  const result = renderComponent("test-styled", { text: "Click" });
  assertEquals(result, '<style>.btn { color: red; }</style><button class="btn">Click</button>');
});

Deno.test("defineComponent with API integration", () => {
  const registry = getRegistry();
  delete registry["test-api"];

  defineComponent("test-api", {
    props: { id: "string" },
    api: {
      create: {
        route: "POST /test/:id",
        handler: () => new Response("created")
      },
      remove: {
        route: "DELETE /test/:id", 
        handler: () => new Response("deleted")
      }
    },
    render: ({ id }, api) => 
      h("div", api.create(id), `Item ${id}`)
  });

  const entry = registry["test-api"];
  assertExists(entry.api);
  assertExists(entry.api!.create);
  assertExists(entry.api!.remove);

  const createAction = entry.api!.create("123");
  assertEquals(createAction["hx-post"], "/test/123");

  const removeAction = entry.api!.remove("456");
  assertEquals(removeAction["hx-delete"], "/test/456");
});

Deno.test("defineComponent throws error without render function", () => {
  let errorThrown = false;
  try {
    // @ts-ignore - testing runtime error
    defineComponent("test-no-render", {
      props: { text: "string" }
    });
  } catch (error) {
    errorThrown = true;
    assertStringIncludes((error as Error).message, 'missing required configuration: render function');
  }
  assertEquals(errorThrown, true);
});
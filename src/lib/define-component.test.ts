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
import { post, del } from "./api-helpers.ts";

Deno.test("defineComponent registers component in registry", () => {
  // Clear registry first
  const registry = getRegistry();
  delete registry["test-define"];

  defineComponent("test-define", {
    // @ts-ignore - test doesn't need perfect types
    render: (props: { text: string }) => h("div", null, props.text)
  });

  assertExists(registry["test-define"]);
  assertEquals(typeof registry["test-define"].render, "function");
});

Deno.test("defineComponent with props transformer (defaults)", () => {
  const registry = getRegistry();
  delete registry["test-defaults"];

  defineComponent("test-defaults", {
    props: (attrs) => ({
      name: attrs.name,
      count: parseInt(attrs.count || "42"),
      active: "active" in attrs
    }),
    render: ({ name, count, active }) => 
      h("div", null, `${name}: ${count}, active: ${active}`)
  });

  const result1 = renderComponent("test-defaults", { name: "test" });
  assertEquals(result1, "<div>test: 42, active: false</div>");

  const result2 = renderComponent("test-defaults", { name: "test", count: "100", active: "" });
  assertEquals(result2, "<div>test: 100, active: true</div>");
});

Deno.test("defineComponent with validation in props transformer", () => {
  const registry = getRegistry();
  delete registry["test-validation"];

  defineComponent("test-validation", {
    props: (attrs) => ({
      title: attrs.title || "Untitled",
      subtitle: attrs.subtitle || undefined,
      count: attrs.count ? Math.max(0, parseInt(attrs.count)) : 0
    }),
    render: ({ title, subtitle, count }) => 
      h("div", null, `${title} ${subtitle || ''} ${count}`)
  });

  const result1 = renderComponent("test-validation", { title: "Hello" });
  assertEquals(result1, "<div>Hello  0</div>");

  const result2 = renderComponent("test-validation", { 
    title: "Hello", 
    subtitle: "World", 
    count: "5" 
  });
  assertEquals(result2, "<div>Hello World 5</div>");
});

Deno.test("defineComponent with styles and classes (zero config)", () => {
  const registry = getRegistry();
  delete registry["test-styled"];

  const css = ".btn { color: red; }";
  defineComponent("test-styled", {
    styles: css,
    classes: { button: "btn" },
    // @ts-ignore - test doesn't need perfect types
    render: (props: { text: string }, _api, classes) => 
      h("button", { class: classes!.button }, props.text)
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
    props: (attrs) => ({ id: attrs.id }),
    api: {
      create: post("/test/:id", () => new Response("created")),
      remove: del("/test/:id", () => new Response("deleted"))
    },
    // @ts-ignore - test doesn't need perfect types
    render: (props, api) => 
      h("div", api.create(props.id), `Item ${props.id}`)
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
      props: (attrs) => ({ text: attrs.text })
    });
  } catch (error) {
    errorThrown = true;
    assertStringIncludes((error as Error).message, 'missing required configuration: render function');
  }
  assertEquals(errorThrown, true);
});
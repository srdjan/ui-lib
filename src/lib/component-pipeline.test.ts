// Tests for the component pipeline API

import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { component } from "./component-pipeline.ts";
import { getRegistry } from "./registry.ts";
import { h } from "./jsx-runtime.ts";

Deno.test("component registers in registry", () => {
  // Clear registry first
  const registry = getRegistry();
  delete registry["test-component"];
  
  component("test-component")
    .view(() => h("div", null, "Hello"));
    
  assertExists(registry["test-component"]);
  assertEquals(typeof registry["test-component"].render, "function");
});

Deno.test("component with props creates prop spec", () => {
  const registry = getRegistry();
  delete registry["test-props"];
  
  component("test-props")
    .props({ name: "string", age: "number?" })
    .view((props) => h("div", null, `Hello ${(props as any).name}`));
    
  const entry = registry["test-props"];
  assertExists(entry.props);
  assertExists(entry.props!.name);
  assertExists(entry.props!.age);
  assertEquals(entry.props!.name.attribute, "name");
  assertEquals(entry.props!.age.attribute, "age");
});

Deno.test("component with api generates client functions", () => {
  const registry = getRegistry();
  delete registry["test-api"];
  
  component("test-api")
    .api({
      'POST /api/save/:id': () => new Response("saved"),
      'DELETE /api/delete/:id': () => new Response("deleted")
    })
    .view(() => h("div", null, "Content"));
    
  const entry = registry["test-api"];
  assertExists(entry.serverActions); // Auto-generated client functions
  assertExists(entry.serverActions!.create); // Generated from POST
  assertExists(entry.serverActions!.delete); // Generated from DELETE
  
  const createAction = entry.serverActions!.create("123");
  assertEquals(createAction["hx-post"], "/api/save/123");
  
  const deleteAction = entry.serverActions!.delete("123");  
  assertEquals(deleteAction["hx-delete"], "/api/delete/123");
});

Deno.test("component with styles stores CSS", () => {
  const registry = getRegistry();
  delete registry["test-styles"];
  
  const css = ".test { color: red; }";
  component("test-styles")
    .styles(css)
    .view(() => h("div", null, "Styled"));
    
  const entry = registry["test-styles"];
  assertEquals(entry.css, css);
});

Deno.test("component render function works with JSX", () => {
  const registry = getRegistry();
  delete registry["test-render"];
  
  component("test-render")
    .props({ message: "string" })
    .view((props) => h("p", null, (props as any).message));
    
  const entry = registry["test-render"];
  const result = entry.render({ message: "Hello Test" });
  assertEquals(result, "<p>Hello Test</p>");
});

Deno.test("component with parts passes parts to view function", () => {
  const registry = getRegistry();
  delete registry["test-parts"];
  
  component("test-parts")
    .parts({ container: ".container", content: ".content" })
    .view((_props, _api, parts) => {
      return h("div", { class: parts!.container.slice(1) }, 
        h("span", { class: parts!.content.slice(1) }, "Content")
      );
    });
    
  const entry = registry["test-parts"];
  const result = entry.render({});
  assertEquals(result, '<div class="container"><span class="content">Content</span></div>');
});

Deno.test("component pipeline is chainable", () => {
  const registry = getRegistry();
  delete registry["test-chain"];
  
  const result = component("test-chain")
    .props({ title: "string" })
    .styles(".chain { display: block; }")
    .api({ 'GET /test': () => new Response("test") })
    .view((props) => h("div", { class: "chain" }, (props as any).title));
    
  // Should return the builder for chaining
  assertExists(result);
  
  // Should be registered
  assertExists(registry["test-chain"]);
});
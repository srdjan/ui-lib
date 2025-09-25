/** @jsx h */
// Tests for the new minimal defineComponent API
import {
  assertEquals,
  assertExists,
  assertStringIncludes,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { renderComponent } from "./component-state.ts";
import { defineComponent } from "./define-component.ts";
import { h } from "./jsx-runtime.ts";
import { boolean, string } from "./prop-helpers.ts";
import { getRegistry } from "./registry.ts";

Deno.test("Minimal API: Basic component registration", () => {
  // Clear registry first
  const registry = getRegistry();
  delete registry["test-basic"];

  defineComponent("test-basic", {
    render: ({
      text = string("Hello World"),
    }) => {
      return <div>{text}</div>;
    },
  });

  assertExists(registry["test-basic"]);
  assertEquals(typeof registry["test-basic"].render, "function");
});

Deno.test("Minimal API: Component with prop parsing", () => {
  const registry = getRegistry();
  delete registry["test-props"];

  defineComponent("test-props", {
    render: ({
      name = string("default"),
      count = string("42"),
      active = boolean(false),
    }) => {
      const parsedCount = parseInt(typeof count === "string" ? count : "42");
      const isActive = typeof active === "boolean" ? active : false;
      return <div>{name}: {parsedCount}, active: {String(isActive)}</div>;
    },
  });

  const result1 = renderComponent("test-props", { name: "test" });
  assertEquals(
    result1,
    '<div data-component="test-props">test: 42, active: false</div>',
  );

  const result2 = renderComponent("test-props", {
    name: "test",
    count: "100",
    active: "",
  });
  assertEquals(
    result2,
    '<div data-component="test-props">test: 100, active: true</div>',
  );
});

Deno.test("Minimal API: Component with styles", () => {
  const registry = getRegistry();
  delete registry["test-styles"];

  defineComponent("test-styles", {
    styles: `.test-button { background: blue; color: white; }`,
    render: ({
      text = string("Click me"),
    }) => {
      return <button class="test-button">{text}</button>;
    },
  });

  assertExists(registry["test-styles"].css);
  assertEquals(
    registry["test-styles"].css,
    `.test-button { background: blue; color: white; }`,
  );

  const result = renderComponent("test-styles", { text: "Test Button" });
  // Should include CSS and button HTML
  assertEquals(
    result,
    '<style>.test-button { background: blue; color: white; }</style><button class="test-button" data-component="test-styles">Test Button</button>',
  );
});

Deno.test("Minimal API: Component with API", () => {
  const registry = getRegistry();
  delete registry["test-api"];

  const mockHandler = async () =>
    new Response(JSON.stringify({ success: true }));

  const TestApi = defineComponent("test-api", {
    api: {
      save: ["POST", "/api/save", mockHandler],
      delete: ["DELETE", "/api/delete/:id", mockHandler],
    },
    render: (attrs: Record<string, string>, api) => {
      assertExists(api);
      assertExists(api.save);
      assertExists(api.delete);

      const saveAttrs = api.save();
      const deleteAttrs = api.delete("123");

      return <div>Component with API</div>;
    },
  });

  assertExists(registry["test-api"].api);
  assertExists(registry["test-api"].apiMap);
  assertEquals(typeof TestApi, "function");
  assertEquals(TestApi.componentName, "test-api");

  const result = renderComponent("test-api", {});
  assertEquals(
    result,
    '<div data-component="test-api">Component with API</div>',
  );
});

Deno.test("Minimal API: Error handling for missing render", () => {
  const registry = getRegistry();
  delete registry["test-no-render"];

  let errorThrown = false;
  let errorMessage = "";

  try {
    // @ts-ignore - intentionally passing invalid config
    defineComponent("test-no-render", {
      styles: "/* some styles */",
    });
  } catch (error) {
    errorThrown = true;
    errorMessage = (error as Error).message;
  }

  assertEquals(errorThrown, true);
  assertStringIncludes(errorMessage, "Cannot read properties of undefined");
});

Deno.test("Minimal API: Children preservation", () => {
  const registry = getRegistry();
  delete registry["test-children"];

  defineComponent("test-children", {
    render: ({
      children = string("No children"),
    }) => {
      const childrenContent = typeof children === "string" && children !== ""
        ? children
        : "No children";
      return <div>{childrenContent}</div>;
    },
  });

  // Test with children - this simulates SSR tag processor passing children
  const result1 = renderComponent(
    "test-children",
    { children: "Child content" } as any,
  );
  assertEquals(
    result1,
    '<div data-component="test-children">Child content</div>',
  );

  // Test without children
  const result2 = renderComponent("test-children", {});
  assertEquals(
    result2,
    '<div data-component="test-children">No children</div>',
  );
});

Deno.test("Minimal API: Reactive configuration", () => {
  const registry = getRegistry();
  delete registry["test-reactive"];

  defineComponent("test-reactive", {
    reactive: {
      state: { count: "data-count" },
      css: { "--theme": "data-theme" },
      on: { "user:login": "handleLogin" },
    },
    render: ({
      count = string("0"),
    }) => {
      return <div data-count={count}>Reactive Component</div>;
    },
  });

  const result = renderComponent("test-reactive", { count: "5" });
  // The result should include reactive attributes processed by applyReactiveAttrs
  assertStringIncludes(result, "Reactive Component");
});

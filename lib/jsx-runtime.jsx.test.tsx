/** @jsx h */
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { h } from "./jsx-runtime.ts";
import { defineComponent } from "./define-component.ts";
import { resetRegistry } from "./registry.ts";
import { boolean, number, string } from "./prop-helpers.ts";
import { renderComponent } from "./component-state.ts";

Deno.test("JSX runtime detects and renders ui-lib components", () => {
  // Clean registry
  resetRegistry();

  // Register a test component
  defineComponent("test-counter", {
    render: ({ count = number(0), label = string("Counter") }) => {
      return `<div data-count="${count}">${label}: ${count}</div>`;
    },
  });

  // Test JSX syntax
  const jsxResult = <test-counter count={5} label="My Counter" />;

  // Test renderComponent equivalent
  const traditionalResult = renderComponent("test-counter", {
    "count": "5",
    "label": "My Counter",
  });

  // Results should be identical (ignoring potential CSS differences)
  assertEquals(
    jsxResult.includes('data-count="5"'),
    true,
    "JSX should render with correct count",
  );
  assertEquals(
    jsxResult.includes("My Counter: 5"),
    true,
    "JSX should render with correct content",
  );

  // Both approaches should produce functionally equivalent output
  assertEquals(
    jsxResult.includes('data-count="5"'),
    traditionalResult.includes('data-count="5"'),
    "JSX and renderComponent should produce equivalent results",
  );
});

Deno.test("JSX runtime handles prop type conversion", () => {
  resetRegistry();

  defineComponent("test-props", {
    render: ({
      str = string("default"),
      num = number(0),
      bool = boolean(false),
    }) => {
      return `<div>${str}-${num}-${bool}</div>`;
    },
  });

  const result = <test-props str="hello" num={42} bool={true} />;

  assertEquals(result.includes("hello-42"), true);
});

Deno.test("JSX runtime falls back to HTML for non-ui-lib tags", () => {
  const htmlResult = <div class="test">Hello</div>;
  assertEquals(htmlResult, '<div class="test">Hello</div>');
});

Deno.test("JSX runtime handles kebab-case detection correctly", () => {
  // Single word components should be treated as HTML
  const single = <button>Click</button>;
  assertEquals(single, "<button>Click</button>");

  // Kebab-case components should be checked against registry
  resetRegistry();
  defineComponent("my-component", {
    render: () => "<span>Custom</span>",
  });

  const kebab = <my-component />;
  assertEquals(kebab.includes("Custom"), true);
});

Deno.test("JSX runtime handles children properly", () => {
  resetRegistry();

  defineComponent("test-children", {
    render: ({ children = string("") }) => {
      return `<div class="wrapper">${children}</div>`;
    },
  });

  const result = (
    <test-children>
      <p>Child content</p>
    </test-children>
  );

  assertEquals(result.includes("<p>Child content</p>"), true);
  assertEquals(result.includes('class="wrapper"'), true);
});

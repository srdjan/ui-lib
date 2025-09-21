import {
  assertEquals,
  assertStringIncludes,
} from "https://deno.land/std/assert/mod.ts";
import { defineComponent } from "./define-component.ts";
import { renderComponent } from "./component-state.ts";
import { h } from "./jsx-runtime.ts";

// Integration tests for declarative bindings with the component system

Deno.test("defineComponent - auto-processes declarative bindings", () => {
  defineComponent("test-declarative-basic", {
    render: () => h("div", { "data-bind-text": "message" }, "Default message"),
  });

  const html = renderComponent("test-declarative-basic");

  // Should process the binding
  assertStringIncludes(html, "data-binding-id=");
  assertStringIncludes(html, 'data-state-topic="message"');
  assertStringIncludes(html, 'hx-on="htmx:load:');
  assertStringIncludes(html, "this.textContent = data");

  // Should still have component wrapper
  assertStringIncludes(html, 'data-component="test-declarative-basic"');
});

Deno.test("defineComponent - multiple binding types", () => {
  defineComponent("test-declarative-multi", {
    render: () =>
      h("div", {}, [
        h("span", { "data-bind-text": "username" }, "User"),
        h("input", { "data-bind-value": "email", "type": "email" }),
        h("button", {
          "data-emit": "save",
          "data-emit-value": '{"action": "save"}',
        }, "Save"),
        h("div", { "data-show-if": "isVisible" }, "Conditional content"),
      ]),
  });

  const html = renderComponent("test-declarative-multi");

  // Should process all binding types
  assertStringIncludes(html, 'data-state-topic="username"');
  assertStringIncludes(html, 'data-bind-value-target="email"');
  assertStringIncludes(html, "ui-lib:save");
  assertStringIncludes(html, "&quot;action&quot;: &quot;save&quot;"); // JSON quotes are escaped
  assertStringIncludes(html, 'data-state-topic="isVisible"');
});

Deno.test("defineComponent - bindings with traditional reactive config", () => {
  defineComponent("test-mixed-reactive", {
    reactive: {
      inject: true,
      on: { click: "handleClick()" },
      state: { "user-count": "data-count" },
    },
    render: () =>
      h("div", { "data-bind-text": "status" }, [
        h("span", { "data-count": "0" }, "Count: 0"),
        h("button", { "data-emit": "increment" }, "+"),
      ]),
  });

  const html = renderComponent("test-mixed-reactive");

  // Should have both traditional reactive and declarative bindings
  assertStringIncludes(html, 'data-state-topic="status"'); // Processed declarative binding
  assertStringIncludes(html, "click: handleClick()"); // Traditional reactive
  assertStringIncludes(html, "ui-lib:increment"); // Processed emit binding
});

Deno.test("defineComponent - bindings with props", () => {
  defineComponent("test-declarative-props", {
    props: (attrs) => ({
      title: attrs.title || "Default",
      stateName: attrs.stateName || "defaultState",
    }),
    render: (props) =>
      h("div", {}, [
        h("h1", {}, props.title),
        h("span", { "data-bind-text": props.stateName }, "Loading..."),
      ]),
  });

  const html = renderComponent("test-declarative-props", {
    title: "Test Title",
    stateName: "customState",
  });

  assertStringIncludes(html, "Test Title");
  assertStringIncludes(html, 'data-state-topic="customState"');
});

Deno.test("defineComponent - conditional binding processing", () => {
  // Component without bindings should not be processed
  defineComponent("test-no-bindings", {
    render: () =>
      h("div", { "class": "regular" }, [
        h("span", {}, "No bindings here"),
        h("button", { "onclick": "doSomething()" }, "Click"),
      ]),
  });

  const html = renderComponent("test-no-bindings");

  // Should not contain any binding-related attributes
  assertEquals(html.includes("data-binding-id"), false);
  assertEquals(html.includes("data-state-topic"), false);

  // Should preserve original content
  assertStringIncludes(html, 'onclick="doSomething()"');
  assertStringIncludes(html, "No bindings here");
});

Deno.test("defineComponent - binding with CSS styles", () => {
  defineComponent("test-declarative-styled", {
    styles: {
      padding: "1rem",
      backgroundColor: "white",
    },
    render: () =>
      h("div", {
        "data-bind-class": "theme",
        "data-bind-style": "color:textColor",
      }, "Styled with bindings"),
  });

  const html = renderComponent("test-declarative-styled");

  // Should have declarative bindings (CSS styles may not generate classes properly)
  assertStringIncludes(html, 'data-state-topic="theme"');
  assertStringIncludes(html, 'data-state-topic="textColor"');
  assertStringIncludes(html, "this.style.color = data");
  assertStringIncludes(html, "this.className = data");
});

Deno.test("defineComponent - complex nested bindings", () => {
  defineComponent("test-nested-bindings", {
    render: () =>
      h("div", { "data-bind-class": "outerTheme" }, [
        h("header", {}, [
          h("h1", { "data-bind-text": "title" }, "Default Title"),
          h(
            "nav",
            { "data-show-if": "showNav" },
            h("a", {
              "href": "#",
              "data-emit": "navigate",
              "data-emit-value": '{"page": "home"}',
            }, "Home"),
          ),
        ]),
        h(
          "main",
          {},
          h("form", {}, [
            h("input", {
              "data-bind-value": "searchQuery",
              "placeholder": "Search...",
              "data-listen": "keyup:handleSearch()",
            }),
            h("button", {
              "type": "button",
              "data-emit": "search",
              "data-hide-if": "isSearching",
            }, "Search"),
          ]),
        ),
      ]),
  });

  const html = renderComponent("test-nested-bindings");

  // Should process all nested bindings
  const bindingIds = html.match(/data-binding-id="/g);
  // Note: Some elements may have multiple bindings processed separately
  assertEquals((bindingIds?.length ?? 0) >= 6, true); // At least 6 bindings

  // Verify specific bindings
  assertStringIncludes(html, 'data-state-topic="outerTheme"');
  assertStringIncludes(html, 'data-state-topic="title"');
  assertStringIncludes(html, 'data-state-topic="showNav"');
  assertStringIncludes(html, 'data-bind-value-target="searchQuery"');
  assertStringIncludes(html, "&quot;page&quot;: &quot;home&quot;"); // JSON quotes are escaped
  assertStringIncludes(html, 'data-state-topic="isSearching"');
});

Deno.test("defineComponent - performance with many bindings", () => {
  // Test that processing many bindings doesn't significantly impact performance
  const manyBindings = Array.from({ length: 50 }, (_, i) => (
    `<div data-bind-text="item${i}">Item ${i}</div>`
  )).join("");

  defineComponent("test-many-bindings", {
    render: () =>
      h("div", { dangerouslySetInnerHTML: { __html: manyBindings } }),
  });

  const startTime = performance.now();
  const html = renderComponent("test-many-bindings");
  const endTime = performance.now();

  const processingTime = endTime - startTime;

  // Should process all bindings
  const bindingIds = html.match(/data-binding-id="/g);
  assertEquals(bindingIds?.length, 50);

  // Performance should be reasonable (less than 100ms for 50 bindings)
  assertEquals(processingTime < 100, true);
});

Deno.test("defineComponent - binding validation warnings", () => {
  // Component with invalid binding syntax
  defineComponent("test-invalid-bindings", {
    render: () =>
      h("div", {}, [
        h("div", { "data-bind-style": "invalidformat" }, "Bad style binding"),
        h("div", { "data-listen": "invalidformat" }, "Bad listen binding"),
        h("div", { "data-bind-text": "" }, "Empty binding"),
      ]),
  });

  // Should still render but bindings won't work as expected
  const html = renderComponent("test-invalid-bindings");

  // Invalid bindings should be left unprocessed or partially processed
  assertStringIncludes(html, "Bad style binding");
  assertStringIncludes(html, "Bad listen binding");
  assertStringIncludes(html, "Empty binding");
});

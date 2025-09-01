import {
  assert,
  assertStringIncludes,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { defineComponent } from "./define-component.ts";
import { getRegistry } from "./registry.ts";
import { renderComponent } from "./component-state.ts";
import { h } from "./jsx-runtime.ts";

Deno.test("reactive.inject adds consolidated hx-on with mount/unmount", () => {
  const registry = getRegistry();
  delete registry["test-reactive"];

  defineComponent("test-reactive", {
    reactive: {
      inject: true,
      on: { click: "clicked()" },
      mount: "init()",
      unmount: "cleanup()",
    },
    // @ts-ignore - simple render
    render: () => h("div", null, "Hi"),
  });

  const html = renderComponent("test-reactive");
  assertStringIncludes(html, 'hx-on="');
  assertStringIncludes(html, "click: clicked()");
  assertStringIncludes(html, "htmx:load:");
  assertStringIncludes(html, "MutationObserver");
});

Deno.test("reactive.inject merges with existing hx-on on root", () => {
  const registry = getRegistry();
  delete registry["test-reactive-merge"];

  defineComponent("test-reactive-merge", {
    reactive: {
      inject: true,
      on: { change: "a()" },
    },
    // @ts-ignore - simple render with existing hx-on
    render: () => h("div", { "hx-on": "submit: foo()" }, "X"),
  });

  const html = renderComponent("test-reactive-merge");
  // Should keep both submit and our injected change handler
  assertStringIncludes(html, "submit: foo()");
  assertStringIncludes(html, "change: a()");
  // Only one hx-on attribute present
  assert((html.match(/hx-on=/g) || []).length === 1);
});

Deno.test("reactive.css augments or creates component CSS", () => {
  const registry = getRegistry();
  delete registry["test-reactive-css"];

  defineComponent("test-reactive-css", {
    reactive: {
      css: { accent: "color: var(--ignored);" },
    },
    // @ts-ignore - simple render
    render: () => h("div", null, "X"),
  });

  const entry = registry["test-reactive-css"];
  // Should rewrite var(--ignored) to var(--accent) and target data-component selector
  assertStringIncludes(entry.css!, '[data-component="test-reactive-css"]');
  assertStringIncludes(entry.css!, "color: var(--accent)");
});

// Tests for DOM manipulation helpers

import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  toggleClass,
  toggleClasses,
  updateParentCounter,
  resetCounter,
  activateTab,
  toggleParentClass,
  syncCheckboxToClass,
  conditionalClass,
  spreadAttrs,
  dataAttrs,
  escape
} from "./dom-helpers.ts";

Deno.test("toggleClass returns correct action", () => {
  const action = toggleClass("active");
  assertEquals(action, {
    type: "toggleClass",
    className: "active"
  });
});

Deno.test("toggleClasses returns correct action", () => {
  const action = toggleClasses(["light", "dark"]);
  assertEquals(action, {
    type: "toggleClasses",
    classNames: ["light", "dark"]
  });
});

Deno.test("updateParentCounter returns correct action", () => {
  const action = updateParentCounter(".counter", ".display", 5);
  assertEquals(action, {
    type: "updateParentCounter",
    parentSelector: ".counter",
    counterSelector: ".display",
    delta: 5
  });
});

Deno.test("resetCounter returns correct action", () => {
  const action = resetCounter(".display", 0, ".container");
  assertEquals(action, {
    type: "resetCounter",
    displaySelector: ".display",
    initialValue: 0,
    containerSelector: ".container"
  });
});

Deno.test("activateTab returns correct action", () => {
  const action = activateTab(".tabs", ".btn", ".content", "active");
  assertEquals(action, {
    type: "activateTab",
    container: ".tabs",
    buttons: ".btn",
    content: ".content",
    activeClass: "active"
  });
});

Deno.test("toggleParentClass returns correct action", () => {
  const action = toggleParentClass("open");
  assertEquals(action, {
    type: "toggleParentClass",
    className: "open"
  });
});

Deno.test("syncCheckboxToClass returns correct action", () => {
  const action = syncCheckboxToClass("done");
  assertEquals(action, {
    type: "syncCheckbox",
    className: "done"
  });
});

Deno.test("conditionalClass returns correct class", () => {
  assertEquals(conditionalClass(true, "active", "inactive"), "active");
  assertEquals(conditionalClass(false, "active", "inactive"), "inactive");
  assertEquals(conditionalClass(false, "active"), "");
});

Deno.test("spreadAttrs formats attributes correctly", () => {
  const attrs = spreadAttrs({ 
    "hx-get": "/api/data", 
    "hx-target": "#result" 
  });
  assertEquals(attrs, 'hx-get="/api/data" hx-target="#result"');
});

Deno.test("dataAttrs formats data attributes correctly", () => {
  const attrs = dataAttrs({ userId: 123, userName: "test" });
  assertEquals(attrs, 'data-user-id="123" data-user-name="test"');
});

Deno.test("escape function sanitizes HTML", () => {
  assertEquals(escape('<script>alert("xss")</script>'), '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  assertEquals(escape("Tom & Jerry"), "Tom &amp; Jerry");
  assertEquals(escape("'quotes'"), "&#39;quotes&#39;");
});
// Tests for DOM manipulation helpers

import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  buildAttrs,
  conditionalClass,
  dataAttrs,
  escape,
  hxVals,
  spreadAttrs,
  toggleClass,
  toggleClasses,
} from "./dom-helpers.ts";

Deno.test("toggleClass returns correct action", () => {
  const action = toggleClass("active");
  assertEquals(action, {
    type: "toggleClass",
    className: "active",
  });
});

Deno.test("toggleClasses returns correct action", () => {
  const action = toggleClasses(["light", "dark"]);
  assertEquals(action, {
    type: "toggleClasses",
    classNames: ["light", "dark"],
  });
});

// Example-only helpers were moved out of the library.

Deno.test("conditionalClass returns correct class", () => {
  assertEquals(conditionalClass(true, "active", "inactive"), "active");
  assertEquals(conditionalClass(false, "active", "inactive"), "inactive");
  assertEquals(conditionalClass(false, "active"), "");
});

Deno.test("spreadAttrs formats attributes correctly", () => {
  const attrs = spreadAttrs({
    "hx-get": "/api/data",
    "hx-target": "#result",
  });
  assertEquals(attrs, 'hx-get="/api/data" hx-target="#result"');
});

Deno.test("dataAttrs formats data attributes correctly", () => {
  const attrs = dataAttrs({ userId: 123, userName: "test" });
  assertEquals(attrs, 'data-user-id="123" data-user-name="test"');
});

Deno.test("escape function sanitizes HTML", () => {
  assertEquals(
    escape('<script>alert("xss")</script>'),
    "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;",
  );
  assertEquals(escape("Tom & Jerry"), "Tom &amp; Jerry");
  assertEquals(escape("'quotes'"), "&#39;quotes&#39;");
});

Deno.test("spreadAttrs escapes special characters", () => {
  const attrs = spreadAttrs({ title: "Tom & \"Jerry\" <tag> 'q'" });
  assertEquals(
    attrs,
    'title="Tom &amp; &quot;Jerry&quot; &lt;tag&gt; &#39;q&#39;"',
  );
});

Deno.test("buildAttrs supports boolean presence and escaping", () => {
  const s = buildAttrs({ disabled: true, "aria-hidden": false, id: "x&" });
  // disabled present, aria-hidden omitted, id escaped
  const parts = s.split(" ");
  const hasDisabled = parts.includes("disabled");
  const hasAriaHidden = s.includes("aria-hidden");
  const hasEscapedId = s.includes('id="x&amp;"');
  assertEquals(hasDisabled, true);
  assertEquals(hasAriaHidden, false);
  assertEquals(hasEscapedId, true);
});

Deno.test("hxVals builds valid attribute with escaped JSON", () => {
  const attr = hxVals({ productId: "p\"1&<>'" });
  // Should start with hx-vals and include &quot; for embedded quotes
  assertEquals(attr.startsWith('hx-vals="'), true);
  assertEquals(attr.includes("&quot;"), true);
});

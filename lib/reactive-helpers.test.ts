import {
  assertEquals,
  assertStringIncludes,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  conditionalAction,
  createNotification,
  createThemeToggle,
  dispatchEvent,
  findClosestComponent,
  getCSSProperty,
  hxOn,
  listensFor,
  on,
  publishState,
  safeExecute,
  setCSSProperty,
  subscribeToState,
  toggleCSSProperty,
} from "./reactive-helpers.ts";

Deno.test("CSS property helpers generate expected JS strings", () => {
  assertStringIncludes(setCSSProperty("color", "red"), "--color");
  assertStringIncludes(getCSSProperty("color"), "--color");
  const toggle = toggleCSSProperty("theme", "light", "dark");
  assertStringIncludes(toggle, "--theme");
  assertStringIncludes(toggle, "newValue");
});

Deno.test("State and event helpers generate expected JS strings", () => {
  assertStringIncludes(publishState("cart", { x: 1 }), "funcwcState");
  assertStringIncludes(subscribeToState("cart", "doSomething()"), "subscribe");
  assertStringIncludes(
    dispatchEvent("open", { id: 1 }),
    "CustomEvent('ui-lib:open'",
  );
});

Deno.test("Attribute and utility helpers generate expected strings", () => {
  assertEquals(
    hxOn({ "htmx:load": "init()", "ui-lib:open": "noop()" }).includes(
      "htmx:load",
    ),
    true,
  );
  // on() wraps hx-on="..."
  const attr = on({ "htmx:load": "init()", "ui-lib:open": "noop()" });
  assertStringIncludes(attr, 'hx-on="');
  assertStringIncludes(attr, "htmx:load:");
  assertStringIncludes(listensFor("open", "handle()"), "hx-on=");
  assertStringIncludes(findClosestComponent(), "[data-component]");
  assertStringIncludes(conditionalAction("x>0", "doA()", "doB()"), "if (");
  assertStringIncludes(safeExecute("run()"), "try {");
});

Deno.test("create helpers compose expected behavior strings", () => {
  const notif = createNotification("Saved", "success");
  assertStringIncludes(notif, "show-notification");

  const themeToggle = createThemeToggle({ bg: "#fff" }, { bg: "#000" });
  assertStringIncludes(themeToggle, "setProperty('--bg'");
});

import {
  assertEquals,
  assertMatch,
  assertStringIncludes,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  debugReactiveState,
  dispatchEvent,
  getCSSProperty,
  hxOn,
  on,
  safeExecute,
  setCSSProperty,
  toggleCSSProperty,
} from "./reactive-helpers.ts";

Deno.test("CSS helpers respect scope branches", () => {
  assertStringIncludes(
    setCSSProperty("x", "1", "global"),
    "document.documentElement",
  );
  assertStringIncludes(
    setCSSProperty("x", "1", "component"),
    'closest("[data-component]")',
  );
  assertStringIncludes(
    getCSSProperty("y", "global"),
    "document.documentElement",
  );
  assertStringIncludes(
    getCSSProperty("y", "component"),
    'closest("[data-component]")',
  );
  assertStringIncludes(
    toggleCSSProperty("z", "a", "b", "component"),
    'closest("[data-component]")',
  );
});

Deno.test("dispatchEvent targets are configurable", () => {
  assertStringIncludes(
    dispatchEvent("ping", undefined, "document"),
    "document.dispatchEvent",
  );
  assertStringIncludes(
    dispatchEvent("ping", undefined, "self"),
    "this.dispatchEvent",
  );
  assertStringIncludes(
    dispatchEvent("ping", undefined, "parent"),
    "this.parentElement.dispatchEvent",
  );
});

Deno.test("safeExecute builds try/catch with or without custom handler", () => {
  const withDefault = safeExecute("doIt()");
  assertMatch(withDefault, /try \{ doIt\(\) \} catch \(error\) \{ .*\}/);
  const withCustom = safeExecute("doIt()", "oops(error)");
  assertStringIncludes(withCustom, "oops(error)");
});

Deno.test("debugReactiveState includes optional sections", () => {
  const minimal = debugReactiveState("label", false, false);
  // Should not include CSS or State snippets
  assertEquals(/CSS Properties:/.test(minimal), false);
  assertEquals(/State Manager:/.test(minimal), false);

  const full = debugReactiveState("label", true, true);
  assertMatch(full, /CSS Properties:/);
  assertMatch(full, /State Manager:/);
});

Deno.test("hxOn and on format multiple events on new lines", () => {
  const body = hxOn({ "htmx:load": "init()", "ui-lib:open": "noop()" });
  assertStringIncludes(body, "htmx:load: init()\nfuncwc:open: noop()");
  const attr = on({ click: "x()", change: "y()" });
  assertMatch(attr, /hx-on=\"click: x\(\)\nchange: y\(\)\"/);
});

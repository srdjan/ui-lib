import {
  assertEquals,
  assertStringIncludes,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { defineComponent } from "./define-component.ts";
import { getRegistry } from "./registry.ts";
import { renderComponent } from "./component-state.ts";

Deno.test("injects data-component at first opening tag", () => {
  const registry = getRegistry();
  delete registry["inject-basic"];

  defineComponent("inject-basic", {
    // @ts-ignore minimal typing for test
    render: () => '<div class="box">OK</div>',
  });

  const html = renderComponent("inject-basic", {});
  assertStringIncludes(html, '<div class="box" data-component="inject-basic">');
});

Deno.test("preserves leading comments/whitespace before first tag", () => {
  const registry = getRegistry();
  delete registry["inject-comments"];

  defineComponent("inject-comments", {
    // @ts-ignore minimal typing for test
    render: () => '\n<!-- marker -->\n<div class="c">Hi</div>',
  });

  const html = renderComponent("inject-comments", {});
  // The comment should remain at start; data-component should be on the div
  assertEquals(html.startsWith("\n<!-- marker -->\n"), true);
  assertStringIncludes(
    html,
    '<div class="c" data-component="inject-comments">',
  );
});

Deno.test("does not duplicate data-component if already present", () => {
  const registry = getRegistry();
  delete registry["inject-existing"];

  defineComponent("inject-existing", {
    // @ts-ignore minimal typing for test
    render: () => '<div data-component="pre">X</div>',
  });

  const html = renderComponent("inject-existing", {});
  // Should remain unchanged with existing data-component value
  assertEquals(html, '<div data-component="pre">X</div>');
});

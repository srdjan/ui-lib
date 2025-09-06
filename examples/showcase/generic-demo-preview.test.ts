import { assertStringIncludes } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { renderComponent } from "../../index.ts";
import "./generic-demo-preview.tsx"; // register component

Deno.test("generic-demo-preview renders default badges", () => {
  const html = renderComponent("generic-demo-preview", { demo: "features" });
  assertStringIncludes(html, "10x Faster");
  assertStringIncludes(html, "0kb Bundle");
  assertStringIncludes(html, "100% Type Safe");
});

Deno.test("generic-demo-preview renders media badges", () => {
  const html = renderComponent("generic-demo-preview", { demo: "media" });
  assertStringIncludes(html, "Audio Player");
  assertStringIncludes(html, "Video Controls");
  assertStringIncludes(html, "UI Themes");
});


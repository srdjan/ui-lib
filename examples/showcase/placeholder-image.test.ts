import { assertStringIncludes } from "https://deno.land/std@0.224.0/assert/assert_string_includes.ts";
import { renderComponent } from "../../index.ts";
import "./placeholder-image.tsx";

Deno.test("placeholder-image renders SVG with provided label and dimensions", () => {
  const html = renderComponent("placeholder-image", {
    width: 120,
    height: 60,
    label: "Test",
  });
  assertStringIncludes(html, "data-component=\"placeholder-image\"");
  assertStringIncludes(html, "<svg");
  assertStringIncludes(html, "width=\"120\"");
  assertStringIncludes(html, "height=\"60\"");
  assertStringIncludes(html, ">Test<");
});


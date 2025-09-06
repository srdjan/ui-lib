import { assertStringIncludes } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { renderComponent } from "../../index.ts";
import "./forms-preview.tsx"; // register component

Deno.test("forms-preview renders expected sections", () => {
  const html = renderComponent("forms-preview", {});
  assertStringIncludes(html, "Registration");
  assertStringIncludes(html, "Contact Us");
  assertStringIncludes(html, "Stay Updated");
});

import { assertStringIncludes } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { renderComponent } from "../../index.ts";
import "./dashboard-preview.tsx"; // register component

Deno.test("dashboard-preview renders analytics content", () => {
  const html = renderComponent("dashboard-preview", {});
  assertStringIncludes(html, "Analytics Dashboard");
  assertStringIncludes(html, "Revenue");
  assertStringIncludes(html, "Revenue Trend");
});


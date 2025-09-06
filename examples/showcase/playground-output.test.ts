import { assertStringIncludes } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { renderComponent } from "../../index.ts";
import "./playground-output.tsx"; // register component

Deno.test("playground-output success state", () => {
  const html = renderComponent("playground-output", {
    name: "demo",
    rendered: "<div>ok</div>",
    status: "success",
  });
  assertStringIncludes(html, "Success!");
  assertStringIncludes(
    html,
    "Component &quot;demo&quot; compiled and rendered successfully.",
  );
  assertStringIncludes(html, "<div>ok</div>");
});

Deno.test("playground-output error state", () => {
  const html = renderComponent("playground-output", {
    rendered: "",
    status: "error",
    error: "SyntaxError: Unexpected token",
  });
  assertStringIncludes(html, "Compilation Error");
  assertStringIncludes(html, "SyntaxError: Unexpected token");
});

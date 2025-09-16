import { assertEquals } from "https://deno.land/std@0.224.0/testing/asserts.ts";
import { h } from "./simple.tsx";

Deno.test("h normalizes class arrays and objects", () => {
  const html = h(
    "div",
    { class: ["btn", { active: true, disabled: false }, ["pill"]] },
    "Click",
  );
  assertEquals(html, '<div class="btn active pill">Click</div>');
});

Deno.test("h normalizes style objects", () => {
  const html = h(
    "div",
    { style: { backgroundColor: "red", marginTop: "4px", opacity: 0.5 } },
    "Styled",
  );
  assertEquals(
    html,
    '<div style="background-color: red; margin-top: 4px; opacity: 0.5">Styled</div>',
  );
});

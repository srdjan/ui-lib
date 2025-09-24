import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { parseActionPlan, resolveActionTarget } from "./action-dsl.ts";

Deno.test("parseActionPlan handles single call", () => {
  const plan = parseActionPlan("increment(1)");
  assertExists(plan);
  assertEquals(plan.calls.length, 1);
  assertEquals(plan.calls[0], { name: "increment", args: [1] });
});

Deno.test("parseActionPlan handles sequences", () => {
  const plan = parseActionPlan("sequence(reset('a'), increment('a'))");
  assertExists(plan);
  assertEquals(plan.calls.length, 2);
  assertEquals(plan.calls[0].name, "reset");
  assertEquals(plan.calls[1].name, "increment");
});

Deno.test("resolveActionTarget maps role target", () => {
  assertEquals(resolveActionTarget("role:count"), '[data-role="count"]');
});

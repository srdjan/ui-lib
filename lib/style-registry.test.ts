import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  popStyleContext,
  pushStyleContext,
  shouldInjectStyle,
} from "./style-registry.ts";

Deno.test("shouldInjectStyle returns true once per context", () => {
  pushStyleContext();
  try {
    assert(shouldInjectStyle("btn"));
    assertEquals(shouldInjectStyle("btn"), false);
  } finally {
    popStyleContext();
  }

  // Outside of a context, dedup is disabled (always true)
  assert(shouldInjectStyle("btn"));
  assert(shouldInjectStyle("btn"));
});

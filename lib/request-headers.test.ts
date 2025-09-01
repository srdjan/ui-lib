import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  currentRequestHeaders,
  runWithRequestHeaders,
} from "./request-headers.ts";
import { shouldInjectStyle } from "./style-registry.ts";

Deno.test("runWithRequestHeaders sets and restores headers", () => {
  // Outside any context, headers are empty
  assertEquals(currentRequestHeaders(), {});

  const headers = { "x-test": "123" };
  const result = runWithRequestHeaders(headers, () => {
    // Inside, current headers should match
    assertEquals(currentRequestHeaders(), headers);
    return 42;
  });

  assertEquals(result, 42);
  // After, headers stack should be restored
  assertEquals(currentRequestHeaders(), {});
});

Deno.test("runWithRequestHeaders manages style context for dedup", () => {
  // Outside a context, dedup is disabled: always true
  const key = "component-style";
  const a = shouldInjectStyle(key);
  const b = shouldInjectStyle(key);
  // both true when no active style context
  assertEquals([a, b], [true, true]);

  // Within headers scope, a style context is pushed: dedup happens
  runWithRequestHeaders({}, () => {
    const first = shouldInjectStyle(key);
    const second = shouldInjectStyle(key);
    assertEquals([first, second], [true, false]);
  });

  // After scope, back to non-dedup behavior
  const c = shouldInjectStyle(key);
  assertEquals(c, true);
});

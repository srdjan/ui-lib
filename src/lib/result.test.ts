// Minimal local asserts
const assert = (cond: boolean, msg?: string) => {
  if (!cond) throw new Error(msg ?? "assertion failed");
};
const assertEquals = (a: unknown, b: unknown, msg?: string) => {
  if (JSON.stringify(a) !== JSON.stringify(b)) {
    throw new Error(
      msg ?? `Expected ${JSON.stringify(a)} to equal ${JSON.stringify(b)}`,
    );
  }
};

import { err, flatMap, map, mapError, ok } from "./result.ts";

Deno.test("result ok/err basics", () => {
  const a = ok(1);
  const b = err("x");
  assert(a.ok);
  assert(!b.ok);
});

Deno.test("map and flatMap", () => {
  const r1 = ok(2);
  const r2 = map(r1, (x) => x * 2);
  assertEquals(r2, ok(4));

  const r3 = flatMap(r2, (x) => ok(String(x)));
  assertEquals(r3, ok("4"));

  const e1 = err("bad");
  assertEquals(map(e1, (x: number) => x + 1), e1);
  assertEquals(flatMap(e1, (_: number) => ok(0)), e1);
});

Deno.test("mapError", () => {
  const e1 = err("bad");
  const e2 = mapError(e1, (e) => e.toUpperCase());
  assertEquals(e2, err("BAD"));
});

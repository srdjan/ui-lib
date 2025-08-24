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

import { createEffect, createMemo, createSignal } from "./signals.ts";

Deno.test("signal read/write and effect", async () => {
  const [get, set] = createSignal(0);
  let ran = 0;
  createEffect(() => {
    get();
    ran++;
  });
  assertEquals(get(), 0);
  set(1);
  await Promise.resolve(); // allow microtask
  assert(ran >= 2, "effect should re-run after set");
});

Deno.test("memo updates only on dep change", async () => {
  const [a, setA] = createSignal(1);
  const [b, setB] = createSignal(2);
  const sum = createMemo(() => Number(a()) + Number(b()));
  assertEquals(sum(), 3);
  setA(5);
  await Promise.resolve();
  assertEquals(sum(), 7);
  setB((x) => Number(x) + 1);
  await Promise.resolve();
  assertEquals(sum(), 8);
});

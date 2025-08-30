import { deepFreeze } from "./immutability.ts";

Deno.test("deepFreeze freezes nested objects", () => {
  const obj: { a: { b: number } } = { a: { b: 1 } };
  deepFreeze(obj);
  try {
    obj.a.b = 2;
  } catch (_) {
    // in strict mode, mutation throws; in sloppy, it silently fails
  }
  // value should remain unchanged
  // Either because it threw or because assignment failed due to freeze
  if (obj.a.b !== 1) throw new Error("object mutated despite deepFreeze");
});

import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { deepFreeze, freezeOnDev } from "./immutability.ts";

Deno.test("freezeOnDev freezes in development (non-production)", () => {
  const originalEnv = (globalThis as { NODE_ENV?: string }).NODE_ENV;
  (globalThis as { NODE_ENV?: string }).NODE_ENV = "development";

  const frozen = freezeOnDev({ a: { b: 1 } });

  assert(Object.isFrozen(frozen));
  assert(Object.isFrozen(frozen.a));

  // restore
  (globalThis as { NODE_ENV?: string }).NODE_ENV = originalEnv;
});

Deno.test("freezeOnDev is no-op in production", () => {
  const originalEnv = (globalThis as { NODE_ENV?: string }).NODE_ENV;
  (globalThis as { NODE_ENV?: string }).NODE_ENV = "production";

  const obj = { a: { b: 1 } };
  const result = freezeOnDev(obj);
  assertEquals(result, obj);
  assert(!Object.isFrozen(result));

  // restore
  (globalThis as { NODE_ENV?: string }).NODE_ENV = originalEnv;
});

Deno.test("deepFreeze recursively freezes nested objects", () => {
  const obj: { a: { b: number } } = { a: { b: 1 } };
  deepFreeze(obj);
  assert(Object.isFrozen(obj));
  assert(Object.isFrozen(obj.a));
});

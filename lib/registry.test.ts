import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  getRegistry,
  registerComponent,
  type SSRRegistryEntry,
} from "./registry.ts";

Deno.test("getRegistry returns a stable singleton object", () => {
  const a = getRegistry();
  const b = getRegistry();
  assertEquals(a, b);
});

Deno.test("registerComponent registers and warns on overwrite", () => {
  const registry = getRegistry();
  const name = "test-registry";
  delete (registry as Record<string, unknown>)[name];

  const entry1: SSRRegistryEntry = {
    render: () => "one",
  };
  registerComponent(name, entry1);
  assertExists(registry[name]);
  assertEquals(typeof registry[name].render, "function");

  // Capture warnings on overwrite
  const warns: string[] = [];
  const origWarn = console.warn;
  console.warn = (msg?: unknown) => {
    warns.push(String(msg ?? ""));
  };
  try {
    const entry2: SSRRegistryEntry = { render: () => "two", css: ".x{}" };
    registerComponent(name, entry2);
  } finally {
    console.warn = origWarn;
  }

  assertExists(registry[name]);
  // Should have emitted at least one warning line
  assertEquals(warns.length > 0, true);
});

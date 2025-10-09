import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.224.0/testing/asserts.ts";
import type { ApiMap } from "./api-generator.ts";
import { decorateAttributes, generateClientHx, hx } from "./api-recipes.ts";

import { patch } from "./api-helpers.ts";
Deno.test("decorateAttributes merges hx metadata", () => {
  const base: Record<string, string> = {
    "hx-patch": "/api/todos/1",
    "hx-vals": JSON.stringify({ done: true }),
    "hx-headers": JSON.stringify({ Accept: "text/html" }),
  };

  const result = decorateAttributes(
    base,
    { trigger: "click" },
    {
      indicator: "#spinner",
      vals: { optimistic: true },
      headers: { "X-Test": "ok" },
    },
  );

  assertEquals(base["hx-trigger"], undefined);
  assertEquals(result["hx-trigger"], "click");
  assertEquals(result["hx-indicator"], "#spinner");
  assertEquals(
    result["hx-vals"],
    JSON.stringify({ done: true, optimistic: true }),
  );
  assertEquals(
    result["hx-headers"],
    JSON.stringify({ Accept: "text/html", "X-Test": "ok" }),
  );
});

Deno.test("generateClientHx produces enriched hx attribute strings", () => {
  const handler = () => new Response("ok");
  const apiMap: ApiMap = {
    toggle: patch("/api/todos/:id/toggle", handler),
  };

  const actions = generateClientHx(apiMap, { trigger: "click" });
  const attrs = actions.toggle(
    "42",
    { done: true },
    hx({ indicator: "#spin" }),
  );

  assert(attrs.includes('hx-patch="/api/todos/42/toggle"'));
  assert(attrs.includes('hx-trigger="click"'));
  assert(attrs.includes('hx-indicator="#spin"'));
});

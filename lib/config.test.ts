import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { configure } from "./config.ts";
import { generateClientApi } from "./api-generator.ts";
import { post } from "./api-helpers.ts";

Deno.test("configure overrides HTMX defaults for generated API attrs", () => {
  // Set custom defaults
  configure({
    hx: {
      swapDefault: "innerHTML",
      targetDefault: "#root",
      headers: { "X-CSRF": "token" },
    },
  });

  const apiMap = {
    create: post("/api/todos", () => new Response("ok")),
  };
  const client = generateClientApi(apiMap);
  const attrs = client.create({ a: 1 });

  assertEquals(attrs["hx-post"], "/api/todos");
  assertEquals(attrs["hx-swap"], "innerHTML");
  assertEquals(attrs["hx-target"], "#root");

  const headers = JSON.parse(attrs["hx-headers"]);
  assertEquals(headers["X-Requested-With"], "XMLHttpRequest");
  assertEquals(headers["X-CSRF"], "token");
});

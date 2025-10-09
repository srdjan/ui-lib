import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { create, del, get, patch, post, put, remove } from "./api-helpers.ts";

Deno.test("api helper routes have expected method and path", () => {
  const handler = () => new Response("ok");
  assertEquals(get("/x", handler).method, "GET");
  assertEquals(get("/x", handler).path, "/x");
  assertEquals(post("/x", handler).method, "POST");
  assertEquals(put("/x", handler).method, "PUT");
  assertEquals(patch("/x", handler).method, "PATCH");
  assertEquals(del("/x", handler).method, "DELETE");
});

Deno.test("api helper aliases map correctly", () => {
  const handler = () => new Response("ok");
  assertEquals(create("/y", handler).method, "POST");
  assertEquals(remove("/z", handler).method, "DELETE");
});

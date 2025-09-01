import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { create, del, get, patch, post, put, remove } from "./api-helpers.ts";

Deno.test("api helper tuples have expected method and path", () => {
  const handler = () => new Response("ok");
  assertEquals(get("/x", handler).slice(0, 2), ["GET", "/x"]);
  assertEquals(post("/x", handler).slice(0, 2), ["POST", "/x"]);
  assertEquals(put("/x", handler).slice(0, 2), ["PUT", "/x"]);
  assertEquals(patch("/x", handler).slice(0, 2), ["PATCH", "/x"]);
  assertEquals(del("/x", handler).slice(0, 2), ["DELETE", "/x"]);
});

Deno.test("api helper aliases map correctly", () => {
  const handler = () => new Response("ok");
  assertEquals(create("/y", handler).slice(0, 2), ["POST", "/y"]);
  assertEquals(remove("/z", handler).slice(0, 2), ["DELETE", "/z"]);
});

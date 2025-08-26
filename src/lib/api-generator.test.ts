// Tests for API generation from route definitions

import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { generateClientApi } from "./api-generator.ts";
import { get, post, patch, put, del } from "./api-helpers.ts";

Deno.test("generateClientApi creates client functions with helper syntax", () => {
  const apiMap = {
    create: post("/api/todos", async () => new Response("created")),
    list: get("/api/todos", async () => new Response("list")),
    toggle: patch("/api/todos/:id/toggle", async () => new Response("toggled")),
    remove: del("/api/todos/:id", async () => new Response("deleted")),
    getPost: get("/api/users/:userId/posts/:postId", async () => new Response("nested"))
  };

  const clientApi = generateClientApi(apiMap);

  // Check generated function names match the explicit names
  assertExists(clientApi.create);
  assertExists(clientApi.list);
  assertExists(clientApi.toggle);
  assertExists(clientApi.remove);
  assertExists(clientApi.getPost);

  // Test parameter substitution
  const createAction = clientApi.create();
  assertEquals(createAction["hx-post"], "/api/todos");

  const toggleAction = clientApi.toggle("123");
  assertEquals(toggleAction["hx-patch"], "/api/todos/123/toggle");

  const removeAction = clientApi.remove("456"); 
  assertEquals(removeAction["hx-delete"], "/api/todos/456");

  // Test multiple parameters
  const nestedAction = clientApi.getPost("user1", "post2");
  assertEquals(nestedAction["hx-get"], "/api/users/user1/posts/post2");
});

Deno.test("generateClientApi handles edge cases", () => {
  const apiMap = {
    update: put("/api/users/:id", async () => new Response("updated")),
    invalid: "not a tuple", // Invalid format
    root: get("/api", async () => new Response("root"))
  } as any; // Type assertion to allow invalid entry for testing

  const clientApi = generateClientApi(apiMap);

  // PUT should work with explicit function name
  assertExists(clientApi.update);
  const updateAction = clientApi.update("123");
  assertEquals(updateAction["hx-put"], "/api/users/123");

  // Root path without params
  assertExists(clientApi.root);
  const rootAction = clientApi.root();
  assertEquals(rootAction["hx-get"], "/api");

  // Invalid routes should be ignored (no function created for malformed routes)
  assertEquals(Object.keys(clientApi).includes("invalid"), false);
});

Deno.test("helper syntax works with different HTTP methods", () => {
  const apiMap = {
    list: get("/api/todos", async () => new Response("test")),
    getItem: get("/api/todos/:id", async () => new Response("test")),
    create: post("/api/todos", async () => new Response("test")),
    update: put("/api/todos/:id", async () => new Response("test")),
    patchItem: patch("/api/todos/:id", async () => new Response("test")),
    remove: del("/api/todos/:id", async () => new Response("test"))
  };

  const clientApi = generateClientApi(apiMap);
  
  // Check that all explicit function names are preserved
  assertExists(clientApi.list);
  assertExists(clientApi.getItem);
  assertExists(clientApi.create);
  assertExists(clientApi.update);
  assertExists(clientApi.patchItem);
  assertExists(clientApi.remove);

  // Test that HTTP methods are correctly mapped to HTMX attributes
  assertEquals(clientApi.list()["hx-get"], "/api/todos");
  assertEquals(clientApi.create()["hx-post"], "/api/todos");
  assertEquals(clientApi.update("123")["hx-put"], "/api/todos/123");
  assertEquals(clientApi.patchItem("123")["hx-patch"], "/api/todos/123");
  assertEquals(clientApi.remove("123")["hx-delete"], "/api/todos/123");
});

Deno.test("parameter extraction handles complex paths", () => {
  const apiMap = {
    getComment: get("/api/users/:userId/posts/:postId/comments/:commentId", 
      async () => new Response("nested"))
  };

  const clientApi = generateClientApi(apiMap);
  
  // Should extract all 3 parameters in order
  const action = clientApi.getComment("user123", "post456", "comment789");
  assertEquals(action["hx-get"], "/api/users/user123/posts/post456/comments/comment789");
});

Deno.test("generateClientApi handles no parameters", () => {
  const apiMap = {
    health: get("/api/health", async () => new Response("ok")),
    logout: post("/api/logout", async () => new Response("logged out"))
  };

  const clientApi = generateClientApi(apiMap);

  // Explicit function names work for routes with no parameters
  const healthAction = clientApi.health();
  assertEquals(healthAction["hx-get"], "/api/health");

  const logoutAction = clientApi.logout();
  assertEquals(logoutAction["hx-post"], "/api/logout");
});
// Tests for API generation from route definitions

import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { generateClientApi } from "./api-generator.ts";

Deno.test("generateClientApi creates client functions from routes", () => {
  const apiMap = {
    "POST /api/todos": async () => new Response("created"),
    "GET /api/todos": async () => new Response("list"),  
    "PATCH /api/todos/:id/toggle": async () => new Response("toggled"),
    "DELETE /api/todos/:id": async () => new Response("deleted"),
    "GET /api/users/:userId/posts/:postId": async () => new Response("nested"),
  };

  const clientApi = generateClientApi(apiMap);

  // Check generated function names
  assertExists(clientApi.create); // POST -> create
  assertExists(clientApi.list);   // GET (collection) -> list
  assertExists(clientApi.toggle); // PATCH with action -> toggle
  assertExists(clientApi.delete); // DELETE -> delete  
  assertExists(clientApi.get);    // GET (with params) -> get

  // Test parameter substitution
  const createAction = clientApi.create();
  assertEquals(createAction["hx-post"], "/api/todos");

  const toggleAction = clientApi.toggle("123");
  assertEquals(toggleAction["hx-patch"], "/api/todos/123/toggle");

  const deleteAction = clientApi.delete("456"); 
  assertEquals(deleteAction["hx-delete"], "/api/todos/456");

  // Test multiple parameters
  const nestedAction = clientApi.get("user1", "post2");
  assertEquals(nestedAction["hx-get"], "/api/users/user1/posts/post2");
});

Deno.test("generateClientApi handles edge cases", () => {
  const apiMap = {
    "PUT /api/users/:id": async () => new Response("updated"),
    "INVALID_ROUTE": async () => new Response("invalid"),
    "GET /api": async () => new Response("root"),
  };

  const clientApi = generateClientApi(apiMap);

  // PUT should map to update
  assertExists(clientApi.update);
  const updateAction = clientApi.update("123");
  assertEquals(updateAction["hx-put"], "/api/users/123");

  // Root path without params
  assertExists(clientApi.list);
  const rootAction = clientApi.list();
  assertEquals(rootAction["hx-get"], "/api");

  // Invalid routes should be ignored (no function created)
  assertEquals(Object.keys(clientApi).includes("invalid"), false);
});

Deno.test("function name generation follows REST conventions", () => {
  const testCases = [
    // [method, path, expected function name]
    ["GET", "/api/todos", "list"],
    ["GET", "/api/todos/:id", "get"], 
    ["POST", "/api/todos", "create"],
    ["PUT", "/api/todos/:id", "update"],
    ["PATCH", "/api/todos/:id", "update"], 
    ["DELETE", "/api/todos/:id", "delete"],
    ["PATCH", "/api/todos/:id/toggle", "toggle"], // Action takes precedence
    ["POST", "/api/todos/:id/archive", "archive"], // Action takes precedence
  ];

  testCases.forEach(([method, path, expectedName]) => {
    const apiMap = { [`${method} ${path}`]: async () => new Response("test") };
    const clientApi = generateClientApi(apiMap);
    
    assertExists(clientApi[expectedName], 
      `Expected function ${expectedName} for ${method} ${path}`);
  });
});

Deno.test("parameter extraction handles complex paths", () => {
  const apiMap = {
    "GET /api/users/:userId/posts/:postId/comments/:commentId": 
      async () => new Response("nested"),
  };

  const clientApi = generateClientApi(apiMap);
  
  // Should extract all 3 parameters in order
  const action = clientApi.get("user123", "post456", "comment789");
  assertEquals(action["hx-get"], "/api/users/user123/posts/post456/comments/comment789");
});

Deno.test("generateClientApi handles no parameters", () => {
  const apiMap = {
    "GET /api/health": async () => new Response("ok"),
    "POST /api/logout": async () => new Response("logged out"),
  };

  const clientApi = generateClientApi(apiMap);

  // Health and logout are action names, not resources, so they use the path name
  const healthAction = clientApi.health();
  assertEquals(healthAction["hx-get"], "/api/health");

  const logoutAction = clientApi.logout();
  assertEquals(logoutAction["hx-post"], "/api/logout");
});
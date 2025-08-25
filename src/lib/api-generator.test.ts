// Tests for API generation from route definitions

import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { generateClientApi } from "./api-generator.ts";

Deno.test("generateClientApi creates client functions with explicit names", () => {
  const apiMap = {
    create: {
      route: "POST /api/todos",
      handler: async () => new Response("created")
    },
    list: {
      route: "GET /api/todos",
      handler: async () => new Response("list")
    },
    toggle: {
      route: "PATCH /api/todos/:id/toggle", 
      handler: async () => new Response("toggled")
    },
    remove: {
      route: "DELETE /api/todos/:id",
      handler: async () => new Response("deleted")
    },
    getPost: {
      route: "GET /api/users/:userId/posts/:postId",
      handler: async () => new Response("nested")
    }
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
    update: {
      route: "PUT /api/users/:id",
      handler: async () => new Response("updated")
    },
    invalid: {
      route: "INVALID_ROUTE", 
      handler: async () => new Response("invalid")
    },
    root: {
      route: "GET /api",
      handler: async () => new Response("root")
    }
  };

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

Deno.test("explicit function names work with different HTTP methods", () => {
  const apiMap = {
    list: {
      route: "GET /api/todos",
      handler: async () => new Response("test")
    },
    get: {
      route: "GET /api/todos/:id", 
      handler: async () => new Response("test")
    },
    create: {
      route: "POST /api/todos",
      handler: async () => new Response("test")
    },
    update: {
      route: "PUT /api/todos/:id",
      handler: async () => new Response("test")
    },
    patch: {
      route: "PATCH /api/todos/:id",
      handler: async () => new Response("test")
    },
    remove: {
      route: "DELETE /api/todos/:id",
      handler: async () => new Response("test")
    }
  };

  const clientApi = generateClientApi(apiMap);
  
  // Check that all explicit function names are preserved
  assertExists(clientApi.list);
  assertExists(clientApi.get);
  assertExists(clientApi.create);
  assertExists(clientApi.update);
  assertExists(clientApi.patch);
  assertExists(clientApi.remove);

  // Test that HTTP methods are correctly mapped to HTMX attributes
  assertEquals(clientApi.list()["hx-get"], "/api/todos");
  assertEquals(clientApi.create()["hx-post"], "/api/todos");
  assertEquals(clientApi.update("123")["hx-put"], "/api/todos/123");
  assertEquals(clientApi.patch("123")["hx-patch"], "/api/todos/123");
  assertEquals(clientApi.remove("123")["hx-delete"], "/api/todos/123");
});

Deno.test("parameter extraction handles complex paths", () => {
  const apiMap = {
    getComment: {
      route: "GET /api/users/:userId/posts/:postId/comments/:commentId",
      handler: async () => new Response("nested")
    }
  };

  const clientApi = generateClientApi(apiMap);
  
  // Should extract all 3 parameters in order
  const action = clientApi.getComment("user123", "post456", "comment789");
  assertEquals(action["hx-get"], "/api/users/user123/posts/post456/comments/comment789");
});

Deno.test("generateClientApi handles no parameters", () => {
  const apiMap = {
    health: {
      route: "GET /api/health",
      handler: async () => new Response("ok")
    },
    logout: {
      route: "POST /api/logout", 
      handler: async () => new Response("logged out")
    }
  };

  const clientApi = generateClientApi(apiMap);

  // Explicit function names work for routes with no parameters
  const healthAction = clientApi.health();
  assertEquals(healthAction["hx-get"], "/api/health");

  const logoutAction = clientApi.logout();
  assertEquals(logoutAction["hx-post"], "/api/logout");
});
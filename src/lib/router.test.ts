// Tests for Router functionality

import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { appRouter, type RouteHandler } from "./router.ts";

// Helper to create test requests
const createRequest = (method: string, url: string): Request => {
  return new Request(url, { method });
};

// Helper to create test handlers
const createHandler = (name: string): RouteHandler => {
  return async () => new Response(name);
};

Deno.test("Router registers routes correctly", () => {
  // Create a fresh router instance to avoid test interference
  const testRouter = new (appRouter.constructor as any)();
  
  const handler = createHandler("test");
  testRouter.register("GET", "/users/:id", handler);
  
  // Test that route was registered by trying to match it
  const request = createRequest("GET", "http://example.com/users/123");
  const match = testRouter.match(request);
  
  assertExists(match);
  assertEquals(match.params.id, "123");
  assertEquals(match.handler, handler);
});

Deno.test("Router handles different HTTP methods", () => {
  const testRouter = new (appRouter.constructor as any)();
  
  const getHandler = createHandler("get");
  const postHandler = createHandler("post");
  const putHandler = createHandler("put");
  const deleteHandler = createHandler("delete");
  
  testRouter.register("GET", "/users", getHandler);
  testRouter.register("POST", "/users", postHandler);
  testRouter.register("PUT", "/users/:id", putHandler);
  testRouter.register("DELETE", "/users/:id", deleteHandler);
  
  // Test GET
  const getMatch = testRouter.match(createRequest("GET", "http://example.com/users"));
  assertExists(getMatch);
  assertEquals(getMatch.handler, getHandler);
  assertEquals(Object.keys(getMatch.params).length, 0);
  
  // Test POST
  const postMatch = testRouter.match(createRequest("POST", "http://example.com/users"));
  assertExists(postMatch);
  assertEquals(postMatch.handler, postHandler);
  
  // Test PUT with parameter
  const putMatch = testRouter.match(createRequest("PUT", "http://example.com/users/123"));
  assertExists(putMatch);
  assertEquals(putMatch.handler, putHandler);
  assertEquals(putMatch.params.id, "123");
  
  // Test DELETE with parameter
  const deleteMatch = testRouter.match(createRequest("DELETE", "http://example.com/users/456"));
  assertExists(deleteMatch);
  assertEquals(deleteMatch.handler, deleteHandler);
  assertEquals(deleteMatch.params.id, "456");
});

Deno.test("Router extracts single route parameters", () => {
  const testRouter = new (appRouter.constructor as any)();
  const handler = createHandler("single-param");
  
  testRouter.register("GET", "/users/:id", handler);
  
  const match = testRouter.match(createRequest("GET", "http://example.com/users/abc123"));
  assertExists(match);
  assertEquals(match.params.id, "abc123");
  assertEquals(match.handler, handler);
});

Deno.test("Router extracts multiple route parameters", () => {
  const testRouter = new (appRouter.constructor as any)();
  const handler = createHandler("multi-param");
  
  testRouter.register("GET", "/users/:userId/posts/:postId", handler);
  
  const match = testRouter.match(
    createRequest("GET", "http://example.com/users/user123/posts/post456")
  );
  assertExists(match);
  assertEquals(match.params.userId, "user123");
  assertEquals(match.params.postId, "post456");
  assertEquals(match.handler, handler);
});

Deno.test("Router handles complex nested parameters", () => {
  const testRouter = new (appRouter.constructor as any)();
  const handler = createHandler("nested-param");
  
  testRouter.register("GET", "/api/v1/users/:userId/posts/:postId/comments/:commentId", handler);
  
  const match = testRouter.match(
    createRequest("GET", "http://example.com/api/v1/users/u1/posts/p2/comments/c3")
  );
  assertExists(match);
  assertEquals(match.params.userId, "u1");
  assertEquals(match.params.postId, "p2");
  assertEquals(match.params.commentId, "c3");
});

Deno.test("Router handles trailing slashes", () => {
  const testRouter = new (appRouter.constructor as any)();
  const handler = createHandler("trailing-slash");
  
  testRouter.register("GET", "/users/:id", handler);
  
  // Should match both with and without trailing slash
  const matchWithoutSlash = testRouter.match(
    createRequest("GET", "http://example.com/users/123")
  );
  const matchWithSlash = testRouter.match(
    createRequest("GET", "http://example.com/users/123/")
  );
  
  assertExists(matchWithoutSlash);
  assertExists(matchWithSlash);
  assertEquals(matchWithoutSlash.params.id, "123");
  assertEquals(matchWithSlash.params.id, "123");
});

Deno.test("Router returns null for non-matching routes", () => {
  const testRouter = new (appRouter.constructor as any)();
  testRouter.register("GET", "/users/:id", createHandler("test"));
  
  // Different path
  const noPathMatch = testRouter.match(
    createRequest("GET", "http://example.com/posts/123")
  );
  assertEquals(noPathMatch, null);
  
  // Different method
  const noMethodMatch = testRouter.match(
    createRequest("POST", "http://example.com/users/123")
  );
  assertEquals(noMethodMatch, null);
  
  // Invalid parameter structure
  const noStructureMatch = testRouter.match(
    createRequest("GET", "http://example.com/users/123/extra")
  );
  assertEquals(noStructureMatch, null);
});

Deno.test("Router normalizes HTTP methods to uppercase", () => {
  const testRouter = new (appRouter.constructor as any)();
  const handler = createHandler("case-test");
  
  // Register with lowercase method
  testRouter.register("get", "/test", handler);
  
  // Should match uppercase request
  const upperMatch = testRouter.match(createRequest("GET", "http://example.com/test"));
  assertExists(upperMatch);
  assertEquals(upperMatch.handler, handler);
  
  // Should also match lowercase request
  const lowerMatch = testRouter.match(createRequest("get", "http://example.com/test"));
  assertExists(lowerMatch);
  assertEquals(lowerMatch.handler, handler);
});

Deno.test("Router handles routes without parameters", () => {
  const testRouter = new (appRouter.constructor as any)();
  const handler = createHandler("no-params");
  
  testRouter.register("GET", "/health", handler);
  
  const match = testRouter.match(createRequest("GET", "http://example.com/health"));
  assertExists(match);
  assertEquals(match.handler, handler);
  assertEquals(Object.keys(match.params).length, 0);
});

Deno.test("Router handles root path", () => {
  const testRouter = new (appRouter.constructor as any)();
  const handler = createHandler("root");
  
  testRouter.register("GET", "/", handler);
  
  const match = testRouter.match(createRequest("GET", "http://example.com/"));
  assertExists(match);
  assertEquals(match.handler, handler);
  assertEquals(Object.keys(match.params).length, 0);
});

Deno.test("Router parameter values can contain various characters", () => {
  const testRouter = new (appRouter.constructor as any)();
  const handler = createHandler("special-chars");
  
  testRouter.register("GET", "/users/:id/data", handler);
  
  // Test alphanumeric
  const alphaMatch = testRouter.match(
    createRequest("GET", "http://example.com/users/abc123/data")
  );
  assertExists(alphaMatch);
  assertEquals(alphaMatch.params.id, "abc123");
  
  // Test with dashes and underscores
  const dashMatch = testRouter.match(
    createRequest("GET", "http://example.com/users/user-id_123/data")
  );
  assertExists(dashMatch);
  assertEquals(dashMatch.params.id, "user-id_123");
});

Deno.test("Router first matching route wins", () => {
  const testRouter = new (appRouter.constructor as any)();
  const firstHandler = createHandler("first");
  const secondHandler = createHandler("second");
  
  // Register two routes that could match the same pattern
  testRouter.register("GET", "/users/:id", firstHandler);
  testRouter.register("GET", "/users/:userId", secondHandler);
  
  const match = testRouter.match(createRequest("GET", "http://example.com/users/123"));
  assertExists(match);
  // Should match the first registered handler
  assertEquals(match.handler, firstHandler);
  assertEquals(match.params.id, "123");
});
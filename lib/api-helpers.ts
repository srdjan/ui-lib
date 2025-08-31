// HTTP method helper functions for clean API definitions
import type { RouteHandler } from "./router.ts";
import type { ApiDefinition } from "./api-generator.ts";

/**
 * Create a GET route definition
 *
 * @example
 * ```tsx
 * api: {
 *   list: get("/api/todos", async () => { ... }),
 *   getItem: get("/api/todos/:id", async (req, params) => { ... })
 * }
 * ```
 */
export const get = (path: string, handler: RouteHandler): ApiDefinition =>
  ["GET", path, handler] as const;

/**
 * Create a POST route definition
 *
 * @example
 * ```tsx
 * api: {
 *   create: post("/api/todos", async (req) => { ... })
 * }
 * ```
 */
export const post = (path: string, handler: RouteHandler): ApiDefinition =>
  ["POST", path, handler] as const;

/**
 * Create a PUT route definition
 *
 * @example
 * ```tsx
 * api: {
 *   update: put("/api/todos/:id", async (req, params) => { ... })
 * }
 * ```
 */
export const put = (path: string, handler: RouteHandler): ApiDefinition =>
  ["PUT", path, handler] as const;

/**
 * Create a PATCH route definition
 *
 * @example
 * ```tsx
 * api: {
 *   toggle: patch("/api/todos/:id/toggle", async (req, params) => { ... })
 * }
 * ```
 */
export const patch = (path: string, handler: RouteHandler): ApiDefinition =>
  ["PATCH", path, handler] as const;

/**
 * Create a DELETE route definition
 *
 * Note: Uses 'del' instead of 'delete' to avoid JavaScript keyword conflict
 *
 * @example
 * ```tsx
 * api: {
 *   remove: del("/api/todos/:id", async (req, params) => { ... })
 * }
 * ```
 */
export const del = (path: string, handler: RouteHandler): ApiDefinition =>
  ["DELETE", path, handler] as const;

// Convenience aliases for common patterns
/**
 * Alias for 'del' - create a DELETE route definition
 */
export const remove = del;

/**
 * Alias for 'post' - create a POST route definition
 */
export const create = post;

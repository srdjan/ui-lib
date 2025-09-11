// HTTP method helper functions for clean API definitions
import type { RouteHandler, RouteHandlerFor } from "./router.ts";
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
export function get<Path extends string>(
  path: Path,
  handler: RouteHandlerFor<Path>,
): ApiDefinition;
export function get(path: string, handler: RouteHandler): ApiDefinition {
  return ["GET", path, handler] as const;
}

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
export function post<Path extends string>(
  path: Path,
  handler: RouteHandlerFor<Path>,
): ApiDefinition;
export function post(path: string, handler: RouteHandler): ApiDefinition {
  return ["POST", path, handler] as const;
}

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
export function put<Path extends string>(
  path: Path,
  handler: RouteHandlerFor<Path>,
): ApiDefinition;
export function put(path: string, handler: RouteHandler): ApiDefinition {
  return ["PUT", path, handler] as const;
}

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
export function patch<Path extends string>(
  path: Path,
  handler: RouteHandlerFor<Path>,
): ApiDefinition;
export function patch(path: string, handler: RouteHandler): ApiDefinition {
  return ["PATCH", path, handler] as const;
}

/**
 * Create a DELETE route definition
 *
 * @example
 * ```tsx
 * api: {
 *   remove: remove("/api/todos/:id", async (req, params) => { ... })
 * }
 * ```
 */
export function remove<Path extends string>(
  path: Path,
  handler: RouteHandlerFor<Path>,
): ApiDefinition;
export function remove(path: string, handler: RouteHandler): ApiDefinition {
  return ["DELETE", path, handler] as const;
}

// Aliases for convenience
/**
 * Alias for post() - Create a POST route definition
 */
export const create = post;

/**
 * Alias for remove() - Create a DELETE route definition
 */
export const del = remove;

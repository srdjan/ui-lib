/**
 * API Helpers - HTTP Method Wrappers
 * Simple helpers for defining component APIs with direct spread operator support
 */

import type { RouteHandler } from "./router.ts";

// Type for the API action that returns spreadable HTMX attributes
export type ApiAction = (
  ...params: string[]
) => Record<string, string>;

// Type for wrapped route handler with action generator
export type ApiRoute = {
  readonly method: string;
  readonly path: string;
  readonly handler: RouteHandler;
  readonly toAction: (...params: string[]) => Record<string, string>;
};

/**
 * GET method helper
 * @param path Route path with optional params (e.g., "/api/users/:id")
 * @param handler Route handler function
 * @returns ApiRoute object with action generator
 *
 * @example
 * ```tsx
 * api: {
 *   list: get("/api/todos", async () => { ... }),
 *   getItem: get("/api/todos/:id", async (req, params) => { ... })
 * }
 * // Usage in render:
 * <div {...api.list()}>Load Todos</div>
 * <div {...api.getItem(todoId)}>Load Todo</div>
 * ```
 */
export function get(path: string, handler: RouteHandler): ApiRoute {
  return createApiRoute("GET", path, handler);
}

/**
 * POST method helper
 * @param path Route path with optional params (e.g., "/api/todos/:id/toggle")
 * @param handler Route handler function
 * @returns ApiRoute object with action generator
 *
 * @example
 * ```tsx
 * api: {
 *   create: post("/api/todos", async (req) => { ... }),
 *   toggle: post("/api/todos/:id/toggle", async (req, params) => { ... })
 * }
 * // Usage in render:
 * <button {...api.create()}>Add Todo</button>
 * <input type="checkbox" {...api.toggle(todo.id)} />
 * ```
 */
export function post(path: string, handler: RouteHandler): ApiRoute {
  return createApiRoute("POST", path, handler);
}

/**
 * PATCH method helper
 * @param path Route path with optional params (e.g., "/api/todos/:id")
 * @param handler Route handler function
 * @returns ApiRoute object with action generator
 *
 * @example
 * ```tsx
 * api: {
 *   update: patch("/api/todos/:id", async (req, params) => { ... })
 * }
 * // Usage in render:
 * <button {...api.update(todo.id)}>Update</button>
 * ```
 */
export function patch(path: string, handler: RouteHandler): ApiRoute {
  return createApiRoute("PATCH", path, handler);
}

/**
 * PUT method helper
 * @param path Route path with optional params (e.g., "/api/todos/:id")
 * @param handler Route handler function
 * @returns ApiRoute object with action generator
 *
 * @example
 * ```tsx
 * api: {
 *   replace: put("/api/todos/:id", async (req, params) => { ... })
 * }
 * // Usage in render:
 * <button {...api.replace(todo.id)}>Replace</button>
 * ```
 */
export function put(path: string, handler: RouteHandler): ApiRoute {
  return createApiRoute("PUT", path, handler);
}

/**
 * DELETE method helper
 * @param path Route path with optional params (e.g., "/api/todos/:id")
 * @param handler Route handler function
 * @returns ApiRoute object with action generator
 *
 * @example
 * ```tsx
 * api: {
 *   remove: del("/api/todos/:id", async (req, params) => { ... })
 * }
 * // Usage in render:
 * <button {...api.remove(todo.id)}>Delete</button>
 * ```
 */
export function del(path: string, handler: RouteHandler): ApiRoute {
  return createApiRoute("DELETE", path, handler);
}

/**
 * Internal helper to create ApiRoute with HTMX attribute generator
 */
function createApiRoute(
  method: string,
  path: string,
  handler: RouteHandler,
): ApiRoute {
  return {
    method,
    path,
    handler,
    toAction: (...params: string[]) => {
      // Interpolate path params
      const interpolatedPath = interpolatePath(path, params);

      // Generate HTMX attributes
      const httpMethod = method.toLowerCase();
      return {
        [`hx-${httpMethod}`]: interpolatedPath,
        "hx-target": "this",
        "hx-swap": "outerHTML",
      };
    },
  };
}

/**
 * Interpolate path parameters
 * Replaces :param with actual values in order
 */
function interpolatePath(path: string, params: string[]): string {
  const paramNames = extractParamNames(path);

  if (paramNames.length !== params.length) {
    console.warn(
      `Parameter count mismatch: path "${path}" expects ${paramNames.length} params but got ${params.length}`,
    );
  }

  let interpolated = path;
  paramNames.forEach((paramName, idx) => {
    const value = params[idx] ?? "";
    interpolated = interpolated.replace(`:${paramName}`, value);
  });

  return interpolated;
}

/**
 * Extract parameter names from path
 * "/api/todos/:id/comments/:commentId" => ["id", "commentId"]
 */
function extractParamNames(path: string): string[] {
  const matches = path.match(/:([^/]+)/g);
  if (!matches) return [];
  return matches.map((m) => m.substring(1));
}

// Aliases for convenience
/**
 * Alias for del() - Create a DELETE route definition
 */
export const remove = del;

/**
 * Alias for post() - Create a POST route definition
 */
export const create = post;

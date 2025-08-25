// Auto-generation of client attributes from API route definitions

import { type RouteHandler } from "./router.ts";

export type ApiDefinition = {
  route: string;
  handler: RouteHandler;
};

export type ApiMap = Record<string, ApiDefinition>;
export type GeneratedApiMap = Record<
  string,
  (...args: unknown[]) => Record<string, unknown>
>;

/**
 * Auto-generates client attribute functions from API definitions with explicit function names
 *
 * Examples:
 * toggle: { route: 'PATCH /api/todos/:id/toggle', handler: ... } → toggle: (id) => ({ 'hx-patch': `/api/todos/${id}/toggle` })
 * remove: { route: 'DELETE /api/todos/:id', handler: ... }        → remove: (id) => ({ 'hx-delete': `/api/todos/${id}` })
 * create: { route: 'POST /api/todos', handler: ... }              → create: () => ({ 'hx-post': '/api/todos' })
 */
export function generateClientApi(apiMap: ApiMap): GeneratedApiMap {
  const generatedApi: GeneratedApiMap = {};

  for (const [functionName, apiDef] of Object.entries(apiMap)) {
    const { route } = apiDef;
    const [method, path] = route.split(" ");
    
    if (!method || !path) {
      console.warn(
        `Invalid route definition: "${route}". Expected format: "METHOD /path" (e.g., "GET /api/todos", "POST /api/users/:id")`
      );
      continue;
    }

    const paramNames = extractParameterNames(path);
    
    generatedApi[functionName] = (...args: unknown[]) => {
      const htmxMethod = `hx-${method.toLowerCase()}` as const;
      let finalPath = path;

      // Replace path parameters with actual values
      paramNames.forEach((param, index) => {
        if (index < args.length) {
          finalPath = finalPath.replace(`:${param}`, String(args[index]));
        }
      });

      return { [htmxMethod]: finalPath };
    };
  }

  return generatedApi;
}


/**
 * Extract parameter names from a route path
 *
 * Example: '/api/todos/:id/comments/:commentId' → ['id', 'commentId']
 */
function extractParameterNames(path: string): string[] {
  const paramRegex = /:([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
  const params: string[] = [];
  let match;

  while ((match = paramRegex.exec(path)) !== null) {
    params.push(match[1]);
  }

  return params;
}

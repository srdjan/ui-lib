// Auto-generation of client attributes from API route definitions

import { type RouteHandler } from "./router.ts";

export type ApiMap = Record<string, RouteHandler>;
export type GeneratedApiMap = Record<string, (...args: unknown[]) => Record<string, unknown>>;

/**
 * Auto-generates client attribute functions from API route definitions
 * 
 * Examples:
 * 'PATCH /api/todos/:id/toggle' → toggle: (id) => ({ 'hx-patch': `/api/todos/${id}/toggle` })
 * 'DELETE /api/todos/:id'        → delete: (id) => ({ 'hx-delete': `/api/todos/${id}` })
 * 'POST /api/todos'              → create: () => ({ 'hx-post': '/api/todos' })
 */
export function generateClientApi(apiMap: ApiMap): GeneratedApiMap {
  const generatedApi: GeneratedApiMap = {};

  for (const [route, _handler] of Object.entries(apiMap)) {
    const [method, path] = route.split(' ');
    if (!method || !path) {
      console.warn(`Invalid route definition: "${route}"`);
      continue;
    }

    const functionName = generateFunctionName(method, path);
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
 * Generate a client function name from HTTP method and path
 * 
 * Examples:
 * POST /api/todos → create
 * GET /api/todos → list  
 * PATCH /api/todos/:id/toggle → toggle
 * DELETE /api/todos/:id → delete
 * PUT /api/todos/:id → update
 */
function generateFunctionName(method: string, path: string): string {
  const pathParts = path.split('/').filter(Boolean);
  const lastPart = pathParts[pathParts.length - 1];
  
  // If the last part is a specific action (not a parameter), use it
  if (lastPart && !lastPart.startsWith(':')) {
    return lastPart;
  }
  
  // Otherwise, use conventional REST mapping
  switch (method.toUpperCase()) {
    case 'GET':
      // GET /api/todos/:id → get, GET /api/todos → list
      return lastPart?.startsWith(':') ? 'get' : 'list';
    case 'POST':
      return 'create';
    case 'PUT':
    case 'PATCH':
      return 'update';
    case 'DELETE':
      return 'delete';
    default:
      return method.toLowerCase();
  }
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
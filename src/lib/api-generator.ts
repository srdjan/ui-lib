// Auto-generation of client attributes from API route definitions

import { type RouteHandler } from "./router.ts";
import { currentRequestHeaders } from "./request-headers.ts";

// Type-safe tuple format: functionName -> [method, path, handler]
export type ApiDefinition = readonly [string, string, RouteHandler]; // [method, path, handler]
export type ApiMap = Record<string, ApiDefinition>;
export type GeneratedApiMap = Record<
  string,
  (...args: unknown[]) => Record<string, string>
>;

/**
 * Auto-generates client attribute functions from type-safe API definitions
 *
 * Examples:
 * toggle: ["PATCH", "/api/todos/:id/toggle", handler] → toggle: (id) => ({ 'hx-patch': `/api/todos/${id}/toggle` })
 * remove: ["DELETE", "/api/todos/:id", handler]       → remove: (id) => ({ 'hx-delete': `/api/todos/${id}` })
 * create: ["POST", "/api/todos", handler]             → create: () => ({ 'hx-post': '/api/todos' })
 */
export function generateClientApi(apiMap: ApiMap): GeneratedApiMap {
  const generatedApi: GeneratedApiMap = {};

  for (const [functionName, apiDefinition] of Object.entries(apiMap)) {
    if (!Array.isArray(apiDefinition) || apiDefinition.length !== 3) {
      console.warn(
        `Invalid API definition for "${functionName}". Expected format: [method, path, handler] (e.g., ["POST", "/api/todos", handler])`,
      );
      continue;
    }

    const [method, path, _handler] = apiDefinition;

    if (!method || !path) {
      console.warn(
        `Invalid API definition for "${functionName}": method and path are required`,
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

      const attrs: Record<string, string> = { [htmxMethod]: finalPath };

      // Prefer HTML swaps for SSR responses
      if (method !== "GET") attrs["hx-swap"] = "outerHTML";

      // Standardize on JSON requests
      attrs["hx-ext"] = "json-enc";
      attrs["hx-encoding"] = "json";

      // Default headers to advertise HTML response and mark AJAX
      const defaultHeaders: Record<string, string> = {
        Accept: "text/html; charset=utf-8",
        "X-Requested-With": "XMLHttpRequest",
      };

      // Merge request-scoped headers (e.g., CSRF token)
      Object.assign(defaultHeaders, currentRequestHeaders());

      // Support payload after path params, plus optional options object
      if (args.length > paramNames.length) {
        const payload = args[paramNames.length];
        const maybeOpts = args[paramNames.length + 1];

        if (payload !== undefined) {
          try {
            attrs["hx-vals"] = JSON.stringify(payload as unknown);
          } catch {
            // ignore non-serializable payloads
          }
        }

        if (maybeOpts && typeof maybeOpts === "object") {
          const opts = maybeOpts as {
            headers?: Record<string, string>;
            target?: string;
            swap?: string;
          };
          if (opts.swap) attrs["hx-swap"] = opts.swap;
          if (opts.target) attrs["hx-target"] = opts.target;
          if (opts.headers) Object.assign(defaultHeaders, opts.headers);
        }
      }

      // Set sensible defaults for non-GET interactions if not overridden
      if (method !== "GET" && !("hx-target" in attrs)) {
        attrs["hx-target"] = "closest [data-component]";
      }

      try {
        attrs["hx-headers"] = JSON.stringify(defaultHeaders);
      } catch {
        // ignore if we cannot serialize headers
      }

      return attrs;
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

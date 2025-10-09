// Auto-generation of client attributes from API route definitions

import type { RouteHandler } from "./router.ts";
import { currentRequestHeaders } from "./request-headers.ts";
import { getConfig } from "./config.ts";
import type { ApiRoute } from "./api-helpers.ts";

// Type-safe tuple format (deprecated): functionName -> [method, path, handler]
export type ApiDefinition = readonly [string, string, RouteHandler]; // [method, path, handler]

// New ApiRoute format (recommended)
export type ApiMap = Record<string, ApiRoute | ApiDefinition>; // Support both for migration

export type GeneratedApiMap = Record<
  string,
  (...args: string[]) => Record<string, string>
>;

// Options accepted by generated client functions
export type ApiClientOptions = {
  headers?: Record<string, string>;
  target?: string;
  swap?: string;
};

/**
 * Auto-generates client attribute functions from type-safe API definitions
 *
 * Supports both new ApiRoute format and legacy tuple format:
 * - New: toggle: post("/api/todos/:id/toggle", handler) → toggle: (id) => ({ 'hx-post': `/api/todos/${id}/toggle` })
 * - Old: toggle: ["POST", "/api/todos/:id/toggle", handler] → toggle: (id) => ({ 'hx-post': `/api/todos/${id}/toggle` })
 */
export function generateClientApi(apiMap: ApiMap): GeneratedApiMap {
  const generatedApi: GeneratedApiMap = {};

  for (const [functionName, apiDefinition] of Object.entries(apiMap)) {
    let method: string;
    let path: string;

    // Check if it's an ApiRoute object (new format) or tuple (old format)
    if (isApiRoute(apiDefinition)) {
      // New ApiRoute format - use the toAction method directly
      generatedApi[functionName] = apiDefinition.toAction;
      continue;
    } else if (Array.isArray(apiDefinition) && apiDefinition.length === 3) {
      // Legacy tuple format
      [method, path] = apiDefinition;

      if (!method || !path) {
        console.warn(
          `Invalid API definition for "${functionName}": method and path are required`,
        );
        continue;
      }
    } else {
      console.warn(
        `Invalid API definition for "${functionName}". Expected ApiRoute object or [method, path, handler] tuple`,
      );
      continue;
    }

    const paramNames = extractParameterNames(path);

    generatedApi[functionName] = (...args: unknown[]) => {
      const cfg = getConfig();
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
      if (method !== "GET") attrs["hx-swap"] = cfg.hx.swapDefault;

      // Standardize on JSON requests
      attrs["hx-ext"] = "json-enc";
      attrs["hx-encoding"] = "json";

      // Default headers to advertise HTML response and mark AJAX
      const defaultHeaders: Record<string, string> = {
        Accept: "text/html; charset=utf-8",
        "X-Requested-With": "XMLHttpRequest",
      };
      Object.assign(defaultHeaders, cfg.hx.headers);

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
          const opts = maybeOpts as ApiClientOptions;
          if (opts.swap) attrs["hx-swap"] = opts.swap;
          if (opts.target) attrs["hx-target"] = opts.target;
          if (opts.headers) Object.assign(defaultHeaders, opts.headers);
        }
      }

      // Set sensible defaults for non-GET interactions if not overridden
      if (method !== "GET" && !("hx-target" in attrs)) {
        attrs["hx-target"] = cfg.hx.targetDefault;
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

/**
 * Type guard to check if value is ApiRoute object
 */
function isApiRoute(value: unknown): value is ApiRoute {
  return (
    typeof value === "object" &&
    value !== null &&
    "method" in value &&
    "path" in value &&
    "handler" in value &&
    "toAction" in value &&
    typeof (value as ApiRoute).toAction === "function"
  );
}

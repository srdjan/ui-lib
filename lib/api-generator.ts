// Auto-generation of client attributes from API route definitions

import type { ApiRoute } from "./api-helpers.ts";

// Api map strictly uses typed ApiRoute helpers
export type ApiMap = Record<string, ApiRoute>;

export type GeneratedApiMap = Record<
  string,
  (...args: string[]) => Record<string, string>
>;

function isApiRouteLike(
  value: unknown,
): value is { toAction: (...args: string[]) => Record<string, string> } {
  return typeof value === "object" && value !== null &&
    typeof (value as any).toAction === "function";
}

// Options accepted by generated client functions
export type ApiClientOptions = {
  headers?: Record<string, string>;
  target?: string;
  swap?: string;
};

/**
 * Auto-generates client attribute functions from ApiRoute definitions
 *
 * Example: toggle: post("/api/todos/:id/toggle", handler) → toggle: (id) => ({ 'hx-post': `/api/todos/${id}/toggle` })
 */
export function generateClientApi(apiMap: ApiMap): GeneratedApiMap {
  const generatedApi: GeneratedApiMap = {};

  for (const [functionName, apiDefinition] of Object.entries(apiMap)) {
    if (isApiRouteLike(apiDefinition)) {
      generatedApi[functionName] = apiDefinition.toAction;
    }
  }

  return generatedApi;
}

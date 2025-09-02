// In src/lib/router.ts
import { getConfig } from "./config.ts";

export type RouteParams = Record<string, string>;

export type RouteHandler = (
  request: Request,
  params: RouteParams,
) => Promise<Response> | Response;

export interface Route {
  method: string;
  path: string;
  pattern: RegExp; // Regex to match URL and capture params
  paramNames: string[]; // Names of the params (e.g., ["id"])
  handler: RouteHandler;
}

export class Router {
  private routes: Route[] = [];

  // Converts a path string like '/users/:id' into a RegExp
  private createPattern(
    path: string,
  ): { pattern: RegExp; paramNames: string[] } {
    const paramNames: string[] = [];
    const pattern = new RegExp(
      `^${
        path.replace(/:(\w+)/g, (_, name) => {
          paramNames.push(name);
          return "([^\/]+)";
        })
      }/?$`,
    );
    return { pattern, paramNames };
  }

  public register(method: string, path: string, handler: RouteHandler) {
    const { pattern, paramNames } = this.createPattern(path);
    this.routes.push({
      method: method.toUpperCase(),
      path,
      pattern,
      paramNames,
      handler,
    });
    if (getConfig().logging || getConfig().dev) {
      console.log(`[Router] Registered: ${method} ${path}`);
    }
  }

  public match(
    request: Request,
  ): { handler: RouteHandler; params: RouteParams } | null {
    const url = new URL(request.url);
    for (const route of this.routes) {
      if (route.method !== request.method.toUpperCase()) {
        continue;
      }
      const match = url.pathname.match(route.pattern);
      if (match) {
        const params = route.paramNames.reduce((acc, name, i) => {
          acc[name] = match[i + 1];
          return acc;
        }, {} as RouteParams);
        return { handler: route.handler, params };
      }
    }
    return null;
  }
}

// Export a singleton instance
export const appRouter = new Router();

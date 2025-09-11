// In src/lib/router.ts

export type RouteParams = Record<string, string>;

// HTTP method literals
export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";

// Extract ":param" segments from a path template as a union of keys
export type PathParamKeys<Path extends string> =
  Path extends `${string}:${infer Param}/${infer Rest}` ? (
      Param extends `${infer Key}${string}` ? Key | PathParamKeys<Rest> : never
    )
  : Path extends `${string}:${infer Last}` ? (
      Last extends `${infer Key}${string}` ? Key : never
    )
  : never;

// Build params object type from a path template
export type RouteParamsOf<Path extends string> =
  [PathParamKeys<Path>] extends [never] ? {}
  : { [K in PathParamKeys<Path>]: string };

// Typed route handler for a specific path template
export type RouteHandlerFor<Path extends string> = (
  request: Request,
  params: RouteParamsOf<Path>,
) => Promise<Response> | Response;

export type RouteHandler = (
  request: Request,
  params: RouteParams,
) => Promise<Response> | Response;

export interface Route {
  method: Method | string;
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

  public register<Path extends string>(
    method: Method | string,
    path: Path,
    handler: RouteHandlerFor<Path> | RouteHandler,
  ) {
    const { pattern, paramNames } = this.createPattern(path);
    this.routes.push({
      method: (method as string).toUpperCase(),
      path,
      pattern,
      paramNames,
      handler: handler as RouteHandler,
    });
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

// In src/lib/router.ts

export type RouteParams = Record<string, string>;

// HTTP method literals
export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";

// Extract ":param" segments from a path template as a union of keys
export type PathParamKeys<Path extends string> = Path extends
  `${string}:${infer Param}/${infer Rest}` ? (
    Param extends `${infer Key}${string}` ? Key | PathParamKeys<Rest> : never
  )
  : Path extends `${string}:${infer Last}` ? (
      Last extends `${infer Key}${string}` ? Key : never
    )
  : never;

// Build params object type from a path template
export type RouteParamsOf<Path extends string> = [PathParamKeys<Path>] extends
  [never] ? {}
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

// Router state type
type RouterState = {
  readonly routes: readonly Route[];
};

// Pure helper functions
const createPattern = (
  path: string,
): { pattern: RegExp; paramNames: string[] } => {
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
};

const addRoute = (
  state: RouterState,
  method: Method | string,
  path: string,
  handler: RouteHandler,
): RouterState => {
  const { pattern, paramNames } = createPattern(path);
  const newRoute: Route = {
    method: (method as string).toUpperCase(),
    path,
    pattern,
    paramNames,
    handler,
  };

  return {
    routes: [...state.routes, newRoute],
  };
};

const matchRoute = (
  state: RouterState,
  request: Request,
): { handler: RouteHandler; params: RouteParams } | null => {
  const url = new URL(request.url);
  for (const route of state.routes) {
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
};

// Router interface for type compatibility
export interface IRouter {
  register<Path extends string>(
    method: Method | string,
    path: Path,
    handler: RouteHandlerFor<Path> | RouteHandler,
  ): void;
  match(
    request: Request,
  ): { handler: RouteHandler; params: RouteParams } | null;
}

// Functional Router implementation
export const createRouter = (): IRouter => {
  let state: RouterState = { routes: [] };

  return {
    register<Path extends string>(
      method: Method | string,
      path: Path,
      handler: RouteHandlerFor<Path> | RouteHandler,
    ) {
      state = addRoute(state, method, path, handler as RouteHandler);
    },

    match(
      request: Request,
    ): { handler: RouteHandler; params: RouteParams } | null {
      return matchRoute(state, request);
    },
  };
};

// Backward compatibility - Router class that uses functional implementation
export class Router {
  private router: IRouter;

  constructor() {
    this.router = createRouter();
  }

  register<Path extends string>(
    method: Method | string,
    path: Path,
    handler: RouteHandlerFor<Path> | RouteHandler,
  ) {
    this.router.register(method, path, handler);
  }

  match(
    request: Request,
  ): { handler: RouteHandler; params: RouteParams } | null {
    return this.router.match(request);
  }

  // Convenience methods
  get<Path extends string>(
    path: Path,
    handler: RouteHandlerFor<Path> | RouteHandler,
  ) {
    this.register("GET", path, handler);
  }

  post<Path extends string>(
    path: Path,
    handler: RouteHandlerFor<Path> | RouteHandler,
  ) {
    this.register("POST", path, handler);
  }

  put<Path extends string>(
    path: Path,
    handler: RouteHandlerFor<Path> | RouteHandler,
  ) {
    this.register("PUT", path, handler);
  }

  patch<Path extends string>(
    path: Path,
    handler: RouteHandlerFor<Path> | RouteHandler,
  ) {
    this.register("PATCH", path, handler);
  }

  delete<Path extends string>(
    path: Path,
    handler: RouteHandlerFor<Path> | RouteHandler,
  ) {
    this.register("DELETE", path, handler);
  }
}

// Functional convenience functions
export const get = <Path extends string>(
  path: Path,
  handler: RouteHandlerFor<Path> | RouteHandler,
) => ({ method: "GET" as const, path, handler });

export const post = <Path extends string>(
  path: Path,
  handler: RouteHandlerFor<Path> | RouteHandler,
) => ({ method: "POST" as const, path, handler });

export const put = <Path extends string>(
  path: Path,
  handler: RouteHandlerFor<Path> | RouteHandler,
) => ({ method: "PUT" as const, path, handler });

export const patch = <Path extends string>(
  path: Path,
  handler: RouteHandlerFor<Path> | RouteHandler,
) => ({ method: "PATCH" as const, path, handler });

export const del = <Path extends string>(
  path: Path,
  handler: RouteHandlerFor<Path> | RouteHandler,
) => ({ method: "DELETE" as const, path, handler });

// Route definition type for functional approach
export type RouteDefinition = {
  readonly method: Method;
  readonly path: string;
  readonly handler: RouteHandler;
};

// Create router from route definitions
export const createRouterFromDefinitions = (
  definitions: readonly RouteDefinition[],
): IRouter => {
  const router = createRouter();
  definitions.forEach(({ method, path, handler }) => {
    router.register(method, path, handler);
  });
  return router;
};

// Ultra-succinct pipeline API for functional web components (SSR-compatible)
import { createPropSpec, type PropSpecObject, type InferProps } from "./props.ts";
import { getRegistry } from "./registry.ts";
import { appRouter } from "./router.ts";
import { type RouteHandler } from "./router.ts";

type ApiMap = Record<string, RouteHandler>;

type ServerActionMap = Record<
  string,
  (...args: unknown[]) => Record<string, unknown>
>;

type PartsMap = Record<string, string>;

// Generic Pipeline builder interface
interface ComponentBuilder<TProps extends Record<string, unknown>> {
  props<P extends PropSpecObject>(propSpec: P): ComponentBuilder<TProps & InferProps<P>>;
  serverActions(serverActionMap: ServerActionMap): ComponentBuilder<TProps>;
  api(apiMap: ApiMap): ComponentBuilder<TProps>;
  parts(partsMap: PartsMap): ComponentBuilder<TProps>;
  view(
    renderFn: (
      props: TProps,
      serverActions?: Record<string, (...args: unknown[]) => Record<string, unknown>>,
      parts?: PartsMap
    ) => string,
  ): ComponentBuilder<TProps>;
  styles(css: string): ComponentBuilder<TProps>;
}

// Internal builder state - now also generic
interface BuilderState<TProps extends Record<string, unknown>> {
  name: string;
  propSpec?: PropSpecObject;
  serverActionMap?: ServerActionMap;
  partsMap?: PartsMap;
  renderFn?: (
    props: TProps,
    serverActions?: Record<string, (...args: unknown[]) => Record<string, unknown>>,
    parts?: PartsMap
  ) => string;
  css?: string;
}

// Main builder implementation - now generic
class ComponentBuilderImpl<TProps extends Record<string, unknown>> implements ComponentBuilder<TProps> {
  private builderState: BuilderState<TProps>;

  constructor(name: string) {
    this.builderState = { name };
  }

  props<P extends PropSpecObject>(propSpec: P): ComponentBuilder<TProps & InferProps<P>> {
    this.builderState.propSpec = propSpec;
    return this as unknown as ComponentBuilder<TProps & InferProps<P>>;
  }

  serverActions(serverActionMap: ServerActionMap): ComponentBuilder<TProps> {
    this.builderState.serverActionMap = serverActionMap;
    return this;
  }

  api(apiMap: ApiMap): ComponentBuilder<TProps> {
    for (const [route, handler] of Object.entries(apiMap)) {
      const [method, path] = route.split(' ');
      if (!method || !path || !handler) {
        console.warn(`Invalid route definition: "${route}"`);
        continue;
      }
      appRouter.register(method, path, handler);
    }
    return this;
  }

  parts(partsMap: PartsMap): ComponentBuilder<TProps> {
    this.builderState.partsMap = partsMap;
    return this;
  }

  view(
    renderFn: (
      props: TProps,
      serverActions?: Record<string, (...args: unknown[]) => Record<string, unknown>>,
      parts?: PartsMap
    ) => string,
  ): ComponentBuilder<TProps> {
    this.builderState.renderFn = renderFn as any; // Cast to avoid deep generic issues
    this.register();
    return this;
  }

  styles(css: string): ComponentBuilder<TProps> {
    this.builderState.css = css;
    return this;
  }

  private register(): void {
    const { name, propSpec, serverActionMap, renderFn, css, partsMap } = this.builderState;

    if (!renderFn) {
      throw new Error(
        `Component ${name} is missing required configuration: view is required`,
      );
    }
    
    const props = propSpec ? createPropSpec(propSpec) : undefined;
    const registry = getRegistry();
    
    registry[name] = {
      props,
      css,
      serverActions: serverActionMap,
      // The render function needs to be wrapped to pass the parts map.
      render: (finalProps, finalServerActions) => {
        return renderFn(
          finalProps as TProps,
          finalServerActions as Record<string, (...args: unknown[]) => Record<string, unknown>> | undefined,
          partsMap,
        );
      },
    };
  }
}

// Main component function - starts with an empty props object
export const component = (name: string): ComponentBuilder<{}> => {
  return new ComponentBuilderImpl(name);
};

// Export types for external use
export type { ServerActionMap };

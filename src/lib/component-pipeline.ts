// Ultra-succinct pipeline API for functional web components (SSR-compatible)
import {
  createPropSpec,
  type InferProps,
  type PropSpecObject,
} from "./props.ts";
import { getRegistry } from "./registry.ts";
import { appRouter } from "./router.ts";
import {
  type ApiMap,
  generateClientApi,
  type GeneratedApiMap,
} from "./api-generator.ts";
import "./jsx.d.ts"; // Import JSX types

type PartsMap = Record<string, string>;

// Generic Pipeline builder interface
interface ComponentBuilder<TProps extends Record<string, unknown>> {
  props<P extends PropSpecObject>(
    propSpec: P,
  ): ComponentBuilder<TProps & InferProps<P>>;
  api(apiMap: ApiMap): ComponentBuilder<TProps>;
  parts(partsMap: PartsMap): ComponentBuilder<TProps>;
  view(
    renderFn: (
      props: TProps,
      api?: GeneratedApiMap,
      parts?: PartsMap,
    ) => string,
  ): ComponentBuilder<TProps>;
  styles(css: string): ComponentBuilder<TProps>;
}

// Internal builder state - now also generic
interface BuilderState<TProps extends Record<string, unknown>> {
  name: string;
  propSpec?: PropSpecObject;
  apiMap?: ApiMap;
  partsMap?: PartsMap;
  renderFn?: (
    props: TProps,
    api?: GeneratedApiMap,
    parts?: PartsMap,
  ) => string;
  css?: string;
}

// Main builder implementation - now generic
class ComponentBuilderImpl<TProps extends Record<string, unknown>>
  implements ComponentBuilder<TProps> {
  private builderState: BuilderState<TProps>;

  constructor(name: string) {
    this.builderState = { name };
  }

  props<P extends PropSpecObject>(
    propSpec: P,
  ): ComponentBuilder<TProps & InferProps<P>> {
    this.builderState.propSpec = propSpec;
    return this as unknown as ComponentBuilder<TProps & InferProps<P>>;
  }

  api(apiMap: ApiMap): ComponentBuilder<TProps> {
    // Store the API map for later use in view function
    this.builderState.apiMap = apiMap;

    // Register all routes with the router
    for (const [route, handler] of Object.entries(apiMap)) {
      const [method, path] = route.split(" ");
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
      api?: GeneratedApiMap,
      parts?: PartsMap,
    ) => string,
  ): ComponentBuilder<TProps> {
    this.builderState.renderFn = renderFn;
    this.register();
    return this;
  }

  styles(css: string): ComponentBuilder<TProps> {
    this.builderState.css = css;
    return this;
  }

  private register(): void {
    const { name, propSpec, apiMap, renderFn, css, partsMap } =
      this.builderState;

    if (!renderFn) {
      throw new Error(
        `Component ${name} is missing required configuration: view is required`,
      );
    }

    const props = propSpec ? createPropSpec(propSpec) : undefined;
    const generatedApi = apiMap ? generateClientApi(apiMap) : undefined;
    const registry = getRegistry();

    registry[name] = {
      props,
      css,
      api: generatedApi, // Now contains auto-generated client functions
      // The render function needs to be wrapped to pass the generated API and parts map
      render: (finalProps, _unusedApi) => {
        const jsxElement = renderFn(
          finalProps as TProps,
          generatedApi,
          partsMap,
        );
        return jsxElement; // JSX.Element is defined as string in our runtime
      },
    };
  }
}

// Main component function - starts with an empty props object
export const component = (
  name: string,
): ComponentBuilder<Record<PropertyKey, never>> => {
  return new ComponentBuilderImpl(name);
};

// Export types for external use
export type { ApiMap, GeneratedApiMap };

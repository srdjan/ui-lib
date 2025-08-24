// Ultra-succinct pipeline API for functional web components (SSR-compatible)
import { createPropSpec, type PropSpecObject } from "./props.ts";
import { getRegistry } from "./registry.ts";

// Server action map for HTMX attributes - the only state management we need
type ServerActionMap = Record<
  string,
  (...args: unknown[]) => Record<string, unknown>
>;

// Pipeline builder interface - simplified for DOM-native approach
interface ComponentBuilder {
  props(propSpec: PropSpecObject): ComponentBuilder;
  serverActions(serverActionMap: ServerActionMap): ComponentBuilder;
  view(
    renderFn: (
      props: unknown,
      serverActions?: unknown
    ) => string,
  ): ComponentBuilder;
  styles(css: string): ComponentBuilder;
}

// Internal builder state - simplified
interface BuilderState {
  name: string;
  propSpec?: PropSpecObject;
  serverActionMap?: ServerActionMap;
  renderFn?: (
    props: unknown,
    serverActions?: unknown
  ) => string;
  css?: string;
}

// Smart prop parsing implementation moved to props.ts

// Server action creator generation - creates callable functions that return HTMX attributes
const createServerActionCreators = (
  serverActionMap: ServerActionMap,
): Record<string, (...args: unknown[]) => Record<string, unknown>> => {
  const creators: Record<string, (...args: unknown[]) => Record<string, unknown>> = {};

  for (const [actionType, handler] of Object.entries(serverActionMap)) {
    creators[actionType] = (...args: unknown[]) => {
      return handler(...args);
    };
  }

  return creators;
};

// Main builder implementation
class ComponentBuilderImpl implements ComponentBuilder {
  private builderState: BuilderState;

  constructor(name: string) {
    this.builderState = { name };
  }

  props(propSpec: PropSpecObject): ComponentBuilder {
    this.builderState.propSpec = propSpec;
    return this;
  }

  serverActions(serverActionMap: ServerActionMap): ComponentBuilder {
    this.builderState.serverActionMap = serverActionMap;
    return this;
  }

  view(
    renderFn: (
      props: unknown,
      serverActions?: unknown
    ) => string,
  ): ComponentBuilder {
    this.builderState.renderFn = renderFn;
    this.register();
    return this;
  }

  styles(css: string): ComponentBuilder {
    this.builderState.css = css;
    return this;
  }

  private register(): void {
    const { name, propSpec, serverActionMap, renderFn, css } = this.builderState;

    if (!renderFn) {
      throw new Error(
        `Component ${name} is missing required configuration: view is required`,
      );
    }
    
    // Register component in SSR registry
    const props = propSpec ? createPropSpec(propSpec) : undefined;
    const registry = getRegistry();
    
    registry[name] = {
      props,
      css,
      serverActions: serverActionMap,
      render: renderFn,
    };
  }
}

// Main component function
export const component = (name: string): ComponentBuilder => {
  return new ComponentBuilderImpl(name);
};

// Export types for external use
export type { ServerActionMap };

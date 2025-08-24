// Ultra-succinct pipeline API for functional web components (SSR-only)
import type { Action as _Action } from "./types.ts";
import { createPropSpec, type PropSpecObject } from "./props.ts";

// Simplified types for better usability
type ActionMap = Record<
  string,
  (state: unknown, ...args: unknown[]) => Record<string, unknown>
>;

// Pipeline builder interface
interface ComponentBuilder {
  state(initialState: Record<string, unknown>): ComponentBuilder;
  props(propSpec: PropSpecObject): ComponentBuilder;
  actions(actionMap: ActionMap): ComponentBuilder;
  view(
    renderFn: (state: unknown, props: unknown, actions: unknown) => string,
  ): ComponentBuilder;
  styles(css: string): ComponentBuilder;
  effects(effectMap: Record<string, unknown>): ComponentBuilder;
}

// Internal builder state
interface BuilderState {
  name: string;
  initialState?: Record<string, unknown>;
  propSpec?: PropSpecObject;
  actionMap?: ActionMap;
  renderFn?: (state: unknown, props: unknown, actions: unknown) => string;
  css?: string;
  effectMap?: Record<string, unknown>;
}

// Smart prop parsing implementation moved to props.ts

// Action creator generation
const createActionCreators = (
  actionMap: ActionMap,
): Record<string, (...args: unknown[]) => { type: string; payload: unknown[] }> => {
  const creators: Record<string, (...args: unknown[]) => { type: string; payload: unknown[] }> = {};

  for (const [actionType, _handler] of Object.entries(actionMap)) {
    creators[actionType] = (...args: unknown[]) => ({
      type: actionType,
      payload: args,
    });
  }

  return creators;
};

// Main builder implementation
class ComponentBuilderImpl implements ComponentBuilder {
  private builderState: BuilderState;

  constructor(name: string) {
    this.builderState = { name };
  }

  state(initialState: Record<string, unknown>): ComponentBuilder {
    this.builderState.initialState = initialState;
    return this;
  }

  props(propSpec: PropSpecObject): ComponentBuilder {
    this.builderState.propSpec = propSpec;
    return this;
  }

  actions(actionMap: ActionMap): ComponentBuilder {
    this.builderState.actionMap = actionMap;
    return this;
  }

  view(
    renderFn: (state: unknown, props: unknown, actions: unknown) => string,
  ): ComponentBuilder {
    this.builderState.renderFn = renderFn;
    this.register();
    return this;
  }

  styles(css: string): ComponentBuilder {
    this.builderState.css = css;
    return this;
  }

  effects(effectMap: Record<string, unknown>): ComponentBuilder {
    this.builderState.effectMap = effectMap;
    return this;
  }

  private register(): void {
    const { name, initialState, propSpec, actionMap, renderFn, css } =
      this.builderState;

    if (!initialState || !actionMap || !renderFn) {
      throw new Error(
        `Component ${name} is missing required configuration: state, actions, and view are required`,
      );
    }
    // SSR-only: expose a render method on the global registry for demos
    const actionCreators = createActionCreators(actionMap);
    const props = propSpec ? createPropSpec(propSpec) : undefined;
    const bag = (globalThis as any).__FWC_SSR__ ?? ((globalThis as any).__FWC_SSR__ = {});
    bag[name] = {
      init: () => initialState,
      props,
      css,
      render: (state: unknown, parsedProps: unknown) =>
        renderFn(state, parsedProps, actionCreators),
    };
  }
}

// Main component function
export const component = (name: string): ComponentBuilder => {
  return new ComponentBuilderImpl(name);
};

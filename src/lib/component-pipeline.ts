// Ultra-succinct pipeline API for functional web components
/** @jsxImportSource https://esm.sh/mono-jsx */
import { type Action, defineComponent } from "../index.ts";
import type { ComponentContext } from "./types.ts";

// Simplified types for better usability
type PropSpecObject = Record<string, string>;
type ActionMap = Record<string, (...args: any[]) => Record<string, any>>;

// Pipeline builder interface
interface ComponentBuilder {
  state(initialState: Record<string, any>): ComponentBuilder;
  props(propSpec: PropSpecObject): ComponentBuilder;
  actions(actionMap: ActionMap): ComponentBuilder;
  view(
    renderFn: (state: any, props: any, actions: any) => Node,
  ): ComponentBuilder;
  styles(css: string): ComponentBuilder;
  effects(effectMap: Record<string, any>): ComponentBuilder;
}

// Internal builder state
interface BuilderState {
  name: string;
  initialState?: Record<string, any>;
  propSpec?: PropSpecObject;
  actionMap?: ActionMap;
  renderFn?: (state: any, props: any, actions: any) => Node;
  css?: string;
  effectMap?: Record<string, any>;
}

// Smart prop parsing implementation
const createPropSpec = (propSpec: PropSpecObject): Record<string, any> => {
  const result: Record<string, any> = {};

  for (const [key, typeHint] of Object.entries(propSpec)) {
    const isOptional = typeHint.endsWith("?");
    const baseType = isOptional ? typeHint.slice(0, -1) : typeHint;

    result[key] = {
      attribute: key,
      parse: (v: unknown) => {
        if (v == null) return isOptional ? undefined : null;

        switch (baseType) {
          case "number":
            const num = Number(v);
            return isNaN(num) ? (isOptional ? undefined : 0) : num;
          case "boolean":
            return v != null && v !== "false" && v !== "0";
          case "string":
          default:
            return String(v);
        }
      },
    };
  }

  return result;
};

// Action creator generation
const createActionCreators = (actionMap: ActionMap): Record<string, any> => {
  const creators: Record<string, any> = {};

  for (const [actionType, _handler] of Object.entries(actionMap)) {
    creators[actionType] = (...args: any[]) => ({
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

  state(initialState: Record<string, any>): ComponentBuilder {
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
    renderFn: (state: any, props: any, actions: any) => Node,
  ): ComponentBuilder {
    this.builderState.renderFn = renderFn;
    this.register(); // Auto-register when view is provided
    return this;
  }

  styles(css: string): ComponentBuilder {
    this.builderState.css = css;
    return this;
  }

  effects(effectMap: Record<string, any>): ComponentBuilder {
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

    // Create action creators for the view
    const actionCreators = createActionCreators(actionMap);

    // Convert action map to reducer function
    const update = (state: any, action: Readonly<Action>): any => {
      const handler = actionMap[action.type];
      if (!handler) return state;

      const payload = (action as any).payload || [];
      const updates = handler(state, ...payload);
      return { ...state, ...updates };
    };

    // Create prop spec if provided
    const props = propSpec ? createPropSpec(propSpec) : undefined;

    // Wrap render function to provide action creators
    const view = (state: any, props: any): Node => {
      return renderFn(state, props, actionCreators);
    };

    // Register the component
    defineComponent(name, {
      init: () => initialState,
      update,
      view,
      props,
      styles: css ? [css] : undefined,
    });
  }
}

// Main component function
export const component = (name: string): ComponentBuilder => {
  return new ComponentBuilderImpl(name);
};

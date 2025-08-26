// Simplified defineComponent with optional props transformer
import { getRegistry } from "./registry.ts";
import {
  type ApiMap,
  generateClientApi,
  type GeneratedApiMap,
} from "./api-generator.ts";
import { appRouter } from "./router.ts";
import { type PropsSpec, type InferProps } from "./props-simple.ts";
import "./jsx.d.ts"; // Import JSX types

type ClassMap = Record<string, string>;

// Conditional render function types based on whether API is provided
type RenderFunctionWithApi<TPropsSpec extends PropsSpec> = (
  props: InferProps<TPropsSpec>,
  api: GeneratedApiMap,
  classes?: ClassMap,
) => string;

type RenderFunctionWithoutApi<TPropsSpec extends PropsSpec> = (
  props: InferProps<TPropsSpec>,
  api?: undefined,
  classes?: ClassMap,
) => string;

// Component configuration with API
export interface ComponentConfigWithApi<TPropsSpec extends PropsSpec> {
  props?: TPropsSpec;
  styles?: string;
  classes?: ClassMap;
  api: ApiMap;  // Required when this interface is used
  render: RenderFunctionWithApi<TPropsSpec>;
}

// Component configuration without API
export interface ComponentConfigWithoutApi<TPropsSpec extends PropsSpec> {
  props?: TPropsSpec;
  styles?: string;
  classes?: ClassMap;
  api?: never;  // Not allowed when this interface is used
  render: RenderFunctionWithoutApi<TPropsSpec>;
}

// Union type for component configuration
export type ComponentConfig<TPropsSpec extends PropsSpec> = 
  | ComponentConfigWithApi<TPropsSpec>
  | ComponentConfigWithoutApi<TPropsSpec>;

/**
 * Define a component with simplified props system.
 * 
 * @example
 * ```tsx
 * // Zero config - props are just strings
 * defineComponent("simple-text", {
 *   render: (props: { message: string }) => <div>{props.message}</div>
 * });
 * 
 * // With transformer when parsing needed
 * defineComponent("counter", {
 *   props: (attrs) => ({
 *     count: parseInt(attrs.count || "0"),
 *     step: parseInt(attrs.step || "1"),
 *     active: attrs.hasOwnProperty("active")
 *   }),
 *   render: (props) => (
 *     <div class={props.active ? "active" : ""}>
 *       Count: {props.count}
 *     </div>
 *   )
 * });
 * 
 * // With API
 * defineComponent("todo-item", {
 *   props: (attrs) => ({
 *     id: attrs.id,
 *     text: attrs.text,
 *     done: attrs.hasOwnProperty("done")
 *   }),
 *   api: {
 *     toggle: patch("/api/todos/:id/toggle", handler),
 *     remove: del("/api/todos/:id", handler)
 *   },
 *   render: (props, api) => (
 *     <div>
 *       <span>{props.text}</span>
 *       <button {...api.toggle(props.id)}>Toggle</button>
 *       <button {...api.remove(props.id)}>×</button>
 *     </div>
 *   )
 * });
 * ```
 */
export function defineComponent<TPropsSpec extends PropsSpec>(
  name: string,
  config: ComponentConfig<TPropsSpec>,
): void {
  const { props: propsTransformer, styles: css, classes: classMap, api: apiMap, render } = config;

  // Validate required configuration
  if (!render) {
    throw new Error(
      `Component "${name}" is missing required configuration: render function must be provided.`
    );
  }

  // Generate API client functions if provided
  let generatedApi: GeneratedApiMap | undefined;
  if (apiMap) {
    generatedApi = generateClientApi(apiMap);
    
    // Register all routes with the router
    for (const [functionName, apiDefinition] of Object.entries(apiMap)) {
      if (!Array.isArray(apiDefinition) || apiDefinition.length !== 3) {
        console.warn(`Invalid API definition for "${functionName}". Expected format: [method, path, handler] (e.g., ["POST", "/api/todos", handler])`);
        continue;
      }
      
      const [method, path, handler] = apiDefinition;
      if (!method || !path || !handler) {
        console.warn(`Invalid API definition for "${functionName}": method, path, and handler are required`);
        continue;
      }
      
      appRouter.register(method, path, handler);
    }
  }

  // Register the component in the SSR registry
  const registry = getRegistry();
  registry[name] = {
    props: undefined, // No longer using complex prop specs
    css,
    api: generatedApi,
    render: (rawAttrs, _unusedApi) => {
      // Apply props transformer if provided, otherwise use raw attributes
      const finalProps = propsTransformer ? propsTransformer(rawAttrs) : rawAttrs;
      
      // Pass the correct parameters based on whether API exists
      if (generatedApi) {
        // Component has API - pass api as required parameter
        return (render as RenderFunctionWithApi<TPropsSpec>)(
          finalProps as InferProps<TPropsSpec>,
          generatedApi,
          classMap,
        );
      } else {
        // Component has no API - don't pass api parameter
        return (render as RenderFunctionWithoutApi<TPropsSpec>)(
          finalProps as InferProps<TPropsSpec>,
          undefined,
          classMap,
        );
      }
    },
  };
}